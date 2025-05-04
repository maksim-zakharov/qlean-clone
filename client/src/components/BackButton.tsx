import {ChevronLeft} from "lucide-react";
import {Button} from "./ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {FC, useEffect} from "react";
import {useTelegram} from "../hooks/useTelegram.ts";
import {RoutePaths} from "../routes.ts";

export const BackButton: FC<{ url?: string, state?: any, onClick?: any }> = ({url, state, onClick}) => {
    const navigate = useNavigate()
    const {backButton, isLoading, error} = useTelegram();

    const showTgBackButton = Boolean(backButton && !isLoading && !error);

    const onBack = () => {
        onClick?.();
        navigate(url || RoutePaths.Root, state ? {state} : undefined);
    }

    useEffect(() => {
        if (backButton && showTgBackButton) {
            Telegram.WebApp.onEvent('backButtonClicked', onBack);
            backButton.show();
        }
    }, [backButton, onBack, showTgBackButton]);

    if (showTgBackButton) {
        return null;
    }

    return <Button
        variant="ghost"
        className="p-2 -ml-2 text-tg-theme-text-colorhover:bg-transparent"
        onClick={onBack}
    >
        <ChevronLeft className="h-10 w-10"/>
    </Button>
}