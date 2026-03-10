"use client"

import * as React from "react"
import { LoginForm } from "@/components/auth/login-form"
import { LottiePanel } from "@/components/auth/lottie-panel"
import { AuthBackgroundShape } from "@/components/auth/auth-background-shape"

export default function LoginPage() {
  const [hasError, setHasError] = React.useState(false)

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-muted/30 px-4 py-10 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center opacity-60">
        <AuthBackgroundShape />
      </div>
      <div className="relative z-10 flex w-full max-w-md flex-col items-center">
        <LottiePanel hasError={hasError} />
        <LoginForm onValidationError={setHasError} />
      </div>
    </div>
  )
}
