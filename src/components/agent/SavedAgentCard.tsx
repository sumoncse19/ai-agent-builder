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
      <div className="group relative rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:border-violet-200 hover:shadow-md">
        <h3 className="mb-3 text-base font-bold text-gray-900">{agent.name}</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <User size={14} className="text-violet-500" />
            <span>{profileName || "No profile"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-amber-500" />
            <span>{agent.skillIds?.length || 0} skills</span>
          </div>
          <div className="flex items-center gap-2">
            <Layers size={14} className="text-purple-500" />
            <span>{agent.layerIds?.length || 0} layers</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-emerald-500" />
            <span>{agent.provider || "No provider"}</span>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={onLoad}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-violet-50 px-3 py-2 text-sm font-medium text-violet-700 transition-colors hover:bg-violet-100"
          >
            <Upload size={14} />
            Load
          </button>
          <button
            onClick={() => setShowDeleteDialog(true)}
            className="flex items-center justify-center rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
          >
            <Trash2 size={14} />
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
