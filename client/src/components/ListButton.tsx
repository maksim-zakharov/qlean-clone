import {Typography} from "./ui/Typography.tsx";
import {Card} from "./ui/card.tsx";
import React, {FC, ReactNode} from "react";

interface IProps {
    text: ReactNode;
    extra?: ReactNode;
    icon?: ReactNode;
}

export const ListButton: FC<IProps & React.ComponentProps<'div'>> = ({text, extra, icon, ...props}) => {

    return <Card className="p-0 gap-0" {...props}>
        <div className="p-4 py-2 flex justify-between items-center">
            <div className="flex flex-col">
                <Typography.Title className="flex font-normal [line-height:28px]">{icon ? <div className="mr-4 h-7 w-7">{icon}</div> : undefined}{text}</Typography.Title>
            </div>
            {extra}
        </div>
    </Card>
}

export const ListButtonGroup: FC = ({children}: React.ComponentProps<'div'>) => <div
    className="[&>*:first-child]:rounded-b-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:last-child]:rounded-t-none">
    {children}
</div>