import {
  bigint,
  integer,
  json,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

// 管理员角色: system = 系统管理员 (拥有全部权限), admin = 普通管理员
export const userRoleEnum = pgEnum("user_role", ["system", "admin"]);

// 管理员数据表, 保存管理员与系统管理员
export const adminUsers = pgTable("admin-users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("admin"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// 登录会话表, 有效期 7 天
export const adminSessions = pgTable("admin-session", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => adminUsers.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// 单词数据表, 对应 Supabase 中的 public.words 表
// id 使用 bigint 自增(identity); content 以 JSON 形式保存完整词条
export const words = pgTable("words", {
  id: bigint("id", { mode: "number" })
    .generatedByDefaultAsIdentity()
    .primaryKey(),
  wordRank: integer("wordRank"),
  headWord: text("headWord"),
  content: json("content"),
  bookId: text("bookId"),
});

// 单词书表, 保存单词书的元数据信息
// bookId 作为对外关联键, 与 words.bookId 建立逻辑关联
export const books = pgTable("books", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  wordCount: integer("word_count").notNull().default(0),
  coverUrl: text("cover_url"),
  bookId: text("book_id").notNull().unique(),
  tags: text("tags"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
