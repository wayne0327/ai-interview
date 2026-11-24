"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, Settings } from "lucide-react";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();
  const isApp = pathname?.startsWith("/interview");

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <Logo />
          <span className="text-base font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            InterviewAI
          </span>
        </Link>

        {isApp ? (
          <div className="flex items-center gap-4">
            <Link
              href="/settings"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <Settings size={15} />
              設定
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <ArrowLeft size={15} />
              返回首頁
            </Link>
          </div>
        ) : (
          <nav className="flex items-center gap-7">
            <a
              href="#features"
              className="hidden text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:block dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              功能
            </a>
            <a
              href="#how-it-works"
              className="hidden text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:block dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              如何運作
            </a>
            <Link
              href="/settings"
              className="hidden items-center gap-1.5 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 sm:flex dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              <Settings size={15} />
              設定
            </Link>
            <Link
              href="/interview"
              className="group flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-4 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              開始模擬面試
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
