import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { hashPassword } from "@/lib/password";
import { hasAdminUsers } from "@/lib/session";

export async function POST(request: Request) {
  let body: { name?: string; email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "请填写完整信息" }, { status: 400 });
  }

  // 已存在管理员数据时, 禁止二次注册系统管理员
  if (await hasAdminUsers()) {
    return NextResponse.json(
      { error: "系统管理员已存在，不允许二次注册" },
      { status: 403 }
    );
  }

  const existing = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email),
  });
  if (existing) {
    return NextResponse.json({ error: "该邮箱已被注册" }, { status: 409 });
  }

  const [user] = await db
    .insert(adminUsers)
    .values({
      name,
      email,
      passwordHash: hashPassword(password),
      role: "system", // 首个注册的用户固定为系统管理员
    })
    .returning({ id: adminUsers.id });

  return NextResponse.json({ ok: true, user: { id: user.id } });
}
