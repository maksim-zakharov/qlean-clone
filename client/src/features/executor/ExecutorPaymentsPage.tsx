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
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts"
import {ChartConfig, ChartContainer} from "../../components/ui/chart.tsx";


export const ExecutorPaymentsPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {data: orders = [], isLoading, isError} = useGetOrdersQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    const chartConfig = {
        payment: {
            label: "Mobile",
            color: "hsl(var(--chart-2))",
        },
        date: {
            label: "Mobile",
            color: "hsl(var(--chart-2))",
        },
    } satisfies ChartConfig

    const [paymentsPeriod, setPaymentsPeriod] = useState<'week' | 'month'>('week');

    const completedOrders = useMemo(() => orders.filter(o => ['completed', 'canceled'].includes(o.status)).sort((a, b) => b.id - a.id), [orders]);
    const filteredOrders = useMemo(() => orders.filter(o => ['completed', 'canceled'].includes(o.status)).filter(order => {
        const orderDate = dayjs(order.date);
        return orderDate.isAfter(dayjs().subtract(1, paymentsPeriod));
    }), [orders, paymentsPeriod])

    const totalSum = useMemo(() => filteredOrders.reduce((acc, curr) => acc + curr.serviceVariant?.basePrice + curr.options.reduce((acc, curr) => acc + curr?.price, 0), 0), [filteredOrders]);

    const chartData = filteredOrders.reduce((acc, curr, index) => {
        acc.push({date: curr.date, payment: curr.serviceVariant?.basePrice + curr.options.reduce((acc, curr) => acc + curr?.price, 0) + (acc[index - 1]?.payment || 0)});
        return acc;
    }, [])

    console.log(chartData);
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
        <Card className="px-4 py-3 flex-row justify-between">
            <div className="flex flex-col">
                <Button className="p-0 border-none h-6 w-max" variant="default" size="sm" onClick={() => setPaymentsPeriod(prevState => prevState !== 'week' ? 'week' : 'month')}>
                    <CalendarSync className="w-4 h-4 mr-1" /><Typography.Description className="text-tg-theme-button-color">Выплаты за {paymentsPeriod === 'week' ? 'неделю' : 'месяц'}</Typography.Description>
                </Button>
                <Typography.H2 className="mb-0 text-[24px]">{moneyFormat(totalSum)}</Typography.H2>
            </div>
            <ChartContainer config={chartConfig} className="w-[120px] h-[60px]">
                <AreaChart
                    accessibilityLayer
                    data={chartData}
                    margin={{
                        left: 0,
                        right: 0,
                    }}
                >
                    <defs>
                        <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                            <stop
                                offset="5%"
                                stopColor="var(--chart-2)"
                                stopOpacity={1.0}
                            />
                            <stop
                                offset="95%"
                                stopColor="var(--chart-2)"
                                stopOpacity={0.1}
                            />
                        </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} horizontal={false}/>
                    <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={2}
                        minTickGap={30}
                        tickFormatter={val => dayjs(val).format('D')}
                    />
                    <Area
                        fill="url(#fillDesktop)"
                        dataKey="payment"
                        type="natural"
                        fillOpacity={0.3}

                        stroke="var(--chart-2)"
                        stackId="a"
                    />
                </AreaChart>
            </ChartContainer>
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