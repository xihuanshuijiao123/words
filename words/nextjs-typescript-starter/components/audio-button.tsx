"use client";

import * as React from "react";
import { SpeakerIcon } from "./icons";

// 播放单词发音。speech 为 content.word.content 中的 usspeech / ukspeech 参数
export function AudioButton({
  speech,
  text,
  label = "发音",
  className = "",
}: {
  speech?: string;
  text?: string;
  label?: string;
  className?: string;
}) {
  const play = React.useCallback(() => {
    // 归一化发音参数，eg: "ruler&type=1"（英音）、"ruler&type=2"（美音）
    const param = speech?.trim?.() || text?.trim?.() || "";
    if (!param) return;

    // 拆分单词本体与音色类型，audio 参数需单独编码，type 为其后独立参数
    const match = param.match(/^(.*?)(?:&type=(\d+))?$/);
    const word = match?.[1]?.trim() || param;
    const type = match?.[2] || "1";

    const audio = new Audio(
      `https://dict.youdao.com/dictvoice?audio=${encodeURIComponent(
        word,
      )}&type=${type}`,
    );
    audio.play().catch(() => {
      // 忽略自动播放限制等错误
    });
  }, [speech, text]);

  return (
    <button
      type="button"
      onClick={play}
      aria-label={label}
      className={`inline-flex items-center justify-center gap-1 rounded-full bg-primary-600 text-white transition active:scale-95 ${className}`}
    >
      <SpeakerIcon width={18} height={18} />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
