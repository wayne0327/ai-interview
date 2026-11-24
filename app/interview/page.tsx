"use client";

import { useState } from "react";
import {
  AlertTriangle,
  Award,
  Bot,
  CheckCircle2,
  Lightbulb,
  Loader2,
  RotateCcw,
  Send,
  Sparkles,
  User,
} from "lucide-react";
import { parseFinalResult } from "../lib/parseFinalResult";

type ChatMessage = {
  role: "interviewer" | "candidate";
  content: string;
};

type InterviewResponse = {
  type: "question" | "final";
  content: string;
  questionNumber: number | null;
  totalQuestions: number;
};

type Phase = "setup" | "chat" | "done";

const MIN_QUESTIONS = 1;
const MAX_QUESTIONS = 10;

export default function InterviewPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [questionCount, setQuestionCount] = useState(3);
  const [phase, setPhase] = useState<Phase>("setup");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [questionInfo, setQuestionInfo] = useState<{
    current: number;
    total: number;
  } | null>(null);
  const [finalResult, setFinalResult] = useState<string | null>(null);
  const [totalQuestions, setTotalQuestions] = useState(3);

  async function callInterviewApi(nextHistory: ChatMessage[], totalQ: number) {
    const res = await fetch("/api/interview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jobDescription,
        history: nextHistory,
        totalQuestions: totalQ,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error ?? "發生未知錯誤");
    }

    return data as InterviewResponse;
  }

  async function startInterview() {
    if (!jobDescription.trim()) {
      setError("請先輸入職缺描述");
      return;
    }

    const clampedCount = Math.min(
      Math.max(Math.round(questionCount) || MIN_QUESTIONS, MIN_QUESTIONS),
      MAX_QUESTIONS
    );

    setError(null);
    setLoading(true);
    try {
      const data = await callInterviewApi([], clampedCount);
      setTotalQuestions(clampedCount);
      setHistory([{ role: "interviewer", content: data.content }]);
      setQuestionInfo({
        current: data.questionNumber ?? 1,
        total: data.totalQuestions,
      });
      setPhase("chat");
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生未知錯誤");
    } finally {
      setLoading(false);
    }
  }

  async function submitAnswer() {
    if (!answer.trim()) {
      setError("請輸入你的回答");
      return;
    }

    setError(null);
    const nextHistory: ChatMessage[] = [
      ...history,
      { role: "candidate", content: answer },
    ];
    setHistory(nextHistory);
    setAnswer("");
    setLoading(true);

    try {
      const data = await callInterviewApi(nextHistory, totalQuestions);

      if (data.type === "final") {
        setFinalResult(data.content);
        setPhase("done");
      } else {
        setHistory([...nextHistory, { role: "interviewer", content: data.content }]);
        setQuestionInfo({
          current: data.questionNumber ?? (questionInfo?.current ?? 0) + 1,
          total: data.totalQuestions,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "發生未知錯誤");
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setJobDescription("");
    setQuestionCount(3);
    setPhase("setup");
    setHistory([]);
    setAnswer("");
    setError(null);
    setQuestionInfo(null);
    setFinalResult(null);
  }

  const review = finalResult ? parseFinalResult(finalResult) : null;
  const hasStructuredReview = !!review && review.score !== null && review.perQuestion.length > 0;

  return (
    <div className="relative flex flex-1 justify-center overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-white px-4 py-10 sm:px-6 dark:from-indigo-500/5 dark:via-zinc-950 dark:to-zinc-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-24 -z-10 flex justify-center blur-3xl"
      >
        <div className="h-72 w-[32rem] rounded-full bg-gradient-to-br from-indigo-300/30 via-violet-300/20 to-fuchsia-300/20 dark:from-indigo-500/15 dark:via-violet-500/10 dark:to-fuchsia-500/10" />
      </div>

      <main className="flex w-full max-w-2xl flex-col gap-6 rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-xl shadow-zinc-900/5 backdrop-blur sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/90">
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Sparkles size={11} />
            AI 面試模擬
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            開始一場模擬面試
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            輸入職缺描述並選擇題數，AI 面試官將依序提問，回答完畢後會給出每題的建議回答與整體評分。
          </p>
        </div>

        {phase === "setup" && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="jobDescription"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                職缺描述
              </label>
              <textarea
                id="jobDescription"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={6}
                placeholder="例如：我們正在招募一名前端工程師，需熟悉 React、TypeScript，負責開發與維護公司內部管理系統..."
                className="w-full resize-none rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="questionCount"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
              >
                面試題數（{MIN_QUESTIONS} ~ {MAX_QUESTIONS} 題）
              </label>
              <input
                id="questionCount"
                type="number"
                min={MIN_QUESTIONS}
                max={MAX_QUESTIONS}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-24 rounded-xl border border-zinc-300 bg-white p-2 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              />
            </div>

            {error && (
              <p className="flex items-center gap-1.5 text-sm text-red-500">
                <AlertTriangle size={14} />
                {error}
              </p>
            )}

            <button
              onClick={startInterview}
              disabled={loading}
              className="mt-1 flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  準備題目中...
                </>
              ) : (
                "開始模擬面試"
              )}
            </button>
          </div>
        )}

        {phase !== "setup" && (
          <div className="flex flex-col gap-5">
            <div className="rounded-xl bg-zinc-100 p-3 text-xs text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">
                職缺描述：
              </span>{" "}
              {jobDescription}
            </div>

            {phase === "chat" && questionInfo && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>
                    第 {questionInfo.current} / {questionInfo.total} 題
                  </span>
                  <span>{Math.round((questionInfo.current / questionInfo.total) * 100)}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all"
                    style={{
                      width: `${(questionInfo.current / questionInfo.total) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {history.map((message, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2.5 ${
                    message.role === "interviewer" ? "justify-start" : "justify-end"
                  }`}
                >
                  {message.role === "interviewer" && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-500/25">
                      <Bot size={15} />
                    </span>
                  )}
                  <div
                    className={`max-w-[80%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                      message.role === "interviewer"
                        ? "rounded-tl-sm bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                        : "rounded-tr-sm bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                    }`}
                  >
                    {message.content}
                  </div>
                  {message.role === "candidate" && (
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                      <User size={15} />
                    </span>
                  )}
                </div>
              ))}
            </div>

            {phase === "chat" && (
              <div className="flex flex-col gap-2">
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  rows={4}
                  placeholder="輸入你的回答..."
                  className="w-full resize-none rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                />
                {error && (
                  <p className="flex items-center gap-1.5 text-sm text-red-500">
                    <AlertTriangle size={14} />
                    {error}
                  </p>
                )}
                <button
                  onClick={submitAnswer}
                  disabled={loading}
                  className="flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                >
                  {loading ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      送出中...
                    </>
                  ) : (
                    <>
                      送出回答
                      <Send size={14} />
                    </>
                  )}
                </button>
              </div>
            )}

            {phase === "done" && review && (
              <div className="flex flex-col gap-5">
                {hasStructuredReview ? (
                  <>
                    <div className="flex items-center gap-4 rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-violet-50 p-5 dark:border-indigo-500/20 dark:from-indigo-500/10 dark:to-violet-500/10">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm shadow-indigo-600/30">
                        <Award size={24} />
                      </span>
                      <div>
                        <p className="text-xs font-medium text-indigo-700 dark:text-indigo-300">
                          整體評分
                        </p>
                        <p className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
                          {review.score}
                          <span className="text-base font-normal text-zinc-500 dark:text-zinc-400">
                            {" "}
                            / {review.maxScore}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                        逐題建議
                      </h2>
                      {review.perQuestion.map((q, index) => (
                        <div
                          key={index}
                          className="flex flex-col gap-2.5 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/60"
                        >
                          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                            第 {index + 1} 題：{q.question}
                          </p>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            <span className="font-medium text-zinc-600 dark:text-zinc-300">
                              你的回答：
                            </span>{" "}
                            {q.answerSummary}
                          </p>
                          <div className="flex gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                            <Lightbulb size={14} className="mt-0.5 shrink-0" />
                            <p className="leading-relaxed whitespace-pre-wrap">
                              {q.suggestion}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {review.pros.length > 0 && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                          <p className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 dark:text-emerald-300">
                            <CheckCircle2 size={15} />
                            優點
                          </p>
                          <ul className="mt-2 flex flex-col gap-1.5 text-xs text-emerald-800 dark:text-emerald-200">
                            {review.pros.map((item, i) => (
                              <li key={i} className="leading-relaxed">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {review.cons.length > 0 && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/20 dark:bg-rose-500/10">
                          <p className="flex items-center gap-1.5 text-sm font-semibold text-rose-700 dark:text-rose-300">
                            <AlertTriangle size={15} />
                            待改進之處
                          </p>
                          <ul className="mt-2 flex flex-col gap-1.5 text-xs text-rose-800 dark:text-rose-200">
                            {review.cons.map((item, i) => (
                              <li key={i} className="leading-relaxed">
                                • {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {review.suggestions.length > 0 && (
                      <div className="rounded-xl border border-indigo-200 bg-indigo-50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/10">
                        <p className="flex items-center gap-1.5 text-sm font-semibold text-indigo-700 dark:text-indigo-300">
                          <Sparkles size={15} />
                          綜合建議
                        </p>
                        <ul className="mt-2 flex flex-col gap-1.5 text-xs text-indigo-800 dark:text-indigo-200">
                          {review.suggestions.map((item, i) => (
                            <li key={i} className="leading-relaxed">
                              • {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="whitespace-pre-wrap rounded-xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-100">
                    {review.raw}
                  </div>
                )}

                <button
                  onClick={restart}
                  className="flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
                >
                  <RotateCcw size={14} />
                  重新開始
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
