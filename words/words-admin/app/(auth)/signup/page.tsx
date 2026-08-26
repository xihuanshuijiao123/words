"use client"

import { useRouter } from "next/navigation"
import * as React from "react"

import { useAuth } from "@/components/auth/auth-provider"
import { BookOpenIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignupPage() {
  const router = useRouter()
  const { signup, hasAdmin, user, isReady } = useAuth()

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const [error, setError] = React.useState("")
  const [pending, setPending] = React.useState(false)

  // 已有管理员数据或已登录时, 不允许二次注册系统管理员
  React.useEffect(() => {
    if (!isReady) return
    if (user) {
      router.replace("/books")
    } else if (hasAdmin) {
      router.replace("/signin")
    }
  }, [isReady, user, hasAdmin, router])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("请输入姓名")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("请输入有效的邮箱地址")
      return
    }
    if (password.length < 6) {
      setError("密码至少需要 6 位")
      return
    }
    if (password !== confirm) {
      setError("两次输入的密码不一致")
      return
    }

    setPending(true)
    const result = await signup({ name, email, password })
    setPending(false)

    if (!result.ok) {
      setError(result.error)
      return
    }
    router.replace("/signin")
  }

  return (
    <Card className="w-full">
      <CardHeader className="items-center text-center">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BookOpenIcon className="size-5" />
        </div>
        <CardTitle className="text-xl">系统管理员注册</CardTitle>
        <CardDescription>首次注册将创建系统管理员账户</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              placeholder="请输入姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              placeholder="至少 6 位"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm">确认密码</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="再次输入密码"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? "注册中…" : "注册"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
