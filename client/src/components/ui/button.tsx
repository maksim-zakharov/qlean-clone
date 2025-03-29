import * as React from "react"
import { cn } from "@/lib/utils"
import { ButtonHTMLAttributes, forwardRef } from "react"

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <button
        className={cn(
          "h-11 text-base font-normal inline-flex items-center justify-center rounded-xl transition-colors disabled:pointer-events-none disabled:opacity-50 px-4",
          {
            "hover:bg-transparent focus-visible:outline-none focus-visible:ring-0 active:bg-transparent": variant === 'ghost',
            "bg-tg-theme-button-color text-tg-theme-button-text-color hover:opacity-90": variant === 'default',
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

export { Button }
