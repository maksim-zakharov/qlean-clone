import {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {useTelegram} from "./useTelegram.ts";

export const useBackButton = (url: string) => {
    const navigate = useNavigate()
    const {backButton, isLoading, error} = useTelegram();

    const showTgBackButton = Boolean(backButton && !isLoading && !error);
    
    const onBack = () => navigate(url || '/')

    useEffect(() => {
        if (backButton && showTgBackButton) {
            Telegram.WebApp.onEvent('backButtonClicked', onBack);
            backButton.show();
        }
    }, [backButton, onBack, showTgBackButton]);
}