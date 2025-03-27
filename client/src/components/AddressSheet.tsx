import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "./ui/button"
import React from "react";

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
  addresses, 
  selectedAddress, 
  onAddressSelect,
  onAddAddress,
  children 
}: React.PropsWithChildren<AddressSheetProps>) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle className="text-xl font-bold mb-3 text-tg-theme-text-color text-left">Мои адреса</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col flex-1 p-4">
          {/*{addresses.length === 0 ? (*/}
          {/*  <div className="flex-1 flex items-center justify-center text-tg-theme-hint-color">*/}
          {/*    Нет адресов*/}
          {/*  </div>*/}
          {/*) : (*/}
          {/*  <div className="flex-1 flex flex-col gap-2">*/}
          {/*    {addresses.map((address) => (*/}
          {/*      <button*/}
          {/*        key={address.id}*/}
          {/*        onClick={() => {*/}
          {/*          onAddressSelect(address.address)*/}
          {/*        }}*/}
          {/*        className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${*/}
          {/*          selectedAddress === address.address*/}
          {/*            ? "bg-tg-theme-button-color text-tg-theme-button-text-color"*/}
          {/*            : "bg-tg-theme-bg-color text-tg-theme-text-color hover:bg-tg-theme-bg-color/80"*/}
          {/*        }`}*/}
          {/*      >*/}
          {/*        {address.address}*/}
          {/*      </button>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*)}*/}
          <Button
              className="w-full px-8 h-[48px] text-[15px] font-medium bg-tg-theme-button-color text-tg-theme-button-text-color hover:bg-tg-theme-button-color/90"
              onClick={onAddAddress}
          >
            Добавить адрес
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
} 