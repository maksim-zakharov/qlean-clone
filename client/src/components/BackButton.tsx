import {ChevronLeft} from "lucide-react";
import {Button} from "./ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {FC, useEffect} from "react";

export const BackButton: FC<{ onBack: () => void }> = ({onBack}) => {
    const navigate = useNavigate()

    const showTgBackButton = Boolean(Telegram.WebApp?.isVersionAtLeast?.('6.1') && Telegram.WebApp?.isExpanded);

    useEffect(() => {
        if (showTgBackButton) {
            Telegram.WebApp.onEvent('backButtonClicked', onBack);
            Telegram.WebApp?.BackButton?.show?.();
        }
    }, [showTgBackButton]);

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