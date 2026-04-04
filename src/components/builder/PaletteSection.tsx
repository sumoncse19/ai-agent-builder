import { ChevronDown } from "lucide-react";
import { cn } from "../../utils/cn";

interface PaletteSectionProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}

export function PaletteSection({
  title,
  icon,
  count,
  children,
  isOpen,
  onToggle,
}: PaletteSectionProps) {
  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          "flex w-full items-center justify-between px-4 py-2.5 text-left transition-colors hover:bg-surface-elevated/50",
          isOpen && "bg-surface-elevated/30",
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn("text-text-muted", isOpen && "text-ember-500")}>
            {icon}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            {title}
          </span>
          <span className="inline-flex items-center rounded-md bg-surface-elevated/60 px-1.5 py-0.5 font-mono text-[10px] font-medium text-text-muted">
            {count}
          </span>
        </div>
        <ChevronDown
          size={14}
          className={cn(
            "text-text-muted transition-transform duration-200",
            isOpen && "rotate-180 text-ember-500",
          )}
        />
      </button>
      <div
        className={cn(
          "grid transition-all duration-200",
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 pointer-events-none",
        )}
      >
        <div className="overflow-hidden">
          <div className="stagger-children flex flex-col gap-1.5 px-3 pb-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
