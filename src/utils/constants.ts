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
    bg: "bg-info/15",
    text: "text-info",
    border: "border-info/25",
  },
  action: {
    bg: "bg-action/15",
    text: "text-action",
    border: "border-action/25",
  },
};

export const TYPE_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  reasoning: {
    bg: "bg-reasoning/15",
    text: "text-reasoning",
    border: "border-reasoning/25",
  },
  personality: {
    bg: "bg-personality/15",
    text: "text-personality",
    border: "border-personality/25",
  },
  context: {
    bg: "bg-context/15",
    text: "text-context",
    border: "border-context/25",
  },
  formatting: {
    bg: "bg-formatting/15",
    text: "text-formatting",
    border: "border-formatting/25",
  },
};