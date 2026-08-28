"use client";

import * as React from "react";
import { AudioButton } from "@/components/audio-button";
import { ChevronRightIcon } from "@/components/icons";
import type { Word } from "@/lib/types";

export function StudyCard({
  word,
  onDetail,
}: {
  word: Word;
  onDetail?: () => void;
}) {
  const content = word.content.word.content;
  const head = word.headWord || word.content.word.wordHead;
  const usphone = content?.usphone;
  const usspeech = content?.usspeech;
  const tranCn = content?.trans?.[0]?.tranCn;
  const sentence = content?.sentence?.sentences?.[0];

  return (
    <div className="rounded-3xl bg-white p-6 shadow-card">
      <div className="text-center">
        <h2 className="text-4xl font-bold tracking-tight text-gray-900">
          {head}
        </h2>
        {usphone && (
          <p className="mt-2 text-lg text-gray-500">/{usphone}/</p>
        )}
        {usspeech && (
          <div className="mt-3 flex justify-center">
            <AudioButton speech={usspeech} className="px-3 py-1.5" />
          </div>
        )}
      </div>

      {tranCn && (
        <div className="mt-6">
          <p className="text-lg font-medium text-gray-800">{tranCn}</p>
        </div>
      )}

      {sentence && (
        <div className="mt-6 rounded-2xl bg-gray-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            例句
          </p>
          <p className="mt-1.5 text-[15px] text-gray-800">{sentence.sContent}</p>
          {sentence.sCn && (
            <p className="mt-0.5 text-sm text-gray-500">{sentence.sCn}</p>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={onDetail}
        className="mt-6 flex w-full items-center justify-center gap-1 rounded-xl border border-primary-100 bg-primary-50 py-3 text-sm font-semibold text-primary-600 transition active:scale-[0.99]"
      >
        查看详情
        <ChevronRightIcon width={16} height={16} />
      </button>
    </div>
  );
}
