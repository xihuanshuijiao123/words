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

function SigninForm() {
  const router = useRouter()
  const { signin, hasAdmin, user, isReady } = useAuth()

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [pending, setPending] = React.useState(false)

  // 无管理员数据时去注册; 已登录则直接进入后台
  React.useEffect(() => {
    if (!isReady) return
    if (!hasAdmin) {
      router.replace("/signup")
    } else if (user) {
      router.replace("/books")
    }
  }, [isReady, hasAdmin, user, router])

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError("")

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("请输入有效的邮箱地址")
      return
    }
    if (!password) {
      setError("请输入密码")
      return
    }

    setPending(true)
    const result = await signin({ email, password })
    setPending(false)

    if (!result.ok) {
      setError(result.error)
      return
    }
    router.replace("/books")
  }

  return (
    <Card className="w-full">
      <CardHeader className="items-center text-center">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BookOpenIcon className="size-5" />
        </div>
        <CardTitle className="text-xl">管理员登录</CardTitle>
        <CardDescription>登录以管理单词书与管理员</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="grid gap-4">
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
              placeholder="请输入密码"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
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
            {pending ? "登录中…" : "登录"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default function SigninPage() {
  return (
    <React.Suspense
      fallback={<div className="flex justify-center p-10">加载中…</div>}
    >
      <SigninForm />
    </React.Suspense>
  )
}
