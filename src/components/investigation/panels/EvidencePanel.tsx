"use client";

import { useInvestigationStore } from "@/stores/investigation-store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  MapPin,
  Star,
  X,
} from "lucide-react";
import {
  getCategoryIcon,
  getReliabilityColor,
  formatTimestamp,
} from "@/lib/utils";

export default function EvidencePanel() {
  const {
    currentCase,
    state,
    selectedEvidence,
    setSelectedEvidence,
    discoverEvidence,
  } = useInvestigationStore();
  if (!currentCase || !state) return null;

  const selected = currentCase.evidence.find((e) => e.id === selectedEvidence);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white font-heading tracking-tight">
            EVIDENCE LOCKER
          </h2>
          <div className="text-[10px] font-mono text-detective-muted tracking-widest mt-1">
            {state.discoveredEvidence.length}/{currentCase.evidence.length}{" "}
            DISCOVERED
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-detective-muted" />
          <input
            placeholder="Search evidence..."
            className="bg-white/[0.03] border border-white/8 px-3 py-1.5 text-xs font-mono text-white/80 placeholder:text-detective-muted focus:outline-none focus:border-white/15 w-48"
          />
        </div>
      </div>

      <div className="flex gap-6">
        {/* Evidence List */}
        <div className="flex-1 space-y-2">
          {currentCase.evidence.map((ev, i) => {
            const discovered = state.discoveredEvidence.includes(ev.id);
            return (
              <motion.button
                key={ev.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => {
                  if (!discovered) discoverEvidence(ev.id);
                  setSelectedEvidence(ev.id);
                }}
                className={`w-full text-left p-3 border transition-all duration-200 ${
                  selectedEvidence === ev.id
                    ? "border-detective-red/40 bg-detective-red/5"
                    : discovered
                      ? "border-white/5 bg-white/[0.02] hover:border-white/10"
                      : "border-white/3 bg-white/[0.01] hover:border-white/8 opacity-50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{getCategoryIcon(ev.category)}</span>
                    <span className="text-[9px] font-mono text-detective-muted tracking-widest">
                      {ev.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {ev.isRedHerring && (
                      <span className="text-[8px] font-mono text-detective-amber bg-detective-amber/10 px-1.5 py-0.5 border border-detective-amber/20">
                        RED HERRING
                      </span>
                    )}
                    {ev.importance >= 9 && (
                      <Star className="w-3 h-3 text-detective-amber" />
                    )}
                  </div>
                </div>
                <div className="text-xs font-mono text-white/80 mb-1">
                  {discovered ? ev.title : "??? UNDISCOVERED ???"}
                </div>
                {discovered && (
                  <div className="flex items-center gap-3 text-[9px] font-mono text-detective-muted">
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {formatTimestamp(ev.timestamp)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {ev.location}
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Evidence Detail */}
        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-96 shrink-0"
            >
              <div className="glass-panel border border-white/5 p-5 sticky top-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">
                      {getCategoryIcon(selected.category)}
                    </span>
                    <div>
                      <div className="text-[9px] font-mono text-detective-muted tracking-widest">
                        {selected.id}
                      </div>
                      <div className="text-[9px] font-mono text-detective-muted tracking-widest">
                        {selected.category.toUpperCase()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedEvidence(null)}
                    className="text-detective-muted hover:text-white/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-sm font-mono text-white font-bold mb-3">
                  {selected.title}
                </h3>

                <p className="text-xs font-mono text-white/60 leading-relaxed mb-4">
                  {selected.description}
                </p>

                {/* Metadata */}
                <div className="space-y-2 mb-4">
                  {Object.entries(selected.metadata).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-[9px] font-mono text-detective-muted tracking-widest uppercase">
                        {key}
                      </span>
                      <span className="text-[10px] font-mono text-white/70 text-right max-w-[200px] truncate">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-white/5 my-3" />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[9px] font-mono text-detective-muted tracking-widest">
                      SOURCE
                    </span>
                    <span className="text-[10px] font-mono text-white/70">
                      {selected.source}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[9px] font-mono text-detective-muted tracking-widest">
                      RELIABILITY
                    </span>
                    <span
                      className={`text-[10px] font-mono ${getReliabilityColor(selected.reliability)}`}
                    >
                      {selected.reliability.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[9px] font-mono text-detective-muted tracking-widest">
                      LOCATION
                    </span>
                    <span className="text-[10px] font-mono text-white/70">
                      {selected.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[9px] font-mono text-detective-muted tracking-widest">
                      TIMESTAMP
                    </span>
                    <span className="text-[10px] font-mono text-white/70">
                      {formatTimestamp(selected.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Linked Suspects */}
                {selected.linkedSuspects.length > 0 && (
                  <div className="mt-4">
                    <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-2">
                      LINKED SUSPECTS
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selected.linkedSuspects.map((sId) => {
                        const suspect = currentCase.suspects.find(
                          (s) => s.id === sId
                        );
                        return (
                          <span
                            key={sId}
                            className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/8 text-white/60"
                          >
                            {suspect?.name || sId}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Linked Evidence */}
                {selected.linkedEvidence.length > 0 && (
                  <div className="mt-3">
                    <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-2">
                      LINKED EVIDENCE
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selected.linkedEvidence.map((eId) => (
                        <button
                          key={eId}
                          onClick={() => setSelectedEvidence(eId)}
                          className="text-[9px] font-mono px-1.5 py-0.5 bg-detective-red/10 border border-detective-red/20 text-detective-red hover:bg-detective-red/20 transition-colors"
                        >
                          {eId}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
