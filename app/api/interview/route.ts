import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_TOTAL_QUESTIONS = 3;
const MIN_TOTAL_QUESTIONS = 1;
const MAX_TOTAL_QUESTIONS = 10;

type ChatMessage = {
  role: "interviewer" | "candidate";
  content: string;
};

type Provider = "gemini" | "openai" | "anthropic";

const DEFAULT_MODEL: Record<Provider, string> = {
  gemini: "gemini-3.8-flash",
  openai: "gpt-4o-mini",
  anthropic: "claude-sonnet-5",
};

function resolveTotalQuestions(value: unknown): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_TOTAL_QUESTIONS;
  const rounded = Math.round(n);
  return Math.min(Math.max(rounded, MIN_TOTAL_QUESTIONS), MAX_TOTAL_QUESTIONS);
}

async function callGemini(apiKey: string, model: string, prompt: string) {
  const ai = new GoogleGenAI({ apiKey });
  const result = await ai.models.generateContent({ model, contents: prompt });
  return result.text?.trim() ?? "";
}

async function callOpenAI(apiKey: string, model: string, prompt: string) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`OpenAI API 錯誤 (${res.status})：${errBody}`);
  }

  const data = await res.json();
  return (data.choices?.[0]?.message?.content ?? "").trim();
}

async function callAnthropic(apiKey: string, model: string, prompt: string) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`Anthropic API 錯誤 (${res.status})：${errBody}`);
  }

  const data = await res.json();
  const text = data.content
    ?.filter((block: { type: string }) => block.type === "text")
    .map((block: { text: string }) => block.text)
    .join("")
    .trim();
  return text ?? "";
}

async function callProvider(
  provider: Provider,
  apiKey: string,
  model: string,
  prompt: string
) {
  switch (provider) {
    case "gemini":
      return callGemini(apiKey, model, prompt);
    case "openai":
      return callOpenAI(apiKey, model, prompt);
    case "anthropic":
      return callAnthropic(apiKey, model, prompt);
  }
}

export async function POST(req: NextRequest) {
  let body: {
    jobDescription?: string;
    history?: ChatMessage[];
    totalQuestions?: number;
    provider?: string;
    apiKey?: string;
    model?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  const provider = body.provider as Provider;
  if (!["gemini", "openai", "anthropic"].includes(provider)) {
    return NextResponse.json(
      { error: "請先在設定頁面選擇 AI 供應商" },
      { status: 400 }
    );
  }

  const apiKey = body.apiKey?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "請先在設定頁面輸入你的 API Key" },
      { status: 400 }
    );
  }

  const model = body.model?.trim() || DEFAULT_MODEL[provider];

  const jobDescription = body.jobDescription?.trim() ?? "";
  const history = body.history ?? [];
  const totalQuestions = resolveTotalQuestions(body.totalQuestions);

  if (!jobDescription) {
    return NextResponse.json({ error: "請提供職缺描述" }, { status: 400 });
  }

  const answeredCount = history.filter((m) => m.role === "candidate").length;
  const isFinal = answeredCount >= totalQuestions;

  const transcript = history
    .map((m) => `${m.role === "interviewer" ? "面試官" : "應徵者"}：${m.content}`)
    .join("\n");

  const prompt = isFinal
    ? `你是一位專業的技術面試官，正在針對以下職缺描述面試應徵者。

職缺描述：
"""
${jobDescription}
"""

完整面試對話紀錄（面試官的提問與應徵者的回答依序交錯）：
"""
${transcript}
"""

應徵者已經回答完全部 ${totalQuestions} 道題目，面試結束。請你先針對「每一題」分別給出更好的回答方式建議，再提供整體評語。請直接輸出以下格式的繁體中文內容，不要有多餘的開場白，${totalQuestions} 題請全部列出、不要省略：

逐題建議：
第 1 題：<該題題目原文>
你的回答摘要：<簡短摘要應徵者的回答內容>
建議回答方式：<具體說明更完整、更有說服力的回答方向，可包含應補充的重點、範例或結構>

（依此格式列出每一題，直到第 ${totalQuestions} 題）

整體評分：X / 10

優點：
- ...

待改進之處：
- ...

綜合建議：
- ...`
    : `你是一位專業的技術面試官，正在針對以下職缺描述面試應徵者。

職缺描述：
"""
${jobDescription}
"""

目前的面試對話紀錄（若為空代表面試尚未開始）：
"""
${transcript || "（尚未開始）"}
"""

請根據職缺描述與目前對話內容，提出接下來的面試問題，這是第 ${answeredCount + 1} 題（總共 ${totalQuestions} 題）。
問題需切合職缺所需的技能或經驗，並避免重複先前已問過的題目。
請只輸出單一個問題的內容，使用繁體中文，不要加上編號、前言或任何多餘說明。`;

  try {
    const text = await callProvider(provider, apiKey, model, prompt);

    if (!text) {
      return NextResponse.json(
        { error: "AI 沒有回應內容，請稍後再試" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      type: isFinal ? "final" : "question",
      content: text,
      questionNumber: isFinal ? null : answeredCount + 1,
      totalQuestions,
    });
  } catch (error) {
    console.error(`${provider} API 呼叫失敗：`, error);
    const message =
      error instanceof Error ? error.message : "呼叫 AI 服務時發生錯誤，請稍後再試";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
