import {ReactNode} from "react";
import {Card} from "./ui/card.tsx";
import {cn} from "../lib/utils.ts";

interface CardItemProps {
    title: string
    icon?: ReactNode
    onClick?: () => void
    className?: string;
}

export const CardItem = ({title, icon, onClick, className}: CardItemProps) => <Card
    className={cn(`p-4 cursor-pointer hover:opacity-90 transition-opacity min-h-[140px] relative`, className)}
    onClick={onClick}
>
    <div className="flex flex-col h-full">
        <h3 className="text-base font-medium text-tg-theme-text-color max-w-[60%] text-left">{title}</h3>
        {icon && <div className="absolute bottom-4 right-4">
            {icon}
        </div>}
    </div>
</Card>