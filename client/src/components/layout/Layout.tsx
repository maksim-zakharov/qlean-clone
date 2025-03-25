import { User, Home, ClipboardList, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Avatar } from "./Avatar"
import { Outlet, useNavigate } from "react-router-dom"

export const Layout = () => {
  const [userData, setUserData] = useState<{ firstName: string; id: number } | null>(null)
  const [isWebApp, setIsWebApp] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Получаем данные пользователя из Telegram WebApp
    const webApp = window.Telegram?.WebApp
    if (webApp) {
      setIsWebApp(true)
      if (webApp.initDataUnsafe?.user) {
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

  return (
    <div className="fixed inset-0 flex flex-col bg-tg-theme-bg-color">
      <div className="absolute inset-x-0 mx-auto max-w-[420px] h-full flex flex-col">
        {/* Header */}
        <div className={`flex-none bg-tg-theme-bg-color p-4 ${isWebApp ? 'pt-[env(safe-area-inset-top)]' : 'pt-4'} z-10`}>
          <div className="flex items-center justify-between">
            <Avatar name={userData?.firstName} userId={userData?.id} />
            <div className="flex-1 text-center">
              <Button variant="ghost" className="text-tg-theme-text-color text-base">
                Оружейный переулок <span className="ml-1 opacity-50">›</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-h-0 relative bg-tg-theme-secondary-bg-color">
          <div className="absolute inset-0 overflow-y-auto overscroll-none">
            <Outlet />
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex-none bg-tg-theme-bg-color">
          <div className="flex justify-around items-center py-2">
            <Button 
              variant="ghost" 
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => navigate('/')}
            >
              <Home className={`h-5 w-5 ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`} />
              <span className={`text-xs ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`}>Главная</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => navigate('/orders')}
            >
              <ClipboardList className={`h-5 w-5 ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`} />
              <span className={`text-xs ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`}>Заказы</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => navigate('/bonuses')}
            >
              <Gift className={`h-5 w-5 ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`} />
              <span className={`text-xs ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`}>Бонусы</span>
            </Button>
            <Button 
              variant="ghost" 
              className="flex flex-col items-center gap-1 h-auto py-2"
              onClick={() => navigate('/profile')}
            >
              <User className={`h-5 w-5 ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`} />
              <span className={`text-xs ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`}>Профиль</span>
            </Button>
          </div>
          {isWebApp && <div className="h-[env(safe-area-inset-bottom)] bg-tg-theme-bg-color" />}
        </div>
      </div>
    </div>
  )
} 