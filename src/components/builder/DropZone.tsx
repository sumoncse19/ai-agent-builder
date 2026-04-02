import { useRef, useEffect } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "../../utils/cn";
import { EmptyState } from "../ui/EmptyState";
import { SortableItem } from "./SortableItem";
import type { DragItemType } from "../../types/agent";

interface SingleDropZoneProps {
  id: string;
  type: DragItemType;
  label: string;
  icon: React.ReactNode;
  mode: "single";
  item?: { id: string; name: string } | null;
  onRemove: () => void;
  activeDragType: DragItemType | null;
}

interface MultiDropZoneProps {
  id: string;
  type: DragItemType;
  label: string;
  icon: React.ReactNode;
  mode: "multi";
  items: {
    id: string;
    name: string;
    badge?: { label: string; variant: "category" | "type" };
  }[];
  onRemove: (id: string) => void;
  activeDragType: DragItemType | null;
}

type DropZoneProps = SingleDropZoneProps | MultiDropZoneProps;

export function DropZone(props: DropZoneProps) {
  const { id, type, label, icon, mode, activeDragType } = props;
  const { isOver, setNodeRef } = useDroppable({ id, data: { type } });
  const zoneRef = useRef<HTMLDivElement>(null);

  const isValidTarget = activeDragType === type;
  const isHighlighted = isOver && isValidTarget;

  // Fix #1: scroll the matching drop zone into view when user starts dragging a matching type
  useEffect(() => {
    if (isValidTarget && zoneRef.current) {
      zoneRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isValidTarget]);

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        zoneRef.current = node;
      }}
      role="region"
      aria-label={`Drop zone for ${label}`}
      className={cn(
        "rounded-xl border-2 p-4 transition-all duration-200",
        isHighlighted
          ? "border-violet-400 bg-violet-50 shadow-md ring-2 ring-violet-300"
          : isValidTarget && activeDragType
            ? "border-violet-300 bg-violet-50/30 border-dashed shadow-sm animate-pulse"
            : "border-gray-200 bg-gray-50/50",
      )}
    >
      <div className="mb-3 flex items-center gap-2">
        <span
          className={cn("text-gray-500", isValidTarget && "text-violet-600")}
        >
          {icon}
        </span>
        <h3
          className={cn(
            "text-sm font-semibold text-gray-700",
            isValidTarget && "text-violet-700",
          )}
        >
          {label}
        </h3>
        {isValidTarget && !isHighlighted && (
          <span className="text-xs font-medium text-violet-500 animate-pulse">
            Drop here
          </span>
        )}
      </div>

      {mode === "single" ? (
        <SingleContent
          item={props.item}
          onRemove={props.onRemove}
          type={type}
        />
      ) : (
        <MultiContent items={props.items} onRemove={props.onRemove} />
      )}
    </div>
  );
}

function SingleContent({
  item,
  onRemove,
  type,
}: {
  item?: { id: string; name: string } | null;
  onRemove: () => void;
  type: DragItemType;
}) {
  if (!item) {
    return (
      <EmptyState
        message={`Drag a ${type} here`}
        className="min-h-15 border-gray-100"
      />
    );
  }

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <span className="text-sm font-medium text-gray-900">{item.name}</span>
      <button
        onClick={onRemove}
        className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
}

function MultiContent({
  items,
  onRemove,
}: {
  items: {
    id: string;
    name: string;
    badge?: { label: string; variant: "category" | "type" };
  }[];
  onRemove: (id: string) => void;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        message="Drag items here"
        className="min-h-15 border-gray-100"
      />
    );
  }

  return (
    <SortableContext
      items={items.map((i) => i.id)}
      strategy={verticalListSortingStrategy}
    >
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <SortableItem
            key={item.id}
            id={item.id}
            name={item.name}
            badge={item.badge}
            onRemove={() => onRemove(item.id)}
          />
        ))}
      </div>
    </SortableContext>
  );
}
