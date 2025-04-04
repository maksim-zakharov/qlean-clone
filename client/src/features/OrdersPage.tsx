import React, {useMemo} from "react";
import {Typography} from "../components/ui/Typography.tsx";
import {Card} from "../components/ui/card.tsx";
import {Button} from "../components/ui/button.tsx";
import {useGetOrdersQuery} from "../api.ts";
import dayjs from "dayjs";
import {ClipboardPlus, ListPlus, Map, RotateCw} from "lucide-react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {moneyFormat} from "../lib/utils.ts";
import {useDispatch} from "react-redux";
import {retryOrder, selectBaseService} from "../slices/createOrderSlice.ts";
import {useNavigate} from "react-router-dom";
import {Skeleton} from "../components/ui/skeleton.tsx";
import {EmptyState} from "../components/EmptyState.tsx";
import {AddAddressSheet} from "../components/AddAddressSheet.tsx";
import {RoutePaths} from "../routes.ts";


export const OrdersPage = () => {
    const {userId} = useTelegram();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {data: orders = [], isLoading} = useGetOrdersQuery({userId}, {
        refetchOnMountOrArgChange: true
    });

    const activeOrders = useMemo(() => orders.filter(o => !['completed', 'canceled'].includes(o.status)).sort((a, b) => b.id - a.id), [orders]);
    const completedOrders = useMemo(() => orders.filter(o => ['completed', 'canceled'].includes(o.status)).sort((a, b) => b.id - a.id), [orders]);

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

    if(orders.length === 0){
        return  <EmptyState
            icon={<ClipboardPlus className="h-10 w-10" />}
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
        {activeOrders.length > 0 && <div className="flex flex-col gap-4">
            <Typography.H2 className="mb-0">
                Активные
            </Typography.H2>
            {activeOrders.map(ao => <Card className="p-0 pl-4 gap-0" onClick={() => handleOrderClick(ao)}>
                <div className="p-3 pl-0 separator-shadow-bottom">
                    <div className="flex justify-between">
                        <Typography.Title>{ao.baseService?.name}</Typography.Title>
                        <Typography.Title>{moneyFormat(ao.serviceVariant?.basePrice + ao.options.reduce((acc, curr) => acc + curr?.price, 0))}</Typography.Title>
                    </div>
                    <div className="flex justify-between">
                        <Typography.Description>{ao.fullAddress}</Typography.Description>
                        <Typography.Description>{dayjs(ao.date).format('D MMMM, HH:mm')}</Typography.Description>
                    </div>
                </div>
                <div className="p-3 pl-0 flex gap-2 flex-col">
                    <div className="flex justify-between">
                        <Typography.Title>№{ao.id}</Typography.Title>
                        <Typography.Title>Оформлен</Typography.Title>
                    </div>
                    <div className="flex justify-between align-bottom items-center">
                        <Button className="p-0 border-none h-6" onClick={(e) => handleAddOptionClick(e, ao)} variant="default" size="sm">
                            <ListPlus className="w-5 h-5 mr-2" /> Добавить услугу
                        </Button>
                        <Typography.Description>Поддержка</Typography.Description>
                    </div>
                </div>
            </Card>)}
        </div>}
        {completedOrders.length > 0 && <div className="flex flex-col gap-4">
            <Typography.H2 className="mb-0">
                Все заявки
            </Typography.H2>
            {completedOrders.map(ao => <Card className="p-0 pl-4 gap-0" onClick={() => handleOrderClick(ao)}>
                <div className="p-3 pl-0 separator-shadow-bottom">
                    <div className="flex justify-between">
                        <Typography.Title>{ao.baseService?.name}</Typography.Title>
                        <Typography.Title>{moneyFormat(ao.serviceVariant?.basePrice + ao.options.reduce((acc, curr) => acc + curr?.price, 0))}</Typography.Title>
                    </div>
                    <div className="flex justify-between">
                        <Typography.Description>{ao.fullAddress}</Typography.Description>
                        <Typography.Description>{dayjs(ao.date).format('D MMMM, HH:mm')}</Typography.Description>
                    </div>
                </div>
                <div className="p-3 pl-0 flex gap-2 flex-col">
                    <div className="flex justify-between">
                        <Typography.Title>№{ao.id}</Typography.Title>
                        <Typography.Title>{ao.status === 'completed' ? 'Завершен' : 'Отменен'}</Typography.Title>
                    </div>
                    <div className="flex justify-between align-bottom items-center">
                        <Button className="p-0 border-none h-6" variant="default" size="sm"
                                onClick={(e) => handleRetryClick(e, ao)}>
                            <RotateCw className="w-5 h-5 mr-2" /> Повторить
                            </Button>
                        <Typography.Description>Поддержка</Typography.Description>
                    </div>
                </div>
            </Card>)}
        </div>}
    </div>
}