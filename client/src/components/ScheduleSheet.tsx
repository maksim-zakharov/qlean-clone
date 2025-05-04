import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import React, {useCallback, useMemo, useState} from "react";
import {CardItem} from "./CardItem.tsx";
import {useTelegram} from "../hooks/useTelegram.ts";
import dayjs, {Dayjs} from "dayjs";
import {useGetAvailableDatesQuery, useGetExecutorAvailableSlotsQuery} from "../api/api.ts";
import {EmptyState} from "./EmptyState.tsx";
import {CalendarX} from "lucide-react";
import {Skeleton} from "./ui/skeleton.tsx";
import {Calendar} from "./ui/calendar.tsx";
import {useTranslation} from "react-i18next";

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
    const {t} = useTranslation();
    const {vibro} = useTelegram();

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

    const [tab, setTab] = useState<Date>(dayjs().startOf('day').toDate());

    const {data: availableDates = []} = useGetAvailableDatesQuery({
        optionIds,
        serviceVariantId
    }, {
        skip: !serviceVariantId || !optionIds
    })

    const availableDatesSet = useMemo(() => new Set(availableDates?.map(date => dayjs(date).valueOf()) || []), [availableDates]);

    const isPastDate = useCallback((date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Обнуляем время
        if(
            // Если это было вчера
            date < today
            || !availableDatesSet.size){
            return true;
        }
        const value = dayjs(date).valueOf()
        return !availableDatesSet.has(value);
    }, [availableDatesSet]);

    const {data: availableSlots = [], isFetching} = useGetExecutorAvailableSlotsQuery({
        date: dayjs(tab).valueOf(),
        serviceVariantId,
        optionIds
    }, {
        skip: !tab || !serviceVariantId || !optionIds
    });

    const filteredSlots = useMemo(() => availableSlots.map(sl => ({...sl, time: dayjs(sl.timestamp).format('HH:mm')})), [availableSlots]);

    return (
        <Sheet onOpenChange={(opened) => opened ? vibro() : null}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh]">
                <SheetHeader>
                    <SheetTitle
                        className="text-xl font-bold text-tg-theme-text-color text-left">{t('calendar_title')}</SheetTitle>
                </SheetHeader>
                <Calendar className="px-0"
                          mode="single"
                          selected={tab}
                          onSelect={setTab}
                          disabled={isPastDate}
                />
                {isFetching && <div className="grid grid-cols-3 gap-2 overflow-x-auto no-scrollbar">
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                    <Skeleton className="w-full min-h-[40px]"/>
                </div>}
                {!isFetching && filteredSlots.length === 0 &&
                    <EmptyState className="h-50 my-0 flex-none" icon={<CalendarX/>} title="There are no available slots"
                                description="Please choose another day."/>}
                {!isFetching && filteredSlots.length > 0 &&
                    <div className="grid grid-cols-3 gap-2 overflow-x-auto no-scrollbar">
                        {filteredSlots.map(service =>
                            <CardItem
                                textClassName="items-center"
                                className={`min-h-[40px] p-2 border-transparent ${service.timestamp === selectedTimestamp && `[background-color:var(--tg-theme-button-color)!important]`}`}
                                key={service.timestamp}
                                title={service.time}
                                onClick={() => onSelectDate(service.timestamp)}
                            />)}
                    </div>}
            </SheetContent>
        </Sheet>
    )
} 