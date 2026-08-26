"use client"

import * as React from "react"

import { generateId } from "@/lib/auth"
import { type WordBook, readBooks, seedBooks, writeBooks } from "@/lib/books"
import { PlusIcon, SearchIcon, PencilIcon, Trash2Icon } from "lucide-react"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const languages = ["英语", "中文", "日语", "韩语", "法语"]

type BookForm = {
  name: string
  description: string
  language: string
  wordCount: string
}

const emptyForm: BookForm = {
  name: "",
  description: "",
  language: languages[0],
  wordCount: "",
}

function formatDate(iso: string) {
  const date = new Date(iso)
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date)
}

export default function BooksPage() {
  const [books, setBooks] = React.useState<WordBook[]>([])
  const [search, setSearch] = React.useState("")
  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<WordBook | null>(null)
  const [form, setForm] = React.useState<BookForm>(emptyForm)
  const [formError, setFormError] = React.useState("")
  const [deleteTarget, setDeleteTarget] = React.useState<WordBook | null>(null)

  React.useEffect(() => {
    setBooks(seedBooks())
  }, [])

  function persist(nextBooks: WordBook[]) {
    writeBooks(nextBooks)
    setBooks(nextBooks)
  }

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setFormError("")
    setFormOpen(true)
  }

  function openEdit(book: WordBook) {
    setEditing(book)
    setForm({
      name: book.name,
      description: book.description,
      language: book.language,
      wordCount: String(book.wordCount),
    })
    setFormError("")
    setFormOpen(true)
  }

  function handleSave(event: React.FormEvent) {
    event.preventDefault()
    setFormError("")

    const name = form.name.trim()
    const wordCount = Number(form.wordCount)

    if (!name) {
      setFormError("请输入单词书名称")
      return
    }
    if (!form.language) {
      setFormError("请选择语言")
      return
    }
    if (Number.isNaN(wordCount) || wordCount < 0) {
      setFormError("请输入有效的单词数量")
      return
    }

    if (editing) {
      const next = books.map((b) =>
        b.id === editing.id
          ? {
              ...b,
              name,
              description: form.description.trim(),
              language: form.language,
              wordCount,
            }
          : b
      )
      persist(next)
    } else {
      const book: WordBook = {
        id: generateId(),
        name,
        description: form.description.trim(),
        language: form.language,
        wordCount,
        createdAt: new Date().toISOString(),
      }
      persist([book, ...books])
    }
    setFormOpen(false)
  }

  function confirmDelete() {
    if (!deleteTarget) return
    persist(books.filter((b) => b.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  const filtered = books.filter((b) =>
    b.name.toLowerCase().includes(search.trim().toLowerCase())
  )

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">单词书管理</h1>
          <p className="text-sm text-muted-foreground">管理已创建的单词书</p>
        </div>
        <Button onClick={openCreate}>
          <PlusIcon />
          新增单词书
        </Button>
      </div>

      <div className="relative w-full max-w-sm">
        <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-8"
          placeholder="搜索单词书名称"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>名称</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>语言</TableHead>
              <TableHead className="text-right">单词数</TableHead>
              <TableHead>创建时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                  暂无单词书
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.name}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {book.description || "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{book.language}</Badge>
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {book.wordCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(book.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => openEdit(book)}
                        aria-label="编辑"
                        title="编辑"
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => setDeleteTarget(book)}
                        aria-label="删除"
                        title="删除"
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "编辑单词书" : "新增单词书"}</DialogTitle>
            <DialogDescription>
              填写单词书的基本信息，带 * 为必填项。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="book-name">
                名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="book-name"
                placeholder="例如：考研英语 5500 词"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="book-description">描述</Label>
              <Input
                id="book-description"
                placeholder="简单描述这本单词书"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="book-language">
                语言 <span className="text-destructive">*</span>
              </Label>
              <select
                id="book-language"
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="book-word-count">
                单词数量 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="book-word-count"
                type="number"
                min={0}
                placeholder="例如：5500"
                value={form.wordCount}
                onChange={(e) => setForm({ ...form, wordCount: e.target.value })}
              />
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
                onClick={() => setFormOpen(false)}
              >
                取消
              </Button>
              <Button type="submit">{editing ? "保存" : "创建"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除单词书</DialogTitle>
            <DialogDescription>
              确定要删除「{deleteTarget?.name}」吗？此操作无法撤销。
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
