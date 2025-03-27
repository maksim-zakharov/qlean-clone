import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import React from "react";
import {CardItem} from "./CardItem.tsx";

interface ScheduleSheetProps {
    onSelectDate: (date: number) => void;
}

export function ScheduleSheet({
                                  children,
                                  onSelectDate
                              }: React.PropsWithChildren<ScheduleSheetProps>) {
    const schedule = [
        {title: '123', timestamp: 123},
        {title: '123', timestamp: 123},
        {title: '123', timestamp: 123},
        {title: '123', timestamp: 123},
        {title: '123', timestamp: 123},
        {title: '123', timestamp: 123},
        {title: '123', timestamp: 123},
    ]

    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh]">
                <SheetHeader>
                    <SheetTitle className="text-xl font-bold mb-3 text-tg-theme-text-color text-left">Выбор
                        времени</SheetTitle>
                </SheetHeader>
                <div className="grid grid-cols-2 gap-2">
                    {schedule.map(service =>
                        <CardItem
                            className="min-h-[80px]"
                            key={service.timestamp}
                            title={service.title}
                            onClick={() => onSelectDate(service.timestamp)}
                        />)}
                </div>
            </SheetContent>
        </Sheet>
    )
} 