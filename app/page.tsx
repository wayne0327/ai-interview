import Link from "next/link";
import {
  ArrowRight,
  Award,
  Bot,
  ListChecks,
  MessageSquareText,
  Settings2,
  Sparkles,
  User,
} from "lucide-react";

const features = [
  {
    icon: Settings2,
    title: "客製化面試情境",
    description:
      "貼上任何職缺描述，自由設定想練習的題數，AI 會依據職缺需求規劃專屬的面試流程。",
  },
  {
    icon: Bot,
    title: "AI 即時出題",
    description:
      "面試官會根據職缺與你目前的回答動態追問，每一題都緊扣職缺所需的技能與經驗。",
  },
  {
    icon: MessageSquareText,
    title: "逐題建議回答",
    description:
      "每道題目結束後，立即取得更完整的回答方向、可補充的重點與具體範例，而不只是對錯。",
  },
  {
    icon: Award,
    title: "整體評分與建議",
    description:
      "面試結束後給出整體評分、優缺點分析與改進建議，幫助你掌握下一次面試的方向。",
  },
];

const steps = [
  {
    step: "01",
    title: "輸入職缺描述",
    description: "貼上職缺的工作內容與需求，並選擇想要練習的題數。",
  },
  {
    step: "02",
    title: "與 AI 面試官互動",
    description: "逐題回答 AI 面試官的提問，它會依據你的回答持續追問。",
  },
  {
    step: "03",
    title: "獲得評分與建議",
    description: "完成所有題目後，立即取得逐題建議與整體評分報告。",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <section className="relative isolate overflow-hidden px-4 pt-20 pb-24 sm:px-6 sm:pt-28 sm:pb-32">
        <div
          aria-hidden
          className="absolute inset-x-0 -top-40 -z-10 flex justify-center blur-3xl"
        >
          <div className="h-[28rem] w-[36rem] rounded-full bg-gradient-to-br from-indigo-400/40 via-violet-400/30 to-fuchsia-400/30 dark:from-indigo-500/25 dark:via-violet-500/20 dark:to-fuchsia-500/20" />
        </div>

        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            <Sparkles size={13} />
            由 Google Gemini 驅動
          </span>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl md:text-6xl dark:text-zinc-50">
            用 AI 面試官，
            <br />
            <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              練到正式面試不緊張
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-zinc-600 sm:text-lg dark:text-zinc-400">
            貼上職缺描述，AI 面試官會依照職缺需求出題、追問，並在面試結束後，針對每一題給出更好的回答方式與整體評分建議。
          </p>

          <div className="mt-9 flex flex-col items-center gap-3 sm:flex-row">
            <Link
              href="/interview"
              className="group flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-indigo-600/25 transition-transform hover:scale-[1.03] active:scale-[0.98]"
            >
              開始模擬面試
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#features"
              className="flex h-12 items-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              了解功能
            </a>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-xl">
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/90 shadow-2xl shadow-zinc-900/10 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
            <div className="flex items-center gap-2 border-b border-zinc-100 px-4 py-3 dark:border-zinc-800">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <span className="ml-2 text-xs text-zinc-400">
                interviewai.app/interview
              </span>
            </div>
            <div className="flex flex-col gap-3 p-4 text-sm sm:p-5">
              <div className="flex items-start gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                  <Bot size={14} />
                </span>
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-zinc-100 px-3.5 py-2.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  請分享一次你排查生產環境效能問題的經驗？
                </div>
              </div>
              <div className="flex items-start justify-end gap-2.5">
                <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-zinc-900 px-3.5 py-2.5 text-white dark:bg-zinc-100 dark:text-zinc-900">
                  我會先透過監控系統定位瓶頸，再逐步排查...
                </div>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300">
                  <User size={14} />
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                  <Bot size={14} />
                </span>
                <div className="max-w-[80%] rounded-2xl rounded-tl-sm bg-zinc-100 px-3.5 py-2.5 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                  整體評分：8.5 / 10 — 建議補充量化成效會更有說服力。
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="border-t border-zinc-100 bg-zinc-50/60 px-4 py-20 sm:px-6 dark:border-zinc-900 dark:bg-zinc-900/30"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              每一次練習，都更接近理想的回答
            </h2>
            <p className="mt-3 text-zinc-600 dark:text-zinc-400">
              InterviewAI 不只是出題機器人，更像一位會給你具體建議的面試教練。
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-sm shadow-indigo-500/25">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              三個步驟，完成一次完整的模擬面試
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-3 sm:gap-6">
            {steps.map(({ step, title, description }, index) => (
              <div key={step} className="relative flex flex-col items-center text-center">
                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-zinc-200 sm:block dark:bg-zinc-800" />
                )}
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25">
                  {step}
                </span>
                <h3 className="mt-5 text-base font-semibold text-zinc-900 dark:text-zinc-50">
                  {title}
                </h3>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 px-8 py-14 text-center shadow-xl shadow-indigo-600/20 sm:px-16">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
            <ListChecks size={13} />
            完全免費開始練習
          </span>
          <h2 className="mt-5 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            準備好接受下一次挑戰了嗎？
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-indigo-50 sm:text-base">
            現在就貼上你想應徵的職缺描述，讓 AI 面試官陪你練到有信心上場。
          </p>
          <Link
            href="/interview"
            className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-semibold text-indigo-700 shadow-lg transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            立即開始模擬面試
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
