import React, {useMemo} from 'react'
import {useNavigate, useParams} from 'react-router-dom'
import {Button} from '@/components/ui/button'
import {Tabs, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {List} from "../../components/ui/list.tsx";
import {BackButton} from "../../components/BackButton.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";
import {Info, Plus, Star} from 'lucide-react'
import EstimatedTime from "../../components/EstimatedTime.tsx";
import {Header} from "../../components/ui/Header.tsx";
import {BottomActions} from "../../components/BottomActions.tsx";
import {Typography} from "../../components/ui/Typography.tsx";
import {Badge} from "../../components/ui/badge.tsx";
import {moneyFormat} from "../../lib/utils.ts";
import {usePatchOrderMutation} from "../../api.ts";
import {useDispatch, useSelector} from "react-redux";
import {clearState, selectBaseService, selectOptions, selectVariant} from "../../slices/createOrderSlice.ts";

export const OrderCreationPage = () => {
    const [patchOrder] = usePatchOrderMutation();
    const services = useSelector(state => state.createOrder.services);
    const orderId = useSelector(state => state.createOrder.id)
    const baseService = useSelector(state => state.createOrder.baseService)
    const options = useSelector(state => state.createOrder.options)
    const serviceVariant = useSelector(state => state.createOrder.serviceVariant)

    const {vibro} = useTelegram();
    const navigate = useNavigate()
    const {serviceId = ''} = useParams<{ serviceId: string }>()

    const dispatch = useDispatch();

    // Если создаем - true, если редактируем - false;
    const isDraft = !Boolean(orderId);

    // Находим таб, в котором находится услуга
    const currentService = useMemo(() => services.find(service => service.id === Number(serviceId)), [serviceId, services]);

    const variantId = serviceVariant?.id || currentService?.variants[0]?.id;

    // Находим варианты услуг по базовой услуге
    const variants = currentService?.variants || [];
    // Получаем доступные опции для типа услуги
    const availableOptions = currentService?.options || [];

    const selectedOptionsIdSet = useMemo(() => new Set(options.map(o => o.id)), [options]);

    // Считаем общую сумму
    const totalPrice = useMemo(() => options.reduce((sum, optionId) => {
        const option = availableOptions.find(opt => opt.id === Number(optionId))
        return sum + (option?.price || 0)
    }, serviceVariant?.basePrice || 0), [serviceVariant, options, availableOptions]);

    // Считаем общее время
    const totalDuration = useMemo(() => options.reduce((sum, optionId) => {
        const option = availableOptions.find(opt => opt.id === Number(optionId))
        return sum + (option?.duration || 0)
    }, serviceVariant?.duration || 0), [serviceVariant, options, availableOptions]);

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
            dispatch(selectBaseService({baseService: currentService, serviceVariant, options}))

            navigate(`/order/${serviceId}/checkout`);
        } else {
            await patchOrder({id: orderId, serviceVariant, options}).unwrap();
            navigate(`/orders`);
        }
    }

    const handleSelectVariant = (serviceVariant: any) => {
        dispatch(selectVariant({serviceVariant}))
    }

    const handleBackClick = () => dispatch(clearState());

    if (!currentService) {
        return null
    }

    return (
        <div className="fixed inset-0 flex flex-col">
            <Header>
                <div className="grid grid-cols-[40px_auto_40px]">
                    <BackButton onClick={handleBackClick}/>
                    <Typography.Title
                        className="items-center flex justify-center">{currentService?.name}</Typography.Title>
                </div>
            </Header>

            {/* Service Options */}
            <div className="flex-1 overflow-y-auto overscroll-none bg-tg-theme-secondary-bg-color px-4">
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
                <div className="pt-2">
                    <List itemClassName="flex-col gap-2">
                        {availableOptions.map((option) => <>
                            <div className="flex items-center gap-3 ml-3 w-full justify-between">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                    <Info
                                        className="flex-none w-[18px] h-[18px] mt-0.5 text-tg-theme-subtitle-text-color"/>
                                    <span
                                        className="text-[16px] [line-height:20px] [font-weight:400] text-tg-theme-text-color truncate">{option.name}</span>
                                </div>
                                <span
                                    className="text-[15px] font-normal text-tg-theme-text-color whitespace-nowrap">{moneyFormat(option.price)}</span>
                            </div>
                            <div className="flex items-center gap-3 ml-3 w-full justify-between">
                                {option.isPopular ? (
                                    <Badge className="flex gap-1 items-center"><Star
                                        className="w-3 h-3"/>ПОПУЛЯРНО</Badge>
                                ) : <div/>}
                                <Button
                                    variant={selectedOptionsIdSet.has(option.id) ? 'primary' : 'default'}
                                    className={`w-[34px] h-[34px] p-0 rounded-xl hover:bg-transparent`}
                                    onClick={() => handleOptionToggle(option)}
                                >
                                    <Plus
                                        className={`w-[18px] h-[18px] ${selectedOptionsIdSet.has(option.id) ? 'rotate-45' : ''} transition-transform`}/>
                                </Button>
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
                >
                    {isDraft ? <><span className="flex-1 text-left">Далее</span>
                        <span>{moneyFormat(totalPrice)}</span></> : 'Сохранить'}
                </Button>
            </BottomActions>
        </div>
    )
}