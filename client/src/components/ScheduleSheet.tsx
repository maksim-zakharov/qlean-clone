import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import React, {useMemo} from "react";
import {CardItem} from "./CardItem.tsx";
import {useTelegram} from "../hooks/useTelegram.ts";
import dayjs from "dayjs";
import {Tabs, TabsList, TabsTrigger} from "./ui/tabs.tsx";

interface ScheduleSheetProps {
    onSelectDate: (date: number) => void;
}

export function ScheduleSheet({
                                  children,
                                  onSelectDate
                              }: React.PropsWithChildren<ScheduleSheetProps>) {
    const {vibro} = useTelegram();

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

        return slots;
    }

    const result = useMemo(() => Array.from({length: 7}, (_, i) => {
        const date = dayjs().add(i, 'day').startOf('day');
        return {
            date: date.format('dddd, D MMMM').toLowerCase(),
            timestamp: date.valueOf(),
            slots: generateTimeSlots(date)
        };
    }), []);

    return (
        <Sheet onOpenChange={(opened) => opened ? vibro() : null}>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh]">
                <SheetHeader>
                    <SheetTitle className="text-xl font-bold mb-3 text-tg-theme-text-color text-left">Выбор
                        времени</SheetTitle>
                </SheetHeader>
                <Tabs defaultValue="active" className="mt-[calc(env(safe-area-inset-top))]">
                    <TabsList>
                        {result.map(r => <TabsTrigger
                            key={r.timestamp}
                            value={r.date}
                        >
                            {r.date}
                        </TabsTrigger>)}
                    </TabsList>
                </Tabs>
                <div className="grid grid-cols-2 gap-2 mt-2">
                    {result[0].slots.map(service =>
                        <CardItem
                            className="min-h-[80px]"
                            key={service.timestamp}
                            title={service.time}
                            onClick={() => onSelectDate(service.timestamp)}
                        />)}
                </div>
            </SheetContent>
        </Sheet>
    )
} 