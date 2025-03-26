import {User} from "lucide-react"
import {useTelegram} from "../../hooks/useTelegram.ts";

export const Avatar = () => {
    const {photoUrl} = useTelegram();

    return (
        <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium bg-gray-400`}>
            {photoUrl ? <img src={photoUrl}/> : <User className="w-5 h-5"/>}
        </div>
    )
} 