import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,} from "@/components/ui/sheet"
import {Button} from "./ui/button"
import React, {useEffect, useState} from "react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {useAddAddressMutation, useDeleteAddressMutation, useEditAddressMutation} from "../api.ts";
import {InputWithLabel} from "./InputWithLabel.tsx";
import {Trash2} from "lucide-react";


export function AddAddressSheet({
                                    address,
                                    onChangeAddress,
                                    children
                                }: React.PropsWithChildren<any>) {
    const {vibro, userId} = useTelegram();
    const [addAddress] = useAddAddressMutation();
    const [editAddress] = useEditAddressMutation();
    const [deleteAddress] = useDeleteAddressMutation();

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
        await func({id, name, fullAddress, comments, userId}).unwrap();
        setOpened(false)
        clearAddress();
    }

    const handleOnDelete = async () => {
        await deleteAddress({id}).unwrap();
        setOpened(false)
        clearAddress();
    }

    return (
        <Sheet onOpenChange={handleOpenChange} open={_opened}>
            <SheetTrigger asChild onClick={() => setOpened(true)}>
                {children}
            </SheetTrigger>
            <SheetContent side="bottom" extra={address ? <Button variant="ghost" className="pr-1 text-tg-theme-hint-color" onClick={handleOnDelete}><Trash2 /></Button> : null}>
                <SheetHeader>
                    <SheetTitle
                        className="text-xl font-bold text-tg-theme-text-color text-left">{address ? 'Редактирование' : 'Добавление'} адреса</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-4 mb-4">
                    <InputWithLabel label="Название" value={name}
                                    onChange={e => setAddress(prevState => ({...prevState, name: e.target.value}))}/>
                    <InputWithLabel label="Адрес" value={fullAddress}
                                    onChange={e => setAddress(prevState => ({
                                        ...prevState,
                                        fullAddress: e.target.value
                                    }))}/>
                    <InputWithLabel label="Комментарий" value={comments}
                                    onChange={e => setAddress(prevState => ({
                                        ...prevState,
                                        comments: e.target.value
                                    }))}/>
                </div>
                <div className="flex flex-col flex-1">
                    <Button
                        wide
                        onClick={handleOnSubmit}
                    >
                        Сохранить
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    )
} 