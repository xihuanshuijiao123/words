"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { useAuth } from "@/components/auth/auth-provider"

export default function HomePage() {
  const router = useRouter()
  const { user, hasAdmin, isReady } = useAuth()

  React.useEffect(() => {
    if (!isReady) return
    if (!hasAdmin) {
      router.replace("/signup")
    } else if (user) {
      router.replace("/books")
    } else {
      router.replace("/signin")
    }
  }, [isReady, hasAdmin, user, router])

  return (
    <main className="flex min-h-svh items-center justify-center">
      <span className="text-sm text-muted-foreground">跳转中…</span>
    </main>
  )
}
