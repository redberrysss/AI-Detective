"use client";

import { useInvestigationStore } from "@/stores/investigation-store";
import { motion } from "framer-motion";
import { Brain, AlertTriangle, Search, Eye } from "lucide-react";

export default function AnalysisPanel() {
  const { currentCase, state } = useInvestigationStore();
  if (!currentCase || !state) return null;

  const discoveredContradictions = currentCase.contradictions.filter((c) =>
    state.contradictionsFound.includes(c.id)
  );
  const undiscoveredContradictions = currentCase.contradictions.filter(
    (c) => !state.contradictionsFound.includes(c.id)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white font-heading tracking-tight">
          AI ANALYSIS
        </h2>
        <div className="text-[10px] font-mono text-detective-muted tracking-widest mt-1">
          CONTRADICTIONS & INSIGHTS
        </div>
      </div>

      {/* Discovered Contradictions */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-3.5 h-3.5 text-detective-amber" />
          <span className="text-[10px] font-mono text-detective-muted tracking-widest">
            DISCOVERED CONTRADICTIONS ({discoveredContradictions.length}/
            {currentCase.contradictions.length})
          </span>
        </div>

        {discoveredContradictions.length === 0 ? (
          <div className="glass-panel p-6 border border-white/5 text-center">
            <Search className="w-6 h-6 text-detective-muted/40 mx-auto mb-2" />
            <p className="text-xs font-mono text-detective-muted">
              No contradictions identified yet. Compare suspect statements with
              evidence.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {discoveredContradictions.map((cont, i) => (
              <motion.div
                key={cont.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-panel p-4 border border-detective-amber/20"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-[9px] font-mono text-detective-amber tracking-widest">
                    {cont.id}
                  </span>
                  <span className="text-[9px] font-mono text-detective-amber">
                    CONFIDENCE: {cont.confidence}%
                  </span>
                </div>

                <div className="mb-2">
                  <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                    STATEMENT
                  </div>
                  <p className="text-xs font-mono text-white/70 pl-3 border-l border-white/10">
                    {cont.statementText}
                  </p>
                </div>

                <div className="mb-2">
                  <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                    CONTRADICTED BY
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 bg-detective-red/10 border border-detective-red/20 text-detective-red">
                    {cont.contradictingEvidenceId}
                  </span>
                </div>

                <div>
                  <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                    EXPLANATION
                  </div>
                  <p className="text-xs font-mono text-white/60 leading-relaxed">
                    {cont.explanation}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Undiscovered Contradictions */}
      {undiscoveredContradictions.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Eye className="w-3.5 h-3.5 text-detective-muted/40" />
            <span className="text-[10px] font-mono text-detective-muted tracking-widest">
              REMAINING CONTRADICTIONS ({undiscoveredContradictions.length})
            </span>
          </div>
          <div className="space-y-2">
            {undiscoveredContradictions.map((cont) => (
              <div
                key={cont.id}
                className="p-3 border border-white/3 bg-white/[0.01] text-[10px] font-mono text-detective-muted/40"
              >
                {cont.id} — Not yet identified
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="glass-panel p-4 border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Brain className="w-3.5 h-3.5 text-detective-red/60" />
          <span className="text-[10px] font-mono text-detective-muted tracking-widest">
            INVESTIGATION SUMMARY
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs font-mono">
          <div className="flex justify-between">
            <span className="text-detective-muted">Evidence Found:</span>
            <span className="text-white/70">
              {state.discoveredEvidence.length}/{currentCase.evidence.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-detective-muted">Suspects Interviewed:</span>
            <span className="text-white/70">
              {state.interviewedSuspects.length}/{currentCase.suspects.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-detective-muted">Contradictions Found:</span>
            <span className="text-white/70">
              {state.contradictionsFound.length}/{currentCase.contradictions.length}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-detective-muted">Hints Used:</span>
            <span className="text-white/70">{state.hintsUsed}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-detective-muted">Connections Made:</span>
            <span className="text-white/70">{state.connectedNodes.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-detective-muted">Confidence:</span>
            <span className="text-white/70">{state.currentConfidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
