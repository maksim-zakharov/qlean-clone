import React, {useMemo, useState} from "react";
import {Typography} from "../../components/ui/Typography.tsx";
import {Button} from "../../components/ui/button.tsx";
import {useCompleteOrderMutation, useGetExecutorOrdersQuery} from "../../api.ts";
import dayjs from "dayjs";
import {Banknote, CalendarCheck, CircleX, ClipboardPlus} from "lucide-react";
import {moneyFormat} from "../../lib/utils.ts";
import {useDispatch} from "react-redux";
import {retryOrder, selectBaseService} from "../../slices/createOrderSlice.ts";
import {useNavigate} from "react-router-dom";
import {Skeleton} from "../../components/ui/skeleton.tsx";
import {EmptyState} from "../../components/EmptyState.tsx";
import {Tabs, TabsList, TabsTrigger} from "../../components/ui/tabs.tsx";
import {Header} from "../../components/ui/Header.tsx";


import {formatDuration} from "../../components/EstimatedTime.tsx";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../components/ui/accordion.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";
import {AlertDialogWrapper} from "../../components/AlertDialogWrapper.tsx";
import {toast} from "sonner";


export const ExecutorOrdersPage = () => {
    const [completeOrder, {isLoading: completeOrderLoading}] = useCompleteOrderMutation();
    const navigate = useNavigate()
    const [orderToDelete, setOrderToDelete] = useState<any | null>(null);
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
    const filteredOrders = useMemo(() => orders.filter(o => !['completed', 'canceled'].includes(o.status) && dayjs(o.date).startOf('day').unix() === dayjs(Number(tab)).startOf('day').unix()).sort((a, b) => b.id - a.id), [orders, tab]);
    const activeOrders = useMemo(() => filteredOrders.filter(o => o.status === 'processed').sort((a, b) => b.id - a.id), [filteredOrders]);

    const handleFinishOrder = async (order) => {
        await completeOrder(order).unwrap();
        setOrderToDelete(undefined);
        toast("Order completed", {
            classNames: {
                icon: 'mr-2 h-5 w-5 text-[var(--chart-2)]'
            },
            icon: <CalendarCheck className="h-5 w-5 text-[var(--chart-2)]" />
        })
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
        return <EmptyState className="flex justify-center h-screen items-center m-auto"
                           icon={<Banknote className="h-10 w-10"/>} title="No active orders"
                           description="Your upcoming jobs will appear here once you accept them."/>
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
        <div className="flex flex-col gap-4 py-4">
            {filteredOrders.length === 0 && <EmptyState className="flex justify-center h-screen items-center m-auto"
                                                        icon={<ClipboardPlus className="h-10 w-10"/>}
                                                        title="No active orders"
                                                        description="Your upcoming jobs will appear here once you accept them."/>
            }
            {activeOrders.length > 0 && <div className="flex flex-col px-4 gap-4">
                <Typography.H2 className="mb-0">
                    In progress
                </Typography.H2>
            </div>
            }
            {filteredOrders.map(ao => <Accordion
                className="p-0 px-4 gap-0"
                type="single"
                collapsible
                defaultValue="services"
                onValueChange={() => vibro()}
            >
                <AccordionItem value="services" className="rounded-xl">
                    <AccordionTrigger className="flex justify-normal py-0" disabled>
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
                        {ao.status === 'processed' &&
                            <Button className="mt-3" onClick={() => setOrderToDelete(ao)}>Finalize</Button>
                        }
                            </AccordionContent>}
                    </AccordionItem>
                        </Accordion>)}
                </div>
        <AlertDialogWrapper open={Boolean(orderToDelete)} title="Finalize order"
                            description="Are you sure you want to finalize your order?"
                            onOkText="Yes"
                            onCancelText="No"
                            onCancelClick={() => setOrderToDelete(undefined)}
                            onOkClick={() => handleFinishOrder(orderToDelete)}></AlertDialogWrapper>
            </div>
            }