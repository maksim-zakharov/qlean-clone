import {ClipboardList, Gift, Home, LucideIcon} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Avatar} from "./Avatar"
import {Outlet, useLocation, useNavigate} from "react-router-dom"
import {Header} from "../ui/Header.tsx";
import {Spacer} from "../ui/Spacer.tsx";
import {useTelegram} from "../../hooks/useTelegram.ts";

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
    const {user, isLoading} = useTelegram();
    const navigate = useNavigate()
    const location = useLocation();

    if (isLoading) {
        return null;
    }

    return <>
        <Header isWebApp={Boolean(user)}><Spacer>
            <Avatar/>
            <div className="flex-1 flex flex-col items-center">
                <span className="text-xs text-tg-theme-hint-color mb-0.5">Адрес</span>
                <Button variant="ghost" className="text-tg-theme-text-color text-base font-medium">
                    Оружейный переулок <span className="ml-2 text-tg-theme-subtitle-text-color">›</span>
                </Button>
            </div>
        </Spacer>
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
            className="separator-shadow-top fixed flex justify-around items-center bottom-0 left-0 right-0 bg-tg-theme-secondary-bg-color pb-[env(safe-area-inset-bottom)]">
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