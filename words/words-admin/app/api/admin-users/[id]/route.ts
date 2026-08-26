import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { hashPassword } from "@/lib/password";
import { getSessionUser } from "@/lib/session";

async function authorize() {
  const session = await getSessionUser();
  if (!session) return { error: "未登录" as const, status: 401 as const };
  if (session.role !== "system")
    return { error: "无权限" as const, status: 403 as const };
  return { session };
}

// 统计系统管理员数量, 用于避免清空系统管理员导致无法登录
async function countSystemAdmins() {
  const rows = await db
    .select({ id: adminUsers.id })
    .from(adminUsers)
    .where(eq(adminUsers.role, "system"));
  return rows.length;
}

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const auth = await authorize();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const target = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.id, id),
  });
  if (!target) {
    return NextResponse.json({ error: "管理员不存在" }, { status: 404 });
  }

  let body: {
    name?: string;
    email?: string;
    password?: string;
    role?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }

  const name = body.name?.trim() ?? target.name;
  const email = body.email?.trim().toLowerCase() ?? target.email;
  const role =
    body.role === "system"
      ? "system"
      : body.role === "admin"
        ? "admin"
        : target.role;
  const passwordHash = body.password
    ? hashPassword(body.password)
    : target.passwordHash;

  if (email !== target.email) {
    const existing = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.email, email),
    });
    if (existing) {
      return NextResponse.json({ error: "该邮箱已被注册" }, { status: 409 });
    }
  }

  // 禁止把最后一个系统管理员降级, 避免系统失去管理员
  if (target.role === "system" && role !== "system") {
    const count = await countSystemAdmins();
    if (count <= 1) {
      return NextResponse.json(
        { error: "必须至少保留一名系统管理员" },
        { status: 400 }
      );
    }
  }

  await db
    .update(adminUsers)
    .set({ name, email, passwordHash, role })
    .where(eq(adminUsers.id, id));

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const auth = await authorize();
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  if (auth.session.id === id) {
    return NextResponse.json(
      { error: "不能删除当前登录账户" },
      { status: 400 }
    );
  }

  const target = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.id, id),
  });
  if (!target) {
    return NextResponse.json({ error: "管理员不存在" }, { status: 404 });
  }

  if (target.role === "system") {
    const count = await countSystemAdmins();
    if (count <= 1) {
      return NextResponse.json(
        { error: "必须至少保留一名系统管理员" },
        { status: 400 }
      );
    }
  }

  await db.delete(adminUsers).where(eq(adminUsers.id, id));

  return NextResponse.json({ ok: true });
}
