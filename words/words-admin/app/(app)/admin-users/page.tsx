"use client"

import * as React from "react"

import { useAuth } from "@/components/auth/auth-provider"
import type { AdminRole } from "@/lib/auth-types"
import { PencilIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type AdminRecord = {
  id: string
  name: string
  email: string
  role: AdminRole
  createdAt: string
}

const roleLabel: Record<AdminRole, string> = {
  system: "系统管理员",
  admin: "普通管理员",
}

const roleVariant: Record<AdminRole, "default" | "secondary"> = {
  system: "default",
  admin: "secondary",
}

function formatDate(iso: string) {
  const date = new Date(iso)
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

type FormState = {
  name: string
  email: string
  password: string
  role: AdminRole
}

const emptyForm: FormState = {
  name: "",
  email: "",
  password: "",
  role: "admin",
}

export default function AdminUsersPage() {
  const { user } = useAuth()

  const [users, setUsers] = React.useState<AdminRecord[]>([])
  const [loading, setLoading] = React.useState(true)
  const [listError, setListError] = React.useState("")

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingId, setEditingId] = React.useState<string | null>(null)
  const [form, setForm] = React.useState<FormState>(emptyForm)
  const [formError, setFormError] = React.useState("")
  const [pending, setPending] = React.useState(false)

  const [deleteTarget, setDeleteTarget] = React.useState<AdminRecord | null>(
    null
  )

  const isSystemAdmin = user?.role === "system"

  const fetchUsers = React.useCallback(async () => {
    setLoading(true)
    setListError("")
    try {
      const res = await fetch("/api/admin-users", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) {
        setListError(data.error ?? "加载失败")
        return
      }
      setUsers(data.users ?? [])
    } catch {
      setListError("网络异常")
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    if (isSystemAdmin) fetchUsers()
  }, [isSystemAdmin, fetchUsers])

  function openCreate() {
    setEditingId(null)
    setForm(emptyForm)
    setFormError("")
    setDialogOpen(true)
  }

  function openEdit(admin: AdminRecord) {
    setEditingId(admin.id)
    setForm({
      name: admin.name,
      email: admin.email,
      password: "",
      role: admin.role,
    })
    setFormError("")
    setDialogOpen(true)
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setFormError("")

    if (!form.name.trim()) {
      setFormError("请输入姓名")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setFormError("请输入有效的邮箱地址")
      return
    }
    if (editingId) {
      if (form.password && form.password.length < 6) {
        setFormError("新密码至少需要 6 位")
        return
      }
    } else if (form.password.length < 6) {
      setFormError("密码至少需要 6 位")
      return
    }

    setPending(true)
    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      ...(form.password ? { password: form.password } : {}),
    }

    const res = await fetch(
      editingId ? `/api/admin-users/${editingId}` : "/api/admin-users",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    )
    const data = await res.json()
    setPending(false)

    if (!res.ok) {
      setFormError(data.error ?? "操作失败")
      return
    }
    setDialogOpen(false)
    fetchUsers()
  }

  async function confirmDelete() {
    if (!deleteTarget) return
    const res = await fetch(`/api/admin-users/${deleteTarget.id}`, {
      method: "DELETE",
    })
    setDeleteTarget(null)
    if (res.ok) fetchUsers()
  }

  if (user && !isSystemAdmin) {
    return (
      <div className="grid gap-4">
        <h1 className="text-2xl font-semibold">管理员管理</h1>
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          您没有权限访问该功能。
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">管理员管理</h1>
          <p className="text-sm text-muted-foreground">管理系统管理员账户</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          新增管理员
        </Button>
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>邮箱</TableHead>
              <TableHead>角色</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  加载中…
                </TableCell>
              </TableRow>
            ) : listError ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-destructive"
                >
                  {listError}
                </TableCell>
              </TableRow>
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-muted-foreground"
                >
                  暂无管理员
                </TableCell>
              </TableRow>
            ) : (
              users.map((admin) => {
                const isSelf =
                  admin.id === user?.id ||
                  admin.email.toLowerCase() === user?.email.toLowerCase()
                return (
                  <TableRow key={admin.id}>
                    <TableCell className="font-medium">
                      {admin.name}
                      {isSelf && (
                        <Badge variant="secondary" className="ml-2">
                          当前登录
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[admin.role]}>
                        {roleLabel[admin.role]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(admin.createdAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(admin)}
                        aria-label="编辑"
                        title="编辑"
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        disabled={isSelf}
                        onClick={() => setDeleteTarget(admin)}
                        aria-label="删除"
                        title={isSelf ? "不能删除当前登录账户" : "删除"}
                      >
                        <Trash2Icon />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setFormError("")
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "编辑管理员" : "新增管理员"}</DialogTitle>
            <DialogDescription>
              {editingId
                ? "修改管理员信息，密码留空表示不修改。"
                : "创建一个新的管理员账户。"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="admin-name">姓名</Label>
              <Input
                id="admin-name"
                placeholder="请输入姓名"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-email">邮箱</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-password">密码</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder={editingId ? "留空则不修改" : "至少 6 位"}
                value={form.password}
                onChange={(e) =>
                  setForm((f) => ({ ...f, password: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="admin-role">角色</Label>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    role: (v as AdminRole) ?? f.role,
                  }))
                }
              >
                <SelectTrigger id="admin-role" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">系统管理员</SelectItem>
                  <SelectItem value="admin">普通管理员</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formError && (
              <p className="text-sm text-destructive" role="alert">
                {formError}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
              >
                取消
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "保存中…" : "保存"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除管理员</DialogTitle>
            <DialogDescription>
              确定要删除管理员「{deleteTarget?.name}」吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              取消
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
