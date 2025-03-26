import {ClipboardList, Gift, Home, LucideIcon, User} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useEffect, useState} from "react"
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
    {
        icon: User,
        label: 'Профиль',
        path: '/profile'
    }
]

export const Layout = () => {
    const [userData, setUserData] = useState<{ firstName: string; id: number } | null>(null)
    const [isWebApp, setIsWebApp] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()

    const {isLoading} = useTelegram();

    useEffect(() => {
        // Получаем данные пользователя из Telegram WebApp
        const webApp = window.Telegram?.WebApp
        if (webApp) {
            if (webApp.initDataUnsafe?.user) {
                setIsWebApp(true)
                setUserData({
                    firstName: webApp.initDataUnsafe.user.first_name,
                    id: webApp.initDataUnsafe.user.id
                })
            }

            // Устанавливаем тему в соответствии с Telegram
            if (webApp.colorScheme === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }
        }
    }, [])

    if(isLoading){
        return null;
    }

    return <>
        <Header isWebApp={isWebApp}><Spacer>
            <Avatar/>
            <div className="flex-1 text-center">
                <Button variant="ghost" className="text-tg-theme-text-color text-[17px] font-medium">
                    Оружейный переулок <span className="ml-1 text-tg-theme-subtitle-text-color">›</span>
                </Button>
            </div>
        </Spacer>
        </Header>

        {/* Main Content */}
        <main className="overflow-y-auto pt-[calc(4rem + env(safe-area-inset-top))]
              pb-[calc(4rem + env(safe-area-inset-bottom))] bg-inherit">
            <div className="absolute inset-0 overflow-y-auto overscroll-none pt-14 pb-16 bg-inherit">
                <Outlet/>
            </div>
        </main>

        {/* Bottom Navigation */}
        <footer className="fixed flex justify-around items-center bottom-0 left-0 right-0 bg-white border-t shadow-lg
              pb-[env(safe-area-inset-bottom)]">
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

    return (
        <div className="fixed inset-0 flex flex-col">
            <div className="absolute inset-x-0 mx-auto h-full flex flex-col">
                <Header isWebApp={isWebApp}><Spacer>
                    <Avatar/>
                    <div className="flex-1 text-center">
                        <Button variant="ghost" className="text-tg-theme-text-color text-[17px] font-medium">
                            Оружейный переулок <span className="ml-1 text-tg-theme-subtitle-text-color">›</span>
                        </Button>
                    </div>
                </Spacer>
                </Header>

                {/* Main Content */}
                <div className="flex-1 min-h-0 relative">
                    <div className="absolute inset-0 overflow-y-auto overscroll-none">
                        <Outlet/>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div
                    className="flex-none bg-tg-theme-section-bg-color border-t border-tg-theme-section-separator-color">
                    <div className="flex justify-around items-center">
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
                    </div>
                    <div className="h-[env(safe-area-inset-bottom)] bg-tg-theme-section-bg-color"/>
                </div>
            </div>
        </div>
    )
} 