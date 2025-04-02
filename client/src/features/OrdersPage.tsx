import React, {useMemo} from "react";
import {Typography} from "../components/ui/Typography.tsx";
import {Card} from "../components/ui/card.tsx";
import {Button} from "../components/ui/button.tsx";
import {useGetOrdersQuery} from "../api.ts";
import dayjs from "dayjs";
import {RotateCw} from "lucide-react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {moneyFormat} from "../lib/utils.ts";
import {useDispatch} from "react-redux";
import {retryOrder, selectBaseService} from "../slices/createOrderSlice.ts";
import {useNavigate} from "react-router-dom";


export const OrdersPage = () => {
    const {userId} = useTelegram();
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {data: orders = []} = useGetOrdersQuery({userId}, {
        refetchOnMountOrArgChange: true
    });

    const activeOrders = useMemo(() => orders.filter(o => !['completed', 'canceled'].includes(o.status)).sort((a, b) => b.id - a.id), [orders]);
    const completedOrders = useMemo(() => orders.filter(o => ['completed', 'canceled'].includes(o.status)).sort((a, b) => b.id - a.id), [orders]);

    const handleAddOptionClick = (order: any) => {
        const {baseService} = order;
        let url;

        if (baseService) {
            url = `/order/${baseService?.id}`;
        } else {
            url = '/';
        }

        dispatch(selectBaseService(order))
        navigate(url)
    }

    const handleRetryClick = (order: any) => {
        dispatch(retryOrder(order))
        navigate(`/order/${order.baseService?.id}/checkout`)
    }

    return <div className="px-4 mb-2">
        {activeOrders.length > 0 && <div className="mb-6 mt-4">
            <Typography.H2>
                Активные
            </Typography.H2>
            {activeOrders.map(ao => <Card className="p-0 gap-0 mt-2">
                <div className="p-4 separator-shadow-bottom">
                    <div className="flex justify-between">
                        <Typography.Title>{ao.baseService?.name}</Typography.Title>
                        <Typography.Title>{moneyFormat(ao.serviceVariant?.basePrice + ao.options.reduce((acc, curr) => acc + curr?.price, 0))}</Typography.Title>
                    </div>
                    <div className="flex justify-between">
                        <Typography.Description>{ao.fullAddress}</Typography.Description>
                        <Typography.Description>{dayjs(ao.date).format('D MMMM, HH:mm')}</Typography.Description>
                    </div>
                </div>
                <div className="p-4 flex gap-2 flex-col">
                    <div className="flex justify-between">
                        <Typography.Title>№{ao.id}</Typography.Title>
                        <Typography.Title>Оформлен</Typography.Title>
                    </div>
                    <div className="flex justify-between align-bottom items-baseline">
                        <Button onClick={() => handleAddOptionClick(ao)} variant="default" size="small">Добавить
                            услугу</Button>
                        <Typography.Description>Поддержка</Typography.Description>
                    </div>
                </div>
            </Card>)}
        </div>}
        {completedOrders.length > 0 && <>
            <Typography.H2 className="mt-4">
                Все заявки
            </Typography.H2>
            {completedOrders.map(ao => <Card className="p-0 gap-0 mt-2">
                <div className="p-4 separator-shadow-bottom">
                    <div className="flex justify-between">
                        <Typography.Title>{ao.baseService?.name}</Typography.Title>
                        <Typography.Title>{moneyFormat(ao.serviceVariant?.basePrice + ao.options.reduce((acc, curr) => acc + curr?.price, 0))}</Typography.Title>
                    </div>
                    <div className="flex justify-between">
                        <Typography.Description>{ao.fullAddress}</Typography.Description>
                        <Typography.Description>{dayjs(ao.date).format('D MMMM, HH:mm')}</Typography.Description>
                    </div>
                </div>
                <div className="p-4 flex gap-2 flex-col">
                    <div className="flex justify-between">
                        <Typography.Title>№{ao.id}</Typography.Title>
                        <Typography.Title>Завершен</Typography.Title>
                    </div>
                    <div className="flex justify-between align-bottom items-baseline">
                        <Button variant="default" size="small" onClick={() => handleRetryClick(ao)}><RotateCw className="w-5 h-5 mr-2"/ >Повторить</Button>
                        <Typography.Description>Поддержка</Typography.Description>
                    </div>
                </div>
            </Card>)}
        </>}
    </div>
}