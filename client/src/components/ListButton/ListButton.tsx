import {Typography} from "../ui/Typography.tsx";
import {Card} from "../ui/card.tsx";
import React, {FC, ReactNode} from "react";
import './ListButton.css'

interface IProps {
    text: ReactNode;
    extra?: ReactNode;
    icon?: ReactNode;
}

export const ListButton: FC<IProps & React.ComponentProps<'div'>> = ({text, extra, icon, ...props}) => <Card
    className="p-0 gap-0 ListButton" {...props}>
    <div className="flex justify-between items-center">
        <div className="flex flex-col w-full">
            <Typography.Title className="flex font-normal [line-height:28px] w-full">{icon ?
                <div className="mr-4 h-7 w-7 my-2">{icon}</div> : undefined}<span
                className="inner-text py-2 w-full text-left">{text}</span></Typography.Title>
        </div>
        {extra}
    </div>
</Card>

export const ListButtonGroup: FC = ({children}: React.ComponentProps<'div'>) => <div
    className="[&>*:first-child]:rounded-b-none [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:last-child]:rounded-t-none ListButtonGroup">
    {children}
</div>