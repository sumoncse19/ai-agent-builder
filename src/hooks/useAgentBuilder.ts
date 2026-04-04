import { useState, useEffect, useRef } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import type { SavedAgent } from "../types/agent";
import type { AIProvider } from "../utils/constants";
import { useIndexedDB } from "./useIndexedDB";

export function useAgentBuilder() {
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<AIProvider | "">("");
  const [agentName, setAgentName] = useState("");
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  const [originalAgent, setOriginalAgent] = useState<SavedAgent | null>(null);
  const [savedAgents, setSavedAgents] = useIndexedDB<SavedAgent[]>(
    "savedAgents",
    [],
  );

  // Bug 3 fix: use ref for analytics heartbeat to avoid stale closure
  const agentNameRef = useRef(agentName);
  useEffect(() => {
    agentNameRef.current = agentName;
  }, [agentName]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (agentNameRef.current !== "") {
        console.log(
          `[Analytics Heartbeat] User is working on agent named: "${agentNameRef.current}"`,
        );
      } else {
        console.log(
          `[Analytics Heartbeat] User is working on an unnamed agent draft...`,
        );
      }
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const hasAnySelection =
    selectedProfile !== "" ||
    selectedSkills.length > 0 ||
    selectedLayers.length > 0 ||
    selectedProvider !== "";

  const canSave = agentName.trim() !== "" && hasAnySelection;

  // Dirty-checking: detect if anything changed from the loaded agent
  let hasChanges = false;
  if (editingAgentId && originalAgent) {
    hasChanges =
      agentName.trim() !== originalAgent.name ||
      selectedProfile !== originalAgent.profileId ||
      selectedProvider !== originalAgent.provider ||
      selectedSkills.length !== originalAgent.skillIds.length ||
      selectedLayers.length !== originalAgent.layerIds.length ||
      selectedSkills.some((id, i) => originalAgent.skillIds[i] !== id) ||
      selectedLayers.some((id, i) => originalAgent.layerIds[i] !== id);
  }

  // Bug 1 fix: all handlers create new arrays (no .push() mutation)
  function addSkill(skillId: string) {
    setSelectedSkills((prev) => {
      if (prev.includes(skillId)) return prev;
      return [...prev, skillId];
    });
  }

  function removeSkill(skillId: string) {
    setSelectedSkills((prev) => prev.filter((id) => id !== skillId));
  }

  function addLayer(layerId: string) {
    setSelectedLayers((prev) => {
      if (prev.includes(layerId)) return prev;
      return [...prev, layerId];
    });
  }

  function removeLayer(layerId: string) {
    setSelectedLayers((prev) => prev.filter((id) => id !== layerId));
  }

  function reorderSkills(oldIndex: number, newIndex: number) {
    setSelectedSkills((prev) => arrayMove(prev, oldIndex, newIndex));
  }

  function reorderLayers(oldIndex: number, newIndex: number) {
    setSelectedLayers((prev) => arrayMove(prev, oldIndex, newIndex));
  }

  function saveAgent() {
    if (!agentName.trim()) {
      toast.error("Please enter a name for your agent.");
      return;
    }

    const nameExists = savedAgents.some(
      (a) =>
        a.name.toLowerCase() === agentName.trim().toLowerCase() &&
        a.id !== editingAgentId,
    );
    if (nameExists) {
      toast.error(`An agent named "${agentName.trim()}" already exists.`);
      return;
    }

    if (editingAgentId) {
      setSavedAgents((prev) =>
        prev.map((a) =>
          a.id === editingAgentId
            ? {
                ...a,
                name: agentName.trim(),
                profileId: selectedProfile,
                skillIds: selectedSkills,
                layerIds: selectedLayers,
                provider: selectedProvider as AIProvider,
              }
            : a,
        ),
      );
      setEditingAgentId(null);
      setOriginalAgent(null);
      setAgentName("");
      toast.success(`Agent "${agentName.trim()}" updated!`);
    } else {
      const newAgent: SavedAgent = {
        id: crypto.randomUUID(),
        name: agentName.trim(),
        profileId: selectedProfile,
        skillIds: selectedSkills,
        layerIds: selectedLayers,
        provider: selectedProvider as AIProvider,
      };
      setSavedAgents((prev) => [...prev, newAgent]);
      setAgentName("");
      toast.success(`Agent "${newAgent.name}" saved!`);
    }
  }

  function loadAgent(agent: SavedAgent) {
    setSelectedProfile(agent.profileId || "");
    setSelectedSkills([...(agent.skillIds || [])]);
    setSelectedLayers([...(agent.layerIds || [])]);
    setSelectedProvider(agent.provider || "");
    setAgentName(agent.name);
    setEditingAgentId(agent.id);
    setOriginalAgent({ ...agent });
    toast.info(`Loaded agent "${agent.name}"`);
  }

  // Fixed: side effects moved outside the state updater
  function deleteAgent(index: number) {
    const agent = savedAgents[index];
    if (agent?.id === editingAgentId) {
      setEditingAgentId(null);
      setOriginalAgent(null);
    }
    setSavedAgents((prev) => prev.filter((_, i) => i !== index));
    if (agent) toast.success(`Deleted agent "${agent.name}"`);
  }

  function clearAllAgents() {
    setSavedAgents([]);
    setEditingAgentId(null);
    setOriginalAgent(null);
    toast.success("All saved agents cleared");
  }

  function resetBuilder() {
    setSelectedProfile("");
    setSelectedSkills([]);
    setSelectedLayers([]);
    setSelectedProvider("");
    setAgentName("");
    setEditingAgentId(null);
    setOriginalAgent(null);
  }

  return {
    selectedProfile,
    setSelectedProfile,
    selectedSkills,
    selectedLayers,
    selectedProvider,
    setSelectedProvider: (id: string) =>
      setSelectedProvider(id as AIProvider | ""),
    agentName,
    setAgentName,
    editingAgentId,
    canSave,
    hasChanges,
    addSkill,
    removeSkill,
    addLayer,
    removeLayer,
    reorderSkills,
    reorderLayers,
    saveAgent,
    loadAgent,
    deleteAgent,
    clearAllAgents,
    resetBuilder,
    savedAgents,
  };
}
