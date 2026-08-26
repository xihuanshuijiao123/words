import { readFileSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// drizzle-kit 是独立 CLI，不会自动加载 Next 的 .env，这里手动读取。
function loadEnv() {
  try {
    const raw = readFileSync(".env", "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (m) process.env[m[1]] = m[2];
    }
  } catch {
    // 没有 .env 时忽略
  }
}
loadEnv();

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
    ssl: { rejectUnauthorized: false },
  },
});
