import { useState, useEffect } from "react";
import { RefreshCw, Clock, Bot } from "lucide-react";
import { cn } from "../../utils/cn";

// Bug 4 fix: isolated component so the 1s timer only re-renders this, not the entire app
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
    <div className="flex items-center gap-1.5 text-sm text-gray-500">
      <Clock size={14} />
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
    <header className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-violet-500 to-indigo-600 text-white shadow-md">
            <Bot size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              AI Agent Builder
            </h1>
            <p className="text-sm text-gray-500">
              Design your custom AI personality and capability set
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <SessionTimer />
          <button
            onClick={onRefetch}
            disabled={loading}
            className={cn(
              "flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow",
              loading && "cursor-not-allowed opacity-50",
            )}
          >
            <RefreshCw size={14} className={cn(loading && "animate-spin")} />
            {loading ? "Loading..." : "Reload Data"}
          </button>
        </div>
      </div>
    </header>
  );
}
