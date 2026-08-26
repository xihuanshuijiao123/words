import { NextResponse } from "next/server";
import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { hashPassword } from "@/lib/password";
import { getSessionUser } from "@/lib/session";

// 校验当前登录用户必须是系统管理员
async function authorize() {
  const session = await getSessionUser();
  if (!session) return { error: "未登录" as const, status: 401 as const };
  if (session.role !== "system")
    return { error: "无权限" as const, status: 403 as const };
  return { session };
}

export async function GET() {
  const auth = await authorize();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const users = await db
    .select({
      id: adminUsers.id,
      name: adminUsers.name,
      email: adminUsers.email,
      role: adminUsers.role,
      createdAt: adminUsers.createdAt,
    })
    .from(adminUsers)
    .orderBy(asc(adminUsers.createdAt));

  return NextResponse.json({ users });
}

export async function POST(request: Request) {
  const auth = await authorize();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: { name?: string; email?: string; password?: string; role?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;
  const role = body.role === "system" ? "system" : "admin";

  if (!name || !email || !password) {
    return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
  }

  const existing = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email),
  });
  if (existing) {
    return NextResponse.json({ error: "该邮箱已被注册" }, { status: 409 });
  }

  const [user] = await db
    .insert(adminUsers)
    .values({ name, email, passwordHash: hashPassword(password), role })
    .returning({ id: adminUsers.id });

  return NextResponse.json({ ok: true, user: { id: user.id } });
}
