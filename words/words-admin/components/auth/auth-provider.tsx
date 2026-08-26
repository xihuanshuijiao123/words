"use client"

import * as React from "react"

import type { SessionUser } from "@/lib/auth-types"

type AuthResult = { ok: true } | { ok: false; error: string }

type AuthContextValue = {
  user: SessionUser | null
  hasAdmin: boolean
  isReady: boolean
  signup: (input: {
    name: string
    email: string
    password: string
  }) => Promise<AuthResult>
  signin: (input: {
    email: string
    password: string
  }) => Promise<AuthResult>
  signout: () => Promise<void>
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

async function refreshAuthState() {
  const res = await fetch("/api/auth/me", { cache: "no-store" })
  if (!res.ok) throw new Error("加载认证状态失败")
  const data = (await res.json()) as {
    user: SessionUser | null
    hasAdmin: boolean
  }
  return { user: data.user, hasAdmin: data.hasAdmin }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<SessionUser | null>(null)
  const [hasAdmin, setHasAdmin] = React.useState(false)
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    refreshAuthState()
      .then(({ user, hasAdmin }) => {
        setUser(user)
        setHasAdmin(hasAdmin)
      })
      .catch(() => {
        // 网络或后端异常时, 保持未登录并放行至守卫逻辑
      })
      .finally(() => setIsReady(true))
  }, [])

  const signup = React.useCallback(
    async ({
      name,
      email,
      password,
    }: {
      name: string
      email: string
      password: string
    }): Promise<AuthResult> => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (!res.ok) return { ok: false, error: (data.error as string) ?? "注册失败" }
      setHasAdmin(true)
      return { ok: true }
    },
    []
  )

  const signin = React.useCallback(
    async ({
      email,
      password,
    }: {
      email: string
      password: string
    }): Promise<AuthResult> => {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok || !data.user) {
        return { ok: false, error: (data.error as string) ?? "登录失败" }
      }
      setUser(data.user as SessionUser)
      setHasAdmin(true)
      return { ok: true }
    },
    []
  )

  const signout = React.useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setUser(null)
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, hasAdmin, isReady, signup, signin, signout }),
    [user, hasAdmin, isReady, signup, signin, signout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
