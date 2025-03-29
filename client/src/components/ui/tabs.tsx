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
      className={cn("w-full h-[50px] [display:contents] content-center bg-tg-theme-secondary-bg-color separator-shadow-bottom no-scrollbar overflow-x-auto [&::-webkit-scrollbar]:hidden", className)}
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
        "min-w-fit p-0 bg-transparent flex h-full",
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
        "group px-4 text-[15px] [line-height:18px] font-medium text-tg-theme-hint-color data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-tg-theme-button-color",
        className
      )}
      {...props}
    >
      <span className="relative inline-block whitespace-nowrap">
        {props.children}
        <span className="absolute left-0 right-0 bottom-[-16px] h-[2px] bg-tg-theme-button-color opacity-0 group-data-[state=active]:opacity-100" />
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

export { Tabs, TabsList, TabsTrigger, TabsContent }
