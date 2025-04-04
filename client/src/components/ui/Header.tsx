import {FC} from "react";

export const Header: FC<any> = ({children}: any) =>
    <header
        className={`fixed top-0 left-0 right-0 h-[56px] content-center pt-[calc(8px+env(safe-area-inset-top))] z-10 root-bg-color flex-none px-4 pb-2`}>

        {children}
    </header>