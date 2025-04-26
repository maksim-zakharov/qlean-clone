import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "../../components/ui/accordion.tsx";
import React, { useMemo} from "react";
import dayjs from "dayjs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import {useGetScheduleQuery, useUpdateScheduleMutation} from "../../api.ts";


const weekDays = [];

// Создаем базовую дату (понедельник)
const baseDate = dayjs().startOf('week').add(1, 'day');

// Генерируем массив дней недели
for (let i = 0; i < 7; i++) {
    const currentDate = baseDate.add(i, 'day');

    weekDays.push({
        label: currentDate.format('dddd'), // Полное название на русском
        value: currentDate.locale('en').format('ddd').toUpperCase(), // Сокращение на английском
    });
}


function generateTimeSlots(parentDate) {
    const slots = [];
    const start = parentDate.startOf('day').add(8, 'hour');
    const end = parentDate.startOf('day').add(24, 'hour');

    let current = start;
    let i = 0;

    while (current.isBefore(end)) {
        const slotStart = current;
        const slotEnd = current.add(60, 'minute');

        slots.push({
            timestamp: slotStart.valueOf(),
            time: slotStart.format('HH:mm')
        });
        console.log(i++);

        current = slotEnd;
    }

    return slots;
}

const slots = generateTimeSlots(dayjs());

export const ExecutorSchedulePage = () => {
    const {data: schedule = []} = useGetScheduleQuery({})
    const [updateSchedule, {isLoading}] = useUpdateScheduleMutation()

    const scheduleMap = useMemo(() => schedule.reduce((acc, curr) => {
        const {isDayOff, timeSlots} = curr;
        if(isDayOff){
            acc[curr.dayOfWeek] =  [];
        } else {
            acc[curr.dayOfWeek] = timeSlots.map((curr) => curr.time)
        }

        return acc;
    },{}), [schedule]);

    const handleOnToggle = (day: any, event: any) => {
        console.log(event.target.dataset.value)
        console.log(event.target.dataset.state)

        // включить
        if(event.target.dataset.state === 'off'){
            if(event.target.dataset.value === 'dayoff'){
                scheduleMap[day] = [];
            } else {
                if(!scheduleMap[day]){
                    scheduleMap[day] = [];
                }
                scheduleMap[day].push(event.target.dataset.value)
            }
        } else {
            scheduleMap[day] = scheduleMap[day].filter(val => val !== event.target.dataset.value)
        }

        updateSchedule({
            "days": Object.entries<string[]>(scheduleMap).map(([dayOfWeek, timeSlots]) => ({dayOfWeek, isDayOff: timeSlots?.length <= 0, timeSlots}))
        })
    }

    return <div className="p-4">
        <Accordion
            type="single"
            collapsible
            defaultValue="services"
            className="flex flex-col gap-2"
        >
            {weekDays.map(day => <AccordionItem value={day.value} className="rounded-xl">
                <AccordionTrigger showChevron={false}>
                    <div className="flex justify-between w-full">
                        <span className="text-lg font-medium text-tg-theme-text-color">{day.label}</span>
                        <span className="text-lg font-medium text-tg-theme-text-color">Выходной</span>
                    </div>
                </AccordionTrigger>
                <AccordionContent>
                    <ToggleGroup type="multiple" className="grid grid-cols-6 w-full gap-0.5" disabled={isLoading} value={scheduleMap[day.value.toUpperCase()]?.length > 0 ? scheduleMap[day.value.toUpperCase()] : 'dayoff'}>
                        {slots.map(slot => <ToggleGroupItem onClick={event => handleOnToggle(day.value, event)} value={slot.time} className="border-[0.5px] border-tg-theme-hint-color first:rounded-none last:rounded-none">
                            {slot.time}
                        </ToggleGroupItem>)}
                        <ToggleGroupItem value="dayoff" onClick={event => handleOnToggle(day.value, event)} className="border-[0.5px] border-tg-theme-hint-color first:rounded-none last:rounded-none col-span-2">
                            Выходной
                        </ToggleGroupItem>
                    </ToggleGroup>
                </AccordionContent>
            </AccordionItem>)}
        </Accordion>
        </div>
}