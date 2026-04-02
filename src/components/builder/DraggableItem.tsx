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
      aria-label={isPlaced ? `${name} already added` : `Add ${name} to ${type} zone`}
      aria-disabled={isPlaced}
      className={cn(
        "group relative flex items-start gap-2 rounded-lg border p-3 transition-all select-none",
        !isPlaced && "cursor-pointer lg:cursor-grab",
        isDragging && "z-50 opacity-50 shadow-lg",
        isPlaced
          ? "border-gray-100 bg-gray-50 opacity-50"
          : "border-gray-200 bg-white shadow-sm hover:border-violet-200 hover:shadow-md",
      )}
    >
      <div className="mt-0.5 text-gray-300 group-hover:text-gray-400">
        {isPlaced ? (
          <Check size={14} className="text-green-500" />
        ) : (
          <GripVertical size={14} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900 truncate">
            {name}
          </span>
          {badge && <Badge label={badge.label} variant={badge.variant} />}
        </div>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
