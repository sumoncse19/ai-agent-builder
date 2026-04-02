import { Toaster } from "sonner";
import { useAgentData } from "./hooks/useAgentData";
import { useAgentBuilder } from "./hooks/useAgentBuilder";
import { Header } from "./components/layout/Header";
import { Layout } from "./components/layout/Layout";
import { DragDropBuilder } from "./components/builder/DragDropBuilder";
import { SavedAgentsList } from "./components/agent/SavedAgentsList";

function App() {
  const { data, loading, error, refetch, profileMap, skillMap, layerMap } =
    useAgentData();
  const builder = useAgentBuilder();

  return (
    <>
      <Toaster position="top-right" richColors />
      <Layout
        header={<Header loading={loading} onRefetch={refetch} />}
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
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            Error: {error}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
              <p className="text-sm text-gray-500">
                Loading configuration data...
              </p>
            </div>
          </div>
        )}

        {!data && !loading && !error && (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <p>No data loaded. Click "Reload Data" to try again.</p>
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
