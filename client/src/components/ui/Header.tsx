import {FC} from "react";

export const Header: FC<any> = ({isWebApp, children}: any) =>
    <header className={`fixed top-0 left-0 right-0 ${isWebApp ? "pt-[env(safe-area-inset-top)]" : "pt-2"} z-10 bg-tg-theme-secondary-bg-color flex-none px-4 pb-2`}>

            {children}
</header>