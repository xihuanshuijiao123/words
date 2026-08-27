import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// 解析拼接在一起的多个 JSON 对象。
// 兼容三种格式: JSON Lines(每行一个对象) / 单个 JSON 数组 / 多个缩进对象直接拼接(如本文件)。
// 通过跟踪花括号深度来切分每个顶层对象, 并忽略字符串内部的括号。
function parseObjects(text) {
  const objects = [];
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === '"') inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      continue;
    }
    if (ch === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (ch === "}") {
      if (depth > 0) {
        depth--;
        if (depth === 0 && start >= 0) {
          const slice = text.slice(start, i + 1).trim();
          if (slice) objects.push(JSON.parse(slice));
          start = -1;
        }
      }
    }
  }
  return objects;
}

// CSV 转义: 含逗号/双引号/换行时用双引号包裹, 并把内部双引号转义为两个双引号
function csvEscape(value) {
  const s = String(value ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// 脚本位于 <项目>/scripts/ 下, 项目根目录为上一级
const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(__dirname, "..");

const DEFAULT_INPUT = join(projectRoot, "temp", "PEPXiaoXue3_1.json");
const DEFAULT_OUTPUT = join(projectRoot, "统计", "PEPXiaoXue3_1.csv");

// 用法: node scripts/json2csv.mjs [输入.json] [输出.csv]
const input = resolve(process.argv[2] ?? DEFAULT_INPUT);
const output = resolve(process.argv[3] ?? DEFAULT_OUTPUT);

const raw = readFileSync(input, "utf8");
const objects = parseObjects(raw);

const headers = ["wordRank", "headWord", "content", "bookId"];
const lines = [headers.join(",")];
for (const obj of objects) {
  lines.push(
    [
      obj.wordRank,
      obj.headWord,
      JSON.stringify(obj.content),
      obj.bookId,
    ]
      .map(csvEscape)
      .join(",")
  );
}

// 输出目录不存在则创建
mkdirSync(dirname(output), { recursive: true });
// 加 UTF-8 BOM, 方便 Excel 直接打开中文
writeFileSync(output, "\uFEFF" + lines.join("\n"), "utf8");

console.log(`共处理 ${objects.length} 个单词`);
console.log(`已写入: ${output}`);
