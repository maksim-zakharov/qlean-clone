import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {Button} from "./ui/button"
import React from "react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {List} from "./ui/list.tsx";
import {Typography} from "./ui/Typography.tsx";


interface AddressSheetProps {
    addresses: any[]
    onAddressSelect: (address: any) => void
    onAddAddress: () => void
}

export function AddressSheet({
                                 addresses,
                                 onAddAddress,
                                 onAddressSelect,
                                 children
                             }: React.PropsWithChildren<AddressSheetProps>) {
    const {vibro} = useTelegram();
    const [_opened, setOpened] = React.useState(false);

    const handleSelectAddress = (address: any) => {
        onAddressSelect(address)
        setOpened(false);
    }

    const handleOpenChange = (opened: boolean) => {
        opened ? vibro() : null;
        setOpened(opened)
    }

    return (
        <Sheet onOpenChange={handleOpenChange} open={_opened}>
            <SheetTrigger asChild onClick={() => setOpened(true)}>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom">
                <SheetHeader>
                    <SheetTitle className="text-xl font-bold text-tg-theme-text-color text-left">Мои адреса</SheetTitle>
                </SheetHeader>
                <List className="mt-2 mb-2">
                    {addresses.map(adr => <div className="flex flex-col w-full" key={adr.id} onClick={() => handleSelectAddress(adr)}>
                        <Typography.Title>{adr.name}</Typography.Title>
                        <Typography.Description>{adr.fullAddress}</Typography.Description>
                    </div>)}
                </List>
                <div className="flex flex-col flex-1">
                    <Button
                        wide
                        onClick={onAddAddress}
                    >
                        Добавить адрес
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
} 