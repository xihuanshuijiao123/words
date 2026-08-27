import { readFileSync, writeFileSync } from "node:fs";
import { dirname, basename, resolve } from "node:path";

// 用法: node json-to-csv.mjs <输入.json> [输出.csv]
// 默认读取当前目录下 PEPXiaoXue3_1.json, 输出到同级目录同名 .csv
const input = resolve(process.argv[2] ?? "PEPXiaoXue3_1.json");
const output = process.argv[3]
  ? resolve(process.argv[3])
  : resolve(dirname(input), basename(input, ".json") + ".csv");

// 按行解析 JSON Lines, 跳过空行
const raw = readFileSync(input, "utf8");
const objects = raw
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => JSON.parse(line));

// CSV 转义: 含逗号/双引号/换行时用引号包裹并把内部引号转义为两个引号
function csvEscape(value) {
  const s = String(value ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

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

// 加 UTF-8 BOM, 方便 Excel 直接打开中文
writeFileSync(output, "\uFEFF" + lines.join("\n"), "utf8");

console.log(`共处理 ${objects.length} 行`);
console.log(`已写入: ${output}`);
