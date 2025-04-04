import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {Button} from "./ui/button"
import React from "react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {List} from "./ui/list.tsx";
import {Typography} from "./ui/Typography.tsx";
import {AddAddressSheet} from "./AddAddressSheet.tsx";
import {Pencil} from "lucide-react";
import {EditButton} from "./EditButton.tsx";


interface AddressSheetProps {
    addresses: any[]
    onAddressSelect: (address: any) => void
}

export function AddressSheet({
                                 addresses,
                                 onAddressSelect,
                                 children
                             }: React.PropsWithChildren<AddressSheetProps>) {
    const {vibro} = useTelegram();
    const [_opened, setOpened] = React.useState(false);
    const [editedAddress, setEditedAddress] = React.useState(undefined);

    const clearAddress = () => setEditedAddress(undefined)

    const handleSelectAddress = (address: any) => {
        onAddressSelect(address)
        setOpened(false);
        clearAddress();
    }

    const handleOnEditAddress = (e: React.MouseEvent<HTMLButtonElement>, address: any) => {
        e.stopPropagation();
        setEditedAddress(address)
    }

    const handleOpenChange = (opened: boolean) => {
        opened ? vibro() : null;
        setOpened(opened)
        if (!opened)
            clearAddress();
    }

    return (
        <Sheet onOpenChange={handleOpenChange} open={_opened}>
            <SheetTrigger asChild onClick={() => setOpened(true)}>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] pb-[env(safe-area-inset-bottom)]">
                <SheetHeader>
                    <SheetTitle className="text-xl font-bold text-tg-theme-text-color text-left">Мои адреса</SheetTitle>
                </SheetHeader>
                <List className="mt-4 mb-4 overflow-y-auto no-scrollbar">
                    {addresses.map(adr => <div className="flex w-full justify-between" key={adr.id}
                                               onClick={() => handleSelectAddress(adr)}>
                        <div className="flex flex-col">
                            <Typography.Title>{adr.name}</Typography.Title>
                            <Typography.Description>{adr.fullAddress}</Typography.Description>
                        </div>
                        <EditButton onClick={(e) => handleOnEditAddress(e, adr)}/>
                    </div>)}
                </List>
                <div className="flex flex-col flex-1">
                    <AddAddressSheet address={editedAddress} onChangeAddress={setEditedAddress}>
                        <Button
                            wide
                        >
                            Добавить адрес
                        </Button>
                    </AddAddressSheet>
                </div>
            </SheetContent>
        </Sheet>
    )
} 