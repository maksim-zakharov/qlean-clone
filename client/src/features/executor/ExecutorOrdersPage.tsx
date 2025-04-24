import React, {useMemo, useState} from "react";
import {Typography} from "../../components/ui/Typography.tsx";
import {Card} from "../../components/ui/card.tsx";
import {Button} from "../../components/ui/button.tsx";
import {useGetExecutorOrdersQuery} from "../../api.ts";
import dayjs from "dayjs";
import {ChevronRight, CircleX, ClipboardPlus, Info, ListPlus, RotateCw, Star} from "lucide-react";
import {moneyFormat} from "../../lib/utils.ts";
import {useDispatch} from "react-redux";
import {retryOrder, selectBaseService} from "../../slices/createOrderSlice.ts";
import {useNavigate} from "react-router-dom";
import {Skeleton} from "../../components/ui/skeleton.tsx";
import {EmptyState} from "../../components/EmptyState.tsx";
import {RoutePaths} from "../../routes.ts";
import {Tabs, TabsList, TabsTrigger} from "../../components/ui/tabs.tsx";
import {Header} from "../../components/ui/Header.tsx";
import {List} from "../../components/ui/list.tsx";
import {Badge} from "../../components/ui/badge.tsx";
import {Checkbox} from "../../components/ui/checkbox.tsx";
import {formatDuration} from "../../components/EstimatedTime.tsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../components/ui/accordion.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";


export const ExecutorOrdersPage = () => {
    const navigate = useNavigate()
    const {vibro} = useTelegram();
    const dispatch = useDispatch();
    const {data: orders = [], isLoading, isError} = useGetExecutorOrdersQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    const handleAddOptionClick = (e: React.MouseEvent<HTMLButtonElement>, order: any) => {
        e.stopPropagation()
        dispatch(selectBaseService(order))
        navigate('/order')
    }

    const handleOrderClick = (e: React.MouseEvent<HTMLButtonElement>, order: any) => {
        e.stopPropagation()
        navigate(`/order/${order.id}`)
    }

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
            date: date.locale('en').format('dd, D MMM').toLowerCase(),
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
        <Header className="p-0">
            <Tabs defaultValue={tab} onValueChange={setTab} className="px-4 h-full">
                <TabsList className="bg-inherit px-0 h-full">
                    {result.map(r => <TabsTrigger
                        key={r.timestamp}
                        value={r.timestamp.toString()}
                    >
                        {r.date}
                    </TabsTrigger>)}
                </TabsList>
            </Tabs>
        </Header>
        {/*<Header className="p-0 card-bg-color">*/}
        {/*    <Tabs defaultValue={tab} onValueChange={setTab} className="px-4 h-full">*/}
        {/*        <TabsList className="bg-inherit px-0 h-full">*/}
        {/*            {result.map(r => <TabsTrigger*/}
        {/*                key={r.timestamp}*/}
        {/*                value={r.timestamp.toString()}*/}
        {/*            >*/}
        {/*                {r.date}*/}
        {/*            </TabsTrigger>)}*/}
        {/*        </TabsList>*/}
        {/*    </Tabs>*/}
        {/*</Header>*/}
        <div className="flex flex-col gap-4 py-4">
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
            {/*{filteredOrders.length > 0 && <List itemClassName="gap-2 block" className="rounded-none">*/}
            {/*    {filteredOrders.map((ao) => <Card className="p-0 gap-0 rounded-none justify-between flex-row"*/}
            {/*                                      onClick={(e) => handleOrderClick(e, ao)}>*/}
            {/*        <div className="flex flex-col">*/}
            {/*            <Typography.Title>{ao.baseService?.name}, {ao.serviceVariant?.name}</Typography.Title>*/}
            {/*            <Typography.Description>{ao.fullAddress}</Typography.Description>*/}
            {/*        </div>*/}
            {/*        <div className="flex justify-between">*/}
            {/*            <div className="flex flex-col justify-between text-end">*/}
            {/*                <Typography.Title>{moneyFormat(ao.serviceVariant?.basePrice + ao.options.reduce((acc, curr) => acc + curr?.price, 0))}</Typography.Title>*/}
            {/*                <Typography.Description>{dayjs(ao.date).locale('en').format('D MMMM, HH:mm')}</Typography.Description>*/}
            {/*            </div>*/}
            {/*            <Button*/}
            {/*                className="pr-0 pl-2"*/}
            {/*                variant="ghost">*/}
            {/*                <ChevronRight className="w-5 h-5 text-tg-theme-hint-color mr-[-8px]"/>*/}
            {/*            </Button>*/}
            {/*        </div>*/}
            {/*    </Card>)}*/}
            {/*</List>}*/}
            {filteredOrders.map(ao => <Accordion
                className="p-0 px-4 gap-0"
                type="single"
                collapsible
                defaultValue="services"
                onClick={(e) => handleOrderClick(e, ao)}
                onValueChange={() => vibro()}
            >
                <AccordionItem value="services" className="rounded-xl">
                    <AccordionTrigger className="flex justify-normal pb-0" disabled>
                        <div className="p-3 px-0 separator-shadow-bottom flex flex-col w-full">
                            <div className="flex justify-between">
                                <Typography.Title>{ao.baseService?.name}</Typography.Title>
                                <Typography.Title>{moneyFormat(ao.serviceVariant?.basePrice + ao.options.reduce((acc, curr) => acc + curr?.price, 0))}</Typography.Title>
                            </div>
                            <div className="flex justify-between">
                                <Typography.Description>{ao.fullAddress}</Typography.Description>
                                <Typography.Description>{dayjs(ao.date).format('D MMMM, HH:mm')}</Typography.Description>
                            </div>
                        </div>
                    </AccordionTrigger>
                    {ao.options.length > 0 && <AccordionContent className="gap-1 flex flex-col pt-3">
                        {ao.options.map((service, index) => (
                            <div key={index} className="flex justify-between">
                                <span className="text-xs text-tg-theme-hint-color font-medium">{service.name}</span>
                                <span
                                    className="text-xs text-tg-theme-hint-color font-medium">{formatDuration(service.duration)}</span>
                            </div>
                        ))}
                    </AccordionContent>}
                </AccordionItem>
            </Accordion>)}
        </div>
    </div>
}