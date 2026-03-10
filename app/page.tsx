"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/auth-store"

export default function Page() {
  const router = useRouter()
  const user = useAuthStore((s) => s.user)

  React.useEffect(() => {
    if (user) {
      router.replace("/overview")
    } else {
      router.replace("/login")
    }
  }, [user, router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
    </div>
  )
}
