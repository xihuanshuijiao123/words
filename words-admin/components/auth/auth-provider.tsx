"use client"

import * as React from "react"

import {
  type AdminUser,
  type Session,
  clearSession,
  generateId,
  readSession,
  readUsers,
  writeSession,
  writeUsers,
} from "@/lib/auth"

type AuthResult = { ok: true } | { ok: false; error: string }

type AuthContextValue = {
  user: Session | null
  users: AdminUser[]
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
  signout: () => void
  removeUser: (email: string) => void
}

const AuthContext = React.createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<Session | null>(null)
  const [users, setUsers] = React.useState<AdminUser[]>([])
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const session = readSession()
    const registered = readUsers()
    setUser(session)
    setUsers(registered)
    setIsReady(true)
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
      const registered = readUsers()
      const normalizedEmail = email.trim().toLowerCase()
      if (registered.some((u) => u.email.toLowerCase() === normalizedEmail)) {
        return { ok: false, error: "该邮箱已被注册" }
      }
      const nextUser: AdminUser = {
        id: generateId(),
        name: name.trim(),
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
      }
      const nextUsers = [...registered, nextUser]
      writeUsers(nextUsers)
      setUsers(nextUsers)
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
      const registered = readUsers()
      const normalizedEmail = email.trim().toLowerCase()
      const matched = registered.find(
        (u) => u.email.toLowerCase() === normalizedEmail
      )
      if (!matched) {
        return { ok: false, error: "该邮箱尚未注册" }
      }
      if (matched.password !== password) {
        return { ok: false, error: "密码错误" }
      }
      const session: Session = {
        id: matched.id,
        name: matched.name,
        email: matched.email,
      }
      writeSession(session)
      setUser(session)
      return { ok: true }
    },
    []
  )

  const signout = React.useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const removeUser = React.useCallback((email: string) => {
    const nextUsers = readUsers().filter(
      (u) => u.email.toLowerCase() !== email.toLowerCase()
    )
    writeUsers(nextUsers)
    setUsers(nextUsers)
  }, [])

  const value = React.useMemo<AuthContextValue>(
    () => ({ user, users, isReady, signup, signin, signout, removeUser }),
    [user, users, isReady, signup, signin, signout, removeUser]
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
