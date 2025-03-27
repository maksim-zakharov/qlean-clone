import { Shirt, Grid2x2, Sofa, Footprints, Sparkles, Brush, Hammer, Home, Building2, LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { SERVICES_DATA } from "@/features/order-creation/types"
import {useEffect} from "react";
import {useTelegram} from "../hooks/useTelegram.ts";

const ICONS: Record<string, LucideIcon> = {
  Shirt,
  Grid2x2,
  Sofa,
  Footprints,
  Sparkles,
  Brush,
  Hammer,
  Home,
  Building2
}

interface ServiceCardProps {
  title: string
  backgroundColor?: string
  icon: React.ReactNode
  onClick?: () => void
}

const ServiceCard = ({ title, icon, onClick }: ServiceCardProps) => {
  return (
    <Card 
      className={`bg-tg-theme-section-bg-color p-4 cursor-pointer hover:opacity-90 transition-opacity min-h-[140px] relative`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <h3 className="text-base font-medium text-tg-theme-text-color max-w-[60%] text-left">{title}</h3>
        <div className="absolute bottom-4 right-4">
          {icon}
        </div>
      </div>
    </Card>
  )
}

const MainPage = () => {
  const navigate = useNavigate()

  const {backButton, isLoading, error} = useTelegram();
  useEffect(() => {
    if(!isLoading && !error){
      backButton?.hide();
      Telegram.WebApp.MainButton?.hide();
    }
  }, [backButton, isLoading, error]);

  return (
    <div className="px-4">
      {SERVICES_DATA.map(category => (
        <section key={category.id} className="my-6">
          <h2 className="text-xl font-bold mb-3 text-tg-theme-text-color text-left">
            {category.name}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {category.services.map(service => {
              const Icon = ICONS[service.icon]
              return (
                <ServiceCard
                  key={service.id}
                  title={service.name}
                  icon={<Icon className="w-10 h-10 text-tg-theme-button-color" strokeWidth={1.5} />}
                  onClick={() => navigate(`/order/${service.id}`)}
                />
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

export default MainPage