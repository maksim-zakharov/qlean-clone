import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import React, {useMemo, useState} from "react";
import {CardItem} from "./CardItem.tsx";
import {useTelegram} from "../hooks/useTelegram.ts";
import dayjs from "dayjs";
import {Tabs, TabsList, TabsTrigger} from "./ui/tabs.tsx";

interface ScheduleSheetProps {
    selectedTimestamp?: number;
    onSelectDate: (date: number) => void;
}

export function ScheduleSheet({
                                  children,
                                  selectedTimestamp,
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

    const [tab, setTab] = useState<string>();

    const filteredSlots = useMemo(() => result.find(r => r.timestamp.toString() === tab)?.slots || [], [tab]);

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
                        <TabsList>
                            {result.map(r => <TabsTrigger
                                key={r.timestamp}
                                value={r.timestamp.toString()}
                            >
                                {r.date}
                            </TabsTrigger>)}
                        </TabsList>
                    </Tabs>
                </SheetHeader>
                <div className="grid grid-cols-2 gap-2 overflow-x-auto no-scrollbar mt-2">
                    {filteredSlots.map(service =>
                        <CardItem
                            className={`min-h-[80px] border-2 border-transparent ${service.timestamp === selectedTimestamp && `border-tg-theme-button-color bg-tg-theme-button-color-transparent`}`}
                            key={service.timestamp}
                            title={service.time}
                            onClick={() => onSelectDate(service.timestamp)}
                        />)}
                </div>
            </SheetContent>
        </Sheet>
    )
} 