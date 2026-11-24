export type Provider = "gemini" | "openai" | "anthropic";

export type ByokSettings = {
  provider: Provider;
  apiKey: string;
  model: string;
};

export const PROVIDER_LABELS: Record<Provider, string> = {
  gemini: "Google Gemini",
  openai: "OpenAI",
  anthropic: "Anthropic (Claude)",
};

export const PROVIDER_MODEL_OPTIONS: Record<Provider, string[]> = {
  gemini: ["gemini-3.8-flash", "gemini-3.8-pro", "gemini-2.5-flash"],
  openai: ["gpt-4o", "gpt-4o-mini", "o3-mini"],
  anthropic: ["claude-sonnet-5", "claude-opus-5", "claude-haiku-4-5-20251001"],
};

export const DEFAULT_MODEL: Record<Provider, string> = {
  gemini: "gemini-3.8-flash",
  openai: "gpt-4o-mini",
  anthropic: "claude-sonnet-5",
};

const STORAGE_KEY = "byok-settings";

export function loadByokSettings(): ByokSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      parsed &&
      typeof parsed.apiKey === "string" &&
      typeof parsed.provider === "string" &&
      typeof parsed.model === "string"
    ) {
      return parsed as ByokSettings;
    }
    return null;
  } catch {
    return null;
  }
}

export function saveByokSettings(settings: ByokSettings): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function clearByokSettings(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
