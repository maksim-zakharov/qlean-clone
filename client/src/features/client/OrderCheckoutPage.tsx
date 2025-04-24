import {BackButton} from "@/components/BackButton"
import {Button} from "@/components/ui/button"
import {Calendar, ChevronRight, CreditCard, MessageSquare} from "lucide-react"
import {useNavigate} from "react-router-dom"
import {Checkbox} from "@/components/ui/checkbox"
import React, {useMemo, useState} from "react";
import EstimatedTime from "../../components/EstimatedTime.tsx";
import {ScheduleSheet} from "../../components/ScheduleSheet.tsx";
import {List} from "../../components/ui/list.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "../../components/ui/accordion.tsx"
import {BottomActions} from "@/components/BottomActions.tsx"
import {CommentsSheet} from "../../components/CommentsSheet.tsx";
import dayjs from "dayjs";
import {Typography} from "../../components/ui/Typography.tsx";
import {useAddOrderMutation, useGetAddressesQuery} from "../../api.ts";
import {moneyFormat} from "../../lib/utils.ts";
import {useDispatch, useSelector} from "react-redux";
import {AddressSheet} from "../../components/AddressSheet.tsx";
import {selectDate, selectFullAddress} from "../../slices/createOrderSlice.ts";
import {Header} from "../../components/ui/Header.tsx";
import {AlertDialogWrapper} from "../../components/AlertDialogWrapper.tsx";
import {RoutePaths} from "../../routes.ts";


