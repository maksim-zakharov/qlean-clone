import { Shirt, Grid2x2, Sofa, Footprints, Sparkles, Brush } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ServiceCardProps {
  title: string
  backgroundColor?: string
  icon: React.ReactNode
}

const ServiceCard = ({ title, backgroundColor = "bg-slate-50", icon }: ServiceCardProps) => (
  <Card className={`${backgroundColor} p-4 rounded-[20px] cursor-pointer hover:opacity-90 transition-opacity min-h-[140px] relative`}>
    <div className="flex flex-col h-full">
      <h3 className="text-base font-medium text-tg-theme-text-color max-w-[60%] text-left">{title}</h3>
      <div className="absolute bottom-4 right-4">
        {icon}
      </div>
    </div>
  </Card>
)

const ClientOrdersPage = () => {
  const cleaningServices = [
    {
      title: "Химчистка и стирка одежды",
      backgroundColor: "bg-slate-50 dark:bg-slate-800/60",
      icon: <Shirt className="w-10 h-10 text-tg-theme-text-color" strokeWidth={1.5} />
    },
    {
      title: "Чистка ковров",
      backgroundColor: "bg-orange-50 dark:bg-orange-900/30",
      icon: <Grid2x2 className="w-10 h-10 text-tg-theme-text-color" strokeWidth={1.5} />
    },
    {
      title: "Химчистка мебели",
      backgroundColor: "bg-purple-50 dark:bg-purple-900/30",
      icon: <Sofa className="w-10 h-10 text-tg-theme-text-color" strokeWidth={1.5} />
    },
    {
      title: "Чистка и ремонт обуви",
      backgroundColor: "bg-red-50 dark:bg-red-900/30",
      icon: <Footprints className="w-10 h-10 text-tg-theme-text-color" strokeWidth={1.5} />
    }
  ]

  const housekeepingServices = [
    {
      title: "Регулярная",
      backgroundColor: "bg-green-50 dark:bg-green-900/30",
      icon: <Sparkles className="w-10 h-10 text-tg-theme-text-color" strokeWidth={1.5} />
    },
    {
      title: "Генеральная",
      backgroundColor: "bg-slate-100 dark:bg-slate-800/60",
      icon: <Brush className="w-10 h-10 text-tg-theme-text-color" strokeWidth={1.5} />
    }
  ]

  return (
    <div className="px-3">
      {/* Cleaning Services */}
      <section className="my-6">
        <h2 className="text-xl font-bold mb-3 text-tg-theme-text-color text-left">Химчистка</h2>
        <div className="grid grid-cols-2 gap-3">
          {cleaningServices.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </section>

      {/* Housekeeping Services */}
      <section className="mb-6">
        <h2 className="text-xl font-bold mb-3 text-tg-theme-text-color text-left">Уборка</h2>
        <div className="grid grid-cols-2 gap-3">
          {housekeepingServices.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default ClientOrdersPage