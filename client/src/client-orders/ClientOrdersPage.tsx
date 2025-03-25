import { User, Home, ClipboardList, Gift, Shirt, Grid2x2, Sofa, Footprints, Sparkles, Brush } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import "./ClientOrdersPage.css"

// Типы для Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
          };
        };
        colorScheme?: 'light' | 'dark';
        platform?: string;
      };
    };
  }
}

interface ServiceCardProps {
  title: string
  backgroundColor?: string
  icon: React.ReactNode
}

// Функция для получения цвета аватара в стиле Telegram
const getAvatarColor = (userId?: number) => {
  if (!userId) return "bg-gray-400"
  const colors = [
    "bg-[#ff885e]", "bg-[#dc4d3f]", "bg-[#ff9244]", 
    "bg-[#f9ae26]", "bg-[#87bf62]", "bg-[#65aadd]",
    "bg-[#7b91b3]", "bg-[#b383b3]"
  ]
  return colors[userId % colors.length]
}

// Компонент аватара
const Avatar = ({ name, userId }: { name?: string; userId?: number }) => {
  const isWebApp = Boolean(window.Telegram?.WebApp)
  const initials = name
    ? name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()
    : ''

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(userId)}`}>
      {isWebApp && initials ? initials : <User className="w-5 h-5" />}
    </div>
  )
}

const ServiceCard = ({ title, backgroundColor = "bg-slate-50", icon }: ServiceCardProps) => (
  <Card className={`${backgroundColor} p-6 rounded-3xl cursor-pointer hover:opacity-90 transition-opacity min-h-[180px] relative`}>
    <div className="flex flex-col h-full">
      <h3 className="text-lg font-medium text-tg-theme-text-color max-w-[60%] text-left">{title}</h3>
      <div className="absolute bottom-6 right-6">
        {icon}
      </div>
    </div>
  </Card>
)

const ClientOrdersPage = () => {
  const [userData, setUserData] = useState<{ firstName: string; id: number } | null>(null)
  const [isWebApp, setIsWebApp] = useState(false)

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

  const cleaningServices = [
    {
      title: "Химчистка и стирка одежды",
      backgroundColor: "bg-slate-50",
      icon: <Shirt className="w-12 h-12 text-tg-theme-text-color" strokeWidth={1.5} />
    },
    {
      title: "Чистка ковров",
      backgroundColor: "bg-orange-50",
      icon: <Grid2x2 className="w-12 h-12 text-tg-theme-text-color" strokeWidth={1.5} />
    },
    {
      title: "Химчистка мебели",
      backgroundColor: "bg-purple-50",
      icon: <Sofa className="w-12 h-12 text-tg-theme-text-color" strokeWidth={1.5} />
    },
    {
      title: "Чистка и ремонт обуви",
      backgroundColor: "bg-red-50",
      icon: <Footprints className="w-12 h-12 text-tg-theme-text-color" strokeWidth={1.5} />
    }
  ]

  const housekeepingServices = [
    {
      title: "Регулярная",
      backgroundColor: "bg-green-50",
      icon: <Sparkles className="w-12 h-12 text-tg-theme-text-color" strokeWidth={1.5} />
    },
    {
      title: "Генеральная",
      backgroundColor: "bg-slate-100",
      icon: <Brush className="w-12 h-12 text-tg-theme-text-color" strokeWidth={1.5} />
    }
  ]

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
        <div className="flex-1 overflow-y-auto bg-tg-theme-secondary-bg-color">
          <div className="px-4">
            {/* Cleaning Services */}
            <section className="my-8">
              <h2 className="text-2xl font-bold mb-4 text-tg-theme-text-color text-left">Химчистка</h2>
              <div className="grid grid-cols-2 gap-4">
                {cleaningServices.map((service, index) => (
                  <ServiceCard key={index} {...service} />
                ))}
              </div>
            </section>

            {/* Housekeeping Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-tg-theme-text-color text-left">Уборка</h2>
              <div className="grid grid-cols-2 gap-4">
                {housekeepingServices.map((service, index) => (
                  <ServiceCard key={index} {...service} />
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex-none bg-tg-theme-bg-color">
          <div className="flex justify-around items-center py-2">
            <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
              <Home className={`h-5 w-5 ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`} />
              <span className={`text-xs ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`}>Главная</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
              <ClipboardList className={`h-5 w-5 ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`} />
              <span className={`text-xs ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`}>Заказы</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
              <Gift className={`h-5 w-5 ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`} />
              <span className={`text-xs ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`}>Бонусы</span>
            </Button>
            <Button variant="ghost" className="flex flex-col items-center gap-1 h-auto py-2">
              <User className={`h-5 w-5 ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`} />
              <span className={`text-xs ${isWebApp ? 'text-tg-theme-hint-color' : 'text-gray-500'}`}>Профиль</span>
            </Button>
          </div>
          <div className="h-[env(safe-area-inset-bottom,0px)] bg-tg-theme-bg-color" />
        </div>
      </div>
    </div>
  )
}

export default ClientOrdersPage