import { create } from "zustand"
import { persist } from "zustand/middleware"

type AuthUser = {
  name: string
  email: string
  role: string
}

type AuthStore = {
  user: AuthUser | null
  _hasHydrated: boolean
  login: (email: string, password: string) => boolean
  logout: () => void
}

const CREDENTIALS = {
  email: "admin@nawgati.com",
  password: "nawgati@123",
}

const ADMIN_USER: AuthUser = {
  name: "Admin User",
  email: "admin@nawgati.com",
  role: "Fleet Administrator",
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      _hasHydrated: false,

      login: (email, password) => {
        if (
          email.toLowerCase() === CREDENTIALS.email &&
          password === CREDENTIALS.password
        ) {
          set({ user: ADMIN_USER })
          return true
        }
        return false
      },

      logout: () => {
        set({ user: null })
      },
    }),
    {
      name: "visuals-auth",
      onRehydrateStorage: () => (state) => {
        if (state) state._hasHydrated = true
      },
    }
  )
)
