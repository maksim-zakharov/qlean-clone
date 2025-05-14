import {Header} from "../../components/ui/Header.tsx";
import {Typography} from "../../components/ui/Typography.tsx";
import React, {useMemo, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useCancelOrderMutation, useGetOrderByIdQuery, usePatchOrderMutation} from "../../api/ordersApi.ts";
import {useGetAddressesQuery} from "../../api/api.ts";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../components/ui/accordion.tsx";
import {moneyFormat} from "../../lib/utils.ts";
import dayjs from "dayjs";
import {Button} from "../../components/ui/button.tsx";
import {Card} from "../../components/ui/card.tsx";
import { User} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "../../components/ui/avatar.tsx";
import {BottomActions} from "../../components/BottomActions.tsx";
import {Skeleton} from "../../components/ui/skeleton.tsx";
import {ScheduleSheet} from "../../components/ScheduleSheet.tsx";
import {CommentsSheet} from "../../components/CommentsSheet.tsx";
import {AddressSheet} from "../../components/AddressSheet.tsx";
import {selectBaseService} from "../../slices/createOrderSlice.ts";
import {useDispatch} from "react-redux";
import {AlertDialogWrapper} from "../../components/AlertDialogWrapper.tsx";
import {RoutePaths} from "../../routes.ts";
import {EditButton} from "../../components/EditButton.tsx";
import {useTranslation} from "react-i18next";
import {ErrorState} from "../../components/ErrorState.tsx";
import {OrderStatusText} from "../../components/OrderStatusText.tsx";
import {useBackButton} from "../../hooks/useTelegram.tsx";

