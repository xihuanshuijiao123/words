"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { BookIcon, ChevronRightIcon } from "@/components/icons";
import type { Book } from "@/lib/types";

export function BookCard({ book }: { book: Book }) {
  const router = useRouter();
  const { user, openAuth, setPendingBook } = useAuth();
  const [loading, setLoading] = React.useState(false);

  const handleClick = React.useCallback(() => {
    if (loading) return;
    if (!user) {
      // 未登录：记录待学习的书，切到「我的」并弹出登录弹窗
      setPendingBook(book.bookId);
      openAuth();
      router.push("/profile");
      return;
    }
    setLoading(true);
    router.push(`/learn/${book.bookId}`);
  }, [loading, user, book.bookId, router, setPendingBook, openAuth]);

  return (
    <button
      type="button"
      onClick={handleClick}
      className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-3 text-left shadow-card transition active:scale-[0.99]"
    >
      <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-500">
        {book.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full rounded-xl object-cover"
          />
        ) : (
          <BookIcon width={30} height={30} />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-gray-900">
          {book.title}
        </h3>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-gray-500">
          <span>{book.wordCount} 词</span>
          {book.tags ? (
            <>
              <span className="h-1 w-1 rounded-full bg-gray-300" />
              <span className="truncate">{book.tags}</span>
            </>
          ) : null}
        </div>
      </div>

      <ChevronRightIcon width={18} height={18} className="text-gray-300" />
    </button>
  );
}
