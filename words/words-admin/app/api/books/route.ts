import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { books } from "@/lib/db/schema";
import { getSessionUser } from "@/lib/session";

// 校验当前登录用户
async function authorize() {
  const session = await getSessionUser();
  if (!session) return { error: "未登录" as const, status: 401 as const };
  return { session };
}

export async function GET() {
  const auth = await authorize();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const list = await db
    .select({
      id: books.id,
      title: books.title,
      wordCount: books.wordCount,
      coverUrl: books.coverUrl,
      bookId: books.bookId,
      tags: books.tags,
      createdAt: books.createdAt,
      updatedAt: books.updatedAt,
    })
    .from(books)
    .orderBy(asc(books.createdAt));

  return NextResponse.json({ books: list });
}

export async function POST(request: Request) {
  const auth = await authorize();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
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

  const title = body.title?.trim();
  const wordCount = body.wordCount;
  const coverUrl = body.coverUrl?.trim();
  const bookId = body.bookId?.trim();
  const tags = body.tags?.trim();

  if (!title || !bookId || typeof wordCount !== "number") {
    return NextResponse.json(
      { error: "标题、单词数量、bookId 为必填项" },
      { status: 400 },
    );
  }

  // bookId 必须唯一, 用于与 words 表建立关联
  const existing = await db.query.books.findFirst({
    where: eq(books.bookId, bookId),
  });
  if (existing) {
    return NextResponse.json(
      { error: "该 bookId 已存在, 请更换" },
      { status: 409 },
    );
  }

  const [book] = await db
    .insert(books)
    .values({ title, wordCount, coverUrl, bookId, tags })
    .returning({ id: books.id });

  return NextResponse.json({ ok: true, book: { id: book.id } });
}
