"use client";

import * as React from "react";

import type { Book } from "@/lib/books";
import { PencilIcon, PlusIcon, SearchIcon, Trash2Icon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type BookForm = {
  title: string;
  wordCount: string;
  coverUrl: string;
  bookId: string;
  tags: string;
};

const emptyForm: BookForm = {
  title: "",
  wordCount: "",
  coverUrl: "",
  bookId: "",
  tags: "",
};

export default function BooksPage() {
  const [books, setBooks] = React.useState<Book[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [listError, setListError] = React.useState("");
  const [search, setSearch] = React.useState("");

  const [formOpen, setFormOpen] = React.useState(false);
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<BookForm>(emptyForm);
  const [formError, setFormError] = React.useState("");
  const [pending, setPending] = React.useState(false);

  const [deleteTarget, setDeleteTarget] = React.useState<Book | null>(null);

  const fetchBooks = React.useCallback(async () => {
    setLoading(true);
    setListError("");
    try {
      const res = await fetch("/api/books", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        setListError(data.error ?? "加载失败");
        return;
      }
      setBooks(data.books ?? []);
    } catch {
      setListError("网络异常");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setFormError("");
    setFormOpen(true);
  }

  function openEdit(book: Book) {
    setEditingId(book.id);
    setForm({
      title: book.title,
      wordCount: String(book.wordCount),
      coverUrl: book.coverUrl ?? "",
      bookId: book.bookId,
      tags: book.tags ?? "",
    });
    setFormError("");
    setFormOpen(true);
  }

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setFormError("");

    const title = form.title.trim();
    const wordCount = Number(form.wordCount);
    const bookId = form.bookId.trim();

    if (!title) {
      setFormError("请输入标题");
      return;
    }
    if (!bookId) {
      setFormError("请输入 bookId");
      return;
    }
    if (Number.isNaN(wordCount) || wordCount < 0) {
      setFormError("请输入有效的单词数量");
      return;
    }

    setPending(true);
    const payload = {
      title,
      wordCount,
      coverUrl: form.coverUrl.trim(),
      bookId,
      tags: form.tags.trim(),
    };

    const res = await fetch(
      editingId ? `/api/books/${editingId}` : "/api/books",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = await res.json();
    setPending(false);

    if (!res.ok) {
      setFormError(data.error ?? "操作失败");
      return;
    }
    setFormOpen(false);
    fetchBooks();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/books/${deleteTarget.id}`, {
      method: "DELETE",
    });
    setDeleteTarget(null);
    if (res.ok) fetchBooks();
  }

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

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
          placeholder="搜索单词书标题"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>封面</TableHead>
              <TableHead>标题</TableHead>
              <TableHead className="text-right">单词数量</TableHead>
              <TableHead>bookId</TableHead>
              <TableHead>标签</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  加载中…
                </TableCell>
              </TableRow>
            ) : listError ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-destructive"
                >
                  {listError}
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  暂无单词书
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((book) => {
                const tagList =
                  book.tags
                    ?.split(",")
                    .map((t) => t.trim())
                    .filter(Boolean) ?? [];
                return (
                  <TableRow key={book.id}>
                    <TableCell>
                      {book.coverUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={book.coverUrl}
                          alt={book.title}
                          className="h-12 w-12 rounded-md object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-xs text-muted-foreground">
                          无封面
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {book.wordCount.toLocaleString()}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {book.bookId}
                    </TableCell>
                    <TableCell>
                      {tagList.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tagList.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
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
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? "编辑单词书" : "新增单词书"}</DialogTitle>
            <DialogDescription>
              填写单词书的信息，带 * 为必填项。标签使用逗号分隔。
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSave} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="book-title">
                标题 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="book-title"
                placeholder="例如：考研英语 5500 词"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
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
                onChange={(e) =>
                  setForm({ ...form, wordCount: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="book-cover-url">封面 URL</Label>
              <Input
                id="book-cover-url"
                placeholder="https://example.com/cover.png"
                value={form.coverUrl}
                onChange={(e) =>
                  setForm({ ...form, coverUrl: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="book-book-id">
                bookId <span className="text-destructive">*</span>
              </Label>
              <Input
                id="book-book-id"
                placeholder="例如：PEPXiaoXue3_1"
                value={form.bookId}
                onChange={(e) => setForm({ ...form, bookId: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="book-tags">标签（逗号分隔）</Label>
              <Input
                id="book-tags"
                placeholder="例如：K12,小学生,人教版"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
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
              <Button type="submit" disabled={pending}>
                {pending ? "保存中…" : editingId ? "保存" : "创建"}
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
            <DialogTitle>删除单词书</DialogTitle>
            <DialogDescription>
              确定要删除「{deleteTarget?.title}」吗？此操作无法撤销。
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
  );
}
