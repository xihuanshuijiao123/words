import { generateId } from "@/lib/auth"

export type WordBook = {
  id: string
  name: string
  description: string
  language: string
  wordCount: number
  createdAt: string
}

export const BOOKS_STORAGE_KEY = "words_admin_books"

export function readBooks(): WordBook[] {
  if (typeof window === "undefined") return []
  try {
    const raw = window.localStorage.getItem(BOOKS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as WordBook[]) : []
  } catch {
    return []
  }
}

export function writeBooks(books: WordBook[]) {
  window.localStorage.setItem(BOOKS_STORAGE_KEY, JSON.stringify(books))
}

export function seedBooks(): WordBook[] {
  const existing = readBooks()
  if (existing.length > 0) return existing
  const books: WordBook[] = [
    {
      id: generateId(),
      name: "考研英语 5500 词",
      description: "考研英语核心词汇，覆盖历年真题高频词。",
      language: "英语",
      wordCount: 5500,
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: "大学英语六级词汇",
      description: "六级考试大纲要求掌握的全部词汇。",
      language: "英语",
      wordCount: 4500,
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: "日语 N1 核心词汇",
      description: "JLPT N1 等级核心词汇表。",
      language: "日语",
      wordCount: 2000,
      createdAt: new Date().toISOString(),
    },
    {
      id: generateId(),
      name: "雅思高频词汇",
      description: "雅思听说读写高频词整理。",
      language: "英语",
      wordCount: 3200,
      createdAt: new Date().toISOString(),
    },
  ]
  writeBooks(books)
  return books
}
