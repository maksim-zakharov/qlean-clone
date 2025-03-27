import {FC} from "react";

export const Header: FC<any> = ({children}: any) =>
    <header
        className={`fixed top-0 left-0 right-0 h-[56px] content-center separator-shadow-bottom pt-[calc(8px+env(safe-area-inset-top))] z-10 bg-tg-theme-secondary-bg-color flex-none px-4 pb-2`}>

        {children}
    </header>