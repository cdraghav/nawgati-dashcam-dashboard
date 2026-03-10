import * as React from "react"
import { cn } from "@/lib/utils"

export function BentoGrid({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-3 gap-2 md:auto-rows-[18rem]",
        className
      )}
    >
      {children}
    </div>
  )
}

export function BentoGridItem({
  className,
  header,
}: {
  className?: string
  header?: React.ReactNode
}) {
  return (
    <div className={cn("row-span-1 rounded-xl group/bento", className)}>
      {header}
    </div>
  )
}
