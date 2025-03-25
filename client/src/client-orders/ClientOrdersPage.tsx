import { Shirt, Grid2x2, Sofa, Footprints, Sparkles, Brush } from "lucide-react"
import { Card } from "@/components/ui/card"

interface ServiceCardProps {
  title: string
  backgroundColor?: string
  icon: React.ReactNode
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
  )
}

export default ClientOrdersPage