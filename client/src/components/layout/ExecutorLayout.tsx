import {CalendarPlus, ClipboardList, Home, LucideIcon, User, UserRound, Wallet} from "lucide-react"
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
        icon: ClipboardList,
        label: 'Заказы',
        path: RoutePaths.Executor.Orders
    },
    {
        icon: Wallet,
        label: 'Выплаты',
        path: RoutePaths.Executor.Payments
    },
    {
        icon: CalendarPlus,
        label: 'Расписание',
        path: RoutePaths.Executor.Schedule
    },
    {
        icon: UserRound,
        label: 'Профиль',
        path: RoutePaths.Executor.Profile
    }
]

export const ExecutorLayout = () => {
    const {isLoading} = useTelegram();
    const navigate = useNavigate()
    const location = useLocation();

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

    return <><div className="content">
            <Outlet/>
        </div>

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
    </>
} 