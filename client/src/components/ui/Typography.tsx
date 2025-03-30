import React from "react";
import {cn} from "../../lib/utils.ts";

const TypographyH2 = ({children}: React.ComponentProps<'div'>) => {

    return <h2 className="text-xl font-bold mb-3 text-tg-theme-text-color text-left">
        {children}
    </h2>
}

const TypographyTitle = ({children, className}: React.ComponentProps<'div'>) => <span
    className={cn("text-base font-medium text-tg-theme-text-color", className)}>{children}</span>

const TypographyDescription = ({children}: React.ComponentProps<'div'>) => <span
    className="text-xs text-tg-theme-hint-color">{children}</span>

const Typography = () => {
    return <></>
}

Typography.Title = TypographyTitle;
Typography.Description = TypographyDescription;
Typography.H2 = TypographyH2;

export {Typography};