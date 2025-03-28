import React from "react";

export const BottomActions = ({children}: React.ComponentProps<'div'>) => <div
    className="separator-shadow-top bg-tg-theme-section-bg-color flex-none p-4 pb-[calc(env(safe-area-inset-bottom,0px)+12px)]">
    {children}
</div>