import { useState } from "react";
import { Upload, Trash2, User, Zap, Layers, Cpu } from "lucide-react";
import type { AgentProfile, SavedAgent } from "../../types/agent";
import { ConfirmDialog } from "../ui/ConfirmDialog";

interface SavedAgentCardProps {
  agent: SavedAgent;
  profileMap: Map<string, AgentProfile>;
  onLoad: () => void;
  onDelete: () => void;
}

export function SavedAgentCard({
  agent,
  profileMap,
  onLoad,
  onDelete,
}: SavedAgentCardProps) {
  const profileName = profileMap.get(agent.profileId)?.name;
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  return (
    <>
      <div className="group glass-card relative rounded-xl p-4 transition-all hover:border-ember-500/30 hover:glow-subtle">
        <h3 className="mb-3 text-base font-bold text-text-heading">
          {agent.name}
        </h3>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center gap-2 text-text-secondary">
            <User size={12} className="text-reasoning" />
            <span className="text-xs">{profileName || "No profile"}</span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Zap size={12} className="text-ember-500" />
            <span className="text-xs">
              {agent.skillIds?.length || 0} skills
            </span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Layers size={12} className="text-personality" />
            <span className="text-xs">
              {agent.layerIds?.length || 0} layers
            </span>
          </div>
          <div className="flex items-center gap-2 text-text-secondary">
            <Cpu size={12} className="text-action" />
            <span className="text-xs">{agent.provider || "No provider"}</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={onLoad}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ember-500/10 px-3 py-2 text-xs font-semibold text-ember-500 transition-colors hover:bg-ember-500/20"
          >
            <Upload size={12} />
            Load
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center justify-center rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/20"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        title="Delete Agent"
        message={`Are you sure you want to delete "${agent.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={() => {
          onDelete();
          setShowDeleteDialog(false);
        }}
        onCancel={() => setShowDeleteDialog(false)}
      />
    </>
  );
}
