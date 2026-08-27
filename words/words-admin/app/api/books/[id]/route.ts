import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { books, words } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/session";

async function authorize() {
  const session = await getSessionUser();
  if (!session) return { error: "未登录" as const, status: 401 as const };
  return { session };
}

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const auth = await authorize();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const target = await db.query.books.findFirst({
    where: eq(books.id, id),
  });
  if (!target) {
    return NextResponse.json({ error: "单词书不存在" }, { status: 404 });
  }

  let body: {
    title?: string;
    wordCount?: number;
    coverUrl?: string;
    bookId?: string;
    tags?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const title = body.title?.trim() ?? target.title;
  const wordCount = body.wordCount ?? target.wordCount;
  const coverUrl = body.coverUrl?.trim() ?? target.coverUrl;
  const bookId = body.bookId?.trim() ?? target.bookId;
  const tags = body.tags?.trim() ?? target.tags;

  if (!title || typeof wordCount !== "number") {
    return NextResponse.json(
      { error: "标题、单词数量为必填项" },
      { status: 400 },
    );
  }

  // bookId 变更时校验唯一性 (排除自身)
  if (body.bookId && bookId !== target.bookId) {
    const existing = await db.query.books.findFirst({
      where: eq(books.bookId, bookId),
    });
    if (existing) {
      return NextResponse.json(
        { error: "该 bookId 已存在, 请更换" },
        { status: 409 },
      );
    }
  }

  await db
    .update(books)
    .set({
      title,
      wordCount,
      coverUrl,
      bookId,
      tags,
      updatedAt: new Date(),
    })
    .where(eq(books.id, id));

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const auth = await authorize();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const target = await db.query.books.findFirst({
    where: eq(books.id, id),
  });
  if (!target) {
    return NextResponse.json({ error: "单词书不存在" }, { status: 404 });
  }

  // 在事务中同时删除 books 表记录与 words 表中相同 bookId 的所有数据
  await db.transaction(async (tx) => {
    await tx.delete(words).where(eq(words.bookId, target.bookId));
    await tx.delete(books).where(eq(books.id, id));
  });

  return NextResponse.json({ ok: true });
}
