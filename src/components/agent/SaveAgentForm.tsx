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
  const isDisabled = isEditing ? !canSave || !hasChanges : !canSave;

  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-ember-500">
        {isEditing ? "Update Agent" : "Save Agent"}
      </h3>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Enter agent name..."
          value={agentName}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isDisabled && onSave()}
          className="flex-1 rounded-lg border border-forge-600 bg-forge-850 px-3 py-2 text-sm text-forge-100 placeholder-forge-500 transition-all focus:border-ember-500/50 focus:bg-forge-800 focus:outline-none focus:ring-1 focus:ring-ember-500/30"
        />
        <button
          onClick={onSave}
          disabled={isDisabled}
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
            isDisabled
              ? "cursor-not-allowed bg-forge-700 text-forge-500 opacity-40"
              : "active:scale-[0.97]",
            !isDisabled &&
              (isEditing
                ? "bg-personality text-forge-950 hover:brightness-110"
                : "bg-gradient-to-r from-ember-500 to-ember-600 text-forge-950 shadow-lg shadow-ember-500/20 hover:shadow-ember-500/30"),
          )}
        >
          {isEditing ? <Pencil size={14} /> : <Save size={14} />}
          {isEditing ? "Update" : "Save"}
        </button>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 rounded-lg border border-forge-600 bg-forge-800 px-3 py-2 text-sm font-medium text-forge-300 transition-all hover:border-forge-500 hover:bg-forge-700 hover:text-forge-100"
          title="Reset builder"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </div>
  );
}