export const OrderCheckoutPage = () => {
    const [addOrder, {isLoading}] = useAddOrderMutation();

    const selectedTimestamp = useSelector(state => state.createOrder.date)
    const baseService = useSelector(state => state.createOrder.baseService)
    const options = useSelector(state => state.createOrder.options)
    const serviceVariant = useSelector(state => state.createOrder.serviceVariant)
    const fullAddress = useSelector(state => state.createOrder.fullAddress?.fullAddress)
    const dispatch = useDispatch();

    const [error, setError] = useState<string | undefined>();

    const navigate = useNavigate()
    const [comment, setComment] = useState<string | undefined>();
    const {vibro} = useTelegram();
    const {data: addresses = []} = useGetAddressesQuery();
    const totalPrice = useMemo(() => options.reduce((sum, option) => sum + option.price, serviceVariant?.basePrice || 0), [serviceVariant, options]);

    // Считаем общее время
    const totalDuration = useMemo(() => options.reduce((sum, option) => sum + (option?.duration || 0), serviceVariant?.duration || 0), [serviceVariant, options]);

    const dateTitle = useMemo(() => {
        if (!selectedTimestamp) {
            return 'Дата и время уборки';
        }

        return dayjs(selectedTimestamp).format('dddd, D MMMM HH:mm');
    }, [selectedTimestamp]);

    const handleSelectAddress = (address: any) => {
        dispatch(selectFullAddress(address))
    }

    const handleSelectDate = (date) => dispatch(selectDate({date}));

    const handleOnSubmit = async () => {
        try {
            await addOrder(
                {
                    baseService,
                    serviceVariant,
                    fullAddress,
                    options,
                    date: selectedTimestamp,
                    comment
                }).unwrap();
            navigate(RoutePaths.Orders)
        } catch (e) {
            let description = 'Что-то пошло не так.'
            if (!selectedTimestamp) {
                description = 'Необходимо выбрать дату и время'
            }
            if (!fullAddress) {
                description = 'Необходимо выбрать адрес'
            }
            setError(description);
        }
    }

    return (
        <>
            <AlertDialogWrapper open={Boolean(error)} title="Не удалось оформить заказ" description={error}
                                onOkText="Хорошо"
                                onOkClick={() => setError(undefined)}/>
            <Header>
                <div className="grid grid-cols-[40px_auto_40px]">
                    <BackButton url={RoutePaths.Orders}/>
                    <AddressSheet
                        addresses={addresses}
                        onAddressSelect={handleSelectAddress}
                    >
                        <Button variant="ghost"
                                className="flex-1 flex flex-col items-center h-auto text-tg-theme-text-color text-base font-medium">
                            <Typography.Title>Оформление заказа</Typography.Title>
                            <Typography.Description>{fullAddress}</Typography.Description>
                        </Button>
                    </AddressSheet>
                </div>
            </Header>

            <div className="content flex flex-col gap-4 p-4">
                <List itemClassName="py-2">

                    {/* Date and Time */}
                    <ScheduleSheet selectedTimestamp={selectedTimestamp} onSelectDate={handleSelectDate}
                    >
                        <Button
                            variant="ghost"
                            className="w-full p-0 rounded-2xl h-auto text-sm flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="[background-color:var(--tg-accent-blue)] w-7 h-7 [border-radius:5px] flex items-center justify-center">
                                    <Calendar className="w-5 h-5 text-tg-theme-button-text-color"/>
                                </div>
                                <span className="text-tg-theme-text-color">{dateTitle}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-tg-theme-hint-color mr-[-8px]"/>
                        </Button>
                    </ScheduleSheet>

                    {/* Comments */}
                    <CommentsSheet onChangeText={setComment} text={comment}>
                        <Button
                            variant="ghost"
                            className="w-full p-0 rounded-2xl h-auto text-sm flex items-center justify-between"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="[background-color:var(--tg-accent-orange)] w-7 h-7 [border-radius:5px] flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-tg-theme-text-color"/>
                                </div>
                                <span className="text-tg-theme-text-color">Пожелание к заказу</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-tg-theme-hint-color mr-[-8px]"/>
                        </Button>
                    </CommentsSheet>

                    {/* Payment Method */}
                    <Button
                        variant="ghost"
                        className="w-full p-0 rounded-2xl h-auto text-sm flex items-center justify-between"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="[background-color:var(--tg-accent-green)] w-7 h-7 [border-radius:5px] flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-tg-theme-text-color"/>
                            </div>
                            <span className="text-tg-theme-text-color">Мир *5987</span>
                        </div>
                    </Button>
                </List>

                {/* Order Summary */}
                {baseService && <Accordion
                    type="single"
                    collapsible
                    defaultValue="services"
                    onValueChange={() => vibro()}
                >
                    <AccordionItem value="services">
                        <AccordionTrigger disabled={!options.length}>
                            <div className="flex justify-between w-full">
                                <span className="text-lg font-medium text-tg-theme-text-color">Итого</span>
                                <div className="flex items-center gap-1 pr-2">
                                        <span
                                            className="text-lg font-medium text-tg-theme-text-color">{moneyFormat(totalPrice)}</span>
                                </div>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-2">
                            <div key={baseService?.id} className="flex justify-between">
                                <span className="text-tg-theme-text-color">{baseService?.name}</span>
                                <span
                                    className="text-tg-theme-text-color">{moneyFormat(serviceVariant?.basePrice)}</span>
                            </div>
                            {options.map((service, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="text-tg-theme-text-color">{service.name}</span>
                                    <span
                                        className="text-tg-theme-text-color">{moneyFormat(service.price)}</span>
                                </div>
                            ))}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>}

                <EstimatedTime totalDuration={totalDuration}/>

                {/* Promo Code */}
                {/*<Button*/}
                {/*  variant="ghost"*/}
                {/*  className="w-full bg-tg-theme-bg-color rounded-2xl h-auto py-4 px-4 flex items-center justify-center"*/}
                {/*  onClick={() => /!* TODO: Open promo code input *!/}*/}
                {/*>*/}
                {/*  <span className="text-tg-theme-text-color">У меня есть промокод</span>*/}
                {/*</Button>*/}

                {/* Terms Checkbox */}
                <div className="flex items-center gap-2">
                    <Checkbox id="terms"/>
                    <label htmlFor="terms" className="text-sm text-tg-theme-text-color">
                        Принимаю <span className="text-tg-theme-link-color">условия оказания услуги</span>
                    </label>
                </div>
            </div>

            {/* Submit Button */}
            <BottomActions>
                <Button
                    size="lg"
                    wide
                    loading={isLoading}
                    onClick={handleOnSubmit}
                >
                    Оформить заказ
                </Button>
            </BottomActions>
        </>
    )
} 