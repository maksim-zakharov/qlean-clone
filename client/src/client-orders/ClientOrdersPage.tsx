import { Shirt, Grid2x2, Sofa, Footprints, Sparkles, Brush, Hammer, Home, Building2, LucideIcon } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useNavigate } from "react-router-dom"
import { SERVICES_DATA } from "@/features/order-creation/types"

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
  serviceId: string
}

const ServiceCard = ({ title, backgroundColor = "bg-slate-50", icon, serviceId }: ServiceCardProps) => {
  const navigate = useNavigate()
  
  return (
    <Card 
      className={`${backgroundColor} p-4 rounded-[20px] cursor-pointer hover:opacity-90 transition-opacity min-h-[140px] relative`}
      onClick={() => navigate(`/order/${serviceId}`)}
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

const ClientOrdersPage = () => {
  return (
    <div className="px-3">
      {SERVICES_DATA.map(category => (
        <section key={category.id} className="my-6">
          <h2 className="text-xl font-bold mb-3 text-tg-theme-text-color text-left">
            {category.name}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {category.services.map(service => {
              const Icon = ICONS[service.icon]
              return (
                <ServiceCard
                  key={service.id}
                  title={service.name}
                  backgroundColor={service.backgroundColor}
                  icon={<Icon className="w-10 h-10 text-tg-theme-text-color" strokeWidth={1.5} />}
                  serviceId={service.id}
                />
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}

export default ClientOrdersPage