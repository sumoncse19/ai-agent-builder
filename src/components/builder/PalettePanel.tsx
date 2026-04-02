import { useState, useMemo, useRef } from "react";
import { User, Zap, Layers, Cpu, Search } from "lucide-react";
import type { AgentData } from "../../types/agent";
import { AI_PROVIDERS } from "../../utils/constants";
import { PaletteSection } from "./PaletteSection";
import { DraggableItem } from "./DraggableItem";

type SectionId = "profiles" | "skills" | "layers" | "providers";

interface PalettePanelProps {
  data: AgentData;
  selectedProfile: string;
  selectedSkills: string[];
  selectedLayers: string[];
  selectedProvider: string;
  onAddProfile: (id: string) => void;
  onAddSkill: (id: string) => void;
  onAddLayer: (id: string) => void;
  onAddProvider: (id: string) => void;
}

export function PalettePanel({
  data,
  selectedProfile,
  selectedSkills,
  selectedLayers,
  selectedProvider,
  onAddProfile,
  onAddSkill,
  onAddLayer,
  onAddProvider,
}: PalettePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSection, setOpenSection] = useState<SectionId | null>("profiles");
  const scrollRef = useRef<HTMLDivElement>(null);
  const query = searchQuery.toLowerCase();

  const SECTION_ORDER: SectionId[] = [
    "profiles",
    "skills",
    "layers",
    "providers",
  ];
  const HEADER_HEIGHT = 44;

  const toggleSection = (id: SectionId) => {
    setOpenSection((prev) => (prev === id ? null : id));
    const index = SECTION_ORDER.indexOf(id);
    scrollRef.current?.scrollTo({
      top: index * HEADER_HEIGHT,
      behavior: "smooth",
    });
  };

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
        <h2 className="mb-1 text-base font-bold text-gray-900">
          Component Palette
        </h2>
        <p className="mb-3 text-xs text-gray-400 lg:hidden">
          Tap to add, or drag on desktop
        </p>
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

      <div
        ref={scrollRef}
        className="max-h-[50vh] flex-1 overflow-y-auto lg:max-h-none"
      >
        <PaletteSection
          title="Profiles"
          icon={<User size={16} />}
          count={filteredProfiles.length}
          isOpen={openSection === "profiles"}
          onToggle={() => toggleSection("profiles")}
        >
          {filteredProfiles.map((profile) => (
            <DraggableItem
              key={profile.id}
              id={profile.id}
              type="profile"
              name={profile.name}
              description={profile.description}
              isPlaced={selectedProfile === profile.id}
              onTap={() => onAddProfile(profile.id)}
            />
          ))}
        </PaletteSection>

        <PaletteSection
          title="Skills"
          icon={<Zap size={16} />}
          count={filteredSkills.length}
          isOpen={openSection === "skills"}
          onToggle={() => toggleSection("skills")}
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
              onTap={() => onAddSkill(skill.id)}
            />
          ))}
        </PaletteSection>

        <PaletteSection
          title="Layers"
          icon={<Layers size={16} />}
          count={filteredLayers.length}
          isOpen={openSection === "layers"}
          onToggle={() => toggleSection("layers")}
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
              onTap={() => onAddLayer(layer.id)}
            />
          ))}
        </PaletteSection>

        <PaletteSection
          title="Providers"
          icon={<Cpu size={16} />}
          count={filteredProviders.length}
          isOpen={openSection === "providers"}
          onToggle={() => toggleSection("providers")}
        >
          {filteredProviders.map((provider) => (
            <DraggableItem
              key={provider}
              id={provider}
              type="provider"
              name={provider}
              isPlaced={selectedProvider === provider}
              onTap={() => onAddProvider(provider)}
            />
          ))}
        </PaletteSection>
      </div>
    </div>
  );
}
