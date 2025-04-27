import {CalendarPlus, ClipboardList, LucideIcon, User, Wallet} from "lucide-react"
import {Outlet, useNavigate} from "react-router-dom"
import {useTelegram} from "../../hooks/useTelegram.ts";
import React from "react";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar.tsx";
import { useSelector} from "react-redux";
import {Skeleton} from "../ui/skeleton.tsx";
import {RoutePaths} from "../../routes.ts";
import {Navbar} from "../ui/navbar.tsx";

type MenuItem = {
    icon: LucideIcon | any
    label: string
    path: string
}

export const ExecutorLayout = () => {
    const userInfo = useSelector(state => state.createOrder.userInfo);
    const navigate = useNavigate()
    const {isLoading} = useTelegram();

    const Profile = () => <Avatar className="size-[22px]" onClick={() => navigate(RoutePaths.Executor.Profile)}>
        <AvatarImage src={userInfo?.photoUrl}/>
        <AvatarFallback><User/></AvatarFallback>
    </Avatar>

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
            icon: Profile,
            label: 'Profile',
            path: RoutePaths.Executor.Profile
        }
    ]

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