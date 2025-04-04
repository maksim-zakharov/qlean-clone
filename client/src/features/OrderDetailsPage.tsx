import {Header} from "../components/ui/Header.tsx";
import {BackButton} from "../components/BackButton.tsx";
import {Typography} from "../components/ui/Typography.tsx";
import React, {useMemo, useState} from "react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {useNavigate, useParams} from "react-router-dom";
import {useCancelOrderMutation, useGetAddressesQuery, useGetOrderByIdQuery, usePatchOrderMutation} from "../api.ts";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../components/ui/accordion.tsx";
import {moneyFormat} from "../lib/utils.ts";
import dayjs from "dayjs";
import {Button} from "../components/ui/button.tsx";
import {Card} from "../components/ui/card.tsx";
import {Pencil, User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "../components/ui/avatar.tsx";
import {BottomActions} from "../components/BottomActions.tsx";
import {Skeleton} from "../components/ui/skeleton.tsx";
import {ScheduleSheet} from "../components/ScheduleSheet.tsx";
import {CommentsSheet} from "../components/CommentsSheet.tsx";
import {AddressSheet} from "../components/AddressSheet.tsx";
import {selectBaseService} from "../slices/createOrderSlice.ts";
import {useDispatch} from "react-redux";
import {AlertDialogWrapper} from "../components/AlertDialogWrapper.tsx";
import {RoutePaths} from "../routes.ts";

export const OrderDetailsPage = () => {
    const [patchOrder] = usePatchOrderMutation();
    const [cancelOrder] = useCancelOrderMutation();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {userId, vibro} = useTelegram();
    const {data: addresses = []} = useGetAddressesQuery({userId});
    const {id} = useParams<string>();
    const {data: order, isLoading} = useGetOrderByIdQuery({userId, id: id!});
    const [{title, description, show}, setAlertConfig] = useState({
        title: '',
        description: '',
        show: false
    })

    const canEdit = Boolean(order?.status) && !['completed', 'canceled'].includes(order?.status);

    const totalPrice = useMemo(() => order?.options.reduce((sum, option) => sum + option.price, order?.serviceVariant?.basePrice || 0) || 0, [order]);

    const handleSelectAddress = async ({fullAddress}: any) => {
        if (fullAddress !== order.fullAddress)
            await patchOrder({id: order.id, fullAddress, userId}).unwrap();
    }

    const handleSelectDate = async (date: number) => {
        if (date !== order.date)
            await patchOrder({id: order.id, date, userId}).unwrap();
    }

    const handleChangeComment = async (comment?: string) => {
        if (comment && comment !== order.comment)
            await patchOrder({id: order.id, comment, userId}).unwrap();
    }

    const handleAddOptionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation()
        dispatch(selectBaseService(order))
        navigate('/order')
    }

    const handleOkClick = () => {
        setAlertConfig(prevState => ({...prevState, show: false}));
        setTimeout(() => setAlertConfig(prevState => ({...prevState, title: '', description: ''})), 300);
    }

    const handleCancelClick = async () => {
        await cancelOrder({id: order.id, userId}).unwrap();
        setAlertConfig(prevState => ({...prevState, show: false}));
        setTimeout(() => setAlertConfig(prevState => ({...prevState, title: '', description: ''})), 300);
    }

    const handleCloseClick = () => {
        setAlertConfig({
            title: `Отменить уборку ${dayjs(order.date).format('dd, D MMMM HH:mm')}?`,
            description: 'Вы можете перенести уборку, если дата и время вам не подходят',
            show: true
        })
    }


    if (isLoading && !order) {
        return <div className="px-4 mt-[56px]">
            <div className="mt-4">
                <Skeleton className="w-full h-[128px] mt-2"/>
                <Skeleton className="w-full h-[216px] mt-2"/>
                <Skeleton className="w-full h-[188px] mt-2"/>
            </div>
        </div>
    }

    return <div className="fixed inset-0 flex flex-col bg-inherit">
        <AlertDialogWrapper open={show} title={title} description={description}
                            onOkText="Перенести"
                            onCloseText="Отменить"
                            onCancelClick={handleCancelClick}
                            onOkClick={handleOkClick}/>
        <Header>
            <div className="grid grid-cols-[40px_auto_40px]">
                <BackButton url={RoutePaths.Orders}/>
                <Typography.Title
                    className="items-center flex justify-center">{order.baseService?.name}</Typography.Title>
            </div>
        </Header>

        <div className="flex flex-col gap-4 overflow-y-auto overscroll-none bg-inherit p-4 mt-[56px]">
            <Card className="p-0 pl-4 gap-0">
                <div className="p-3 pl-0 separator-shadow-bottom">
                    <div className="flex justify-between">
                        <Typography.Title>
                            №{order.id}
                        </Typography.Title>
                        <Typography.Title>{order.status === 'active' ? 'Оформлен' : order.status === 'canceled' ? 'Отменен' : 'Завершен'}</Typography.Title>
                    </div>
                </div>
                <div className="p-3 pl-0 flex gap-2 flex-col">
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
            <Card className="p-0 gap-0 pl-4">
                <div className="p-3 pl-0 separator-shadow-bottom">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <Typography.Description>{dayjs(order.date).format('D MMMM')}</Typography.Description>
                            <Typography.Title>{dayjs(order.date).format('HH:mm')}</Typography.Title>
                        </div>
                        {canEdit && <ScheduleSheet selectedTimestamp={new Date(order.date).getTime()}
                                                   onSelectDate={handleSelectDate}>
                            <Button variant="ghost" className="pr-1 text-tg-theme-hint-color h-6">
                                <Pencil/>
                            </Button>
                        </ScheduleSheet>}
                    </div>
                </div>
                <div className="p-3 pl-0 flex gap-2 flex-col separator-shadow-bottom">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <Typography.Description>Адрес</Typography.Description>
                            <Typography.Title>{order.fullAddress}</Typography.Title>
                        </div>
                        {canEdit && <AddressSheet
                            addresses={addresses}
                            onAddressSelect={handleSelectAddress}
                        >
                            <Button variant="ghost" className="pr-1 text-tg-theme-hint-color h-6">
                                <Pencil/>
                            </Button>
                        </AddressSheet>}
                    </div>
                </div>
                <div className="p-3 pl-0 flex gap-2 flex-col">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <Typography.Description>Комментарий</Typography.Description>
                            <Typography.Title
                                className="[overflow-wrap:anywhere]">{order.comment || 'Отсутствует'}</Typography.Title>
                        </div>
                        {canEdit && <CommentsSheet onChangeText={handleChangeComment} text={order.commet}>
                            <Button variant="ghost" className="pr-1 text-tg-theme-hint-color h-6">
                                <Pencil/>
                            </Button>
                        </CommentsSheet>}
                    </div>
                </div>
            </Card>
            {/*<Alert variant="primary" className="mt-2">*/}
            {/*    <AlertTitle>Добавить опции</AlertTitle>*/}
            {/*    <AlertDescription>*/}
            {/*        Помыть духовку, почистить лоток питомца, что-то еще?*/}
            {/*    </AlertDescription>*/}
            {/*    <AlertDescription className="pt-2">*/}
            {/*        <Button*/}
            {/*            size="small"*/}
            {/*        >*/}
            {/*            Добавить опций*/}
            {/*        </Button>*/}
            {/*    </AlertDescription>*/}
            {/*</Alert>*/}
            <Accordion
                type="single"

                defaultValue="services"
                className="mb-2 overflow-hidden rounded-xl"
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
        </div>
        {canEdit && <BottomActions className="gap-2 flex-col flex">
            <Button
                wide
                onClick={handleAddOptionClick}
            >
                Добавить опций
            </Button>
            <Button
                wide
                variant="default"
                onClick={handleCloseClick}
            >
                Отменить
            </Button>
        </BottomActions>}
    </div>
}