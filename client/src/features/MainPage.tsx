import {
    Brush,
    Building2, CircleX,
    ClipboardPlus,
    Footprints,
    Grid2x2,
    Hammer,
    Home,
    LucideIcon,
    Shirt,
    Sofa,
    Sparkles
} from "lucide-react"
import {useNavigate} from "react-router-dom"
import React, {useEffect} from "react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {CardItem} from "../components/CardItem.tsx";
import {Typography} from "../components/ui/Typography.tsx";
import {useGetServicesQuery} from "../api.ts";
import {useDispatch, useSelector} from "react-redux";
import {startOrderFlow} from "../slices/createOrderSlice.ts";
import {Skeleton} from "../components/ui/skeleton.tsx";
import {EmptyState} from "../components/EmptyState.tsx";
import {RoutePaths} from "../routes.ts";
import {Button} from "../components/ui/button.tsx";

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
    const dispatch = useDispatch();
    const {data: services = [], isError} = useGetServicesQuery();

    const {backButton, isLoading, error} = useTelegram();
    useEffect(() => {
        if (!isLoading && !error) {
            backButton?.hide();
            Telegram.WebApp.MainButton?.hide();
        }
    }, [backButton, isLoading, error]);

    const handleCardOnClick = (baseService, serviceVariant) => {
        dispatch(startOrderFlow({baseService, serviceVariant}))
        navigate(`/order`)
    }

    if(isError){
        return  <EmptyState
            icon={<CircleX className="h-10 w-10" />}
            title="Упс, что-то пошло не так..."
            description="Обновите страницу или повторите попытку позднее."
            action={
                <Button onClick={() => window.location.reload()}
                >
                    Обновить страницу
                </Button>}
        />
    }

    return (
        <div className="px-4">
            {services.map(category => (
                <section key={category.id} className="mb-6 mt-4">
                    <Typography.H2>
                        {category.name}
                    </Typography.H2>
                    <div className="grid grid-cols-2 gap-2">
                        {category.variants.map(service => {
                            // const Icon = ICONS[service.icon]
                            return (
                                <CardItem
                                    key={service.id}
                                    title={service.name}
                                    // icon={<Icon className="w-10 h-10 text-tg-theme-button-color" strokeWidth={1.5}/>}
                                    onClick={() => handleCardOnClick(category, service)}
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