export const OrderDetailsPage = () => {
    const {t} = useTranslation();
    const [patchOrder] = usePatchOrderMutation();
    const [cancelOrder, {isLoading: cancelLoading}] = useCancelOrderMutation();
    const navigate = useNavigate()
    useBackButton(() => navigate(RoutePaths.Orders));
    const dispatch = useDispatch();
    const {data: addresses = []} = useGetAddressesQuery();
    const {id} = useParams<string>();
    const {data: order, isLoading, isError} = useGetOrderByIdQuery({id: id!});
    const [{title, description, show}, setAlertConfig] = useState({
        title: '',
        description: '',
        show: false
    })

    const canEdit = Boolean(order?.status) && ['todo'].includes(order?.status);

    const totalPrice = useMemo(() => order?.options.reduce((sum, option) => sum + option.price, order?.serviceVariant?.basePrice || 0) || 0, [order]);

    const handleSelectAddress = async ({fullAddress}: any) => {
        if (fullAddress !== order.fullAddress)
            await patchOrder({id: order.id, fullAddress}).unwrap();
    }

    const handleSelectDate = async (date: number) => {
        if (date !== order.date)
            await patchOrder({id: order.id, date}).unwrap();
    }

    const handleChangeComment = async (comment?: string) => {
        if (comment && comment !== order.comment)
            await patchOrder({id: order.id, comment}).unwrap();
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
        await cancelOrder({id: order.id}).unwrap();
        setAlertConfig(prevState => ({...prevState, show: false}));
        setTimeout(() => setAlertConfig(prevState => ({...prevState, title: '', description: ''})), 300);
    }

    const handleCloseClick = () => {
        Telegram.WebApp.showPopup({
            title: `${t('client_order_details_cancel_title')} ${dayjs.utc(order.date).local().format('dd, D MMMM HH:mm')}?`,
            message: t('client_order_details_cancel_description'),
            buttons: [{
                id: 'ok',
                text: t('client_order_details_reschedule_ok_btn'),
                type: 'default'
            },{
                id: 'cancel',
                text: t('client_order_details_reschedule_cancel_btn'),
                type: 'destructive'
            }]
        }, id => id === 'cancel' && handleCancelClick())
    }

    const executorName = useMemo(() => {
        if(order?.executor){
            let name = order?.executor?.firstName;
            if(order?.executor?.lastName){
                name += ` ${order?.executor?.lastName[0]}.`
            }
            return name;
        }
        return t('client_order_details_executor_status')
    }, [order, t])


    if (isLoading || cancelLoading || !order) {
        return <div className="p-4 mt-[56px] flex flex-col gap-4">
            <Skeleton className="w-full h-[112px]"/>
            <Skeleton className="w-full h-[192px]"/>
            <Skeleton className="w-full h-[164px]"/>
        </div>
    }

    if (isError) {
        return <div
            className="h-screen">
            <ErrorState/>
        </div>
    }

    return <div className="flex flex-col bg-inherit overflow-y-auto overscroll-none h-screen">
        <AlertDialogWrapper open={show} title={title} description={description}
                            onOkText={t('client_order_details_reschedule_ok_btn')}
                            onCloseText={t('client_order_details_reschedule_cancel_btn')}
                            cancelLoading={cancelLoading}
                            onCancelClick={handleCancelClick}
                            onOkClick={handleOkClick}/>
        <Header>
            <Typography.Title
                className="items-center flex justify-center">{order.baseService?.name}</Typography.Title>
        </Header>

        <div className="flex flex-col gap-4 bg-inherit p-4">
            <Card className="p-0 pl-4 gap-0">
                <div className="p-3 pl-0 separator-shadow-bottom">
                    <div className="flex justify-between">
                        <Typography.Title>
                            №{order.id}
                        </Typography.Title>
                        <Typography.Title><OrderStatusText status={order.status}/></Typography.Title>
                    </div>
                </div>
                <div className="p-3 pl-0 flex gap-2 flex-col">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <Typography.Description>{t('client_order_details_executor_title')}</Typography.Description>
                            <Typography.Title>{executorName}</Typography.Title>
                        </div>
                        <Avatar className="rounded-3xl bg-tg-theme-secondary-bg-color">
                            <AvatarImage src={order?.executor?.photoUrl}/>
                            <AvatarFallback className="bg-tg-theme-secondary-bg-color"><User/></AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </Card>
            <Card className="p-0 gap-0 pl-4">
                <div className="p-3 pl-0 separator-shadow-bottom">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <Typography.Description>{dayjs.utc(order.date).local().format('D MMMM')}</Typography.Description>
                            <Typography.Title>{dayjs.utc(order.date).local().format('HH:mm')}</Typography.Title>
                        </div>
                        {canEdit && <ScheduleSheet serviceVariantId={order?.serviceVariant?.id}
                                                   optionIds={order?.options.map(o => o.id)}
                                                   selectedTimestamp={dayjs.utc(order.date).valueOf()}
                                                   onSelectDate={handleSelectDate}>
                            <EditButton/>
                        </ScheduleSheet>}
                    </div>
                </div>
                <div className="p-3 pl-0 flex gap-2 flex-col separator-shadow-bottom">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <Typography.Description>{t('address')}</Typography.Description>
                            <Typography.Title>{order.fullAddress}</Typography.Title>
                        </div>
                        {canEdit && <AddressSheet
                            addresses={addresses}
                            onAddressSelect={handleSelectAddress}
                        >
                            <EditButton/>
                        </AddressSheet>}
                    </div>
                </div>
                <div className="p-3 pl-0 flex gap-2 flex-col">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                            <Typography.Description>{t('payments_comments')}</Typography.Description>
                            <Typography.Title
                                className="[overflow-wrap:anywhere]">{order.comment || t('client_order_details_comments_empty')}</Typography.Title>
                        </div>
                        {canEdit && <CommentsSheet onChangeText={handleChangeComment} text={order.commet}>
                            <EditButton/>
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
            >
                <AccordionItem value="services">
                    <AccordionTrigger disabled>
                        <div className="flex justify-between w-full">
                            <span className="text-lg font-medium text-tg-theme-text-color">{t('client_order_details_services_summary')}</span>
                            <div className="flex items-center gap-1">
                                        <span
                                            className="text-lg font-medium text-tg-theme-text-color">{moneyFormat(totalPrice)}</span>
                            </div>
                        </div>
                    </AccordionTrigger>
                    {order.options.length > 0 && <AccordionContent>
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
                    </AccordionContent>}
                </AccordionItem>
            </Accordion>
        </div>
        {canEdit && <>
            <BottomActions className="flex flex-col gap-2 [min-height:calc(58px+var(--tg-safe-area-inset-bottom))] [padding-bottom:var(--tg-safe-area-inset-bottom)]">
                <Button
                    wide
                    size="lg"
                    onClick={handleAddOptionClick}
                >
                    {t('client_order_details_add_option_btn')}
                </Button>
                <Button
                    wide
                    size="lg"
                    className="border-none"
                    variant="default"
                    onClick={handleCloseClick}
                >
                    {t('client_order_details_cancel_btn')}
                </Button>
            </BottomActions>
        </>
        }
    </div>
}