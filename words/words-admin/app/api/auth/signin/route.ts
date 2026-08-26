import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { verifyPassword } from "@/lib/password";
import { createSession } from "@/lib/session";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json({ error: "请填写邮箱和密码" }, { status: 400 });
  }

  const user = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email),
  });
  if (!user) {
    return NextResponse.json({ error: "该邮箱尚未注册" }, { status: 401 });
  }
  if (!verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "密码错误" }, { status: 401 });
  }

  await createSession(user.id);

  return NextResponse.json({
    ok: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}
