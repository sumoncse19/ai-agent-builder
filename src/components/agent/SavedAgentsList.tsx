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
      <div className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-200 p-8 text-gray-400">
        <Archive size={32} />
        <p className="text-sm font-medium">
          No saved agents yet. Build your first agent above!
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            Saved Agents
            <span className="ml-2 inline-flex items-center rounded-full bg-violet-100 px-2 py-0.5 text-xs font-medium text-violet-700">
              {agents.length}
            </span>
          </h2>
          <button
            onClick={() => setShowClearDialog(true)}
            className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 size={14} />
            Clear All
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
