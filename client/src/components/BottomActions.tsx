import React from "react";
import {cn} from "../lib/utils.ts";

export const BottomActions = ({children, className}: React.ComponentProps<'div'>) => <div
    className={cn("separator-shadow-top fixed bottom-0 left-0 right-0 card-bg-color-transparency [backdrop-filter:blur(5px)] flex-none p-4 py-3", className)}>
    {children}
</div>