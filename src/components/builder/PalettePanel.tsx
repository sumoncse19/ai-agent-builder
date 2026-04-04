import { useState, useRef } from "react";
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

  const filteredProfiles = data.agentProfiles.filter(
    (p) =>
      p.name.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query),
  );

  const filteredSkills = data.skills.filter(
    (s) =>
      s.name.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query),
  );

  const filteredLayers = data.layers.filter(
    (l) =>
      l.name.toLowerCase().includes(query) ||
      l.type.toLowerCase().includes(query) ||
      l.description.toLowerCase().includes(query),
  );

  const filteredProviders = AI_PROVIDERS.filter((p) =>
    p.toLowerCase().includes(query),
  );

  const canvasOffset =
    (selectedProfile ? 70 : 0) +
    selectedSkills.length * 40 +
    selectedLayers.length * 40 +
    (selectedProvider ? 48 : 0);

  return (
    <div className="glass-card flex h-full flex-col rounded-xl">
      <div className="border-b border-border-subtle p-4">
        <h2 className="mb-0.5 text-sm font-bold uppercase tracking-widest text-text-secondary">
          Components
        </h2>
        <p className="mb-3 text-[11px] text-text-muted lg:hidden">
          Tap to add, or drag on desktop
        </p>
        <div className="relative">
          <Search
            size={14}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
          />
          <input
            type="text"
            placeholder="Search components..."
            aria-label="Search components"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-border-strong bg-surface-secondary py-2 pl-9 pr-3 font-mono text-xs text-text-primary placeholder-text-muted transition-all focus:border-ember-500/50 focus:bg-surface-primary focus:outline-none focus:ring-1 focus:ring-ember-500/30"
          />
        </div>
      </div>

      <div
        ref={scrollRef}
        className="max-h-[50vh] flex-1 overflow-y-auto lg:max-h-(--palette-max)"
        style={
          {
            "--palette-max": `calc(100vh - ${320 - canvasOffset}px)`,
          } as React.CSSProperties
        }
      >
        <PaletteSection
          title="Profiles"
          icon={<User size={14} />}
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
          icon={<Zap size={14} />}
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
          icon={<Layers size={14} />}
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
          icon={<Cpu size={14} />}
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
