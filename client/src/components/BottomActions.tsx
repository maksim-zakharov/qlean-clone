import React from "react";
import {cn} from "../lib/utils.ts";

export const BottomActions = ({children, className}: React.ComponentProps<'div'>) => <div
    className={cn("separator-shadow-top fixed bottom-0 left-0 right-0 card-bg-color-transparency [backdrop-filter:blur(5px)] flex-none p-4 py-3 pb-[calc(env(safe-area-inset-bottom,0px)/2+12px)]", className)}>
    {children}
</div>