import {ChevronLeft} from "lucide-react";
import {Button} from "./ui/button.tsx";
import {useNavigate} from "react-router-dom";
import {useEffect} from "react";

export const BackButton = () => {
    const navigate = useNavigate()

    useEffect(() => {
        Telegram.WebApp?.BackButton?.show?.();
    }, []);

    if (Telegram.WebApp?.BackButton) {
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