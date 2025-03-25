import { User } from "lucide-react"

// Функция для получения цвета аватара в стиле Telegram
const getAvatarColor = (userId?: number) => {
  if (!userId) return "bg-gray-400"
  const colors = [
    "bg-[#ff885e]", "bg-[#dc4d3f]", "bg-[#ff9244]", 
    "bg-[#f9ae26]", "bg-[#87bf62]", "bg-[#65aadd]",
    "bg-[#7b91b3]", "bg-[#b383b3]"
  ]
  return colors[userId % colors.length]
}

interface AvatarProps {
  name?: string
  userId?: number
}

export const Avatar = ({ name, userId }: AvatarProps) => {
  const isWebApp = Boolean(window.Telegram?.WebApp)
  const initials = name
    ? name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()
    : ''

  return (
    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-medium ${getAvatarColor(userId)}`}>
      {isWebApp && initials ? initials : <User className="w-5 h-5" />}
    </div>
  )
} 