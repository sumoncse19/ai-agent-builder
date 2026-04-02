export const AI_PROVIDERS = [
  "Gemini",
  "ChatGPT",
  "Kimi",
  "Claude",
  "DeepSeek",
] as const;

export type AIProvider = (typeof AI_PROVIDERS)[number];

export const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  information: {
    bg: "bg-info/10",
    text: "text-info",
    border: "border-info/30",
  },
  action: {
    bg: "bg-action/10",
    text: "text-action",
    border: "border-action/30",
  },
};

export const TYPE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  reasoning: {
    bg: "bg-reasoning/10",
    text: "text-reasoning",
    border: "border-reasoning/30",
  },
  personality: {
    bg: "bg-personality/10",
    text: "text-personality",
    border: "border-personality/30",
  },
  context: {
    bg: "bg-context/10",
    text: "text-context",
    border: "border-context/30",
  },
  formatting: {
    bg: "bg-formatting/10",
    text: "text-formatting",
    border: "border-formatting/30",
  },
};

export const PROVIDER_COLORS: Record<string, string> = {
  Gemini: "bg-blue-500",
  ChatGPT: "bg-emerald-500",
  Kimi: "bg-purple-500",
  Claude: "bg-orange-500",
  DeepSeek: "bg-cyan-500",
};
