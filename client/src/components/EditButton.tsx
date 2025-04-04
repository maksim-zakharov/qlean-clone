import {Pencil} from "lucide-react";
import {Button} from "./ui/button.tsx";
import React from "react";

export const EditButton = ({onClick}: {onClick: React.MouseEventHandler<HTMLButtonElement> | undefined}) => <Button onClick={onClick} variant="ghost" className="pr-1 text-tg-theme-button-color h-6">
    <Pencil size={20}/>
</Button>