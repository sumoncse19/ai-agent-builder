import { useState, useEffect } from "react";
import { RefreshCw, Clock, Flame, Sun, Moon } from "lucide-react";
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
    <div className="flex items-center gap-1.5 font-mono text-xs text-text-muted">
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
  theme: "light" | "dark";
  onToggleTheme: () => void;
}

export function Header({
  loading,
  onRefetch,
  theme,
  onToggleTheme,
}: HeaderProps) {
  return (
    <header className="relative border-b border-border-default bg-surface-overlay backdrop-blur-xl">
      <div className="absolute inset-x-0 bottom-0 h-px animate-border-flow bg-linear-to-r from-transparent via-ember-500/60 to-transparent" />

      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-ember-500 to-ember-600 text-text-inverse shadow-lg shadow-ember-500/20">
            <Flame size={20} strokeWidth={2.5} />
            <div className="absolute inset-0 rounded-xl bg-linear-to-br from-ember-400/20 to-transparent" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-text-heading md:text-xl">
              Agent Forge
            </h1>
            <p className="hidden text-xs font-medium text-text-muted sm:block">
              Craft your custom AI agent
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SessionTimer />
          <button
            onClick={onToggleTheme}
            className="flex items-center justify-center rounded-lg border border-border-default bg-surface-primary p-1.5 text-text-secondary transition-all hover:border-border-strong hover:bg-surface-elevated hover:text-text-primary"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <button
            onClick={onRefetch}
            disabled={loading}
            className={cn(
              "flex items-center gap-2 rounded-lg border border-border-default bg-surface-primary px-3 py-1.5 font-mono text-xs font-medium text-text-secondary transition-all hover:border-border-strong hover:bg-surface-elevated hover:text-text-primary",
              loading && "cursor-not-allowed opacity-40",
            )}
          >
            <RefreshCw size={12} className={cn(loading && "animate-spin")} />
            <span className="hidden sm:inline">
              {loading ? "Syncing..." : "Reload"}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
