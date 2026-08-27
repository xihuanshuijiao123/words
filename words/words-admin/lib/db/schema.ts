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
