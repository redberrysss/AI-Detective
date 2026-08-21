"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCaseById } from "@/cases";
import { useInvestigationStore } from "@/stores/investigation-store";
import InvestigationWorkspace from "@/components/investigation/InvestigationWorkspace";
import DeductionForm from "@/components/investigation/DeductionForm";
import CaseResolution from "@/components/investigation/CaseResolution";
import { Deduction, InvestigationScore } from "@/types";
import { calculateScore } from "@/lib/scoring";
import { getPlayerName } from "@/lib/player";

export default function InvestigatePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const {
    currentCase,
    state,
    setCurrentCase,
    startInvestigation,
    setShowDeduction,
    setShowResolution,
    setInvestigationComplete,
  } = useInvestigationStore();
  const [score, setScore] = useState<InvestigationScore | null>(null);
  const [deduction, setDeduction] = useState<Deduction | null>(null);
  const [leaderboardRank, setLeaderboardRank] = useState<number | null>(null);

  useEffect(() => {
    const caseData = getCaseById(id);
    if (caseData && !currentCase) {
      setCurrentCase(caseData);
      startInvestigation(id);
    } else if (!caseData) {
      router.push("/cases");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentCase]);

  if (!currentCase || !state) {
    return (
      <div className="min-h-screen bg-detective-surface flex items-center justify-center">
        <div className="text-detective-muted font-mono text-sm">
          Loading investigation...
        </div>
      </div>
    );
  }

  const handleDeductionSubmit = (d: Deduction) => {
    const durationSeconds = Math.floor((Date.now() - state.startTime) / 1000);
    const s = calculateScore(
      d,
      currentCase,
      state.hintsUsed,
      durationSeconds,
      state.contradictionsFound.length
    );
    setDeduction(d);
    setScore(s);
    setShowDeduction(false);
    setShowResolution(true);
    setInvestigationComplete(true);

    const playerName = getPlayerName();
    if (playerName) {
      fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseId: id,
          playerName,
          durationSeconds,
          hintsUsed: state.hintsUsed,
          totalScore: s.total,
          correct: s.correctSuspect,
        }),
      })
        .then((res) => res.json())
        .then((data: { rank?: number | null }) => {
          if (typeof data.rank === "number") setLeaderboardRank(data.rank);
        })
        .catch(() => {});
    }
  };

  return (
    <>
      <InvestigationWorkspace />
      <DeductionForm onSubmit={handleDeductionSubmit} />
      {score && deduction && (
        <CaseResolution
          deduction={deduction}
          score={score}
          leaderboardRank={leaderboardRank}
        />
      )}
    </>
  );
}
