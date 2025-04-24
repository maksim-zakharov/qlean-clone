import {FC} from "react";
import {cn} from "../../lib/utils.ts";

export const Header: FC<any> = ({children, className}: any) =>
    <header className="relative">
        <div className="h-[56px]"/>
        <div
            className={cn("fixed top-0 left-0 right-0 h-[56px] content-center z-10 root-bg-color flex-none px-4 pb-2",className)}>
            {children}
        </div>
    </header>