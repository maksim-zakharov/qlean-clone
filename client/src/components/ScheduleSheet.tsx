import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button"
import React from "react";

interface ScheduleSheetProps {
}

export function ScheduleSheet({
  children 
}: React.PropsWithChildren<ScheduleSheetProps>) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh]">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold mb-3 text-tg-theme-text-color text-left">Выбор времени</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
} 