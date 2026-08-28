"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, UserIcon } from "./icons";

const items = [
  { href: "/", label: "首页", Icon: HomeIcon },
  { href: "/profile", label: "我的", Icon: UserIcon },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white pb-[env(safe-area-inset-bottom)]"
      aria-label="底部导航"
    >
      <div className="mx-auto flex h-16 max-w-md items-stretch">
        {items.map(({ href, label, Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors ${
                active ? "font-semibold text-primary-600" : "text-gray-400"
              }`}
            >
              <Icon width={24} height={24} strokeWidth={active ? 2.4 : 2} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
