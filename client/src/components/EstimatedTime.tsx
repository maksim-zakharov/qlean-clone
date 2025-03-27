import {Clock} from "lucide-react";
import {FC, memo} from "react";

const EstimatedTime: FC<{ totalDuration: number }> = ({totalDuration}) => {
    // Форматируем время в часы и минуты
    const formatDuration = (minutes: number) => {
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = minutes % 60

        if (hours === 0) {
            return `${remainingMinutes} минут`
        } else if (remainingMinutes === 0) {
            return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'}`
        } else {
            return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'} ${remainingMinutes} минут`
        }
    }

    return <div className="flex items-center justify-center gap-2 py-4 text-tg-theme-button-color text-base">
        <Clock className="w-5 h-5"/>
        <span>Время уборки примерно {formatDuration(totalDuration)}</span>
    </div>
}

export default memo(EstimatedTime);