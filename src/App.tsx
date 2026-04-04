import { Toaster } from "sonner";
import { useAgentData } from "./hooks/useAgentData";
import { useAgentBuilder } from "./hooks/useAgentBuilder";
import { useTheme } from "./hooks/useTheme";
import { Header } from "./components/layout/Header";
import { Layout } from "./components/layout/Layout";
import { DragDropBuilder } from "./components/builder/DragDropBuilder";
import { SavedAgentsList } from "./components/agent/SavedAgentsList";

const toastStyleDark = {
  background: "var(--color-forge-800)",
  border: "1px solid var(--color-forge-600)",
  color: "var(--color-forge-100)",
} as const;

const toastStyleLight = {
  background: "#ffffff",
  border: "1px solid #dfe1ec",
  color: "#1e2035",
} as const;

function App() {
  const { data, loading, error, refetch, profileMap, skillMap, layerMap } =
    useAgentData();
  const builder = useAgentBuilder();
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <Toaster
        position="top-right"
        richColors
        theme={theme}
        toastOptions={{
          style: theme === "dark" ? toastStyleDark : toastStyleLight,
        }}
      />
      <Layout
        header={
          <Header
            loading={loading}
            onRefetch={refetch}
            theme={theme}
            onToggleTheme={toggleTheme}
          />
        }
        footer={
          <SavedAgentsList
            agents={builder.savedAgents}
            profileMap={profileMap}
            onLoad={builder.loadAgent}
            onDelete={builder.deleteAgent}
            onClearAll={builder.clearAllAgents}
          />
        }
      >
        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            Error: {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-border-default border-t-ember-500" />
              <p className="font-mono text-xs text-text-muted">
                Loading configuration data...
              </p>
            </div>
          </div>
        )}

        {!data && !loading && !error && (
          <div className="flex items-center justify-center py-20 text-text-muted">
            <p className="text-sm">
              No data loaded. Click "Reload" to try again.
            </p>
          </div>
        )}

        {data && !loading && (
          <DragDropBuilder
            data={data}
            profileMap={profileMap}
            skillMap={skillMap}
            layerMap={layerMap}
            selectedProfile={builder.selectedProfile}
            selectedSkills={builder.selectedSkills}
            selectedLayers={builder.selectedLayers}
            selectedProvider={builder.selectedProvider}
            agentName={builder.agentName}
            isEditing={builder.editingAgentId !== null}
            canSave={builder.canSave}
            hasChanges={builder.hasChanges}
            onSetProfile={builder.setSelectedProfile}
            onAddSkill={builder.addSkill}
            onRemoveSkill={builder.removeSkill}
            onAddLayer={builder.addLayer}
            onRemoveLayer={builder.removeLayer}
            onSetProvider={builder.setSelectedProvider}
            onReorderSkills={builder.reorderSkills}
            onReorderLayers={builder.reorderLayers}
            onNameChange={builder.setAgentName}
            onSave={builder.saveAgent}
            onReset={builder.resetBuilder}
          />
        )}
      </Layout>
    </>
  );
}

export default App;
