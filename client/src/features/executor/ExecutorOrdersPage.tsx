import React, {useMemo, useState} from "react";
import {Typography} from "../../components/ui/Typography.tsx";
import {Card} from "../../components/ui/card.tsx";
import {Button} from "../../components/ui/button.tsx";
import {useGetExecutorOrdersQuery} from "../../api.ts";
import dayjs from "dayjs";
import {CircleX, ClipboardPlus, ListPlus} from "lucide-react";
import {moneyFormat} from "../../lib/utils.ts";
import {useDispatch} from "react-redux";
import {retryOrder, selectBaseService} from "../../slices/createOrderSlice.ts";
import {useNavigate} from "react-router-dom";
import {Skeleton} from "../../components/ui/skeleton.tsx";
import {EmptyState} from "../../components/EmptyState.tsx";
import {RoutePaths} from "../../routes.ts";
import {Tabs, TabsList, TabsTrigger} from "../../components/ui/tabs.tsx";
import {Header} from "../../components/ui/Header.tsx";


export const ExecutorOrdersPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const {data: orders = [], isLoading, isError} = useGetExecutorOrdersQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

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

    function generateTimeSlots(parentDate) {
        const slots = [];
        const start = parentDate.startOf('day').add(8, 'hour');
        const end = parentDate.startOf('day').add(22, 'hour');

        let current = start;

        while (current.isBefore(end)) {
            const slotStart = current;
            const slotEnd = current.add(30, 'minute');

            slots.push({
                timestamp: slotStart.valueOf(),
                time: slotStart.format('HH:mm')
            });

            current = slotEnd;
        }

        return slots.filter(s => s.timestamp >= Date.now());
    }

    const result = useMemo(() => Array.from({length: 7}, (_, i) => {
        const date = dayjs().add(i, 'day').startOf('day');
        return {
            date: date.format('dd, D MMM').toLowerCase(),
            timestamp: date.valueOf(),
            slots: generateTimeSlots(date)
        };
    }).filter(s => s.slots.length > 0), []);
    const [tab, setTab] = useState<string>(result[0]?.timestamp.toString());
    const filteredOrders = useMemo(() => orders.filter(o => !['completed', 'canceled'].includes(o.status) && dayjs(o.date).startOf('day').unix() === dayjs(Number(tab)).startOf('day').unix() ).sort((a, b) => b.id - a.id), [orders, tab]);

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

    return <div className="flex flex-col">
        <Header className="p-0 card-bg-color-transparency">
            <Tabs defaultValue={tab} onValueChange={setTab} className="px-4">
                <TabsList className="bg-inherit px-0">
                    {result.map(r => <TabsTrigger
                        key={r.timestamp}
                        value={r.timestamp.toString()}
                    >
                        {r.date}
                    </TabsTrigger>)}
                </TabsList>
            </Tabs>
        </Header>
        <div className="p-4 flex flex-col gap-4">
            {filteredOrders.length === 0 && <EmptyState
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
            {filteredOrders.length > 0 && <div className="flex flex-col gap-4">
                {filteredOrders.map(ao => <Card className="p-0 pl-4 gap-0" onClick={() => handleOrderClick(ao)}>
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
                            <Button className="p-0 border-none h-6" onClick={(e) => handleAddOptionClick(e, ao)}
                                    variant="default" size="sm">
                                <ListPlus className="w-5 h-5 mr-2"/> Добавить услугу
                            </Button>
                            <Typography.Description>Поддержка</Typography.Description>
                        </div>
                    </div>
                </Card>)}
            </div>}
        </div>
    </div>
}