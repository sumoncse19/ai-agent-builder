import { useState } from "react";
import { Trash2, Archive } from "lucide-react";
import type { AgentProfile, SavedAgent } from "../../types/agent";
import { SavedAgentCard } from "./SavedAgentCard";
import { ConfirmDialog } from "../ui/ConfirmDialog";

interface SavedAgentsListProps {
  agents: SavedAgent[];
  profileMap: Map<string, AgentProfile>;
  onLoad: (agent: SavedAgent) => void;
  onDelete: (index: number) => void;
  onClearAll: () => void;
}

export function SavedAgentsList({
  agents,
  profileMap,
  onLoad,
  onDelete,
  onClearAll,
}: SavedAgentsListProps) {
  const [showClearDialog, setShowClearDialog] = useState(false);

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-forge-700/40 p-8 text-forge-500">
        <Archive size={28} />
        <p className="text-xs font-medium">
          No saved agents yet. Build your first agent above!
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="glass-card rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-forge-200">
            Saved Agents
            <span className="inline-flex items-center rounded-md bg-ember-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-ember-400">
              {agents.length}
            </span>
          </h2>
          <button
            onClick={() => setShowClearDialog(true)}
            className="flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
          >
            <Trash2 size={12} />
            Clear All
          </button>
        </div>
        <div className="stagger-children grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent, index) => (
            <SavedAgentCard
              key={agent.id}
              agent={agent}
              profileMap={profileMap}
              onLoad={() => onLoad(agent)}
              onDelete={() => onDelete(index)}
            />
          ))}
        </div>
      </section>

      <ConfirmDialog
        open={showClearDialog}
        title="Clear All Agents"
        message={`Are you sure you want to delete all ${agents.length} saved agents? This action cannot be undone.`}
        confirmLabel="Delete All"
        onConfirm={() => {
          onClearAll();
          setShowClearDialog(false);
        }}
        onCancel={() => setShowClearDialog(false)}
      />
    </>
  );
}
