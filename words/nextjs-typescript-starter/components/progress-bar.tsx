import * as React from "react";

// 用于展示学习进度的细条，支持 0~100 的百分比
export function ProgressBar({
  value,
  className = "",
  trackClassName = "bg-gray-100",
  barClassName = "bg-primary-600",
}: {
  value: number;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full ${trackClassName} ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-300 ${barClassName}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
