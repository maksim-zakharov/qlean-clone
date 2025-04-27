import {useDispatch, useSelector} from "react-redux";
import {Header} from "../../components/ui/Header.tsx";
import {BackButton} from "../../components/BackButton.tsx";
import {Typography} from "../../components/ui/Typography.tsx";
import React, {useEffect, useMemo, useState} from "react";
import {MapPin, User} from "lucide-react";
import {Card} from "../../components/ui/card.tsx";
import {Avatar, AvatarFallback, AvatarImage} from "../../components/ui/avatar.tsx";
import {Button} from "../../components/ui/button.tsx";
import parsePhoneNumberFromString from "libphonenumber-js";
import {Switch} from "../../components/ui/switch.tsx";
import {EditButton} from "../../components/EditButton.tsx";
import {logout} from "../../slices/createOrderSlice.ts";
import {RoutePaths} from "../../routes.ts";
import {useNavigate} from "react-router-dom";

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
    const navigate = useNavigate()
    const dispatch = useDispatch();
    const userInfo = useSelector(state => state.createOrder.userInfo);
    const [address, setAddress] = useState<Address | undefined>()
    const [writeAccessReceived, setWriteAccessReceived] = useState<boolean>(false)

    const phoneText = useMemo(() => {
        if (!userInfo?.phone) {
            return 'Not available';
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
        dispatch(logout())
        window.location.reload();
    })

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=en`
            );
            const data = await response.json();
            setAddress(data.address)
        });
    }, []);

    const addressText = useMemo(() => {
        if(!address){
            return 'Not available'
        }

        const text = [];
        if(address.city) text.push(address.city);
        if(address.road) text.push(address.road);
        if(address.house_number) text.push(address.house_number);

        return text.join(', ');
    }, [address]);

    const handleLogout = () => {
        dispatch(logout())
        navigate(RoutePaths.Root)
        window.location.reload();
    }

    return <>
        <Header>
            <div className="grid grid-cols-[40px_auto_40px]">
                <BackButton url="/"/>
            </div>
        </Header>
        <div className="content text-center px-4">
            <Card className="text-left p-0 gap-0 mt-2 border-none">
                <div className="p-4 py-3 separator-shadow-bottom flex justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <Avatar>
                            <AvatarImage src={userInfo?.photoUrl}/>
                            <AvatarFallback><User/></AvatarFallback>
                        </Avatar>
                        <Typography.Title
                            className="text-xl">{userInfo?.firstName} {userInfo?.lastName}</Typography.Title>
                    </div>
                    <EditButton onClick={() => null} />
                </div>
                <div className="p-4 py-3 separator-shadow-bottom flex justify-between items-center">
                    <div className="flex flex-col">
                        <Typography.Description>Phone</Typography.Description>
                        <Typography.Title>{phoneText}</Typography.Title>
                    </div>
                    {!userInfo?.phone && <Button className="p-0 border-none h-6" size="sm" variant="default" onClick={handleRequestContact}>
                        Refresh
                    </Button>}
                </div>
                <div className="p-4 py-3 flex justify-between items-center">
                    <div className="flex gap-2">
                        <MapPin/>
                        <div className="flex flex-col">
                            <Typography.Description>Address</Typography.Description>
                            <Typography.Title
                                className="flex">{addressText}</Typography.Title>
                        </div>
                    </div>
                </div>
            </Card>
            <Card className="p-0 gap-0 mt-2 border-none">
                <div className="p-4 py-3 flex justify-between items-center">
                    <div className="flex flex-col">
                        <Typography.Title>Telegram notifications</Typography.Title>
                    </div>
                    <Switch
                        checked={writeAccessReceived}
                        onCheckedChange={handleRequestWriteAccess}
                    />
                </div>
            </Card>
            <Button className="mt-2 [color:var(--tg-theme-destructive-text-color)]" variant="ghost" onClick={handleLogout}>Log out</Button>
        </div>
    </>
}