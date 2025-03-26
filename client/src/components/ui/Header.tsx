import {FC} from "react";

export const Header: FC<any> = ({isWebApp, children}: any) =>
    <header className="fixed top-0 left-0 right-0 bg-white border-t shadow-lg pt-[env(safe-area-inset-top)] z-10">
        <div
            className={`flex-none bg-tg-theme-section-bg-color px-4 pt-2 pb-2 z-10`}>
            {children}
        </div>
</header>