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
import {Navbar} from "../ui/navbar.tsx";

type MenuItem = {
    icon: LucideIcon
    label: string
    path: string
}

const menuItems: MenuItem[] = [
    {
        icon: ClipboardList,
        label: 'Orders',
        path: RoutePaths.Executor.Orders
    },
    {
        icon: Wallet,
        label: 'Payments',
        path: RoutePaths.Executor.Payments
    },
    {
        icon: CalendarPlus,
        label: 'Schedule',
        path: RoutePaths.Executor.Schedule
    },
    {
        icon: UserRound,
        label: 'Profile',
        path: RoutePaths.Executor.Profile
    }
]

export const ExecutorLayout = () => {
    const {isLoading} = useTelegram();

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

        <Navbar menuItems={menuItems}/>
    </>
} 