"use client"

import { usePathname, useRouter } from "next/navigation"
import * as React from "react"

import { AppSidebar } from "@/components/admin/app-sidebar"
import { useAuth } from "@/components/auth/auth-provider"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const pageTitles: Record<string, string> = {
  "/books": "单词书管理",
  "/admin-users": "管理员管理",
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isReady } = useAuth()

  React.useEffect(() => {
    if (!isReady) return
    if (!user) router.replace("/signin")
  }, [isReady, user, router])

  if (!isReady) {
    return (
      <main className="flex min-h-svh items-center justify-center">
        <span className="text-sm text-muted-foreground">加载中…</span>
      </main>
    )
  }

  if (!user) {
    return null
  }

  const title = pageTitles[pathname] ?? "单词管理后台"

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger />
          <span className="text-sm font-medium">{title}</span>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
