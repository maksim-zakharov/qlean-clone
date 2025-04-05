// Общий компонент для пустых состояний
import {Typography} from "./ui/Typography.tsx";

export function EmptyState({
                               icon,
                               title,
                               description,
                               action
                           }: {
    icon: React.ReactNode
    title: string
    description: string
    action?: React.ReactNode
}) {
    return (
        <div className="flex flex-1 flex-col items-center justify-center p-4 text-center">
            <div className="text-muted-foreground mb-4 rounded-[50%] card-bg-color text-tg-theme-button-text-color p-4">{icon}</div>
            <Typography.Title className="text-center flex flex-col mb-4">{title}<Typography.Description>{description}</Typography.Description></Typography.Title>
            {action}
        </div>
    )
}