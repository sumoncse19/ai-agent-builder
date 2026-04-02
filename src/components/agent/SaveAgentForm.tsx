import { Save, Pencil, RotateCcw } from "lucide-react";
import { cn } from "../../utils/cn";

interface SaveAgentFormProps {
  agentName: string;
  isEditing: boolean;
  canSave: boolean;
  hasChanges: boolean;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onReset: () => void;
}

export function SaveAgentForm({
  agentName,
  isEditing,
  canSave,
  hasChanges,
  onNameChange,
  onSave,
  onReset,
}: SaveAgentFormProps) {
  // For new agents: need name + at least one selection
  // For updates: need name + at least one selection + something changed
  const isDisabled = isEditing ? !canSave || !hasChanges : !canSave;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
        {isEditing ? "Update Agent" : "Save Agent"}
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter agent name..."
          value={agentName}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isDisabled && onSave()}
          className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
        />
        <button
          onClick={onSave}
          disabled={isDisabled}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition-all",
            isDisabled
              ? "cursor-not-allowed opacity-40"
              : "hover:shadow-md active:scale-[0.98]",
            isEditing
              ? "bg-amber-500 hover:bg-amber-600"
              : "bg-linear-to-r from-violet-500 to-indigo-600",
          )}
        >
          {isEditing ? <Pencil size={14} /> : <Save size={14} />}
          {isEditing ? "Update" : "Save"}
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:bg-gray-50"
          title="Reset builder"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
