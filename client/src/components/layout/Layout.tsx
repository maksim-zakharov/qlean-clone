import {ClipboardList, Home, LucideIcon, User} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Outlet, useLocation, useNavigate} from "react-router-dom"
import {Header} from "../ui/Header.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";
import {useMemo, useState} from "react";
import {AddressSheet} from "../AddressSheet";
import {Typography} from "../ui/Typography.tsx";
import {useGetAddressesQuery} from "../../api.ts";
import {Avatar, AvatarFallback, AvatarImage} from "../ui/avatar.tsx";
import {selectFullAddress} from "../../slices/createOrderSlice.ts";
import {useDispatch, useSelector} from "react-redux";

type MenuItem = {
    icon: LucideIcon
    label: string
    path: string
}

const menuItems: MenuItem[] = [
    {
        icon: Home,
        label: 'Главная',
        path: '/'
    },
    {
        icon: ClipboardList,
        label: 'Заказы',
        path: '/orders'
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
    const {isLoading, userId, photoUrl} = useTelegram();
    const {data: addresses = []} = useGetAddressesQuery({userId});
    const fullAddress = useSelector(state => state.createOrder.fullAddress)
    const navigate = useNavigate()
    const location = useLocation();
    const dispatch = useDispatch();

    const handleSelectAddress = (address: any) => {
        dispatch(selectFullAddress(address))
    }

    if (isLoading) {
        return null;
    }

    return <>
        <Header>
            <div className="grid grid-cols-[40px_auto_40px]">
                <Avatar>
                    <AvatarImage src={photoUrl}/>
                    <AvatarFallback><User /></AvatarFallback>
                </Avatar>
                <div className="flex-1 flex flex-col items-center">
                    <Typography.Description>Адрес</Typography.Description>
                    <AddressSheet
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

        {/* Main Content */}
        <main className="overflow-y-auto bg-inherit">
            <div
                className="absolute no-scrollbar inset-0 overflow-y-auto overscroll-none pt-14 pb-safe-area-inset-bottom bg-inherit ">
                <Outlet/>
            </div>
        </main>

        {/* Bottom Navigation */}
        <footer
            className="separator-shadow-top fixed flex justify-around items-center bottom-0 left-0 right-0 bg-tg-theme-section-bg-color pb-[env(safe-area-inset-bottom)]">
            {menuItems.map(({icon: Icon, label, path}) => (
                <Button
                    key={path}
                    variant="ghost"
                    className="flex flex-col items-center gap-1 h-auto py-2 focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 hover:bg-transparent active:bg-transparent"
                    onClick={() => navigate(path)}
                >
                    <Icon
                        className={`h-[22px] w-[22px] ${location.pathname === path ? 'text-tg-theme-text-color' : 'text-tg-theme-subtitle-text-color'}`}
                    />
                    <span
                        className={`text-[13px] font-medium ${location.pathname === path ? 'text-tg-theme-text-color' : 'text-tg-theme-subtitle-text-color'}`}
                    >
                  {label}
                </span>
                </Button>
            ))}
        </footer>
    </>
} 