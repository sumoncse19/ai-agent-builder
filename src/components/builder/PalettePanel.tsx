import { useState, useMemo } from "react";
import { User, Zap, Layers, Cpu, Search } from "lucide-react";
import type { AgentData } from "../../types/agent";
import { AI_PROVIDERS } from "../../utils/constants";
import { PaletteSection } from "./PaletteSection";
import { DraggableItem } from "./DraggableItem";

interface PalettePanelProps {
  data: AgentData;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  selectedProvider: string;
}

export function PalettePanel({
  data,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
}: PalettePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const query = searchQuery.toLowerCase();

  const filteredProfiles = useMemo(
    () =>
      data.agentProfiles.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query),
      ),
    [data.agentProfiles, query],
  );

  const filteredSkills = useMemo(
    () =>
      data.skills.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query),
      ),
    [data.skills, query],
  );

  const filteredLayers = useMemo(
    () =>
      data.layers.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.type.toLowerCase().includes(query) ||
          l.description.toLowerCase().includes(query),
      ),
    [data.layers, query],
  );

  const filteredProviders = useMemo(
    () => AI_PROVIDERS.filter((p) => p.toLowerCase().includes(query)),
    [query],
  );

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 p-4">
        <h2 className="mb-3 text-base font-bold text-gray-900">
          Component Palette
        </h2>
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search components..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm placeholder-gray-400 transition-colors focus:border-violet-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-violet-100"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <PaletteSection
          title="Profiles"
          icon={<User size={16} />}
          count={filteredProfiles.length}
        >
          {filteredProfiles.map((profile) => (
            <DraggableItem
              key={profile.id}
              id={profile.id}
              type="profile"
              name={profile.name}
              description={profile.description}
              isPlaced={selectedProfile === profile.id}
            />
          ))}
        </PaletteSection>

        <PaletteSection
          title="Skills"
          icon={<Zap size={16} />}
          count={filteredSkills.length}
        >
          {filteredSkills.map((skill) => (
            <DraggableItem
              key={skill.id}
              id={skill.id}
              type="skill"
              name={skill.name}
              description={skill.description}
              badge={{ label: skill.category, variant: "category" }}
              isPlaced={selectedSkills.includes(skill.id)}
            />
          ))}
        </PaletteSection>

        <PaletteSection
          title="Layers"
          icon={<Layers size={16} />}
          count={filteredLayers.length}
        >
          {filteredLayers.map((layer) => (
            <DraggableItem
              key={layer.id}
              id={layer.id}
              type="layer"
              name={layer.name}
              description={layer.description}
              badge={{ label: layer.type, variant: "type" }}
              isPlaced={selectedLayers.includes(layer.id)}
            />
          ))}
        </PaletteSection>

        <PaletteSection
          title="Providers"
          icon={<Cpu size={16} />}
          count={filteredProviders.length}
        >
          {filteredProviders.map((provider) => (
            <DraggableItem
              key={provider}
              id={provider}
              type="provider"
              name={provider}
              isPlaced={selectedProvider === provider}
            />
          ))}
        </PaletteSection>
      </div>
    </div>
  );
}
