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
    bg: "bg-gray-100",
    text: "text-gray-600",
    border: "border-gray-200",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize border",
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
