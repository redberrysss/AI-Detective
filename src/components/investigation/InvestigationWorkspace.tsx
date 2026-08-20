"use client";

import { useInvestigationStore } from "@/stores/investigation-store";
import { useTimer } from "@/hooks/use-timer";
import { FileText, Users, MapPin, Clock, Link2, Brain, PenLine, AlertTriangle, Volume2, VolumeX, ChevronRight } from "lucide-react";
import CenterWorkspace from "./CenterWorkspace";
import AIAssistant from "./AIAssistant";

const navItems = [
  { id: "overview", label: "CASE OVERVIEW", icon: FileText },
  { id: "evidence", label: "EVIDENCE", icon: FileText },
  { id: "suspects", label: "SUSPECTS", icon: Users },
  { id: "witnesses", label: "WITNESSES", icon: Users },
  { id: "locations", label: "LOCATIONS", icon: MapPin },
  { id: "timeline", label: "TIMELINE", icon: Clock },
  { id: "board", label: "INVESTIGATION BOARD", icon: Link2 },
  { id: "analysis", label: "AI ANALYSIS", icon: Brain },
  { id: "notes", label: "NOTES", icon: PenLine },
  { id: "deduction", label: "FINAL DEDUCTION", icon: AlertTriangle },
];

export default function InvestigationWorkspace() {
  const {
    currentCase,
    state,
    activePanel,
    setActivePanel,
    muteSound,
    setMuteSound,
    setShowDeduction,
  } = useInvestigationStore();

  if (!currentCase || !state) {
    return (
      <div className="min-h-screen bg-detective-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-detective-muted font-mono text-sm">
            No active investigation.
          </p>
        </div>
      </div>
    );
  }

  return <WorkspaceContent currentCase={currentCase} state={state} activePanel={activePanel} setActivePanel={setActivePanel} muteSound={muteSound} setMuteSound={setMuteSound} setShowDeduction={setShowDeduction} />;
}

function WorkspaceContent({
  currentCase,
  state,
  activePanel,
  setActivePanel,
  muteSound,
  setMuteSound,
  setShowDeduction,
}: {
  currentCase: NonNullable<ReturnType<typeof useInvestigationStore.getState>["currentCase"]>;
  state: NonNullable<ReturnType<typeof useInvestigationStore.getState>["state"]>;
  activePanel: string;
  setActivePanel: (p: string) => void;
  muteSound: boolean;
  setMuteSound: (m: boolean) => void;
  setShowDeduction: (s: boolean) => void;
}) {
  const { formatted } = useTimer(state.startTime);

  return (
    <div className="min-h-screen bg-detective-surface flex flex-col">
      {/* Top Bar */}
      <div className="h-12 border-b border-white/5 flex items-center px-4 bg-detective-panel/80 backdrop-blur-sm z-20 shrink-0">
        <div className="flex items-center gap-6 text-[10px] font-mono tracking-widest">
          <span className="text-detective-red">{currentCase.metadata.id}</span>
          <span className="text-detective-muted">
            STATUS: <span className="text-green-400">ACTIVE</span>
          </span>
          <span className="text-detective-muted">
            TIME: <span className="text-white/70">{formatted}</span>
          </span>
          <span className="text-detective-muted">
            EVIDENCE:{" "}
            <span className="text-white/70">
              {state.discoveredEvidence.length}/
              {currentCase.evidence.length}
            </span>
          </span>
          <span className="text-detective-muted">
            CONFIDENCE:{" "}
            <span
              className={
                state.currentConfidence >= 70
                  ? "text-green-400"
                  : state.currentConfidence >= 40
                    ? "text-amber-400"
                    : "text-white/70"
              }
            >
              {state.currentConfidence}%
            </span>
          </span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setMuteSound(!muteSound)}
            className="text-detective-muted hover:text-white/70 transition-colors"
          >
            {muteSound ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-56 border-r border-white/5 bg-detective-panel/50 shrink-0 overflow-y-auto">
          <div className="p-3">
            <div className="text-[9px] font-mono text-detective-muted tracking-[0.2em] mb-3 px-2">
              INVESTIGATION MENU
            </div>
            <nav className="space-y-0.5">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === "deduction") {
                      setShowDeduction(true);
                    }
                    setActivePanel(item.id);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 text-left text-[11px] font-mono tracking-wider transition-all duration-200 ${
                    activePanel === item.id
                      ? "bg-white/[0.06] text-white border-l-2 border-detective-red"
                      : "text-detective-muted hover:text-white/70 hover:bg-white/[0.02] border-l-2 border-transparent"
                  }`}
                >
                  <item.icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{item.label}</span>
                  {item.id === "deduction" && (
                    <ChevronRight className="w-3 h-3 ml-auto" />
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Center Workspace */}
        <div className="flex-1 overflow-y-auto">
          <CenterWorkspace />
        </div>

        {/* Right Sidebar — AI Assistant */}
        <div className="w-80 border-l border-white/5 bg-detective-panel/50 shrink-0 flex flex-col overflow-hidden">
          <AIAssistant />
        </div>
      </div>
    </div>
  );
}
