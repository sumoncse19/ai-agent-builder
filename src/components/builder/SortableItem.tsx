import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { cn } from "../../utils/cn";
import { Badge } from "../ui/Badge";

interface SortableItemProps {
  id: string;
  name: string;
  badge?: { label: string; variant: "category" | "type" };
  onRemove: () => void;
}

export function SortableItem({ id, name, badge, onRemove }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-lg border border-forge-600/50 bg-forge-800 px-3 py-2 transition-shadow",
        isDragging && "z-50 opacity-60 glow-ember",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-forge-600 hover:text-forge-400"
      >
        <GripVertical size={12} />
      </button>
      <span className="flex-1 text-xs font-medium text-forge-100 truncate">
        {name}
      </span>
      {badge && <Badge label={badge.label} variant={badge.variant} />}
      <button
        onClick={onRemove}
        className="rounded p-0.5 text-forge-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
      >
        <X size={12} />
      </button>
    </div>
  );
}
