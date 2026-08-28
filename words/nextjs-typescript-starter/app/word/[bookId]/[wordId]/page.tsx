import * as React from "react";
import Link from "next/link";
import { AudioButton } from "@/components/audio-button";
import { ArrowLeftIcon } from "@/components/icons";
import { getWord } from "@/lib/db/queries";
import type { Word } from "@/lib/types";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-card">
      <h2 className="flex items-center gap-1.5 text-sm font-semibold text-gray-900">
        <span className="h-3.5 w-1 rounded-full bg-primary-500" />
        {title}
      </h2>
      <div className="mt-3 text-[15px] text-gray-700">{children}</div>
    </section>
  );
}

export default async function WordDetailPage({
  params,
}: {
  params: { bookId: string; wordId: string };
}) {
  const { bookId, wordId } = params;
  const word: Word | undefined = (await getWord(bookId, wordId)) ?? undefined;
  const detail = word?.content.word.content;

  if (!word) {
    return (
      <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-50 text-center">
        <p className="text-lg font-semibold text-gray-900">词条不存在</p>
        <p className="mt-1 text-sm text-gray-500">未找到该单词</p>
        <Link
          href="/"
          className="mt-6 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white"
        >
          返回首页
        </Link>
      </div>
    );
  }

  const head = word.headWord || word.content.word.wordHead;
  const trans = detail?.trans ?? [];
  const sentences = detail?.sentence?.sentences ?? [];
  const phrases = detail?.phrase?.phrases ?? [];
  const synos = detail?.syno?.synos ?? [];
  const rels = detail?.relWord?.rels ?? [];

  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-md bg-gray-50 pb-10">
      {/* 顶部导航 */}
      <header className="sticky top-0 z-10 flex items-center gap-3 bg-white px-4 py-3 shadow-sm">
        <Link
          href={`/learn/${bookId}`}
          aria-label="返回学习"
          className="flex h-9 items-center gap-1 rounded-full px-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
        >
          <ArrowLeftIcon width={20} height={20} />
          返回学习
        </Link>
      </header>

      {/* 单词头 */}
      <div className="px-4 pt-4">
        <div className="rounded-3xl bg-white p-6 text-center shadow-card">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            {head}
          </h1>
          <div className="mt-2 flex items-center justify-center gap-3 text-gray-500">
            {detail?.ukphone && <span>/{detail.ukphone}/</span>}
            {detail?.usphone && <span>/{detail.usphone}/</span>}
          </div>
          <div className="mt-4 flex items-center justify-center gap-3">
            {detail?.ukspeech && (
              <AudioButton
                speech={detail.ukspeech}
                label="英"
                className="px-3 py-1.5"
              />
            )}
            {detail?.usspeech && (
              <AudioButton
                speech={detail.usspeech}
                label="美"
                className="px-3 py-1.5"
              />
            )}
          </div>
        </div>
      </div>

      {/* 内容区 */}
      <div className="mt-4 space-y-3 px-4">
        {trans.length > 0 && (
          <Section title="释义">
            <ul className="space-y-2">
              {trans.map((t, i) => (
                <li key={i}>
                  <div className="font-medium text-gray-900">
                    {t.tranCn || t.descCn}
                  </div>
                  {t.tranOther && (
                    <p className="mt-0.5 text-sm text-gray-500">
                      {t.tranOther}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {sentences.length > 0 && (
          <Section title="例句">
            <ul className="space-y-3">
              {sentences.map((s, i) => (
                <li key={i}>
                  <p className="text-gray-900">{s.sContent}</p>
                  {s.sCn && (
                    <p className="mt-0.5 text-sm text-gray-500">{s.sCn}</p>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {phrases.length > 0 && (
          <Section title="短语">
            <ul className="space-y-2">
              {phrases.map((p, i) => (
                <li key={i}>
                  <span className="font-medium text-gray-900">
                    {p.pContent}
                  </span>
                  {p.pCn && (
                    <span className="ml-2 text-sm text-gray-500">{p.pCn}</span>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {synos.length > 0 && (
          <Section title="同近">
            <ul className="space-y-2">
              {synos.map((s, i) => (
                <li key={i}>
                  <span className="text-xs font-medium text-gray-400">
                    {s.pos}
                  </span>
                  <p className="text-sm text-gray-500">{s.tran}</p>
                  {s.hwds && s.hwds.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {s.hwds.map((h, j) => (
                        <span
                          key={j}
                          className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
                        >
                          {h.w}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {rels.length > 0 && (
          <Section title="同根">
            <ul className="space-y-2">
              {rels.map((r, i) => (
                <li key={i}>
                  <span className="text-xs font-medium text-gray-400">
                    {r.pos}
                  </span>
                  <ul className="mt-1 space-y-1">
                    {(r.words ?? []).map((w, j) => (
                      <li key={j} className="text-sm">
                        <span className="font-medium text-gray-900">
                          {w.hwd}
                        </span>
                        <span className="ml-2 text-gray-500">{w.tran}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {detail?.remMethod?.val && (
          <Section title="记忆">
            <p className="text-sm text-gray-700">{detail.remMethod.val}</p>
          </Section>
        )}
      </div>
    </div>
  );
}
