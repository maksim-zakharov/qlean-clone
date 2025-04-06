import {ReactNode} from "react";
import {Card} from "./ui/card.tsx";
import {cn} from "../lib/utils.ts";
import {Typography} from "./ui/Typography.tsx";

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
        <Typography.Title className="max-w-[calc(100%-56px)]">{title}</Typography.Title>
        {icon && <div className="absolute bottom-4 right-4">
            {icon}
        </div>}
    </div>
</Card>