import { useState, useEffect } from "react";
import { RefreshCw, Clock, Flame } from "lucide-react";
import { cn } from "../../utils/cn";

function SessionTimer() {
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSessionTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(sessionTime / 60);
  const seconds = sessionTime % 60;

  return (
    <div className="flex items-center gap-1.5 font-mono text-xs text-forge-400">
      <Clock size={12} />
      <span>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
}

interface HeaderProps {
  loading: boolean;
  onRefetch: () => void;
}

export function Header({ loading, onRefetch }: HeaderProps) {
  return (
    <header className="relative border-b border-forge-700/50 bg-forge-900/80 backdrop-blur-xl">
      {/* Animated gradient accent line */}
      <div className="absolute inset-x-0 bottom-0 h-px animate-border-flow bg-gradient-to-r from-transparent via-ember-500/60 to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ember-500 to-ember-600 text-forge-950 shadow-lg shadow-ember-500/20">
            <Flame size={20} strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-ember-400/20 to-transparent" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-forge-50 md:text-xl">
              Agent Forge
            </h1>
            <p className="hidden text-xs font-medium text-forge-400 sm:block">
              Craft your custom AI agent
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <SessionTimer />
          <button
            onClick={onRefetch}
            disabled={loading}
            className={cn(
              "flex items-center gap-2 rounded-lg border border-forge-600 bg-forge-800 px-3 py-1.5 font-mono text-xs font-medium text-forge-200 transition-all hover:border-forge-500 hover:bg-forge-700 hover:text-forge-100",
              loading && "cursor-not-allowed opacity-40",
            )}
          >
            <RefreshCw size={12} className={cn(loading && "animate-spin")} />
            {loading ? "Syncing..." : "Reload"}
          </button>
        </div>
      </div>
    </header>
  );
}
