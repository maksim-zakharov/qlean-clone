import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button"
import React from "react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {Textarea} from "./ui/textarea.tsx";

interface CommentsSheetProps {

}

export function CommentsSheet({
  children 
}: React.PropsWithChildren<CommentsSheetProps>) {
  const {vibro} = useTelegram();
  return (
    <Sheet onOpenChange={(opened) => opened ? vibro() : null}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-tg-theme-text-color text-left">Пожелание к заказу</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col flex-1">
          <Textarea className="mt-2 mb-2 rounded-md resize-none text-[16px]" rows={4} />
          <Button
              className="w-full h-10 text-sm font-medium"
              onClick={console.log}
          >
            Сохранить
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
} 