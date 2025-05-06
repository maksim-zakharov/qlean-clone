import {ClipboardList, Home, LucideIcon, User} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Outlet, useNavigate} from "react-router-dom"
import {Header} from "../ui/Header.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";

import React, {useMemo} from "react";
import {AddressSheet} from "../AddressSheet";
import {Typography} from "../ui/Typography.tsx";
import {useGetAddressesQuery} from "../../api/api.ts";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar.tsx";
import {selectFullAddress} from "../../slices/createOrderSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import {Skeleton} from "../ui/skeleton.tsx";
import {RoutePaths} from "../../routes.ts";
import {Navbar} from "../ui/navbar.tsx";
import {useTranslation} from "react-i18next";

type MenuItem = {
    icon: LucideIcon | any
    label: string
    path: string
}

export const ClientLayout = () => {
    const {t} = useTranslation();
    const {isLoading} = useTelegram();
    const userInfo = useSelector(state => state.createOrder.userInfo);
    const {data: addresses = [], isError} = useGetAddressesQuery();
    const fullAddress = useSelector(state => state.createOrder.fullAddress)
    const navigate = useNavigate()

    const Profile = () => <Avatar className="size-[22px]" onClick={() => navigate(RoutePaths.Profile)}>
        <AvatarImage src={userInfo?.photoUrl}/>
        <AvatarFallback><User/></AvatarFallback>
    </Avatar>

    const menuItems: MenuItem[] = useMemo(() => [
        {
            icon: Home,
            label: t('menu_item_home'),
            path: RoutePaths.Root
        },
        {
            icon: ClipboardList,
            label: t('menu_item_orders'),
            path: RoutePaths.Orders
        },
        {
            icon: Profile,
            label: t('menu_item_profile'),
            path: RoutePaths.Profile
        }
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
    ], [Profile, t])
    const dispatch = useDispatch();

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

    return <>
        <Header>
            <div className="flex-1 flex flex-col items-center">
                <Typography.Description>Address</Typography.Description>
                <AddressSheet
                    isError={isError}
                    addresses={addresses}
                    onAddressSelect={handleSelectAddress}
                >
                    <Button variant="ghost" className="h-auto text-tg-theme-text-color text-base font-medium">
                        {fullAddress?.fullAddress || t('client_checkout_address_error')} <span
                        className="ml-2 text-tg-theme-subtitle-text-color">›</span>
                    </Button>
                </AddressSheet>
            </div>
        </Header>

        <div className="content">
            <Outlet/>
        </div>

        <Navbar menuItems={menuItems}/>
    </>
} 