"use client";

import { useRouter } from "next/navigation";
import { useInvestigationStore } from "@/stores/investigation-store";
import { motion } from "framer-motion";
import { X, Star } from "lucide-react";
import { Deduction, InvestigationScore } from "@/types";

interface CaseResolutionProps {
  deduction: Deduction;
  score: InvestigationScore;
  leaderboardRank?: number | null;
}

export default function CaseResolution({
  deduction,
  score,
  leaderboardRank,
}: CaseResolutionProps) {
  const { currentCase, showResolution, setShowResolution } =
    useInvestigationStore();
  const router = useRouter();
  if (!currentCase || !showResolution) return null;
  const { hiddenSolution } = currentCase;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl my-8 glass-panel border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-detective-amber" />
            <h2 className="text-lg font-bold text-white font-heading tracking-tight">
              INVESTIGATION COMPLETE
            </h2>
          </div>
          <button
            onClick={() => setShowResolution(false)}
            className="text-detective-muted hover:text-white/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Score */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
            className="text-6xl font-mono font-bold text-white mb-2"
          >
            {score.total}
            <span className="text-2xl text-detective-muted">/100</span>
          </motion.div>
          <div className="text-sm font-mono text-detective-amber tracking-wider">
            {score.rank}
          </div>
          {leaderboardRank != null && (
            <div className="text-[10px] font-mono text-detective-muted tracking-widest mt-3">
              FASTEST DETECTIVES — POSITION{" "}
              <span className="text-detective-amber">#{leaderboardRank}</span>
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {[
            {
              label: "SUSPECT",
              value: score.breakdown.suspect,
              max: 25,
              correct: score.correctSuspect,
            },
            {
              label: "MOTIVE",
              value: score.breakdown.motive,
              max: 20,
              correct: score.correctMotive,
            },
            {
              label: "SEQUENCE",
              value: score.breakdown.sequence,
              max: 20,
              correct: score.correctSequence,
            },
            {
              label: "EVIDENCE",
              value: score.breakdown.evidence,
              max: 20,
              correct: true,
            },
            {
              label: "CONTRADICTIONS",
              value: score.breakdown.contradictions,
              max: 10,
              correct: true,
            },
            {
              label: "HINTS",
              value: score.breakdown.hints,
              max: 0,
              correct: true,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 border border-white/5 bg-white/[0.02]"
            >
              <div className="flex justify-between mb-1">
                <span className="text-[9px] font-mono text-detective-muted tracking-widest">
                  {item.label}
                </span>
                <span className="text-xs font-mono text-white/70">
                  {item.value}/{item.max}
                </span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${item.max > 0 ? (item.value / item.max) * 100 : 0}%`,
                  }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className={`h-full rounded-full ${
                    item.correct ? "bg-green-400" : "bg-detective-red"
                  }`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Your Theory vs Actual */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="border border-white/5 p-4">
            <h3 className="text-[10px] font-mono text-detective-muted tracking-widest mb-3">
              YOUR THEORY
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-detective-muted">Suspect: </span>
                <span className="text-white/80">
                  {currentCase.suspects.find(
                    (s) => s.id === deduction.suspectId
                  )?.name || "Unknown"}
                </span>
              </div>
              <div>
                <span className="text-detective-muted">Motive: </span>
                <span className="text-white/80">{deduction.motive}</span>
              </div>
              <div>
                <span className="text-detective-muted">Evidence: </span>
                <span className="text-white/80">
                  {deduction.evidenceIds.join(", ")}
                </span>
              </div>
            </div>
          </div>
          <div className="border border-white/5 p-4">
            <h3 className="text-[10px] font-mono text-detective-muted tracking-widest mb-3">
              ACTUAL EVENTS
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div>
                <span className="text-detective-muted">Guilty: </span>
                <span className="text-white/80">
                  {currentCase.suspects.find(
                    (s) => s.id === hiddenSolution.guiltySuspectId
                  )?.name || "Unknown"}
                </span>
              </div>
              <div>
                <span className="text-detective-muted">Motive: </span>
                <span className="text-white/80">
                  {hiddenSolution.motive.slice(0, 100)}...
                </span>
              </div>
              <div>
                <span className="text-detective-muted">Key Evidence: </span>
                <span className="text-white/80">
                  {hiddenSolution.keyEvidenceIds.join(", ")}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Full Narrative */}
        <div className="border border-white/5 p-4 mb-8">
          <h3 className="text-[10px] font-mono text-detective-muted tracking-widest mb-3">
            WHAT REALLY HAPPENED
          </h3>
          <p className="text-xs font-mono text-white/60 leading-relaxed">
            {hiddenSolution.fullNarrative}
          </p>
        </div>

        {/* Actual Timeline */}
        <div className="border border-white/5 p-4">
          <h3 className="text-[10px] font-mono text-detective-muted tracking-widest mb-3">
            ACTUAL SEQUENCE OF EVENTS
          </h3>
          <div className="space-y-2">
            {hiddenSolution.sequenceOfEvents.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="flex items-start gap-2 text-xs font-mono"
              >
                <span className="text-detective-red/60 shrink-0 mt-0.5">
                  {i + 1}.
                </span>
                <span className="text-white/60 leading-relaxed">{event}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => setShowResolution(false)}
            className="flex-1 px-6 py-3 border border-white/10 text-white/70 font-mono text-xs tracking-wider hover:border-white/25 hover:text-white transition-all duration-300"
          >
            REVIEW INVESTIGATION
          </button>
          <button
            onClick={() => router.push("/cases")}
            className="flex-1 px-6 py-3 bg-detective-red text-white font-mono text-xs tracking-wider hover:bg-detective-red-dim transition-all duration-300"
          >
            BACK TO CASES
          </button>
        </div>
      </motion.div>
    </div>
  );
}
