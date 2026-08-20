"use client";

import { useInvestigationStore } from "@/stores/investigation-store";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export default function TimelinePanel() {
  const { currentCase, state } = useInvestigationStore();
  if (!currentCase || !state) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white font-heading tracking-tight">
          TIMELINE
        </h2>
        <div className="text-[10px] font-mono text-detective-muted tracking-widest mt-1">
          CHRONOLOGICAL RECONSTRUCTION
        </div>
      </div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[52px] top-0 bottom-0 w-px bg-white/8" />

        <div className="space-y-1">
          {currentCase.timeline.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`relative flex items-start gap-4 ${
                event.isGap ? "my-4" : ""
              }`}
            >
              {/* Timestamp */}
              <div className="w-[44px] text-right shrink-0">
                <span
                  className={`text-xs font-mono ${
                    event.isGap ? "text-detective-amber" : "text-white/60"
                  }`}
                >
                  {event.timestamp}
                </span>
              </div>

              {/* Dot */}
              <div className="relative z-10 shrink-0 mt-1.5">
                {event.isGap ? (
                  <div className="w-3 h-3 bg-detective-amber/30 border border-detective-amber rounded-full" />
                ) : event.verified ? (
                  <div className="w-2.5 h-2.5 bg-green-400/30 border border-green-400 rounded-full" />
                ) : (
                  <div className="w-2.5 h-2.5 bg-white/10 border border-white/20 rounded-full" />
                )}
              </div>

              {/* Content */}
              <div
                className={`flex-1 pb-4 ${
                  event.isGap
                    ? "bg-detective-amber/5 border border-detective-amber/20 p-3"
                    : "border-b border-white/3 pb-2"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    {event.isGap && (
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <AlertTriangle className="w-3 h-3 text-detective-amber" />
                        <span className="text-[9px] font-mono text-detective-amber tracking-widest">
                          UNEXPLAINED GAP
                        </span>
                      </div>
                    )}
                    <p
                      className={`text-xs font-mono leading-relaxed ${
                        event.isGap
                          ? "text-detective-amber/80"
                          : event.verified
                            ? "text-white/70"
                            : "text-white/50"
                      }`}
                    >
                      {event.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    {event.verified ? (
                      <CheckCircle className="w-3 h-3 text-green-400/60" />
                    ) : event.isGap ? null : (
                      <XCircle className="w-3 h-3 text-white/20" />
                    )}
                  </div>
                </div>

                {/* Evidence Links */}
                {event.evidenceIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {event.evidenceIds.map((eId) => {
                      const discovered = state.discoveredEvidence.includes(eId);
                      return (
                        <span
                          key={eId}
                          className={`text-[8px] font-mono px-1 py-0.5 border ${
                            discovered
                              ? "bg-detective-red/10 border-detective-red/20 text-detective-red"
                              : "bg-white/3 border-white/5 text-white/20"
                          }`}
                        >
                          {discovered ? eId : "???"}
                        </span>
                      );
                    })}
                  </div>
                )}

                {/* Suspect Links */}
                {event.suspectIds.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {event.suspectIds.map((sId) => {
                      const s = currentCase.suspects.find(
                        (su) => su.id === sId
                      );
                      return (
                        <span
                          key={sId}
                          className="text-[8px] font-mono px-1 py-0.5 bg-white/5 border border-white/8 text-white/40"
                        >
                          {s?.name || sId}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
