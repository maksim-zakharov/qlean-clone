import {Brush, Building2, Footprints, Grid2x2, Hammer, Home, LucideIcon, Shirt, Sofa, Sparkles} from "lucide-react"
import {useNavigate} from "react-router-dom"
import {useEffect} from "react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {CardItem} from "../components/CardItem.tsx";
import {Typography} from "../components/ui/Typography.tsx";
import {useGetServicesQuery} from "../api.ts";

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
    const {data: services = []} = useGetServicesQuery();

    const {backButton, isLoading, error} = useTelegram();
    useEffect(() => {
        if (!isLoading && !error) {
            backButton?.hide();
            Telegram.WebApp.MainButton?.hide();
        }
    }, [backButton, isLoading, error]);

    return (
        <div className="px-4">
            {services.map(category => (
                <section key={category.id} className="mb-6 mt-4">
                    <Typography.H2>
                        {category.name}
                    </Typography.H2>
                    <div className="grid grid-cols-2 gap-2">
                        {category.services.map(service => {
                            const Icon = ICONS[service.icon]
                            return (
                                <CardItem
                                    key={service.id}
                                    title={service.name}
                                    icon={<Icon className="w-10 h-10 text-tg-theme-button-color" strokeWidth={1.5}/>}
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