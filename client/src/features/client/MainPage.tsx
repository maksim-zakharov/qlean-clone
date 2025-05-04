
import {useNavigate} from "react-router-dom"
import React, {useEffect} from "react";
import {useTelegram} from "../../hooks/useTelegram.ts";
import {CardItem} from "../../components/CardItem.tsx";
import {Typography} from "../../components/ui/Typography.tsx";
import {useGetServicesQuery} from "../../api/api.ts";
import {useDispatch} from "react-redux";
import {startOrderFlow} from "../../slices/createOrderSlice.ts";
import {DynamicIcon} from "lucide-react/dynamic";
import {ErrorState} from "../../components/ErrorState.tsx";

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
        return  <ErrorState/>
    }

    return (
        <div className="px-4">
            {services.map(category => (
                <section key={category.id} className="mb-4">
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
                                    icon={service.icon && <DynamicIcon name={service.icon}
                                                                       className="w-10 h-10 text-tg-theme-button-color"
                                                                       strokeWidth={1.5}/>}
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