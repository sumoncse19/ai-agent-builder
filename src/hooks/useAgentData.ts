import { useState, useEffect, useCallback, useMemo } from "react";
import type { AgentData, AgentProfile, Skill, Layer } from "../types/agent";

export function useAgentData() {
  const [data, setData] = useState<AgentData | null>(null);
  // Bug 5 fix: initialize loading to true since we fetch on mount
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/data.json");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const jsonData: AgentData = await response.json();
      setData(jsonData);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch agent data";
      console.error("Error fetching data:", err);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Bug 2 fix: fetch exactly once on mount — no re-fetching on selection changes
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // js-index-maps: build Map<id, item> for O(1) lookups instead of .find() O(n)
  const profileMap = useMemo(
    () =>
      new Map<string, AgentProfile>(
        data?.agentProfiles.map((p) => [p.id, p]) ?? [],
      ),
    [data?.agentProfiles],
  );
  const skillMap = useMemo(
    () => new Map<string, Skill>(data?.skills.map((s) => [s.id, s]) ?? []),
    [data?.skills],
  );
  const layerMap = useMemo(
    () => new Map<string, Layer>(data?.layers.map((l) => [l.id, l]) ?? []),
    [data?.layers],
  );

  return {
    data,
    loading,
    error,
    refetch: fetchData,
    profileMap,
    skillMap,
    layerMap,
  };
}
