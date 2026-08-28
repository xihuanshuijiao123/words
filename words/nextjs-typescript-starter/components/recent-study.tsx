"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ProgressBar } from "@/components/progress-bar";
import { BookIcon, ChevronRightIcon, PlayIcon } from "@/components/icons";
import type { StudySummary } from "@/lib/types";

export function RecentStudy({ study }: { study: StudySummary }) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const handleContinue = React.useCallback(() => {
    if (loading) return;
    setLoading(true);
    router.push(`/learn/${study.bookId}`);
  }, [loading, study.bookId, router]);

  return (
    <section>
      <h2 className="mb-2 flex items-center gap-1.5 text-base font-semibold text-gray-900">
        最近学习
      </h2>
      <button
        type="button"
        onClick={handleContinue}
        className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 p-4 text-left text-white shadow-card transition active:scale-[0.99]"
      >
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20">
          {study.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={study.coverUrl}
              alt={study.title}
              className="h-full w-full rounded-xl object-cover"
            />
          ) : (
            <BookIcon width={26} height={26} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-semibold">
            {study.title}
          </h3>
          <p className="mt-1 text-xs text-white/80">
            上次学到第 {study.lastRank} / 共 {study.total} 个
          </p>
          <div className="mt-2 flex items-center gap-2">
            <ProgressBar
              value={study.percent}
              className="flex-1"
              trackClassName="bg-white/25"
              barClassName="bg-white"
            />
            <span className="text-[11px] font-medium text-white/90">
              {study.percent}%
            </span>
          </div>
        </div>

        <span className="flex shrink-0 items-center gap-1 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-primary-600">
          <PlayIcon width={14} height={14} />
          继续学习
        </span>
      </button>
    </section>
  );
}
