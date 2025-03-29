import { Shirt, Grid2x2, Sofa, Footprints, Sparkles, Brush, Hammer, Home, Building2, LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { SERVICES_DATA } from "@/features/order-creation/types"
import {ReactNode, useEffect} from "react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {CardItem} from "../components/CardItem.tsx";

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
        <section key={category.id} className="mb-6 mt-4">
          <h2 className="text-xl font-bold mb-3 text-tg-theme-text-color text-left">
            {category.name}
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {category.services.map(service => {
              const Icon = ICONS[service.icon]
              return (
                <CardItem
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