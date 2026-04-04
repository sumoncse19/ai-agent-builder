import { cn } from "../../utils/cn";
import { CATEGORY_COLORS, TYPE_COLORS } from "../../utils/constants";

interface BadgeProps {
  label: string;
  variant?: "category" | "type";
  className?: string;
}

export function Badge({ label, variant = "category", className }: BadgeProps) {
  const colorMap = variant === "category" ? CATEGORY_COLORS : TYPE_COLORS;
  const colors = colorMap[label] || {
    bg: "bg-surface-elevated",
    text: "text-text-secondary",
    border: "border-border-default",
  };

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 font-mono text-[10px] font-medium capitalize border",
        colors.bg,
        colors.text,
        colors.border,
        className,
      )}
    >
      {label}
    </span>
  );
}
