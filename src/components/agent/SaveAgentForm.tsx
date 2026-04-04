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
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          placeholder="Enter agent name..."
          aria-label="Agent name"
          value={agentName}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !isDisabled && onSave()}
          className="w-full rounded-lg border border-border-strong bg-surface-secondary px-3 py-2 text-sm text-text-primary placeholder-text-muted transition-all focus:border-ember-500/50 focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-ember-500/30 sm:flex-1"
        />
        <div className="flex gap-2">
          <button
            onClick={onSave}
            disabled={isDisabled}
            className={cn(
              "flex grow items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-all",
              isDisabled
                ? "cursor-not-allowed bg-surface-elevated text-text-muted opacity-40"
                : "active:scale-[0.97]",
              !isDisabled &&
                (isEditing
                  ? "bg-personality text-text-inverse hover:brightness-110"
                  : "bg-linear-to-r from-ember-500 to-ember-600 text-text-inverse shadow-lg shadow-ember-500/20 hover:shadow-ember-500/30"),
            )}
          >
            {isEditing ? <Pencil size={14} /> : <Save size={14} />}
            {isEditing ? "Update" : "Save"}
          </button>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg border border-border-default bg-surface-primary px-3 py-2 text-sm font-medium text-text-secondary transition-all hover:border-border-strong hover:bg-surface-elevated hover:text-text-primary"
            title="Reset builder"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
