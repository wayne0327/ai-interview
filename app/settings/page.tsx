"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Eye, EyeOff, KeyRound, Trash2 } from "lucide-react";
import {
  DEFAULT_MODEL,
  PROVIDER_LABELS,
  PROVIDER_MODEL_OPTIONS,
  Provider,
  clearByokSettings,
  loadByokSettings,
  saveByokSettings,
} from "../lib/byok";

const PROVIDERS: Provider[] = ["gemini", "openai", "anthropic"];
const CUSTOM_MODEL_VALUE = "__custom__";

export default function SettingsPage() {
  const [provider, setProvider] = useState<Provider>("gemini");
  const [apiKey, setApiKey] = useState("");
  const [modelChoice, setModelChoice] = useState<string>(
    PROVIDER_MODEL_OPTIONS.gemini[0]
  );
  const [customModel, setCustomModel] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect -- loading saved settings from localStorage on mount */
    const existing = loadByokSettings();
    if (!existing) return;

    setProvider(existing.provider);
    setApiKey(existing.apiKey);
    if (PROVIDER_MODEL_OPTIONS[existing.provider].includes(existing.model)) {
      setModelChoice(existing.model);
    } else {
      setModelChoice(CUSTOM_MODEL_VALUE);
      setCustomModel(existing.model);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  function handleProviderChange(next: Provider) {
    setProvider(next);
    setModelChoice(PROVIDER_MODEL_OPTIONS[next][0]);
    setCustomModel("");
  }

  function handleSave() {
    const model =
      modelChoice === CUSTOM_MODEL_VALUE
        ? customModel.trim() || DEFAULT_MODEL[provider]
        : modelChoice;

    saveByokSettings({ provider, apiKey: apiKey.trim(), model });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function handleClear() {
    clearByokSettings();
    setApiKey("");
    setProvider("gemini");
    setModelChoice(PROVIDER_MODEL_OPTIONS.gemini[0]);
    setCustomModel("");
  }

  const canSave = apiKey.trim().length > 0;

  return (
    <div className="flex flex-1 justify-center px-4 py-10 sm:px-6">
      <main className="flex w-full max-w-xl flex-col gap-6 rounded-3xl border border-zinc-200/80 bg-white/90 p-6 shadow-xl shadow-zinc-900/5 backdrop-blur sm:p-8 dark:border-zinc-800/80 dark:bg-zinc-900/90">
        <div className="flex flex-col gap-1.5">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-0.5 text-[11px] font-medium text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
            <KeyRound size={11} />
            BYOK 設定
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            使用你自己的 API Key
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            選擇 AI 供應商並輸入你自己的 API Key，面試時會使用這組 Key 呼叫對應的服務。Key
            只會儲存在你的瀏覽器（localStorage），不會上傳到我們的伺服器。
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            供應商
          </label>
          <div className="grid grid-cols-3 gap-2">
            {PROVIDERS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleProviderChange(p)}
                className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  provider === p
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-indigo-500/60 dark:bg-indigo-500/10 dark:text-indigo-300"
                    : "border-zinc-300 text-zinc-600 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                }`}
              >
                {PROVIDER_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="apiKey"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            API Key
          </label>
          <div className="relative">
            <input
              id="apiKey"
              type={showKey ? "text" : "password"}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder={`輸入你的 ${PROVIDER_LABELS[provider]} API Key`}
              className="w-full rounded-xl border border-zinc-300 bg-white p-3 pr-10 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
            <button
              type="button"
              onClick={() => setShowKey((v) => !v)}
              className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              aria-label={showKey ? "隱藏 API Key" : "顯示 API Key"}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="model"
            className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            模型
          </label>
          <select
            id="model"
            value={modelChoice}
            onChange={(e) => setModelChoice(e.target.value)}
            className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            {PROVIDER_MODEL_OPTIONS[provider].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
            <option value={CUSTOM_MODEL_VALUE}>自訂模型名稱...</option>
          </select>
          {modelChoice === CUSTOM_MODEL_VALUE && (
            <input
              type="text"
              value={customModel}
              onChange={(e) => setCustomModel(e.target.value)}
              placeholder="輸入模型名稱，例如 gpt-4.1"
              className="w-full rounded-xl border border-zinc-300 bg-white p-3 text-sm text-zinc-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
            />
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 px-5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/25 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
          >
            {saved ? (
              <>
                <CheckCircle2 size={15} />
                已儲存
              </>
            ) : (
              "儲存設定"
            )}
          </button>
          <button
            onClick={handleClear}
            className="flex h-11 items-center justify-center gap-2 rounded-full border border-zinc-300 px-5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <Trash2 size={14} />
            清除
          </button>
        </div>
      </main>
    </div>
  );
}
