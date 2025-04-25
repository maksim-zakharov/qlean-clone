import React, {useMemo, useState} from "react";
import {Typography} from "../../components/ui/Typography.tsx";
import {Card} from "../../components/ui/card.tsx";
import {Button} from "../../components/ui/button.tsx";
import {useGetOrdersQuery} from "../../api.ts";
import dayjs from "dayjs";
import {CalendarSync, CircleX, ClipboardPlus, Star} from "lucide-react";
import {moneyFormat} from "../../lib/utils.ts";
import {useDispatch} from "react-redux";
import {retryOrder, selectBaseService} from "../../slices/createOrderSlice.ts";
import {useNavigate} from "react-router-dom";
import {Skeleton} from "../../components/ui/skeleton.tsx";
import {EmptyState} from "../../components/EmptyState.tsx";
import {RoutePaths} from "../../routes.ts";


export const ExecutorPaymentsPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {data: orders = [], isLoading, isError} = useGetOrdersQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    const [paymentsPeriod, setPaymentsPeriod] = useState<'week' | 'month'>('week');

    const completedOrders = useMemo(() => orders.filter(o => ['completed', 'canceled'].includes(o.status)).sort((a, b) => b.id - a.id), [orders]);
    const totalSum = useMemo(() => completedOrders.filter(order => {
        const orderDate = dayjs(order.date);
        return orderDate.isAfter(dayjs().subtract(1, paymentsPeriod));
    }).reduce((acc, curr) => acc + curr.serviceVariant?.basePrice + curr.options.reduce((acc, curr) => acc + curr?.price, 0), 0), [completedOrders, paymentsPeriod]);

    const handleAddOptionClick = (e: React.MouseEvent<HTMLButtonElement>, order: any) => {
        e.stopPropagation()
        dispatch(selectBaseService(order))
        navigate('/order')
    }

    const handleOrderClick = (order: any) => navigate(`/order/${order.id}`)

    const handleRetryClick = (e: React.MouseEvent<HTMLButtonElement>, order: any) => {
        e.stopPropagation()
        dispatch(retryOrder(order))
        navigate(`/order/checkout`)
    }

    if (isLoading) {
        return <div className="px-4 mb-4">
            <div className="mb-6 mt-4">
                <Skeleton className="w-[100px] h-[28px] mb-3"/>
                <Skeleton className="w-full h-[156px] mt-4"/>
                <Skeleton className="w-full h-[156px] mt-4"/>
                <Skeleton className="w-full h-[156px] mt-4"/>
            </div>
        </div>
    }

    if (isError) {
        return <EmptyState
            icon={<CircleX className="h-10 w-10"/>}
            title="Упс, что-то пошло не так..."
            description="Обновите страницу или повторите попытку позднее."
            action={
                <Button onClick={() => window.location.reload()}
                >
                    Обновить страницу
                </Button>}
        />
    }

    if (orders.length === 0) {
        return <EmptyState
            icon={<ClipboardPlus className="h-10 w-10"/>}
            title="Нет заказов"
            description="Выберите нужную услугу на главном экране"
            action={
                <Button onClick={() => navigate(RoutePaths.Root)}
                >
                    Выбрать услугу
                </Button>}
        />
    }

    return <div className="p-4 flex flex-col gap-4">
        <Card className="px-4 py-3">
            <div className="flex flex-col">
                <Button className="p-0 border-none h-6 w-max" variant="default" size="sm" onClick={() => setPaymentsPeriod(prevState => prevState !== 'week' ? 'week' : 'month')}>
                    <CalendarSync className="w-4 h-4 mr-1" /><Typography.Description className="text-tg-theme-button-color">Выплаты за {paymentsPeriod === 'week' ? 'неделю' : 'месяц'}</Typography.Description>
                </Button>
                <Typography.H2 className="mb-0 text-[24px]">{moneyFormat(totalSum)}</Typography.H2>
            </div>
        </Card>
        {completedOrders.length > 0 && <div className="flex flex-col gap-4">
            {completedOrders.map(ao => <Card className="p-0 pl-4 gap-0 p-3 pb-0" onClick={() => handleOrderClick(ao)}>
                <div className="flex justify-between">
                    <Typography.Title>{ao.baseService?.name}</Typography.Title>
                    <Typography.Title>{moneyFormat(ao.serviceVariant?.basePrice + ao.options.reduce((acc, curr) => acc + curr?.price, 0))}</Typography.Title>
                </div>
                <div className="flex justify-between">
                    <Typography.Description>{ao.fullAddress}</Typography.Description>
                    <Typography.Description>{dayjs(ao.date).format('D MMMM, HH:mm')}</Typography.Description>
                </div>
                <div className="flex gap-2 mt-2 pb-3">
                    <Star className="w-4 h-4 text-tg-theme-button-color"/>
                    <Star className="w-4 h-4 text-tg-theme-button-color"/>
                    <Star className="w-4 h-4 text-tg-theme-button-color"/>
                    <Star className="w-4 h-4 text-tg-theme-button-color"/>
                    <Star className="w-4 h-4 text-tg-theme-button-color"/>
                </div>
                {ao.comment &&<div className="flex flex-col mt-2 separator-shadow-top py-3">
                    <Typography.Description>Комментарий к оценке</Typography.Description>
                    <Typography.Title>{ao.comment}</Typography.Title>
                </div>}
            </Card>)}
        </div>}
    </div>
}