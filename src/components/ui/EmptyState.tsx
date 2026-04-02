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
        "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-8 text-gray-400",
        className,
      )}
    >
      {icon && <div className="text-3xl">{icon}</div>}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
}
