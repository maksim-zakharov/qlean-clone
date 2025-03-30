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


export const OrderCheckoutPage = () => {
    const [addOrder] = useAddOrderMutation();
    const navigate = useNavigate()
    const location = useLocation()
    const [selectedTimestamp, setSelectedTimestamp] = useState<number | undefined>(undefined);
    const [comment, setComment] = useState<string | undefined>();
    const {vibro} = useTelegram();
    const currentService = location.state?.currentService as Service;
    const selectedServices = (location.state?.selectedServices || []) as ServiceOption[]
    const totalPrice = selectedServices.reduce((sum: number, service: ServiceOption) => sum + service.price, currentService.basePrice)

    // Считаем общее время
    const totalDuration = useMemo(() => selectedServices.reduce((sum, option) => sum + (option?.duration || 0), currentService?.duration || 0), [currentService]);

    const dateTitle = useMemo(() => {
        if (!selectedTimestamp) {
            return 'Дата и время уборки';
        }

        return dayjs(selectedTimestamp).format('dddd, D MMMM HH:mm');
    }, [selectedTimestamp]);

    const handleOnSubmit = async () => {
        await addOrder(
            {
                serviceName: currentService?.name,
                service: currentService,
                totalPrice: totalPrice,
                fullAddress: 'Москва, Ходынский бульвар, 2',
                options: selectedServices,
                date: selectedTimestamp,
                comment
            }).unwrap();
        navigate('/orders')
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-tg-theme-bg-color">
            <Header>
                <div className="grid grid-cols-[40px_auto_40px]">
                    <BackButton url={`/order/${currentService?.id}`} state={{selectedServices, currentService}}/>
                    <div className="flex-1 flex flex-col items-center">
                        <div className="text-tg-theme-text-color text-base font-medium">
                            Оформление заказа
                        </div>
                        <span className="text-xs text-tg-theme-hint-color">Оружейный переулок, 41</span>
                    </div>
                </div>
            </Header>
            <div
                className="flex items-center h-[48px] px-2 pt-[env(safe-area-inset-top,0px)] bg-tg-theme-secondary-bg-color border-b border-tg-theme-section-separator-color">
                <BackButton url={`/order/${currentService?.id}`} state={{selectedServices, currentService}}/>
                <div className="flex-1 flex flex-col items-center">
                    <Typography.Title>Оформление заказа</Typography.Title>
                    <Typography.Description>Оружейный переулок, 41</Typography.Description>
                </div>
                <div className="w-[40px]"/>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-none bg-tg-theme-secondary-bg-color">
                <div className="p-4">
                    <List>

                        {/* Date and Time */}
                        <ScheduleSheet selectedTimestamp={selectedTimestamp} onSelectDate={setSelectedTimestamp}
                        >
                            <Button
                                variant="ghost"
                                className="w-full p-0 rounded-2xl h-auto text-sm flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-6 h-6 text-tg-theme-hint-color"/>
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
                                    <MessageSquare className="w-6 h-6 text-tg-theme-hint-color"/>
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
                                <CreditCard className="w-6 h-6 text-tg-theme-hint-color"/>
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
                            <AccordionTrigger disabled={!selectedServices.length}
                                              className="px-4 py-3 hover:no-underline">
                                <div className="flex justify-between w-full">
                                    <span className="text-lg font-medium text-tg-theme-text-color">Итого</span>
                                    <div className="flex items-center gap-1 pr-2">
                                        <span
                                            className="text-lg font-medium text-tg-theme-text-color">{totalPrice}₽</span>
                                    </div>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="flex flex-col gap-2">
                                    <div key={currentService.id} className="flex justify-between">
                                        <span className="text-tg-theme-text-color">{currentService.name}</span>
                                        <span className="text-tg-theme-text-color">{currentService.basePrice}₽</span>
                                    </div>
                                    {selectedServices.map((service, index) => (
                                        <div key={index} className="flex justify-between">
                                            <span className="text-tg-theme-text-color">{service.name}</span>
                                            <span className="text-tg-theme-text-color">{service.price}₽</span>
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