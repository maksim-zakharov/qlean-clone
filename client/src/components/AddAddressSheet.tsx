import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {Button} from "./ui/button"
import React, {useEffect, useState} from "react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {useAddAddressMutation, useDeleteAddressMutation, useEditAddressMutation} from "../api/api.ts";
import {InputWithLabel} from "./InputWithLabel.tsx";
import { MapPlus, Trash2} from "lucide-react";



export function AddAddressSheet({
                                    address,
                                    onChangeAddress,
                                    children
                                }: React.PropsWithChildren<any>) {
    const {vibro, bottomOffset} = useTelegram();
    const [addAddress, {isLoading: addLoading}] = useAddAddressMutation();
    const [editAddress, {isLoading: editLoading}] = useEditAddressMutation();
    const [deleteAddress, {isLoading: deleteLoading}] = useDeleteAddressMutation();

    const [_opened, setOpened] = React.useState(false);
    const [{id, name, fullAddress, comments}, setAddress] = useState({
        id: -1,
        name: '',
        fullAddress: '',
        comments: '',
    });

    const clearAddress = () => setAddress({
        id: -1,
        name: '',
        fullAddress: '',
        comments: '',
    })

    useEffect(() => {
        if (address) {
            setAddress(address);
            setOpened(true);
        } else {
            clearAddress();
        }
    }, [address]);

    const handleOpenChange = (opened: boolean) => {
        opened ? vibro() : null;
        setOpened(opened)
        if (!opened) {
            onChangeAddress(undefined);
        }
    }

    const handleOnSubmit = async () => {
        const func = !address ? addAddress : editAddress;
        await func({id, name, fullAddress, comments}).unwrap();
        setOpened(false)
        clearAddress();
    }

    const handleOnDelete = async () => {
        await deleteAddress({id}).unwrap();
        setOpened(false)
        clearAddress();
    }

    const handleMapClick = () => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=en`
            );
            const data = await response.json();
            const text = [];
            if(data.address.city) text.push(data.address.city);
            if(data.address.road) text.push(data.address.road);
            if(data.address.house_number) text.push(data.address.house_number);

            setAddress(prevState => ({
                ...prevState,
                fullAddress:text.join(', ')
            }))
        });
    }

    return (
        <Sheet onOpenChange={handleOpenChange} open={_opened}>
            <SheetTrigger asChild onClick={() => setOpened(true)}>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" extra={address ? <Button variant="ghost" className="pr-1 text-tg-theme-hint-color h-[28px]" loading={deleteLoading} onClick={handleOnDelete}><Trash2 /></Button> : null}>
                <SheetHeader>
                    <SheetTitle
                        className="text-xl font-bold text-tg-theme-text-color text-left">{address ? 'Editing' : 'Adding'} address</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-4 mb-4">
                    <InputWithLabel label="Name" value={name}
                                    onChange={e => setAddress(prevState => ({...prevState, name: e.target.value}))}/>
                    <div className="flex gap-2 items-end">
                        <InputWithLabel label="Address" value={fullAddress}
                                        onChange={e => setAddress(prevState => ({
                                            ...prevState,
                                            fullAddress: e.target.value
                                        }))}/>
                        <Button size="sm" className="p-0 border-none h-9" variant="default" onClick={handleMapClick}><MapPlus /></Button>
                    </div>
                    <InputWithLabel label="Comments" value={comments}
                                    onChange={e => setAddress(prevState => ({
                                        ...prevState,
                                        comments: e.target.value
                                    }))}/>
                </div>
                <div className="flex flex-col flex-1">
                    <Button
                        wide
                        size="lg"
                        loading={!address ? addLoading : editLoading}
                        onClick={handleOnSubmit}
                    >
                        Save
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
} 