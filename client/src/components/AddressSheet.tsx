import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {Button} from "./ui/button"
import React from "react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {List} from "./ui/list.tsx";
import {Typography} from "./ui/Typography.tsx";
import {AddAddressSheet} from "./AddAddressSheet.tsx";
import {EditButton} from "./EditButton.tsx";
import {CircleX, Map} from "lucide-react";
import {EmptyState} from "./EmptyState.tsx";

interface AddressSheetProps {
    addresses: any[]
    onAddressSelect: (address: any) => void
    isError?: boolean
    className?: string;
}

export function AddressSheet({
                                 className,
                                 isError,
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
            <SheetTrigger asChild onClick={() => setOpened(true)} className={className}>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] pb-[env(safe-area-inset-bottom)]">
                <SheetHeader>
                    <SheetTitle className="text-xl font-bold text-tg-theme-text-color text-left">Addresses</SheetTitle>
                </SheetHeader>
                {isError && <EmptyState
                    icon={<CircleX className="h-10 w-10" />}
                    title="Упс, что-то пошло не так..."
                    description="Обновите страницу или повторите попытку позднее."
                    action={
                        <Button onClick={() => window.location.reload()}
                        >
                            Refresh page
                        </Button>}
                />}
                {!isError && addresses.length === 0 && <EmptyState
                    icon={<Map className="h-10 w-10" />}
                    title="Нет адресов"
                    description="Добавьте адрес для оформления заказов"
                    action={<AddAddressSheet address={editedAddress} onChangeAddress={setEditedAddress}>
                        <Button
                        >
                            Add address
                        </Button>
                    </AddAddressSheet>}
                />}
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
                {!isError && addresses.length > 0 && <div className="flex flex-col flex-1">
                    <AddAddressSheet address={editedAddress} onChangeAddress={setEditedAddress}>
                        <Button
                            wide
                            size="lg"
                        >
                            Add address
                        </Button>
                    </AddAddressSheet>
                </div>}
            </SheetContent>
        </Sheet>
    )
} 