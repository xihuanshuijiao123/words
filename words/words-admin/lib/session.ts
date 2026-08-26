import { randomBytes } from "crypto";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

import type { SessionUser } from "@/lib/auth-types";
import { db } from "@/lib/db";
import { adminSessions, adminUsers } from "@/lib/db/schema";

export const SESSION_COOKIE_NAME = "admin_session_token";
const SESSION_VALID_DAYS = 7;
const SESSION_MS = SESSION_VALID_DAYS * 24 * 60 * 60 * 1000;

// 创建会话: 生成随机 token 写入 DB, 并通过 HttpOnly Cookie 下发, 有效期 7 天
export async function createSession(userId: string) {
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MS);

  await db.insert(adminSessions).values({ userId, token, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

// 从 Cookie 中解析当前登录用户, 过期的会话自动清理
export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const session = await db.query.adminSessions.findFirst({
    where: eq(adminSessions.token, token),
  });

  if (!session || session.expiresAt.getTime() <= Date.now()) {
    if (session) {
      await db.delete(adminSessions).where(eq(adminSessions.id, session.id));
    }
    return null;
  }

  const user = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.id, session.userId),
  });
  if (!user) return null;

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

// 销毁当前会话并清除 Cookie
export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (token) {
    await db.delete(adminSessions).where(eq(adminSessions.token, token));
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

// 判断是否已存在管理员数据 (用于首个系统管理员注册的判断)
export async function hasAdminUsers(): Promise<boolean> {
  const rows = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .limit(1);
  return rows.length > 0;
}
