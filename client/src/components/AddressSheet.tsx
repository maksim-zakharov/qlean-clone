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

interface Address {
  id: string
  address: string
}

interface AddressSheetProps {
  addresses: Address[]
  selectedAddress: string
  onAddressSelect: (address: string) => void
  onAddAddress: () => void
}

export function AddressSheet({
  onAddAddress,
  children 
}: React.PropsWithChildren<AddressSheetProps>) {
  const {vibro} = useTelegram();
  return (
    <Sheet onOpenChange={(opened) => opened ? vibro() : null}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold text-tg-theme-text-color text-left">Мои адреса</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col flex-1">
          <Button
              className="w-full"
              onClick={onAddAddress}
          >
            Добавить адрес
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
} 