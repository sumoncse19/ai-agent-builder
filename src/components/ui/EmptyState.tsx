import { cn } from "../../utils/cn";

interface EmptyStateProps {
  icon?: React.ReactNode;
  message: string;
  className?: string;
}

export function EmptyState({ icon, message, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border-default p-6 text-text-muted",
        className,
      )}
    >
      {icon && <div className="text-2xl">{icon}</div>}
      <p className="text-xs font-medium">{message}</p>
    </div>
  );
}
