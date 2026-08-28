import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// 复用 drizzle.config.ts 的取数逻辑：优先 POSTGRES_URL，兼容 DATABASE_URL。
const connectionString =
  process.env.POSTGRES_URL ?? process.env.DATABASE_URL ?? "";

// supabase pooler 需要 SSL，与 drizzle.config.ts 保持一致。
const client = postgres(connectionString, {
  ssl: { rejectUnauthorized: false },
});

export const db = drizzle(client, { schema });
