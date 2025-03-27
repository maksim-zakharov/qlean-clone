import {User} from "lucide-react"
import {useTelegram} from "../../hooks/useTelegram.ts";
import {useNavigate} from "react-router-dom";

export const Avatar = () => {
    const {photoUrl} = useTelegram();
    const navigate = useNavigate()

    return (
        <div
            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium bg-gray-400`} onClick={() => navigate('/profile')}>
            {photoUrl ? <img className="rounded-3xl" src={photoUrl}/> : <User className="w-5 h-5"/>}
        </div>
    )
} 