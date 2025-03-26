import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

function Tabs({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
      <TabsPrimitive.Root
          data-slot="tabs"
          className={cn("flex flex-col gap-2 bg-tg-theme-section-bg-color overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full", className)}
          {...props}
      />
  )
}

function TabsList({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px] min-w-fit h-auto p-0 bg-transparent border-b border-tg-theme-section-separator-color flex",
        className
      )}
      {...props}
    />
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
      <TabsPrimitive.Trigger
          data-slot="tabs-trigger"
          className={cn(
              "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group px-6 py-3 text-[17px] font-medium text-tg-theme-hint-color data-[state=active]:text-tg-theme-button-color data-[state=active]:bg-transparent data-[state=active]:shadow-none",
              className
          )}
          {...props}
      >
                  <span className="relative inline-block whitespace-nowrap">
                    {props.name}
                    <span
                        className="absolute left-0 right-0 bottom-[-8px] h-[2px] bg-current opacity-0 group-data-[state=active]:opacity-100"/>
                  </span>
      </TabsPrimitive.Trigger>
  )
}

function TabsContent({
                       className,
                       ...props
                     }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
      <TabsPrimitive.Content
          data-slot="tabs-content"
          className={cn("flex-1 outline-none", className)}
          {...props}
      />
  )
}

export {Tabs, TabsList, TabsTrigger, TabsContent }
