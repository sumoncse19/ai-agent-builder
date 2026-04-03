import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { toast } from "sonner";
import type { SavedAgent } from "../types/agent";
import { useIndexedDB } from "./useIndexedDB";

export function useAgentBuilder() {
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedLayers, setSelectedLayers] = useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [agentName, setAgentName] = useState("");
  const [editingAgentId, setEditingAgentId] = useState<string | null>(null);
  // Track original state when loading an agent, for dirty-checking
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

  // Fix #3: can't save without name AND at least one selection
  const hasAnySelection =
    selectedProfile !== "" ||
    selectedSkills.length > 0 ||
    selectedLayers.length > 0 ||
    selectedProvider !== "";

  const canSave = agentName.trim() !== "" && hasAnySelection;

  // Fix #4: detect if anything changed from the loaded agent
  const hasChanges = useMemo(() => {
    if (!editingAgentId || !originalAgent) return false;
    return (
      agentName.trim() !== originalAgent.name ||
      selectedProfile !== originalAgent.profileId ||
      selectedProvider !== originalAgent.provider ||
      selectedSkills.length !== originalAgent.skillIds.length ||
      selectedLayers.length !== originalAgent.layerIds.length ||
      selectedSkills.some((id, i) => originalAgent.skillIds[i] !== id) ||
      selectedLayers.some((id, i) => originalAgent.layerIds[i] !== id)
    );
  }, [
    editingAgentId,
    originalAgent,
    agentName,
    selectedProfile,
    selectedProvider,
    selectedSkills,
    selectedLayers,
  ]);

  // Bug 1 fix: all handlers create new arrays (no .push() mutation)
  const addSkill = useCallback((skillId: string) => {
    setSelectedSkills((prev) => {
      if (prev.includes(skillId)) return prev;
      return [...prev, skillId];
    });
  }, []);

  const removeSkill = useCallback((skillId: string) => {
    setSelectedSkills((prev) => prev.filter((id) => id !== skillId));
  }, []);

  const addLayer = useCallback((layerId: string) => {
    setSelectedLayers((prev) => {
      if (prev.includes(layerId)) return prev;
      return [...prev, layerId];
    });
  }, []);

  const removeLayer = useCallback((layerId: string) => {
    setSelectedLayers((prev) => prev.filter((id) => id !== layerId));
  }, []);

  const reorderSkills = useCallback((oldIndex: number, newIndex: number) => {
    setSelectedSkills((prev) => arrayMove(prev, oldIndex, newIndex));
  }, []);

  const reorderLayers = useCallback((oldIndex: number, newIndex: number) => {
    setSelectedLayers((prev) => arrayMove(prev, oldIndex, newIndex));
  }, []);

  const saveAgent = useCallback(() => {
    if (!agentName.trim()) {
      toast.error("Please enter a name for your agent.");
      return;
    }

    // When editing, allow the same name for the agent being edited
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
      // Update existing agent
      setSavedAgents((prev) =>
        prev.map((a) =>
          a.id === editingAgentId
            ? {
                ...a,
                name: agentName.trim(),
                profileId: selectedProfile,
                skillIds: selectedSkills,
                layerIds: selectedLayers,
                provider: selectedProvider,
              }
            : a,
        ),
      );
      setEditingAgentId(null);
      setOriginalAgent(null);
      setAgentName("");
      toast.success(`Agent "${agentName.trim()}" updated!`);
    } else {
      // Create new agent
      const newAgent: SavedAgent = {
        id: crypto.randomUUID(),
        name: agentName.trim(),
        profileId: selectedProfile,
        skillIds: selectedSkills,
        layerIds: selectedLayers,
        provider: selectedProvider,
      };
      setSavedAgents((prev) => [...prev, newAgent]);
      setAgentName("");
      toast.success(`Agent "${newAgent.name}" saved!`);
    }
  }, [
    agentName,
    editingAgentId,
    savedAgents,
    selectedProfile,
    selectedSkills,
    selectedLayers,
    selectedProvider,
    setSavedAgents,
  ]);

  const loadAgent = useCallback((agent: SavedAgent) => {
    setSelectedProfile(agent.profileId || "");
    setSelectedSkills([...(agent.skillIds || [])]);
    setSelectedLayers([...(agent.layerIds || [])]);
    setSelectedProvider(agent.provider || "");
    setAgentName(agent.name);
    setEditingAgentId(agent.id);
    // Store original snapshot for dirty-checking
    setOriginalAgent({ ...agent });
    // Fix #5: say "Loaded" not "Editing"
    toast.info(`Loaded agent "${agent.name}"`);
  }, []);

  const deleteAgent = useCallback(
    (index: number) => {
      setSavedAgents((prev) => {
        const agent = prev[index];
        if (agent?.id === editingAgentId) {
          setEditingAgentId(null);
          setOriginalAgent(null);
        }
        const updated = prev.filter((_, i) => i !== index);
        toast.success(`Deleted agent "${agent?.name}"`);
        return updated;
      });
    },
    [setSavedAgents, editingAgentId],
  );

  const clearAllAgents = useCallback(() => {
    setSavedAgents([]);
    setEditingAgentId(null);
    setOriginalAgent(null);
    toast.success("All saved agents cleared");
  }, [setSavedAgents]);

  const resetBuilder = useCallback(() => {
    setSelectedProfile("");
    setSelectedSkills([]);
    setSelectedLayers([]);
    setSelectedProvider("");
    setAgentName("");
    setEditingAgentId(null);
    setOriginalAgent(null);
  }, []);

  return {
    selectedProfile,
    setSelectedProfile,
    selectedSkills,
    selectedLayers,
    selectedProvider,
    setSelectedProvider,
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
