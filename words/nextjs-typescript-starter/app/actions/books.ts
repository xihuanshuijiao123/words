"use server";

import { getBook, getBooks } from "@/lib/db/queries";
import type { Book } from "@/lib/types";

export { getBooks };

export async function getBookAction(bookId: string): Promise<Book | null> {
  return getBook(bookId);
}
