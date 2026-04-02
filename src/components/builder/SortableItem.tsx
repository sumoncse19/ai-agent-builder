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
        "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm transition-shadow",
        isDragging && "z-50 shadow-lg opacity-75",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-gray-300 hover:text-gray-500"
      >
        <GripVertical size={14} />
      </button>
      <span className="flex-1 text-sm font-medium text-gray-800 truncate">
        {name}
      </span>
      {badge && <Badge label={badge.label} variant={badge.variant} />}
      <button
        onClick={onRemove}
        className="rounded p-0.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
      >
        <X size={14} />
      </button>
    </div>
  );
}
