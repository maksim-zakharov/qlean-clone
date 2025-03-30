import * as React from "react"
import {ButtonHTMLAttributes, forwardRef} from "react"
import {cn} from "@/lib/utils"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost' | 'primary',
    size?: 'small' | 'medium' | 'large',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, variant = 'primary', size = 'medium', ...props}, ref) => {
        return (
            <button
                className={cn(
                    "font-normal inline-flex items-center justify-center rounded-xl transition-colors disabled:pointer-events-none disabled:opacity-50",
                    {
                        "h-9 text-sm px-4": size === 'small',
                        "h-11 text-base px-4": size === 'medium',
                    },
                    {
                        "hover:bg-transparent focus-visible:outline-none focus-visible:ring-0 active:bg-transparent": variant === 'ghost',
                        "bg-tg-theme-button-color text-tg-theme-button-text-color hover:opacity-90": variant === 'primary',
                        "bg-tg-theme-button-color-transparent text-tg-theme-button-color hover:opacity-90": variant === 'default',
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export {Button}
