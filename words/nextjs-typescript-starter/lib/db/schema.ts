import {
  bigint,
  index,
  integer,
  json,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";
import type { WordContent } from "@/lib/types";

// 单词书：与数据库中的 public.books 表一一对应（该表已存在，由外部维护/播种）。
// book_id 为业务主键，例如 "PEPXiaoXue3_1"。
export const books = pgTable(
  "books",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookId: text("book_id").notNull(),
    title: text("title").notNull(),
    wordCount: integer("word_count").notNull().default(0),
    coverUrl: text("cover_url"),
    tags: text("tags").array().notNull().default([]),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [unique("books_book_id_unique").on(t.bookId)],
);

// 单词词条：与数据库中的 public.words 表一一对应（该表已存在，由外部维护/播种）。
// 列名在数据库中为驼峰（"wordRank"/"headWord"/"bookId"），故这里显式指定。
// content 为 JSON，内部结构见 WordContent 类型。
export const words = pgTable("words", {
  id: bigint("id", { mode: "number" }).primaryKey(),
  wordRank: integer("wordRank"),
  headWord: text("headWord"),
  content: json("content").$type<WordContent>(),
  bookId: text("bookId"),
});

// 复用自 words-admin 的 admin-users 表（已存在于数据库中，维护方为 words-admin 项目）。
// 这里仅声明 id 用于新建表的外键引用，完整字段由 words-admin 的 schema 负责。
export const adminUsers = pgTable("admin-users", {
  id: uuid("id").defaultRandom().primaryKey(),
});

// 书级学习进度：每个用户每本书仅一条记录，用于「最近学习」与「我的」总进度。
// 唯一约束 (user_id, book_id)；「最近学习」按 user_id + updated_at desc 取第一条。
export const studyProgress = pgTable(
  "study_progress",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    bookId: text("book_id").notNull(),
    wordId: text("word_id").notNull(),
    lastRank: integer("last_rank").notNull().default(0),
    doneCount: integer("done_count").notNull().default(0),
    // in_progress | completed
    status: text("status").notNull().default("in_progress"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("study_progress_user_book_unique").on(t.userId, t.bookId),
    index("study_progress_user_updated_idx").on(t.userId, t.updatedAt.desc()),
  ],
);

// 词级掌握状态：同一用户同一词仅一条记录，用于按词统计与后续复习调度。
// 唯一约束 (user_id, word_id)；done_count 可由 mastery 处于 learning/mastered 的词条数派生。
export const wordRecords = pgTable(
  "word_records",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => adminUsers.id, { onDelete: "cascade" }),
    bookId: text("book_id").notNull(),
    wordId: text("word_id").notNull(),
    rank: integer("rank").notNull(),
    // new(未学) | learning(学习中) | mastered(已掌握)
    mastery: text("mastery").notNull().default("new"),
    reviewCount: integer("review_count").notNull().default(0),
    lastReviewAt: timestamp("last_review_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    unique("word_records_user_word_unique").on(t.userId, t.wordId),
    index("word_records_user_book_idx").on(t.userId, t.bookId),
  ],
);
