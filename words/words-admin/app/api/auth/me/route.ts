import { NextResponse } from "next/server";

import { getSessionUser, hasAdminUsers } from "@/lib/session";

export async function GET() {
  const [user, hasAdmin] = await Promise.all([
    getSessionUser(),
    hasAdminUsers(),
  ]);
  return NextResponse.json({ user, hasAdmin });
}
