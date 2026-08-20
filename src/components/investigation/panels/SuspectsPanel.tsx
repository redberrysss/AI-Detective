"use client";

import { useInvestigationStore } from "@/stores/investigation-store";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { getSuspicionColor } from "@/lib/utils";

export default function SuspectsPanel() {
  const { currentCase, state, selectedSuspect, setSelectedSuspect, interviewSuspect } =
    useInvestigationStore();
  if (!currentCase || !state) return null;

  const selected = currentCase.suspects.find((s) => s.id === selectedSuspect);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white font-heading tracking-tight">
          PERSONS OF INTEREST
        </h2>
        <div className="text-[10px] font-mono text-detective-muted tracking-widest mt-1">
          {currentCase.suspects.length} SUSPECTS
        </div>
      </div>

      <div className="flex gap-6">
        {/* Suspect List */}
        <div className="flex-1 space-y-3">
          {currentCase.suspects.map((suspect, i) => {
            const interviewed = state.interviewedSuspects.includes(suspect.id);
            return (
              <motion.button
                key={suspect.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => {
                  setSelectedSuspect(suspect.id);
                  if (!interviewed) interviewSuspect(suspect.id);
                }}
                className={`w-full text-left p-4 border transition-all duration-200 ${
                  selectedSuspect === suspect.id
                    ? "border-detective-red/40 bg-detective-red/5"
                    : "border-white/5 bg-white/[0.02] hover:border-white/10"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 border border-white/10 flex items-center justify-center text-xs font-mono text-white/40">
                      {suspect.id.split("-")[1]}
                    </div>
                    <div>
                      <div className="text-sm font-mono text-white font-bold">
                        {suspect.name}
                      </div>
                      <div className="text-[10px] font-mono text-detective-muted">
                        {suspect.relationshipToVictim}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-0.5">
                      SUSPICION
                    </div>
                    <div
                      className={`text-lg font-mono font-bold ${getSuspicionColor(suspect.suspicionScore)}`}
                    >
                      {suspect.suspicionScore}%
                    </div>
                  </div>
                </div>

                <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full suspicion-bar rounded-full transition-all duration-500"
                    style={{ width: `${suspect.suspicionScore}%` }}
                  />
                </div>

                <div className="flex items-center gap-4 text-[9px] font-mono text-detective-muted">
                  <span>{suspect.occupation}</span>
                  <span className="text-white/10">|</span>
                  <span>
                    ALIBI: {suspect.alibiVerified ? "VERIFIED" : "UNVERIFIED"}
                  </span>
                  {interviewed && (
                    <>
                      <span className="text-white/10">|</span>
                      <span className="text-green-400">INTERVIEWED</span>
                    </>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Suspect Detail */}
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
                  <div className="text-[9px] font-mono text-detective-muted tracking-widest">
                    {selected.id}
                  </div>
                  <button
                    onClick={() => setSelectedSuspect(null)}
                    className="text-detective-muted hover:text-white/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-mono text-white font-bold mb-1">
                  {selected.name}
                </h3>
                <p className="text-[10px] font-mono text-detective-muted mb-4">
                  {selected.age} — {selected.occupation}
                </p>

                {/* Suspicion Score */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-[9px] font-mono text-detective-muted tracking-widest">
                      SUSPICION LEVEL
                    </span>
                    <span
                      className={`text-sm font-mono ${getSuspicionColor(selected.suspicionScore)}`}
                    >
                      {selected.suspicionScore}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full suspicion-bar rounded-full"
                      style={{ width: `${selected.suspicionScore}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                      ALIBI
                    </div>
                    <p className="text-xs font-mono text-white/70 leading-relaxed">
                      &quot;{selected.alibi}&quot;
                    </p>
                    <div className="mt-1">
                      <span
                        className={`text-[9px] font-mono ${
                          selected.alibiVerified ? "text-green-400" : "text-detective-amber"
                        }`}
                      >
                        {selected.alibiVerified ? "✓ VERIFIED" : "✗ UNVERIFIED"}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                      MOTIVE
                    </div>
                    <p className="text-xs font-mono text-white/70 leading-relaxed">
                      {selected.motive}
                    </p>
                  </div>

                  <div>
                    <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                      RELATIONSHIP TO VICTIM
                    </div>
                    <p className="text-xs font-mono text-white/70">
                      {selected.relationshipToVictim}
                    </p>
                  </div>

                  <div>
                    <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                      COMMUNICATION HISTORY
                    </div>
                    <div className="space-y-1">
                      {selected.communicationHistory.map((c, i) => (
                        <div key={i} className="text-[10px] font-mono text-white/60 flex items-start gap-1.5">
                          <span className="text-detective-red/40 mt-0.5">•</span>
                          {c}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                      KNOWN LOCATIONS
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selected.knownLocations.map((loc, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/8 text-white/60"
                        >
                          {loc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                      EVIDENCE CONNECTIONS
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selected.evidenceConnections.map((eId) => (
                        <span
                          key={eId}
                          className={`text-[9px] font-mono px-1.5 py-0.5 border ${
                            state.discoveredEvidence.includes(eId)
                              ? "bg-detective-red/10 border-detective-red/20 text-detective-red"
                              : "bg-white/5 border-white/8 text-white/30"
                          }`}
                        >
                          {state.discoveredEvidence.includes(eId) ? eId : "???"}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
