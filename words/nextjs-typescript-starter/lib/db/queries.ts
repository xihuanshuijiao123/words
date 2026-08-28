import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { books, studyProgress, words } from "@/lib/db/schema";
import type { Book, StudySummary, Word, WordContent } from "@/lib/types";

function mapBook(row: {
  id: string;
  bookId: string;
  title: string;
  wordCount: number;
  coverUrl: string | null;
  tags: string[];
}): Book {
  return {
    id: row.id,
    bookId: row.bookId,
    title: row.title,
    wordCount: row.wordCount,
    coverUrl: row.coverUrl,
    // 数据库存的是 text[]，前端 mock 用逗号分隔字符串，这里保持一致。
    tags: row.tags.length > 0 ? row.tags.join(",") : null,
  };
}

function mapWord(row: {
  id: number;
  wordRank: number | null;
  headWord: string | null;
  content: WordContent | null;
  bookId: string | null;
}): Word {
  return {
    id: row.id,
    wordRank: row.wordRank ?? 0,
    headWord: row.headWord ?? "",
    bookId: row.bookId ?? "",
    content: row.content as WordContent,
  };
}

// 从数据库 books 表获取全部单词书，按业务主键 book_id 升序排列。
export async function getBooks(): Promise<Book[]> {
  const rows = await db.select().from(books).orderBy(books.bookId);
  return rows.map(mapBook);
}

export async function getBook(bookId: string): Promise<Book | null> {
  const [row] = await db
    .select()
    .from(books)
    .where(eq(books.bookId, bookId))
    .limit(1);
  return row ? mapBook(row) : null;
}

// 获取某本单词书的全部词条，按 wordRank 升序（即学习顺序）。
export async function getWords(bookId: string): Promise<Word[]> {
  const rows = await db
    .select()
    .from(words)
    .where(eq(words.bookId, bookId))
    .orderBy(words.wordRank);
  return rows.map(mapWord);
}

// 根据业务主键 bookId + content.word.wordId 定位单个词条。
export async function getWord(
  bookId: string,
  wordId: string,
): Promise<Word | null> {
  const [row] = await db
    .select()
    .from(words)
    .where(
      and(
        eq(words.bookId, bookId),
        sql`${words.content}->'word'->>'wordId' = ${wordId}`,
      ),
    )
    .limit(1);
  return row ? mapWord(row) : null;
}

// ---------- 学习进度 (public.study_progress) ----------

// mock 认证的前端用户 id（如 "u-1"）不是 uuid，无法直接作为 study_progress.user_id 外键。
// 这里把固定的演示用户映射到真实 admin-users 中的一行；若传入的已是合法 uuid 则原样返回。
const DEMO_USER_UUID = "b250bb2a-9026-43bf-86c3-19aa96d37a65"; // admin-users 中的 admin 用户
const MOCK_USER_TO_DB: Record<string, string> = {
  "u-1": DEMO_USER_UUID,
};

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value,
  );
}

// 将前端 user.id 解析为可用于外键的 admin-users.id，无法解析时返回 null。
function resolveUserId(userId: string): string | null {
  if (!userId) return null;
  return MOCK_USER_TO_DB[userId] ?? (isUuid(userId) ? userId : null);
}

function makeStudySummary(row: {
  bookId: string;
  title: string;
  wordCount: number;
  coverUrl: string | null;
  lastRank: number;
  doneCount: number;
  status: string;
  updatedAt: Date;
}): StudySummary {
  const total = row.wordCount;
  const percent = total > 0 ? Math.round((row.doneCount / total) * 100) : 0;
  const completed =
    row.status === "completed" || (total > 0 && row.lastRank >= total);
  return {
    bookId: row.bookId,
    title: row.title,
    coverUrl: row.coverUrl,
    total,
    done: row.doneCount,
    percent,
    lastRank: row.lastRank,
    nextRank: completed ? 1 : row.lastRank + 1,
    status: completed ? "completed" : "in_progress",
    updatedAt: new Date(row.updatedAt).toISOString(),
  };
}

// 查询某用户某本书的进度；无记录返回 null。
export async function getStudy(
  userId: string,
  bookId: string,
): Promise<StudySummary | null> {
  const uid = resolveUserId(userId);
  if (!uid) return null;
  const [row] = await db
    .select({
      bookId: studyProgress.bookId,
      title: books.title,
      wordCount: books.wordCount,
      coverUrl: books.coverUrl,
      lastRank: studyProgress.lastRank,
      doneCount: studyProgress.doneCount,
      status: studyProgress.status,
      updatedAt: studyProgress.updatedAt,
    })
    .from(studyProgress)
    .innerJoin(books, eq(studyProgress.bookId, books.bookId))
    .where(and(eq(studyProgress.userId, uid), eq(studyProgress.bookId, bookId)))
    .limit(1);
  return row ? makeStudySummary(row) : null;
}

// 查询某用户全部学习进度，按最近学习时间倒序。
export async function getStudyList(userId: string): Promise<StudySummary[]> {
  const uid = resolveUserId(userId);
  if (!uid) return [];
  const rows = await db
    .select({
      bookId: studyProgress.bookId,
      title: books.title,
      wordCount: books.wordCount,
      coverUrl: books.coverUrl,
      lastRank: studyProgress.lastRank,
      doneCount: studyProgress.doneCount,
      status: studyProgress.status,
      updatedAt: studyProgress.updatedAt,
    })
    .from(studyProgress)
    .innerJoin(books, eq(studyProgress.bookId, books.bookId))
    .where(eq(studyProgress.userId, uid))
    .orderBy(desc(studyProgress.updatedAt));
  return rows.map(makeStudySummary);
}

// 最近学习的一条进度，取 getStudyList 的第一条。
export async function getRecentStudy(
  userId: string,
): Promise<StudySummary | null> {
  return (await getStudyList(userId))[0] ?? null;
}

// 记录/更新某用户某本书的进度。lastRank 与 doneCount 取历史最大值，status 按是否学完该册更新。
export async function recordStudy(
  userId: string,
  bookId: string,
  wordRank: number,
  wordId: string,
): Promise<StudySummary | null> {
  const uid = resolveUserId(userId);
  if (!uid) return null;
  const [book] = await db
    .select({ wordCount: books.wordCount })
    .from(books)
    .where(eq(books.bookId, bookId))
    .limit(1);
  const total = book?.wordCount ?? 0;
  const completed = total > 0 && wordRank >= total;
  await db
    .insert(studyProgress)
    .values({
      userId: uid,
      bookId,
      wordId,
      lastRank: wordRank,
      doneCount: wordRank,
      status: completed ? "completed" : "in_progress",
    })
    .onConflictDoUpdate({
      target: [studyProgress.userId, studyProgress.bookId],
      set: {
        wordId,
        lastRank: sql`GREATEST(${studyProgress.lastRank}, ${wordRank})`,
        doneCount: sql`GREATEST(${studyProgress.doneCount}, ${wordRank})`,
        status: completed ? "completed" : "in_progress",
        updatedAt: new Date(),
      },
    });
  return getStudy(userId, bookId);
}
