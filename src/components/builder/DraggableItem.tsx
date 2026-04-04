import { useDraggable } from "@dnd-kit/core";
import { GripVertical, Check } from "lucide-react";
import { cn } from "../../utils/cn";
import { Badge } from "../ui/Badge";
import type { DragItemType } from "../../types/agent";

interface DraggableItemProps {
  id: string;
  type: DragItemType;
  name: string;
  description?: string;
  badge?: { label: string; variant: "category" | "type" };
  isPlaced?: boolean;
  onTap?: () => void;
}

export function DraggableItem({
  id,
  type,
  name,
  description,
  badge,
  isPlaced = false,
  onTap,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}-${id}`,
    data: { type, id, name, description },
    disabled: isPlaced,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      onClick={() => {
        if (!isPlaced && onTap) onTap();
      }}
      aria-label={
        isPlaced ? `${name} already added` : `Add ${name} to ${type} zone`
      }
      aria-disabled={isPlaced}
      className={cn(
        "group relative flex items-start gap-2 rounded-lg border p-2.5 transition-all select-none",
        !isPlaced && "cursor-pointer lg:cursor-grab",
        isDragging && "z-50 opacity-40",
        isPlaced
          ? "border-border-subtle bg-surface-secondary/30 opacity-40"
          : "border-border-default bg-surface-primary/60 hover:border-ember-500/40 hover:bg-surface-elevated/50",
      )}
    >
      <div className="mt-0.5 shrink-0 text-text-muted group-hover:text-text-secondary">
        {isPlaced ? (
          <Check size={12} className="text-action" />
        ) : (
          <GripVertical size={12} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-text-primary truncate">
            {name}
          </span>
          {badge && <Badge label={badge.label} variant={badge.variant} />}
        </div>
        {description && (
          <p className="mt-0.5 text-[11px] leading-relaxed text-text-muted line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
