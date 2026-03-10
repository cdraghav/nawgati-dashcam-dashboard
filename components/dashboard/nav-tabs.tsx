"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboardIcon, AlertTriangleIcon, RadioIcon, BarChart2Icon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

const navItems = [
  { href: "/overview", label: "Overview", icon: LayoutDashboardIcon },
  { href: "/violations", label: "Violations", icon: AlertTriangleIcon },
  { href: "/analytics", label: "Analytics", icon: BarChart2Icon },
  { href: "/live", label: "Live Map", icon: RadioIcon },
]

export function NavTabs() {
  const pathname = usePathname()
  const { open } = useSidebar()

  if (open) return null

  return (
    <nav
      data-slot="nav-tabs"
      className="flex items-center gap-1 overflow-x-auto border-b bg-card px-4 scrollbar-none"
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="size-3.5" />
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
