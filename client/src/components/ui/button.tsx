import * as React from "react"
import {ButtonHTMLAttributes, forwardRef} from "react"
import {cn} from "@/lib/utils"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'ghost' | 'primary',
    size?: 'small' | 'medium' | 'large',
    wide?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({className, wide, variant = 'primary', size = 'medium', ...props}, ref) => {
        return (
            <button
                className={cn(
                    "font-normal inline-flex items-center justify-center transition-colors disabled:pointer-events-none disabled:opacity-50",
                    {
                        "h-9 text-sm px-4 rounded-sm": size === 'small',
                        "h-[48px] text-[15px] [line-height:18px] [font-weight:500] px-4 rounded-md": size === 'medium',
                    },
                    {
                        "w-full": wide,
                    },
                    {
                        "hover:bg-transparent focus-visible:outline-none focus-visible:ring-0 active:bg-transparent": variant === 'ghost',
                        "bg-tg-theme-button-color text-tg-theme-button-text-color hover:opacity-90": variant === 'primary',
                        "border border-tg-theme-button-color text-tg-theme-button-color hover:opacity-90": variant === 'default',
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
