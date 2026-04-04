import type { AIProvider } from "../utils/constants";

export type SkillCategory = "information" | "action";

export type LayerType = "reasoning" | "personality" | "context" | "formatting";

export interface AgentProfile {
  id: string;
  name: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  description: string;
}

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  description: string;
}

export interface AgentData {
  agentProfiles: AgentProfile[];
  skills: Skill[];
  layers: Layer[];
}

export interface SavedAgent {
  id: string;
  name: string;
  profileId: string;
  skillIds: string[];
  layerIds: string[];
  provider: AIProvider;
}

export type DragItemType = "profile" | "skill" | "layer" | "provider";

export interface DragData {
  type: DragItemType;
  id: string;
  name: string;
  description?: string;
  category?: SkillCategory;
  layerType?: LayerType;
}
