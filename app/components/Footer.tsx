"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    // Deferred to the client so the build-time prerender doesn't bake in a stale year.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:text-zinc-400">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <span className="font-medium text-zinc-700 dark:text-zinc-200">
            InterviewAI
          </span>
        </div>
        <p>由 Google Gemini 驅動的 AI 面試模擬練習工具</p>
        <p>&copy;{year ? ` ${year} ` : " "}InterviewAI. All rights reserved.</p>
      </div>
    </footer>
  );
}
