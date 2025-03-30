import {ClipboardList, Gift, Home, LucideIcon} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Avatar} from "./Avatar"
import {Outlet, useLocation, useNavigate} from "react-router-dom"
import {Header} from "../ui/Header.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";
import {useState} from "react";
import {AddressSheet} from "../AddressSheet";
import {Typography} from "../ui/Typography.tsx";

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
    {
        icon: Gift,
        label: 'Бонусы',
        path: '/bonuses'
    },
    // {
    //     icon: User,
    //     label: 'Профиль',
    //     path: '/profile'
    // }
]

export const Layout = () => {
    const {isLoading} = useTelegram();
    const navigate = useNavigate()
    const location = useLocation();
    const [addresses] = useState<Array<{ id: string; address: string }>>([
        {id: '1', address: 'Оружейный переулок'},
        {id: '2', address: 'ул. Тверская, 1'},
        {id: '3', address: 'Ленинградский проспект, 15'},
    ]);
    const [selectedAddress, setSelectedAddress] = useState(addresses[0]?.address || '');

    const handleAddressSelect = (address: string) => {
        setSelectedAddress(address);
    };

    const handleAddAddress = () => {
        // TODO: Implement address addition logic
        console.log('Add address clicked');
    };

    if (isLoading) {
        return null;
    }

    return <>
        <Header>
            <div className="grid grid-cols-[40px_auto_40px]">
                <Avatar/>
                <div className="flex-1 flex flex-col items-center">
                    <Typography.Description>Адрес</Typography.Description>
                    <AddressSheet
                        addresses={addresses}
                        selectedAddress={selectedAddress}
                        onAddressSelect={handleAddressSelect}
                        onAddAddress={handleAddAddress}
                    >
                        <Button variant="ghost" className="h-auto text-tg-theme-text-color text-base font-medium">
                            {selectedAddress} <span className="ml-2 text-tg-theme-subtitle-text-color">›</span>
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