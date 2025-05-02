import {useDispatch, useSelector} from "react-redux";
import {Header} from "../../components/ui/Header.tsx";
import {BackButton} from "../../components/BackButton.tsx";
import {Typography} from "../../components/ui/Typography.tsx";
import React, {useEffect, useMemo, useState} from "react";
import {
    BriefcaseBusiness,
    CalendarClock,
    ChevronRight,
    HandCoins,
    MapPin,
    Phone,
    Star,
    User,
    X
} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "../../components/ui/avatar.tsx";
import {Button} from "../../components/ui/button.tsx";
import parsePhoneNumberFromString from "libphonenumber-js";
import {Switch} from "../../components/ui/switch.tsx";
import {logout} from "../../slices/createOrderSlice.ts";
import {RoutePaths} from "../../routes.ts";
import {useNavigate} from "react-router-dom";
import {Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger} from "../../components/ui/sheet.tsx";
import {BottomActions} from "../../components/BottomActions.tsx";
import {ListButton} from "@/components/ListButton.tsx";
import {ListButtonGroup} from "../../components/ListButton.tsx";
import {useGetApplicationQuery, useGetServicesQuery, useLoginMutation} from "../../api.ts";
import {DynamicIcon} from "lucide-react/dynamic";
import {PageLoader} from "../../components/PageLoader.tsx";

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
    const dispatch = useDispatch();
    const [loginMutation, {isLoading}] = useLoginMutation();
    const {data: application, isLoading: applicationLoading} = useGetApplicationQuery();
    const [show, setShow] = useState(false);
    const navigate = useNavigate()
    const userInfo = useSelector(state => state.createOrder.userInfo);
    const [address, setAddress] = useState<Address | undefined>()
    const [writeAccessReceived, setWriteAccessReceived] = useState<boolean>(false)
    const {data: services = [], isLoading: servicesLoading} = useGetServicesQuery();
    const applicationVariantIdsSet = useMemo(() => new Set(application?.variants?.map(v => v.variantId) || []), [application]);
    const filteredServices = useMemo(() => services.filter(s => s.variants.some(v => applicationVariantIdsSet.has(v.id))).map(s => ({...s, variants: s.variants.filter(v => applicationVariantIdsSet.has(v.id))})), [applicationVariantIdsSet, services])

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
        if (!address) {
            return 'Not available'
        }

        const text = [];
        if (address.city) text.push(address.city);
        if (address.road) text.push(address.road);
        if (address.house_number) text.push(address.house_number);

        return text.join(', ');
    }, [address]);

    const handleLogout = () => {
        dispatch(logout())
        navigate(RoutePaths.Root)
        window.location.reload();
    }

    const handleWorkClick = () => {
        if(application){
            navigate(RoutePaths.Application);
        } else {
            setShow(true)
        }
    }

    const handleLogin = () => loginMutation(userInfo?.role === 'client' ? 'executor' : 'client').unwrap()

    if (applicationLoading || isLoading) {
        return <PageLoader/>
    }

    return <>
        <Header>
            <div className="grid grid-cols-[40px_auto_40px]">
                <BackButton url="/"/>
            </div>
        </Header>
        <div className="flex flex-col content text-center px-4 gap-6">
            <ListButtonGroup>
                <ListButton icon={<Avatar className="w-7 h-7">
                    <AvatarImage src={userInfo?.photoUrl}/>
                    <AvatarFallback><User/></AvatarFallback>
                </Avatar>} text={<>{userInfo?.firstName} {userInfo?.lastName}</>}/>

                <ListButton icon={<Phone className="p-1 w-7 h-7 bg-[var(--chart-2)] rounded-md"/>} text={<div className="flex flex-col text-left">
                    <Typography.Description>Phone</Typography.Description>
                    <Typography.Title>{phoneText}</Typography.Title>
                </div>} extra={
                    !userInfo?.phone && <Button className="p-0 border-none h-6" size="sm" variant="default"
                                                onClick={handleRequestContact}>
                        Refresh
                    </Button>}/>

                <ListButton text={<div className="flex flex-col text-left">
                    <Typography.Description>Address</Typography.Description>
                    <Typography.Title
                        className="flex">{addressText}</Typography.Title>
                </div>} icon={<MapPin className="p-1 w-7 h-7 bg-[var(--chart-4)] rounded-md"/>}/>
            </ListButtonGroup>

            <ListButton icon={<img src="../telegram.svg"
                                   className="mr-4 h-7 bg-[#2AABEE] rounded-md"/>} text="Telegram notifications"
                        extra={<Switch
                            checked={writeAccessReceived}
                            onCheckedChange={handleRequestWriteAccess}
                        />}/>

            {(!application || application.status !== 'APPROVED') && <Sheet open={show}>
                <SheetTrigger asChild>
                    <ListButton onClick={handleWorkClick}
                                icon={<BriefcaseBusiness className="mr-4 h-7 w-7 rounded-md p-1 bg-[var(--chart-5)]"/>}
                                text="Work in Qlean"/>
                </SheetTrigger>
                <SheetContent side="bottom"
                              className="p-0 overflow-hidden pb-[calc(50px+var(--tg-safe-area-inset-bottom))] min-h-[calc(700px+var(--tg-safe-area-inset-bottom))] h-[calc(100vh-50px)]">
                    <Button
                        onClick={() => setShow(false)}
                        className="border-none absolute rounded-3xl p-2 card-bg-color-transparency top-2 left-2"
                        variant="ghost"><X/></Button>
                    <img src="../img_1.png" className="h-[240px] object-cover"/>
                    <div className="p-4">
                        <SheetHeader className="mb-2">
                            <SheetTitle
                                className="text-xl font-bold text-tg-theme-text-color text-left"><Typography.H2
                                className="text-3xl">Join Us</Typography.H2></SheetTitle>
                        </SheetHeader>
                        <div className="flex mb-7">
                            Access local service jobs, manage your schedule, and receive instant payouts. Your effort,
                            your rules.
                        </div>
                        <div className="grid grid-cols-[56px_auto] mb-3">
                            <CalendarClock className="h-10 w-10 rounded-3xl bg-[var(--chart-1)] p-2 mr-3"/>
                            Get local service requests in your area – no client hunting required, even for newcomers.
                        </div>
                        <div className="grid grid-cols-[56px_auto] mb-3">
                            <HandCoins className="h-10 w-10 rounded-3xl bg-[var(--chart-2)] p-2 mr-3"/>
                            See your earnings upfront. Withdraw funds within 2 hours – zero hidden fees.
                        </div>
                        <div className="grid grid-cols-[56px_auto] mb-4">
                            <Star className="h-10 w-10 rounded-3xl bg-[var(--chart-5)] p-2 mr-3"/>
                            Higher ratings boost your visibility. Earn trust, attract better clients, and grow your
                            income.
                        </div>
                    </div>
                    <BottomActions className="flex">
                        <Button variant="primary" wide onClick={() => navigate(RoutePaths.Application)}>Submit Application</Button>
                    </BottomActions>
                </SheetContent>
            </Sheet>}
            {application?.status === 'APPROVED' && <ListButton onClick={handleLogin} extra={<ChevronRight className="w-5 h-5 text-tg-theme-hint-color mr-[-8px]"/>} icon={<BriefcaseBusiness
                                                                          className="mr-4 h-7 w-7 p-1 bg-[var(--chart-5)] rounded-md"/>} text={`Login as ${userInfo?.role === 'client' ? 'Executor' : 'Client'}`}/>}

            {userInfo?.role === 'executor' && filteredServices.length > 0 && <div>
                <Typography.Title className="text-left mb-0 block">Your services</Typography.Title>
                {filteredServices.map(s => <div className="mt-4">
                    <Typography.Description className="block mb-2 text-left">{s.name}</Typography.Description>
                    <ListButtonGroup>
                        {s.variants.map(s => <ListButton text={s.name} icon={<DynamicIcon name={s.icon}
                                                                                          className="w-7 h-7 p-1 root-bg-color rounded-md"
                                                                                          strokeWidth={1.5}/>}/>)}
                    </ListButtonGroup>
                </div>)}

            </div>}

            <Button className="[color:var(--tg-theme-destructive-text-color)]" variant="ghost" onClick={handleLogout}>Log
                out</Button>
        </div>
    </>
}