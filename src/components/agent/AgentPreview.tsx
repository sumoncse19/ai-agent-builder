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
  const profile = selectedProfile ? profileMap.get(selectedProfile) : undefined;
  const hasAnySelection =
    selectedProfile ||
    selectedSkills.length > 0 ||
    selectedLayers.length > 0 ||
    selectedProvider;

  if (!hasAnySelection) return null;

  return (
    <div className="animate-fade-up glass-card rounded-xl p-4">
      <h3 className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-widest text-ember-500">
        Agent Summary
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {profile && (
          <div className="flex items-start gap-2">
            <User size={14} className="mt-0.5 shrink-0 text-reasoning" />
            <div>
              <p className="font-mono text-[10px] font-medium text-forge-500">
                Profile
              </p>
              <p className="text-sm font-semibold text-forge-100">
                {profile.name}
              </p>
            </div>
          </div>
        )}
        {selectedSkills.length > 0 && (
          <div className="flex items-start gap-2">
            <Zap size={14} className="mt-0.5 shrink-0 text-ember-500" />
            <div>
              <p className="font-mono text-[10px] font-medium text-forge-500">
                Skills
              </p>
              <p className="text-sm font-semibold text-forge-100">
                {selectedSkills.length} selected
              </p>
            </div>
          </div>
        )}
        {selectedLayers.length > 0 && (
          <div className="flex items-start gap-2">
            <Layers size={14} className="mt-0.5 shrink-0 text-personality" />
            <div>
              <p className="font-mono text-[10px] font-medium text-forge-500">
                Layers
              </p>
              <p className="text-sm font-semibold text-forge-100">
                {selectedLayers.length} selected
              </p>
            </div>
          </div>
        )}
        {selectedProvider && (
          <div className="flex items-start gap-2">
            <Cpu size={14} className="mt-0.5 shrink-0 text-action" />
            <div>
              <p className="font-mono text-[10px] font-medium text-forge-500">
                Provider
              </p>
              <p className="text-sm font-semibold text-forge-100">
                {selectedProvider}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
