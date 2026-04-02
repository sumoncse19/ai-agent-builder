import { User, Zap, Layers, Cpu } from "lucide-react";
import type { AgentProfile } from "../../types/agent";

interface AgentPreviewProps {
  profileMap: Map<string, AgentProfile>;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  selectedProvider: string;
}

export function AgentPreview({
  profileMap,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
}: AgentPreviewProps) {
  // Bug 7 fix + js-index-maps: O(1) Map.get() instead of O(n) .find()
  const profile = selectedProfile ? profileMap.get(selectedProfile) : undefined;
  const hasAnySelection =
    selectedProfile ||
    selectedSkills.length > 0 ||
    selectedLayers.length > 0 ||
    selectedProvider;

  if (!hasAnySelection) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
        Agent Summary
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {profile && (
          <div className="flex items-start gap-2">
            <User size={16} className="mt-0.5 shrink-0 text-violet-500" />
            <div>
              <p className="text-xs font-medium text-gray-500">Profile</p>
              <p className="text-sm font-semibold text-gray-900">
                {profile.name}
              </p>
            </div>
          </div>
        )}
        {selectedSkills.length > 0 && (
          <div className="flex items-start gap-2">
            <Zap size={16} className="mt-0.5 shrink-0 text-amber-500" />
            <div>
              <p className="text-xs font-medium text-gray-500">Skills</p>
              <p className="text-sm font-semibold text-gray-900">
                {selectedSkills.length} selected
              </p>
            </div>
          </div>
        )}
        {selectedLayers.length > 0 && (
          <div className="flex items-start gap-2">
            <Layers size={16} className="mt-0.5 shrink-0 text-purple-500" />
            <div>
              <p className="text-xs font-medium text-gray-500">Layers</p>
              <p className="text-sm font-semibold text-gray-900">
                {selectedLayers.length} selected
              </p>
            </div>
          </div>
        )}
        {selectedProvider && (
          <div className="flex items-start gap-2">
            <Cpu size={16} className="mt-0.5 shrink-0 text-emerald-500" />
            <div>
              <p className="text-xs font-medium text-gray-500">Provider</p>
              <p className="text-sm font-semibold text-gray-900">
                {selectedProvider}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
