import {Header} from "../components/ui/Header.tsx";
import {BackButton} from "../components/BackButton.tsx";
import {Typography} from "../components/ui/Typography.tsx";
import React, {useMemo} from "react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useGetOrderByIdQuery} from "../api.ts";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../components/ui/accordion.tsx";
import {moneyFormat} from "../lib/utils.ts";
import dayjs from "dayjs";
import {Button} from "../components/ui/button.tsx";
import {Card} from "../components/ui/card.tsx";
import {selectBaseService} from "../slices/createOrderSlice.ts";
import {useDispatch} from "react-redux";
import {Pencil, User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "../components/ui/avatar.tsx";
import {BottomActions} from "../components/BottomActions.tsx";
import {Alert, AlertDescription, AlertTitle} from "../components/ui/alert.tsx";
import {Skeleton} from "../components/ui/skeleton.tsx";

export const OrderDetailsPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {userId, vibro} = useTelegram();
    const {id} = useParams<string>();
    const {data: order, isLoading} = useGetOrderByIdQuery({userId, id: id!});

    const totalPrice = useMemo(() => order?.options.reduce((sum, option) => sum + option.price, order?.serviceVariant?.basePrice || 0) || 0, [order]);

    const handleAddOptionClick = (e: React.MouseEvent<HTMLButtonElement>, order: any) => {
        e.stopPropagation()
        dispatch(selectBaseService(order))
        navigate('/order')
    }

    if (isLoading && !order) {
        return <div className="px-4 mt-[56px]">
            <div className="mt-4">
                <Skeleton className="w-full h-[128px] mt-2"/>
                <Skeleton className="w-full h-[216px] mt-2"/>
                <Skeleton className="w-full h-[138px] mt-2"/>
            </div>
        </div>
    }

    return <div className="fixed inset-0 flex flex-col">
        <Header>
            <div className="grid grid-cols-[40px_auto_40px]">
                <BackButton url="/orders"/>
                <Typography.Title
                    className="items-center flex justify-center">{order.baseService?.name}</Typography.Title>
            </div>
        </Header>

        <div className="flex-1 overflow-y-auto overscroll-none bg-tg-theme-secondary-bg-color px-4 mt-[56px]">
            <Card className="p-0 gap-0 mt-2">
                <div className="p-4 separator-shadow-bottom">
                    <div className="flex justify-between">
                        <Typography.Title>
                            №{order.id}
                        </Typography.Title>
                        <Typography.Title>Оформлен</Typography.Title>
                    </div>
                </div>
                <div className="p-4 flex gap-2 flex-col separator-shadow-bottom">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <Typography.Description>Исполнитель</Typography.Description>
                            <Typography.Title>В поиске</Typography.Title>
                        </div>
                        <Avatar className="rounded-3xl bg-tg-theme-secondary-bg-color">
                            <AvatarImage src={''}/>
                            <AvatarFallback className="bg-tg-theme-secondary-bg-color"><User/></AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </Card>
            <Card className="p-0 gap-0 mt-2">
                <div className="p-4 separator-shadow-bottom">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <Typography.Description>{dayjs(order.date).format('D MMMM')}</Typography.Description>
                            <Typography.Title>{dayjs(order.date).format('HH:mm')}</Typography.Title>
                        </div>
                        <Button variant="ghost" className="pr-1 text-tg-theme-hint-color h-6"
                                onClick={(e) => null}>
                            <Pencil/>
                        </Button>
                    </div>
                </div>
                <div className="p-4 flex gap-2 flex-col separator-shadow-bottom">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <Typography.Description>Адрес</Typography.Description>
                            <Typography.Title>{order.fullAddress}</Typography.Title>
                        </div>
                        <Button variant="ghost" className="pr-1 text-tg-theme-hint-color h-6"
                                onClick={(e) => null}>
                            <Pencil/>
                        </Button>
                    </div>
                </div>
                <div className="p-4 flex gap-2 flex-col separator-shadow-bottom">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <Typography.Description>Комментарий</Typography.Description>
                            <Typography.Title>{order.comments || 'Отсутствует'}</Typography.Title>
                        </div>
                        <Button variant="ghost" className="pr-1 text-tg-theme-hint-color h-6"
                                onClick={(e) => null}>
                            <Pencil/>
                        </Button>
                    </div>
                </div>
            </Card>
            <Alert variant="primary" className="mt-2">
                <AlertTitle>Добавить опции</AlertTitle>
                <AlertDescription>
                    Помыть духовку, почистить лоток питомца, что-то еще?
                </AlertDescription>
                <AlertDescription className="pt-2">
                    <Button
                        size="small"
                    >
                        Добавить опций
                    </Button>
                </AlertDescription>
            </Alert>
            <Accordion
                type="single"

                defaultValue="services"
                className="mt-2 mb-2 overflow-hidden rounded-2xl"
                onValueChange={() => vibro()}
            >
                <AccordionItem value="services">
                    <AccordionTrigger disabled={!order.options.length}
                                      className="px-4 py-3 hover:no-underline">
                        <div className="flex justify-between w-full">
                            <span className="text-lg font-medium text-tg-theme-text-color">Итого</span>
                            <div className="flex items-center gap-1">
                                        <span
                                            className="text-lg font-medium text-tg-theme-text-color">{moneyFormat(totalPrice)}</span>
                            </div>
                        </div>
                    </AccordionTrigger>
                    {order.options.length > 0 && <AccordionContent>
                        <div className="flex flex-col gap-2">
                            <div key={order.baseService?.id} className="flex justify-between">
                                <span className="text-tg-theme-text-color">{order.baseService?.name}</span>
                                <span
                                    className="text-tg-theme-text-color">{moneyFormat(order.serviceVariant?.basePrice)}</span>
                            </div>
                            {order.options.map((service, index) => (
                                <div key={index} className="flex justify-between">
                                    <span className="text-tg-theme-text-color">{service.name}</span>
                                    <span
                                        className="text-tg-theme-text-color">{moneyFormat(service.price)}</span>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>}
                </AccordionItem>
            </Accordion>
            {/*<Button className="mt-4" wide>*/}
            {/*    Добавить опции*/}
            {/*</Button>*/}
        </div>
        <BottomActions className="gap-2 flex-col flex">
            <Button
                wide
            >
                Перенести
            </Button>
            <Button
                wide
                variant="default"
            >
                Отменить
            </Button>
        </BottomActions>
    </div>
}