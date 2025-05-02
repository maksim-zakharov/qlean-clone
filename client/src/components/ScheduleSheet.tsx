import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import React, {useMemo, useState} from "react";
import {CardItem} from "./CardItem.tsx";
import {useTelegram} from "../hooks/useTelegram.ts";
import dayjs, {Dayjs} from "dayjs";
import {Tabs, TabsList, TabsTrigger} from "./ui/tabs.tsx";
import {useGetExecutorBusySlotsQuery} from "../api.ts";
import {EmptyState} from "./EmptyState.tsx";
import {CalendarX} from "lucide-react";
import {Skeleton} from "./ui/skeleton.tsx";

interface ScheduleSheetProps {
    selectedTimestamp?: number;
    onSelectDate: (date: number) => void;
    serviceVariantId: number;
    optionIds?: number[];
}

export function ScheduleSheet({
    children,
    selectedTimestamp,
    onSelectDate,
    serviceVariantId,
    optionIds = []
}: React.PropsWithChildren<ScheduleSheetProps>) {
    const {vibro} = useTelegram();
    const [tab, setTab] = useState<string>();

    function generateTimeSlots(parentDate: Dayjs) {
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
            date: date.format('dddd, D MMMM').toLowerCase(),
            timestamp: date.valueOf(),
            slots: generateTimeSlots(date)
        };
    }).filter(s => s.slots.length > 0), []);

    const { data: busySlots = [], isFetching } = useGetExecutorBusySlotsQuery({
        date: tab ? Number(tab) : result[0]?.timestamp,
        serviceVariantId,
        optionIds
    }, {
        skip: !tab && !result[0]?.timestamp || !serviceVariantId || !optionIds
    });

    const filteredSlots = useMemo(() => {
        const slots = result.find(r => r.timestamp.toString() === tab)?.slots || [];
        const busyTimestamps = new Set(busySlots.map(slot => slot.timestamp));
        return slots.filter(slot => busyTimestamps.has(slot.timestamp));
    }, [tab, result, busySlots]);

    return (
        <Sheet onOpenChange={(opened) => opened ? vibro() : null}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh]">
                <SheetHeader>
                    <SheetTitle className="text-xl font-bold text-tg-theme-text-color text-left">
                        Выбор времени</SheetTitle>
                    <Tabs defaultValue={tab} onValueChange={setTab} className="mt-[calc(env(safe-area-inset-top))]">
                        <TabsList className="bg-inherit px-0">
                            {result.map(r => <TabsTrigger
                                key={r.timestamp}
                                value={r.timestamp.toString()}
                            >
                                {r.date}
                            </TabsTrigger>)}
                        </TabsList>
                    </Tabs>
                </SheetHeader>
                {isFetching && <div className="grid grid-cols-2 gap-2 overflow-x-auto no-scrollbar mt-2">
                    <Skeleton className="w-full min-h-[80px]"/>
                    <Skeleton className="w-full min-h-[80px]"/>
                    <Skeleton className="w-full min-h-[80px]"/>
                    <Skeleton className="w-full min-h-[80px]"/>
                    <Skeleton className="w-full min-h-[80px]"/>
                    <Skeleton className="w-full min-h-[80px]"/>
                    <Skeleton className="w-full min-h-[80px]"/>
                    <Skeleton className="w-full min-h-[80px]"/>
                    <Skeleton className="w-full min-h-[80px]"/>
                    <Skeleton className="w-full min-h-[80px]"/>
                </div>}
                {!isFetching && filteredSlots.length === 0 && <EmptyState icon={<CalendarX />} title="There are no available slots" description="Please choose another day."/>}
                {!isFetching && filteredSlots.length > 0 && <div className="grid grid-cols-2 gap-2 overflow-x-auto no-scrollbar mt-2">
                    {filteredSlots.map(service =>
                        <CardItem
                            className={`min-h-[80px] border-2 border-transparent ${service.timestamp === selectedTimestamp && `border-tg-theme-button-color bg-tg-theme-button-color-transparent`}`}
                            key={service.timestamp}
                            title={service.time}
                            onClick={() => onSelectDate(service.timestamp)}
                        />)}
                </div>}
            </SheetContent>
        </Sheet>
    )
} 