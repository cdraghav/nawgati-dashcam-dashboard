"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { AppHeader } from "@/components/dashboard/app-header"
import { NavTabs } from "@/components/dashboard/nav-tabs"
import { SidebarProvider } from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)
  const hasHydrated = useAuthStore((s) => s._hasHydrated)

  React.useEffect(() => {
    if (hasHydrated && !user) {
      router.replace("/login")
    }
  }, [hasHydrated, user, router])

  if (!hasHydrated || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden">
      <SidebarProvider>
        <AppSidebar />

        <div className="flex flex-1 flex-col min-w-0">
          <AppHeader />
          <NavTabs />

          <main className="flex flex-1 flex-col min-h-0 overflow-hidden bg-background">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  )
}