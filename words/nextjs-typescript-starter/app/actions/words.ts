"use server";

import { getWord, getWords } from "@/lib/db/queries";
import type { Word } from "@/lib/types";

// 获取某本单词书的全部可学词条，按 wordRank 升序。
export async function getWordsAction(bookId: string): Promise<Word[]> {
  return getWords(bookId);
}

// 根据业务主键 bookId + wordId 定位单个词条（详情页使用）。
export async function getWordAction(
  bookId: string,
  wordId: string,
): Promise<Word | null> {
  return getWord(bookId, wordId);
}
