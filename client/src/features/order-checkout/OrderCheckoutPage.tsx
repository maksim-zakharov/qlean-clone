import {BackButton} from "@/components/BackButton"
import {Button} from "@/components/ui/button"
import {Calendar, ChevronRight, CreditCard, MessageSquare} from "lucide-react"
import {useLocation, useNavigate} from "react-router-dom"
import {Checkbox} from "@/components/ui/checkbox"
import {Service, ServiceOption} from "../order-creation/types.ts";
import React, {useMemo, useState} from "react";
import EstimatedTime from "../../components/EstimatedTime.tsx";
import {ScheduleSheet} from "../../components/ScheduleSheet.tsx";
import {List} from "../../components/ui/list.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger,} from "../../components/ui/accordion"
import {Header} from "../../components/ui/Header.tsx";
import {BottomActions} from "@/components/BottomActions.tsx"
import {CommentsSheet} from "../../components/CommentsSheet.tsx";
import dayjs from "dayjs";
import {Typography} from "../../components/ui/Typography.tsx";
import {useAddOrderMutation} from "../../api.ts";
import {moneyFormat} from "../../lib/utils.ts";
import {useSelector} from "react-redux";


export const OrderCheckoutPage = () => {
    const [addOrder] = useAddOrderMutation();

    const baseService = useSelector(state => state.createOrder.baseService)
    const options = useSelector(state => state.createOrder.options)
    const serviceVariant = useSelector(state => state.createOrder.serviceVariant)
    const fullAddress = useSelector(state => state.createOrder.fullAddress?.fullAddress)

    const navigate = useNavigate()
    const [selectedTimestamp, setSelectedTimestamp] = useState<number | undefined>(undefined);
    const [comment, setComment] = useState<string | undefined>();
    const {vibro, userId} = useTelegram();
    const totalPrice = useMemo(() => options.reduce((sum, option) => sum + option.price, serviceVariant?.basePrice || 0), [serviceVariant, options]);

    // Считаем общее время
    const totalDuration = useMemo(() => options.reduce((sum, option) => sum + (option?.duration || 0), baseService?.duration || 0), [baseService]);

    const backUrl = useMemo(() => {
        const url = new URL(`${window.origin}/order/${baseService?.id}`);
        url.searchParams.set('variantId', serviceVariant.id);
        options.forEach((option) => url.searchParams.append('optionId', option.id));

        return url.toString().replace(window.origin, '');

    }, [serviceVariant, options, baseService]);

    const dateTitle = useMemo(() => {
        if (!selectedTimestamp) {
            return 'Дата и время уборки';
        }

        return dayjs(selectedTimestamp).format('dddd, D MMMM HH:mm');
    }, [selectedTimestamp]);

    const handleOnSubmit = async () => {
        await addOrder(
            {
                baseService,
                serviceVariant,
                fullAddress,
                options,
                date: selectedTimestamp,
                comment,
                userId
            }).unwrap();
        navigate('/orders')
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-tg-theme-bg-color">
            <div
                className="flex items-center h-[48px] px-2 pt-[env(safe-area-inset-top,0px)] bg-tg-theme-secondary-bg-color border-b border-tg-theme-section-separator-color">
                <BackButton url={`/order/${baseService?.id}`} state={{selectedServices: options, currentService: baseService}}/>
                <div className="flex-1 flex flex-col items-center">
                    <Typography.Title>Оформление заказа</Typography.Title>
                    <Typography.Description>{fullAddress}</Typography.Description>
                </div>
                <div className="w-[40px]"/>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-none bg-tg-theme-secondary-bg-color">
                <div className="p-4">
                    <List itemClassName="py-2">

                        {/* Date and Time */}
                        <ScheduleSheet selectedTimestamp={selectedTimestamp} onSelectDate={setSelectedTimestamp}
                        >
                            <Button
                                variant="ghost"
                                className="w-full p-0 rounded-2xl h-auto text-sm flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="[background-color:var(--tg-accent-blue)] w-7 h-7 [border-radius:5px] flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-tg-theme-text-color"/>
                                    </div>
                                    <span className="text-tg-theme-text-color">{dateTitle}</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-tg-theme-hint-color"/>
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
                                        <MessageSquare className="w-5 h-5 text-tg-theme-text-colo"/>
                                    </div>
                                    <span className="text-tg-theme-text-color">Пожелание к заказу</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-tg-theme-hint-color"/>
                            </Button>
                        </CommentsSheet>

                        {/* Payment Method */}
                        <Button
                            variant="ghost"
                            className="w-full p-0 rounded-2xl h-auto text-sm flex items-center justify-between"
                            onClick={() => {/* TODO: Open payment selection */
                            }}
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="[background-color:var(--tg-accent-green)] w-7 h-7 [border-radius:5px] flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-tg-theme-text-colo"/>
                                </div>
                                <span className="text-tg-theme-text-color">Мир *5987</span>
                            </div>
                        </Button>
                    </List>

                    {/* Order Summary */}
                    <Accordion
                        type="single"
                        collapsible
                        defaultValue="services"
                        className="mt-4 overflow-hidden rounded-2xl"
                        onValueChange={() => vibro()}
                    >
                        <AccordionItem value="services">
                            <AccordionTrigger disabled={!options.length}
                                              className="px-4 py-3 hover:no-underline">
                                <div className="flex justify-between w-full">
                                    <span className="text-lg font-medium text-tg-theme-text-color">Итого</span>
                                    <div className="flex items-center gap-1 pr-2">
                                        <span
                                            className="text-lg font-medium text-tg-theme-text-color">{moneyFormat(totalPrice)}</span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-2">
                                    <div key={baseService.id} className="flex justify-between">
                                        <span className="text-tg-theme-text-color">{baseService.name}</span>
                                        <span className="text-tg-theme-text-color">{moneyFormat(serviceVariant.basePrice)}</span>
                                    </div>
                                    {options.map((service, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span className="text-tg-theme-text-color">{service.name}</span>
                                            <span className="text-tg-theme-text-color">{moneyFormat(service.price)}</span>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>

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
                    <div className="flex items-start gap-2 py-2">
                        <Checkbox id="terms"/>
                        <label htmlFor="terms" className="text-sm text-tg-theme-text-color">
                            Принимаю <span className="text-tg-theme-link-color">условия оказания услуги</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <BottomActions>
                <Button
                    wide
                    onClick={handleOnSubmit}
                >
                    Оформить заказ
                </Button>
            </BottomActions>
        </div>
    )
} 