"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { StudyCard } from "@/components/study-card";
import { useAuth } from "@/components/auth-provider";
import { ArrowLeftIcon, CheckIcon } from "@/components/icons";
import { getStudyAction, recordStudyAction } from "@/app/actions/study";
import { getBookAction } from "@/app/actions/books";
import { getWordsAction } from "@/app/actions/words";
import type { Book, StudySummary, Word } from "@/lib/types";

export default function LearnPage({ params }: { params: { bookId: string } }) {
  const { bookId } = params;
  const router = useRouter();
  const { user } = useAuth();
  const userId = user?.id ?? "";

  const [book, setBook] = React.useState<Book | null>(null);
  const [words, setWords] = React.useState<Word[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [study, setStudyState] = React.useState<StudySummary | null>(null);
  const [index, setIndex] = React.useState(0);

  // 从真实 words 表加载整本单词书的词条（64/130 词）、书籍信息与学习进度，并从上次进度继续。
  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      getBookAction(bookId),
      getWordsAction(bookId),
      getStudyAction(userId, bookId),
    ])
      .then(([b, w, s]) => {
        if (cancelled) return;
        setBook(b);
        setWords(w);
        setStudyState(s);
        // 从上次学到的下一个单词开始；无进度则从第一个开始
        const start = Math.max(0, (s?.lastRank ?? 0) - 1);
        setIndex(Math.min(start, Math.max(0, w.length - 1)));
        setLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setWords([]);
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [bookId, userId]);

  const word: Word | undefined = words[index];
  const total = words.length;
  const completed = study?.status === "completed" || index >= total;

  // 学习到某词时记录进度（异步写库）
  React.useEffect(() => {
    if (!word || !userId) return;
    let cancelled = false;
    recordStudyAction(userId, bookId, word.wordRank, word.content.word.wordId)
      .then((s) => {
        if (!cancelled && s) setStudyState(s);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [bookId, word, userId]);

  const goNext = React.useCallback(() => {
    if (!word || !userId) return;
    if (index >= total - 1) return; // 已是最后一个
    const next = index + 1;
    setIndex(next);
    recordStudyAction(
      userId,
      bookId,
      words[next].wordRank,
      words[next].content.word.wordId,
    )
      .then((s) => {
        if (s) setStudyState(s);
      })
      .catch(() => {});
  }, [index, total, word, bookId, words, userId]);

  const goPrev = React.useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  return (
    <div className="mx-auto flex min-h-[100dvh] w-full max-w-md flex-col bg-gray-50">
      {/* 顶部导航：返回 + 书名 + 进度 */}
      <header className="flex items-center gap-3 bg-white px-4 py-3 shadow-sm">
        <Link
          href="/"
          aria-label="返回首页"
          className="flex h-9 w-9 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
        >
          <ArrowLeftIcon width={22} height={22} />
        </Link>
        <h1 className="min-w-0 flex-1 truncate text-center text-base font-semibold text-gray-900">
          {book?.title ?? "学习"}
        </h1>
        <span className="shrink-0 text-sm text-gray-500">
          {total > 0 ? `${Math.min(index + 1, total)} / ${total}` : ""}
        </span>
      </header>

      {/* 卡片主体 */}
      <div className="flex flex-1 flex-col justify-center px-4 py-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center text-center">
            <p className="text-sm text-gray-500">正在加载单词…</p>
          </div>
        ) : !word ? (
          <div className="flex flex-col items-center justify-center text-center">
            <CheckIcon width={44} height={44} className="text-primary-500" />
            <h2 className="mt-4 text-lg font-semibold text-gray-900">
              {total === 0 ? "没有可学习的单词" : "本册已全部学完"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {total === 0 ? "该单词书暂无词条" : "恭喜你完成本册的学习！"}
            </p>
            {total > 0 && (
              <button
                type="button"
                onClick={() => setIndex(0)}
                className="mt-6 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
              >
                重新学习
              </button>
            )}
          </div>
        ) : (
          <StudyCard
            word={word}
            onDetail={() =>
              router.push(`/word/${bookId}/${word.content.word.wordId}`)
            }
          />
        )}
      </div>

      {/* 底部操作 */}
      {word && (
        <div className="sticky bottom-0 flex gap-3 bg-white px-4 py-4 shadow-nav pb-[calc(env(safe-area-inset-bottom)+1rem)]">
          <button
            type="button"
            onClick={goPrev}
            disabled={index <= 0}
            className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition active:scale-[0.99] disabled:opacity-40"
          >
            上一个
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={index >= total - 1}
            className="flex flex-1 items-center justify-center rounded-xl bg-primary-600 py-3 text-sm font-semibold text-white transition hover:bg-primary-700 active:scale-[0.99] disabled:opacity-40"
          >
            {index >= total - 1 ? "已学完" : "下一个"}
          </button>
        </div>
      )}
    </div>
  );
}
