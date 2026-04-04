import { Badge } from "../ui/Badge";
import type { DragData } from "../../types/agent";

interface DragOverlayContentProps {
  data: DragData;
}

export function DragOverlayContent({ data }: DragOverlayContentProps) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-ember-500/50 bg-surface-primary p-3 shadow-2xl shadow-ember-500/10 rotate-2">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-text-heading">
            {data.name}
          </span>
          {data.category && <Badge label={data.category} variant="category" />}
          {data.layerType && <Badge label={data.layerType} variant="type" />}
        </div>
        {data.description && (
          <p className="mt-0.5 text-xs text-text-muted line-clamp-1">
            {data.description}
          </p>
        )}
      </div>
    </div>
  );
}
