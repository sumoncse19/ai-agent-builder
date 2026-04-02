import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import type {
  AgentData,
  AgentProfile,
  Skill,
  Layer,
  DragData,
  DragItemType,
} from "../../types/agent";
import { PalettePanel } from "./PalettePanel";
import { BuilderCanvas } from "./BuilderCanvas";
import { DragOverlayContent } from "./DragOverlayContent";

interface DragDropBuilderProps {
  data: AgentData;
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
  onSetProfile: (id: string) => void;
  onAddSkill: (id: string) => void;
  onRemoveSkill: (id: string) => void;
  onAddLayer: (id: string) => void;
  onRemoveLayer: (id: string) => void;
  onSetProvider: (id: string) => void;
  onReorderSkills: (oldIndex: number, newIndex: number) => void;
  onReorderLayers: (oldIndex: number, newIndex: number) => void;
  onNameChange: (name: string) => void;
  onSave: () => void;
  onReset: () => void;
}

export function DragDropBuilder({
  data,
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
  onSetProfile,
  onAddSkill,
  onRemoveSkill,
  onAddLayer,
  onRemoveLayer,
  onSetProvider,
  onReorderSkills,
  onReorderLayers,
  onNameChange,
  onSave,
  onReset,
}: DragDropBuilderProps) {
  const [activeData, setActiveData] = useState<DragData | null>(null);
  const [activeDragType, setActiveDragType] = useState<DragItemType | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const data = event.active.data.current as DragData | undefined;
    if (data) {
      setActiveData(data);
      setActiveDragType(data.type);
    }
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveData(null);
      setActiveDragType(null);

      if (!over) return;

      const dragData = active.data.current as DragData | undefined;
      if (!dragData) return;

      const overData = over.data.current as { type?: DragItemType } | undefined;

      // Handle drop from palette to canvas
      if (String(active.id).startsWith("palette-")) {
        // overData.type exists when dropping directly on a DropZone.
        // When dropping on a SortableItem inside a zone, type is undefined —
        // infer the zone type by checking which selected array contains the over.id.
        let dropType = overData?.type;
        if (!dropType) {
          const overId = String(over.id);
          if (selectedSkills.includes(overId)) dropType = "skill";
          else if (selectedLayers.includes(overId)) dropType = "layer";
        }
        if (!dropType || dropType !== dragData.type) return;

        switch (dragData.type) {
          case "profile":
            onSetProfile(dragData.id);
            break;
          case "skill":
            onAddSkill(dragData.id);
            break;
          case "layer":
            onAddLayer(dragData.id);
            break;
          case "provider":
            onSetProvider(dragData.id);
            break;
        }
        return;
      }

      // Handle reorder within sortable zones
      if (active.id !== over.id) {
        const activeId = String(active.id);
        const targetId = String(over.id);

        if (
          selectedSkills.includes(activeId) &&
          selectedSkills.includes(targetId)
        ) {
          const oldIndex = selectedSkills.indexOf(activeId);
          const newIndex = selectedSkills.indexOf(targetId);
          onReorderSkills(oldIndex, newIndex);
        } else if (
          selectedLayers.includes(activeId) &&
          selectedLayers.includes(targetId)
        ) {
          const oldIndex = selectedLayers.indexOf(activeId);
          const newIndex = selectedLayers.indexOf(targetId);
          onReorderLayers(oldIndex, newIndex);
        }
      }
    },
    [
      selectedSkills,
      selectedLayers,
      onSetProfile,
      onAddSkill,
      onAddLayer,
      onSetProvider,
      onReorderSkills,
      onReorderLayers,
    ],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-120px)] lg:overflow-hidden">
          <PalettePanel
            data={data}
            selectedProfile={selectedProfile}
            selectedSkills={selectedSkills}
            selectedLayers={selectedLayers}
            selectedProvider={selectedProvider}
          />
        </div>
        <BuilderCanvas
          profileMap={profileMap}
          skillMap={skillMap}
          layerMap={layerMap}
          selectedProfile={selectedProfile}
          selectedSkills={selectedSkills}
          selectedLayers={selectedLayers}
          selectedProvider={selectedProvider}
          agentName={agentName}
          isEditing={isEditing}
          canSave={canSave}
          hasChanges={hasChanges}
          activeDragType={activeDragType}
          onRemoveProfile={() => onSetProfile("")}
          onRemoveSkill={onRemoveSkill}
          onRemoveLayer={onRemoveLayer}
          onRemoveProvider={() => onSetProvider("")}
          onNameChange={onNameChange}
          onSave={onSave}
          onReset={onReset}
        />
      </div>

      <DragOverlay dropAnimation={null}>
        {activeData ? <DragOverlayContent data={activeData} /> : null}
      </DragOverlay>
    </DndContext>
  );
}
