import {ChevronLeft} from "lucide-react";
import {Button} from "./ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {FC, useEffect} from "react";
import {useTelegram} from "../hooks/useTelegram.ts";

export const BackButton: FC<{ onBack?: () => void }> = ({onBack}) => {
    const navigate = useNavigate()
    const {backButton, isLoading, error} = useTelegram();

    const showTgBackButton = Boolean(backButton && !isLoading && !error);

    useEffect(() => {
        if (backButton && showTgBackButton) {
            // Telegram.WebApp.onEvent('backButtonClicked', onBack);
            backButton.show();
        }
    }, [backButton, showTgBackButton]);

    if (showTgBackButton) {
        return;
    }

    return <Button
        variant="ghost"
        className="p-2 -ml-2 text-tg-theme-button-color hover:bg-transparent"
        onClick={() => navigate('/')}
    >
        <ChevronLeft className="h-5 w-5"/>
    </Button>
}