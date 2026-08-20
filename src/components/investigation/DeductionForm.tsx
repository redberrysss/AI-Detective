"use client";

import { useState } from "react";
import { useInvestigationStore } from "@/stores/investigation-store";
import { motion } from "framer-motion";
import { X, AlertTriangle, Send, ChevronRight } from "lucide-react";
import { Deduction } from "@/types";

interface DeductionFormProps {
  onSubmit: (deduction: Deduction) => void;
}

export default function DeductionForm({ onSubmit }: DeductionFormProps) {
  const { currentCase, state, showDeduction, setShowDeduction } =
    useInvestigationStore();
  const [selectedSuspectId, setSelectedSuspectId] = useState("");
  const [selectedMotive, setSelectedMotive] = useState("");
  const [selectedEvidenceIds, setSelectedEvidenceIds] = useState<string[]>([]);
  const [sequenceDescription, setSequenceDescription] = useState("");
  const [step, setStep] = useState(1);

  if (!currentCase || !state || !showDeduction) return null;

  const toggleEvidence = (id: string) => {
    setSelectedEvidenceIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!selectedSuspectId || selectedEvidenceIds.length === 0) return;
    onSubmit({
      suspectId: selectedSuspectId,
      motive: selectedMotive,
      evidenceIds: selectedEvidenceIds,
      sequenceDescription,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto glass-panel border border-white/10 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-detective-red" />
            <h2 className="text-lg font-bold text-white font-heading tracking-tight">
              SOLVE THE CASE
            </h2>
          </div>
          <button
            onClick={() => setShowDeduction(false)}
            className="text-detective-muted hover:text-white/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 mb-6">
          {["WHO", "WHY", "EVIDENCE", "HOW"].map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-6 h-6 flex items-center justify-center text-[10px] font-mono border ${
                  step > i + 1
                    ? "bg-detective-red/20 border-detective-red/40 text-detective-red"
                    : step === i + 1
                      ? "bg-white/10 border-white/20 text-white"
                      : "border-white/5 text-detective-muted"
                }`}
              >
                {i + 1}
              </div>
              <span
                className={`text-[9px] font-mono tracking-widest ${
                  step === i + 1 ? "text-white" : "text-detective-muted"
                }`}
              >
                {s}
              </span>
              {i < 3 && <ChevronRight className="w-3 h-3 text-detective-muted" />}
            </div>
          ))}
        </div>

        {/* Step 1: Select Suspect */}
        {step === 1 && (
          <div>
            <h3 className="text-sm font-mono text-white mb-3">
              WHO IS RESPONSIBLE?
            </h3>
            <div className="space-y-2">
              {currentCase.suspects.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSuspectId(s.id)}
                  className={`w-full text-left p-3 border transition-all ${
                    selectedSuspectId === s.id
                      ? "border-detective-red/40 bg-detective-red/5"
                      : "border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="text-xs font-mono text-white">{s.name}</div>
                  <div className="text-[10px] font-mono text-detective-muted">
                    {s.relationshipToVictim}
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={() => selectedSuspectId && setStep(2)}
              disabled={!selectedSuspectId}
              className="mt-4 px-6 py-2 bg-white/[0.06] border border-white/8 text-xs font-mono text-white/80 hover:bg-white/[0.1] disabled:opacity-30 transition-all"
            >
              NEXT →
            </button>
          </div>
        )}

        {/* Step 2: Select Motive */}
        {step === 2 && (
          <div>
            <h3 className="text-sm font-mono text-white mb-3">
              WHY DID IT HAPPEN?
            </h3>
            <textarea
              value={selectedMotive}
              onChange={(e) => setSelectedMotive(e.target.value)}
              placeholder="Describe the motive..."
              className="w-full h-32 bg-white/[0.02] border border-white/5 p-3 text-xs font-mono text-white/70 placeholder:text-detective-muted/40 focus:outline-none focus:border-white/15 resize-none"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-2 border border-white/8 text-xs font-mono text-detective-muted hover:text-white/70 transition-all"
              >
                ← BACK
              </button>
              <button
                onClick={() => selectedMotive && setStep(3)}
                disabled={!selectedMotive}
                className="px-6 py-2 bg-white/[0.06] border border-white/8 text-xs font-mono text-white/80 hover:bg-white/[0.1] disabled:opacity-30 transition-all"
              >
                NEXT →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Select Evidence */}
        {step === 3 && (
          <div>
            <h3 className="text-sm font-mono text-white mb-1">
              SELECT KEY EVIDENCE
            </h3>
            <p className="text-[10px] font-mono text-detective-muted mb-3">
              Selected: {selectedEvidenceIds.length} items
            </p>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {state.discoveredEvidence.map((eId) => {
                const ev = currentCase.evidence.find((e) => e.id === eId);
                if (!ev) return null;
                return (
                  <button
                    key={eId}
                    onClick={() => toggleEvidence(eId)}
                    className={`w-full text-left p-2 border transition-all flex items-center justify-between ${
                      selectedEvidenceIds.includes(eId)
                        ? "border-detective-red/40 bg-detective-red/5"
                        : "border-white/5 hover:border-white/8"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 border ${
                          selectedEvidenceIds.includes(eId)
                            ? "bg-detective-red border-detective-red"
                            : "border-white/20"
                        }`}
                      />
                      <span className="text-[10px] font-mono text-white/70">
                        {ev.id} — {ev.title}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setStep(2)}
                className="px-6 py-2 border border-white/8 text-xs font-mono text-detective-muted hover:text-white/70 transition-all"
              >
                ← BACK
              </button>
              <button
                onClick={() => selectedEvidenceIds.length > 0 && setStep(4)}
                disabled={selectedEvidenceIds.length === 0}
                className="px-6 py-2 bg-white/[0.06] border border-white/8 text-xs font-mono text-white/80 hover:bg-white/[0.1] disabled:opacity-30 transition-all"
              >
                NEXT →
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Describe How */}
        {step === 4 && (
          <div>
            <h3 className="text-sm font-mono text-white mb-3">
              HOW DID IT HAPPEN?
            </h3>
            <textarea
              value={sequenceDescription}
              onChange={(e) => setSequenceDescription(e.target.value)}
              placeholder="Describe the sequence of events..."
              className="w-full h-32 bg-white/[0.02] border border-white/5 p-3 text-xs font-mono text-white/70 placeholder:text-detective-muted/40 focus:outline-none focus:border-white/15 resize-none"
            />
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setStep(3)}
                className="px-6 py-2 border border-white/8 text-xs font-mono text-detective-muted hover:text-white/70 transition-all"
              >
                ← BACK
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-detective-red text-white font-mono text-xs tracking-wider hover:bg-detective-red-dim transition-all flex items-center gap-2"
              >
                <Send className="w-3 h-3" />
                SUBMIT DEDUCTION
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
