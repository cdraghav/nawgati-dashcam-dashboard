"use client"

import { useAuthStore } from "@/lib/auth-store"

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const login = useAuthStore((s) => s.login)
  const logout = useAuthStore((s) => s.logout)

  return {
    user,
    isAuthenticated: user !== null,
    login,
    logout,
  }
}
