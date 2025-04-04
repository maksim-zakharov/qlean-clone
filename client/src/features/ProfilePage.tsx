import {useSelector} from "react-redux";
import {Header} from "../components/ui/Header.tsx";
import {BackButton} from "../components/BackButton.tsx";
import {Typography} from "../components/ui/Typography.tsx";
import React, {useEffect, useMemo, useState} from "react";
import {MapPin, Pencil, User} from "lucide-react";
import {Card} from "../components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "../components/ui/avatar.tsx";
import {Button} from "../components/ui/button.tsx";
import {useLoginMutation} from "../api.ts";
import parsePhoneNumberFromString from "libphonenumber-js";
import {Switch} from "../components/ui/switch.tsx";

interface Address {
    // Дом
    "house_number": string,
    // Улица
    "road": string,
    "suburb": string,
    // Город
    "city": string,
    // Область
    "state": string,
    // Регион/Округ
    "region": string,
    "postcode": string,
    // Страна
    "country": string,
    "country_code": string
}

export const ProfilePage = () => {

    const [login] = useLoginMutation();
    const userInfo = useSelector(state => state.createOrder.userInfo);
    const [address, setAddress] = useState<Address | undefined>()
    const [writeAccessReceived, setWriteAccessReceived] = useState<boolean>(false)

    const phoneText = useMemo(() => {
        if (!userInfo?.phone) {
            return 'Отсутствует';
        }

        const phoneNumber = parsePhoneNumberFromString(userInfo.phone, 'RU');
        return phoneNumber?.formatInternational() || userInfo.phone;
    }, [userInfo]);

    const handleRequestWriteAccess = () => Telegram.WebApp?.requestWriteAccess(async (isRequested) => {
        if (!isRequested) {
            return;
        }
        setWriteAccessReceived(isRequested)
    })

    const handleRequestContact = () => Telegram.WebApp?.requestContact(async (isRequested) => {
        if (!isRequested) {
            return;
        }
        // Отправляем данные на сервер
        // @ts-ignore
        await login().unwrap();
    })

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=ru`
            );
            const data = await response.json();
            setAddress(data.address)
        });
    }, []);

    return <div className="fixed inset-0 flex flex-col">
        <Header>
            <div className="grid grid-cols-[40px_auto_40px]">
                <BackButton url="/"/>
            </div>
        </Header>
        <div className="flex-1 overflow-y-auto overscroll-none px-4 mt-[56px]">
            <Card className="p-0 gap-0 mt-2">
                <div className="p-4 py-3 separator-shadow-bottom flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <Avatar>
                            <AvatarImage src={userInfo?.photoUrl}/>
                            <AvatarFallback><User/></AvatarFallback>
                        </Avatar>
                        <Typography.Title
                            className="text-xl">{userInfo?.firstName} {userInfo?.lastName}</Typography.Title>
                    </div>
                    <Button variant="ghost" className="pr-1 text-tg-theme-hint-color h-6">
                        <Pencil/>
                    </Button>
                </div>
                <div className="p-4 py-3 separator-shadow-bottom flex justify-between items-center">
                    <div className="flex flex-col">
                        <Typography.Description>Телефон</Typography.Description>
                        <Typography.Title>{phoneText}</Typography.Title>
                    </div>
                    {!userInfo?.phone && <Button size="sm" variant="default" onClick={handleRequestContact}>
                        Обновить
                    </Button>}
                </div>
                <div className="p-4 py-3 flex justify-between items-center">
                    <div className="flex gap-2">
                        <MapPin/>
                        <div className="flex flex-col">
                            <Typography.Description>Адрес</Typography.Description>
                            <Typography.Title
                                className="flex">{!address ? 'Отсутствует' : `${address.city}, ${address.road}, ${address.house_number}`}</Typography.Title>
                        </div>
                    </div>
                </div>
            </Card>
            <Card className="p-0 gap-0 mt-2">
                <div className="p-4 py-3 flex justify-between items-center">
                    <div className="flex flex-col">
                        <Typography.Title>Уведомления в Telegram</Typography.Title>
                    </div>
                    <Switch
                        checked={writeAccessReceived}
                        onCheckedChange={handleRequestWriteAccess}
                    />
                </div>
            </Card>
        </div>
    </div>
}