import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useTelegram} from "./useTelegram.tsx";
import {RoutePaths} from "../routes.ts";

export const useBackButton = (url: string) => {
    const navigate = useNavigate()
    const {backButton, isLoading, error} = useTelegram();

    const showTgBackButton = Boolean(backButton && !isLoading && !error);
    
    const onBack = () => navigate(url || RoutePaths.Root)

    useEffect(() => {
        if (backButton && showTgBackButton) {
            Telegram.WebApp.onEvent('backButtonClicked', onBack);
            backButton.show();
        }
    }, [backButton, onBack, showTgBackButton]);
}