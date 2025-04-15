import {ClipboardList, Home, LucideIcon, User} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Outlet, useLocation, useNavigate} from "react-router-dom"
import {Header} from "../ui/Header.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";
import React, {useEffect, useState} from "react";
import {AddressSheet} from "../AddressSheet";
import {Typography} from "../ui/Typography.tsx";
import {useGetAddressesQuery} from "../../api.ts";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar.tsx";
import {selectFullAddress} from "../../slices/createOrderSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {Skeleton} from "../ui/skeleton.tsx";
import {RoutePaths} from "../../routes.ts";

type MenuItem = {
    icon: LucideIcon
    label: string
    path: string
}

const menuItems: MenuItem[] = [
    {
        icon: Home,
        label: 'Главная',
        path: RoutePaths.Root
    },
    {
        icon: ClipboardList,
        label: 'Заказы',
        path: RoutePaths.Orders
    },
    // {
    //     icon: Gift,
    //     label: 'Бонусы',
    //     path: '/bonuses'
    // },
    // {
    //     icon: User,
    //     label: 'Профиль',
    //     path: '/profile'
    // }
]

export const Layout = () => {
    const {isLoading} = useTelegram();
    const userInfo = useSelector(state => state.createOrder.userInfo);
    const {data: addresses = [], isError} = useGetAddressesQuery();
    const fullAddress = useSelector(state => state.createOrder.fullAddress)
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch();

    const [state, setState] = useState({});

    useEffect(() => {

        const vars = [
            '--tg-viewport-height',
            '--tg-viewport-stable-height',
            '--tg-safe-area-inset-top',
            '--tg-safe-area-inset-bottom',
            '--tg-safe-area-inset-left',
            '--tg-safe-area-inset-right',
            '--tg-content-safe-area-inset-top',
            '--tg-content-safe-area-inset-bottom',
            '--tg-content-safe-area-inset-left',
            '--tg-content-safe-area-inset-right'
        ]

        setState(prevState => ({
            ...prevState,
            ...vars.reduce((acc, v) => ({...acc, [v]: getComputedStyle(document.documentElement).getPropertyValue(v).trim()}), {})
        }))
    }, []);

    const handleSelectAddress = (address: any) => {
        dispatch(selectFullAddress(address))
    }

    if (isLoading) {
        return <div>
            <Skeleton className="w-full h-[56px] rounded-none"/>
            <div className="px-4 mb-6 mt-4 flex flex-col gap-2">
                <Skeleton className="w-[100px] h-[28px] mb-1"/>
                <div className="flex gap-2">
                    <Skeleton className="w-full h-[140px]"/>
                    <Skeleton className="w-full h-[140px]"/>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="w-full h-[140px]"/>
                    <Skeleton className="w-full h-[140px]"/>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="w-full h-[140px]"/>
                    <Skeleton className="w-full h-[140px]"/>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="w-full h-[140px]"/>
                    <Skeleton className="w-full h-[140px]"/>
                </div>
                <div className="flex gap-2">
                    <Skeleton className="w-full h-[140px]"/>
                    <Skeleton className="w-full h-[140px]"/>
                </div>
            </div>
        </div>;
    }

    return <div className="flex flex-col">
        {/* Main Content */}
        <div className="layout-container">
            <Header>
                <div className="grid grid-cols-[40px_auto_40px]">
                    <Avatar onClick={() => navigate('/profile')}>
                        <AvatarImage src={userInfo?.photoUrl}/>
                        <AvatarFallback><User/></AvatarFallback>
                    </Avatar>
                    <div className="flex-1 flex flex-col items-center">
                        <Typography.Description>Адрес</Typography.Description>
                        <AddressSheet
                            isError={isError}
                            addresses={addresses}
                            onAddressSelect={handleSelectAddress}
                        >
                            <Button variant="ghost" className="h-auto text-tg-theme-text-color text-base font-medium">
                                {fullAddress?.fullAddress || 'Выберите адрес'} <span
                                className="ml-2 text-tg-theme-subtitle-text-color">›</span>
                            </Button>
                        </AddressSheet>
                    </div>
                </div>
            </Header>
            {JSON.stringify(state)}
            <Outlet/>
        </div>

        <div className="fixed bottom-0 w-full left-0 right-0">
            <div
                className="menu-container separator-shadow-top flex justify-around items-center [backdrop-filter:blur(5px)] card-bg-color-transparency">
                {menuItems.map(({icon: Icon, label, path}) => (
                    <Button
                        key={path}
                        variant="ghost"
                        className="flex flex-col items-center h-auto py-1.5 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:bg-transparent active:bg-transparent"
                        onClick={() => navigate(path)}
                    >
                        <Icon
                            className={`h-[22px] w-[22px] ${location.pathname === path ? 'text-tg-theme-text-color' : 'text-tg-theme-subtitle-text-color'}`}
                        />
                        <span
                            className={`text-xs font-medium ${location.pathname === path ? 'text-tg-theme-text-color' : 'text-tg-theme-subtitle-text-color'}`}
                        >
                  {label}
                </span>
                    </Button>
                ))}
            </div>
        </div>
    </div>
} 