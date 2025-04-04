import React, {useMemo} from 'react'
import {useNavigate} from 'react-router-dom'
import {Button} from '@/components/ui/button'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {List} from "../components/ui/list.tsx";
import {BackButton} from "../components/BackButton.tsx";
import {useTelegram} from "../hooks/useTelegram.ts";
import {Info, Star} from 'lucide-react'
import EstimatedTime from "../components/EstimatedTime.tsx";
import {Header} from "../components/ui/Header.tsx";
import {BottomActions} from "../components/BottomActions.tsx";
import {Typography} from "../components/ui/Typography.tsx";
import {Badge} from "../components/ui/badge.tsx";
import {moneyFormat} from "../lib/utils.ts";
import {usePatchOrderMutation} from "../api.ts";
import {useDispatch, useSelector} from "react-redux";
import {clearState, selectBaseService, selectOptions, selectVariant} from "../slices/createOrderSlice.ts";
import {RoutePaths} from "../routes.ts";
import {Checkbox} from "../components/ui/checkbox.tsx";

export const OrderCreationPage = () => {
    const [patchOrder] = usePatchOrderMutation();
    const services = useSelector(state => state.createOrder.services);
    const orderId = useSelector(state => state.createOrder.id)
    const baseService = useSelector(state => state.createOrder.baseService)
    const options = useSelector(state => state.createOrder.options)
    const serviceVariant = useSelector(state => state.createOrder.serviceVariant)

    const {vibro, userId} = useTelegram();
    const navigate = useNavigate()

    const dispatch = useDispatch();

    // Если создаем - true, если редактируем - false;
    const isDraft = !Boolean(orderId);

    // Либо мы перешли сюда из других страниц, либо просто откуда то как то - и берем первый сервис из списка
    const currentService = useMemo(() => services.find(s => baseService ? s.id === baseService.id : s) || services[0], [services, baseService]);

    // Находим варианты услуг по базовой услуге
    const variants = currentService?.variants || []
    // Получаем доступные опции для типа услуги
    const availableOptions = currentService?.options || []

    const variantId = useMemo(() => {
        return serviceVariant?.id || variants[0]?.id
    }, [serviceVariant, services, variants]);

    const selectedOptionsIdSet = useMemo(() => new Set(options.map(o => o.id)), [options]);

    // Считаем общую сумму
    const totalPrice = useMemo(() => options.reduce((sum, option) => sum + option.price, serviceVariant?.basePrice || 0), [serviceVariant, options]);

    // Считаем общее время
    const totalDuration = useMemo(() => options.reduce((sum, option) => sum + (option?.duration || 0), serviceVariant?.duration || 0), [serviceVariant, options]);


    const handleOptionToggle = (option: any) => {
        vibro('light');
        const exist = options.find(opt => opt.id === option.id);
        let newOptions = [...options];
        if (exist) {
            newOptions = newOptions.filter(opt => opt.id !== option.id);
        } else {
            newOptions.push(option)
        }
        dispatch(selectOptions({options: newOptions}))
    }

    const handleNext = async () => {
        if (isDraft) {
            dispatch(selectBaseService({baseService, serviceVariant, options}))

            navigate(`/order/checkout`);
        } else {
            await patchOrder({id: orderId, serviceVariant, options, userId}).unwrap();
            navigate(RoutePaths.Order.Details(orderId));
        }
    }

    const handleSelectVariant = (serviceVariant: any) => {
        dispatch(selectVariant({serviceVariant}))
    }

    const handleBackClick = () => dispatch(clearState());

    const backUrl = useMemo(() => {
        if (isDraft) {
            return RoutePaths.Root;
        }
        return RoutePaths.Orders
    }, [isDraft])

    if (!baseService) {
        return null
    }

    return (
        <div className="fixed inset-0 flex flex-col">
            <Header>
                <div className="grid grid-cols-[40px_auto_40px]">
                    <BackButton url={backUrl} onClick={handleBackClick}/>
                    <Typography.Title
                        className="items-center flex justify-center">{baseService?.name}</Typography.Title>
                </div>
            </Header>

            <div className="flex-1 overflow-y-auto overscroll-none">
                <Tabs defaultValue={variantId} value={variantId}
                      className="mt-[calc(56px+env(safe-area-inset-top))]">
                    <TabsList>
                        {variants.map(tab => (
                            <TabsTrigger
                                key={tab.id}
                                value={tab.id}
                                onClick={() => handleSelectVariant(tab)}
                            >
                                {tab.name}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>
                <div>
                    <List itemClassName="flex-col gap-2" className="rounded-none">
                        {availableOptions.map((option) => <>
                            <div className="flex items-center gap-3 w-full justify-between"
                                 onClick={() => handleOptionToggle(option)}>
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                    <Info
                                        className="flex-none w-[18px] h-[18px] mt-0.5 text-tg-theme-subtitle-text-color"/>
                                    <span
                                        className="text-[16px] [line-height:20px] [font-weight:400] text-tg-theme-text-color truncate">{option.name}</span>
                                    {option.isPopular ? (
                                        <Badge className="flex gap-1 items-center"><Star
                                            className="w-3 h-3"/>ПОПУЛЯРНО</Badge>
                                    ) : <div/>}
                                </div>
                                <span
                                    className="text-[15px] font-normal text-tg-theme-text-color whitespace-nowrap">{moneyFormat(option.price)}</span>
                                <Checkbox checked={selectedOptionsIdSet.has(option.id)}
                                          onCheckedChange={() => handleOptionToggle(option)}/>
                            </div>
                        </>)}
                    </List>
                </div>
                <EstimatedTime totalDuration={totalDuration}/>
            </div>

            <BottomActions>
                <Button
                    wide
                    onClick={handleNext}
                    size="lg"
                ><span className="flex-1 text-left">{isDraft ? 'Далее' : 'Сохранить'}</span>
                    <span>{moneyFormat(totalPrice)}</span>
                </Button>
            </BottomActions>
        </div>
    )
}