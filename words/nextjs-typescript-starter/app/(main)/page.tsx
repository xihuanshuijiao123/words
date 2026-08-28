"use client";

import * as React from "react";
import { useAuth } from "@/components/auth-provider";
import { BookCard } from "@/components/book-card";
import { RecentStudy } from "@/components/recent-study";
import { BookOpenIcon } from "@/components/icons";
import { getRecentStudyAction } from "@/app/actions/study";
import { getBooks } from "@/app/actions/books";
import type { Book, StudySummary } from "@/lib/types";

export default function HomePage() {
  const { user } = useAuth();
  const [books, setBooks] = React.useState<Book[]>([]);
  const [booksLoading, setBooksLoading] = React.useState(true);
  const [recentStudy, setRecentStudy] = React.useState<StudySummary | null>(
    null,
  );

  // 从数据库 books 表获取全部单词书
  React.useEffect(() => {
    let cancelled = false;
    getBooks()
      .then((data) => {
        if (!cancelled) setBooks(data);
      })
      .catch(() => {
        if (!cancelled) setBooks([]);
      })
      .finally(() => {
        if (!cancelled) setBooksLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // 从数据库 study_progress 表获取最近学习进度
  React.useEffect(() => {
    if (!user) {
      setRecentStudy(null);
      return;
    }
    let cancelled = false;
    getRecentStudyAction(user.id)
      .then((study) => {
        if (!cancelled) setRecentStudy(study);
      })
      .catch(() => {
        if (!cancelled) setRecentStudy(null);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  return (
    <main className="px-4">
      <header className="mb-5 flex items-center gap-2 pt-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary-600 text-white">
          <BookOpenIcon width={20} height={20} />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight text-gray-900">
            学英语单词
          </h1>
          <p className="text-xs text-gray-500">卡片式背单词，每日进步一点点</p>
        </div>
      </header>

      {user && recentStudy && (
        <div className="mb-6">
          <RecentStudy study={recentStudy} />
        </div>
      )}

      <section>
        <h2 className="mb-2 flex items-center gap-1.5 text-base font-semibold text-gray-900">
          全部单词书
        </h2>

        {booksLoading ? (
          <div className="flex items-center justify-center py-16 text-sm text-gray-400">
            加载中...
          </div>
        ) : books.length > 0 ? (
          <div className="space-y-3">
            {books.map((book) => (
              <BookCard key={book.bookId} book={book} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <BookOpenIcon width={40} height={40} className="text-gray-300" />
            <p className="mt-3 text-sm text-gray-400">暂无单词书</p>
          </div>
        )}
      </section>
    </main>
  );
}
