import * as React from "react";
import {cn} from "../../lib/utils.ts";

export const List = ({children, className}: React.ComponentProps<"div">) => <div
    className={cn("bg-tg-theme-section-bg-color rounded-2xl overflow-hidden", className)}>
    {Array.isArray(children) ? children.map((option, index) => <div
        className={`flex items-center px-4 py-3 ${index !== children.length - 1 && 'border-b border-tg-theme-section-separator-color'}`}>
        {option}
    </div>) : <div
        className={`flex items-center px-4 py-3`}>
        {children}
    </div>}
</div>