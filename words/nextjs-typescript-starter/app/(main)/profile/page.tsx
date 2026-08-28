"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { ProgressBar } from "@/components/progress-bar";
import {
  LogoutIcon,
  UserIcon,
  TargetIcon,
  BookOpenIcon,
  ChevronRightIcon,
} from "@/components/icons";
import { getStudyListAction } from "@/app/actions/study";
import type { StudySummary } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const { user, openAuth, signout } = useAuth();
  const [studyList, setStudyList] = React.useState<StudySummary[]>([]);

  React.useEffect(() => {
    if (!user) {
      setStudyList([]);
      return;
    }
    let cancelled = false;
    getStudyListAction(user.id)
      .then((list) => {
        if (!cancelled) setStudyList(list);
      })
      .catch(() => {
        if (!cancelled) setStudyList([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleLogout = React.useCallback(() => {
    signout();
    router.push("/");
  }, [signout, router]);

  return (
    <main className="px-4">
      <header className="pt-2">
        <h1 className="text-lg font-bold text-gray-900">我的</h1>
      </header>

      {!user && (
        <div className="mt-5 flex flex-col items-center rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-card">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary-500">
            <BookOpenIcon width={30} height={30} />
          </div>
          <h2 className="mt-4 text-base font-semibold text-gray-900">
            登录后开启学习之旅
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            登录后可同步学习进度，继续上次的单词书
          </p>
          <button
            type="button"
            onClick={openAuth}
            className="mt-5 w-full rounded-lg bg-primary-600 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
          >
            登录 / 注册
          </button>
        </div>
      )}

      {user && (
        <>
          <section className="mt-5 flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <UserIcon width={26} height={26} />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-semibold text-gray-900">
                {user.name || user.email}
              </h2>
              <p className="truncate text-sm text-gray-500">{user.email}</p>
            </div>
          </section>

          <section className="mt-6">
            <h2 className="mb-2 flex items-center gap-1.5 text-base font-semibold text-gray-900">
              <TargetIcon width={18} height={18} className="text-primary-600" />
              学习进度
            </h2>

            {studyList.length > 0 ? (
              <div className="space-y-3">
                {studyList.map((study) => (
                  <button
                    key={study.bookId}
                    type="button"
                    onClick={() => router.push(`/learn/${study.bookId}`)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 bg-white p-4 text-left shadow-card transition active:scale-[0.99]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {study.title}
                        </h3>
                        <span className="shrink-0 text-xs text-gray-400">
                          {study.done}/{study.total}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <ProgressBar value={study.percent} className="flex-1" />
                        <span className="text-[11px] font-medium text-gray-500">
                          {study.percent}%
                        </span>
                      </div>
                    </div>
                    <ChevronRightIcon
                      width={18}
                      height={18}
                      className="text-gray-300"
                    />
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-12 text-center">
                <TargetIcon width={32} height={32} className="text-gray-300" />
                <p className="mt-3 text-sm text-gray-400">还没有学习记录</p>
                <p className="text-xs text-gray-300">
                  从首页选择一本单词书开始吧
                </p>
              </div>
            )}
          </section>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-3 text-sm font-semibold text-red-500 transition active:scale-[0.99]"
          >
            <LogoutIcon width={18} height={18} />
            退出登录
          </button>
        </>
      )}
    </main>
  );
}
