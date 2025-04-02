import {ChevronLeft} from "lucide-react";
import {Button} from "./ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {FC, useEffect} from "react";
import {useTelegram} from "../hooks/useTelegram.ts";

export const BackButton: FC<{ url?: string, state?: any, onClick?: any }> = ({url, state, onClick}) => {
    const navigate = useNavigate()
    const {backButton, isLoading, error} = useTelegram();

    const showTgBackButton = Boolean(backButton && !isLoading && !error);

    const onBack = () => {
        onClick?.();
        navigate(url || '/', state ? {state} : undefined);
    }

    useEffect(() => {
        if (backButton && showTgBackButton) {
            Telegram.WebApp.onEvent('backButtonClicked', onBack);
            backButton.show();
        }
    }, [backButton, showTgBackButton]);

    if (showTgBackButton) {
        return <div/>;
    }

    return <Button
        variant="ghost"
        className="p-2 -ml-2 text-tg-theme-button-color hover:bg-transparent"
        onClick={onBack}
    >
        <ChevronLeft className="h-5 w-5"/>
    </Button>
}