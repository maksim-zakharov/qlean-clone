import {FC} from "react";

export const Header: FC<any> = ({isWebApp, children}: any) => <div
    className={`flex-none bg-tg-theme-section-bg-color px-4 ${isWebApp ? 'pt-[env(safe-area-inset-top,8px)]' : 'pt-2'} pb-2 z-10 border-b border-tg-theme-section-separator-color`}>
    {children}
</div>