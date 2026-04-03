import { User, Zap, Layers, Cpu } from "lucide-react";
import type {
  AgentProfile,
  Skill,
  Layer,
  DragItemType,
} from "../../types/agent";
import { DropZone } from "./DropZone";
import { AgentPreview } from "../agent/AgentPreview";
import { SaveAgentForm } from "../agent/SaveAgentForm";

interface BuilderCanvasProps {
  profileMap: Map<string, AgentProfile>;
  skillMap: Map<string, Skill>;
  layerMap: Map<string, Layer>;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  selectedProvider: string;
  agentName: string;
  isEditing: boolean;
  canSave: boolean;
  hasChanges: boolean;
  activeDragType: DragItemType | null;
  onRemoveProfile: () => void;
  onRemoveSkill: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onRemoveProvider: () => void;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onReset: () => void;
}

export function BuilderCanvas({
  profileMap,
  skillMap,
  layerMap,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
  agentName,
  isEditing,
  canSave,
  hasChanges,
  activeDragType,
  onRemoveProfile,
  onRemoveSkill,
  onRemoveLayer,
  onRemoveProvider,
  onNameChange,
  onSave,
  onReset,
}: BuilderCanvasProps) {
  const profile = selectedProfile ? profileMap.get(selectedProfile) : undefined;
  const profileItem = profile ? { id: profile.id, name: profile.name } : null;

  const skillItems = selectedSkills.map((id) => {
    const s = skillMap.get(id);
    return {
      id,
      name: s?.name || id,
      badge: s
        ? { label: s.category, variant: "category" as const }
        : undefined,
    };
  });

  const layerItems = selectedLayers.map((id) => {
    const l = layerMap.get(id);
    return {
      id,
      name: l?.name || id,
      badge: l ? { label: l.type, variant: "type" as const } : undefined,
    };
  });

  const providerItem = selectedProvider
    ? { id: selectedProvider, name: selectedProvider }
    : null;

  return (
    <div className="dot-grid flex flex-col gap-4 rounded-xl border border-forge-700/30 bg-forge-900/50 p-4 md:p-5">
      <h2 className="text-xs font-bold uppercase tracking-widest text-forge-300">
        Agent Canvas
      </h2>

      <div className="stagger-children flex flex-col gap-3">
        <DropZone
          id="drop-profile"
          type="profile"
          label="Base Profile"
          icon={<User size={14} />}
          mode="single"
          item={profileItem}
          onRemove={onRemoveProfile}
          activeDragType={activeDragType}
        />

        <DropZone
          id="drop-skills"
          type="skill"
          label="Skills"
          icon={<Zap size={14} />}
          mode="multi"
          items={skillItems}
          onRemove={onRemoveSkill}
          activeDragType={activeDragType}
        />

        <DropZone
          id="drop-layers"
          type="layer"
          label="Personality Layers"
          icon={<Layers size={14} />}
          mode="multi"
          items={layerItems}
          onRemove={onRemoveLayer}
          activeDragType={activeDragType}
        />

        <DropZone
          id="drop-provider"
          type="provider"
          label="AI Provider"
          icon={<Cpu size={14} />}
          mode="single"
          item={providerItem}
          onRemove={onRemoveProvider}
          activeDragType={activeDragType}
        />
      </div>

      <AgentPreview
        profileMap={profileMap}
        selectedProfile={selectedProfile}
        selectedSkills={selectedSkills}
        selectedLayers={selectedLayers}
        selectedProvider={selectedProvider}
      />

      <SaveAgentForm
        agentName={agentName}
        isEditing={isEditing}
        canSave={canSave}
        hasChanges={hasChanges}
        onNameChange={onNameChange}
        onSave={onSave}
        onReset={onReset}
      />
    </div>
  );
}
