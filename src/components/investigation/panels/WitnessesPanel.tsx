"use client";

import { useInvestigationStore } from "@/stores/investigation-store";
import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export default function WitnessesPanel() {
  const { currentCase } = useInvestigationStore();
  if (!currentCase) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white font-heading tracking-tight">
          WITNESSES
        </h2>
        <div className="text-[10px] font-mono text-detective-muted tracking-widest mt-1">
          {currentCase.witnesses.length} WITNESSES
        </div>
      </div>

      <div className="space-y-4">
        {currentCase.witnesses.map((witness, i) => (
          <motion.div
            key={witness.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel border border-white/5 p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 border border-white/10 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-white/30" />
                </div>
                <div>
                  <div className="text-sm font-mono text-white font-bold">
                    {witness.name}
                  </div>
                  <div className="text-[10px] font-mono text-detective-muted">
                    {witness.age} — {witness.occupation}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-0.5">
                  RELIABILITY
                </div>
                <span
                  className={`text-xs font-mono ${
                    witness.reliability === "high"
                      ? "text-green-400"
                      : witness.reliability === "medium"
                        ? "text-amber-400"
                        : "text-red-400"
                  }`}
                >
                  {witness.reliability.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                RELATIONSHIP TO VICTIM
              </div>
              <div className="text-xs font-mono text-white/70">
                {witness.relationshipToVictim}
              </div>
            </div>

            <div>
              <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                STATEMENT
              </div>
              <div className="text-xs font-mono text-white/60 leading-relaxed pl-3 border-l border-white/10">
                &quot;{witness.statement}&quot;
              </div>
            </div>

            {witness.evidenceConnections.length > 0 && (
              <div className="mt-3">
                <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                  SUPPORTING EVIDENCE
                </div>
                <div className="flex flex-wrap gap-1">
                  {witness.evidenceConnections.map((eId) => (
                    <span
                      key={eId}
                      className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/8 text-white/60"
                    >
                      {eId}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
