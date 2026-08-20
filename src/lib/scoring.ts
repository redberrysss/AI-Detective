import { Deduction, Case, InvestigationScore } from "@/types";

export function calculateScore(
  deduction: Deduction,
  caseData: Case,
  hintsUsed: number,
  timeElapsed: number,
  contradictionsFound: number
): InvestigationScore {
  const { hiddenSolution, scoringRules } = caseData;

  // Correct suspect
  const correctSuspect = deduction.suspectId === hiddenSolution.guiltySuspectId;
  const suspectScore = correctSuspect ? scoringRules.correctSuspect : 0;

  // Correct motive (basic keyword matching)
  const motiveLower = deduction.motive.toLowerCase();
  const solutionMotiveLower = hiddenSolution.motive.toLowerCase();
  const motiveKeywords = solutionMotiveLower
    .split(/\s+/)
    .filter((w) => w.length > 4);
  const motiveMatches = motiveKeywords.filter((kw) =>
    motiveLower.includes(kw)
  ).length;
  const motiveRatio = motiveKeywords.length > 0 ? motiveMatches / motiveKeywords.length : 0;
  const correctMotive = motiveRatio > 0.3;
  const motiveScore = correctMotive
    ? Math.round(scoringRules.correctMotive * Math.min(1, motiveRatio * 1.5))
    : 0;

  // Evidence matching
  const keyEvidenceFound = deduction.evidenceIds.filter((eId) =>
    hiddenSolution.keyEvidenceIds.includes(eId)
  ).length;
  const evidenceScore = Math.round(
    (keyEvidenceFound / Math.max(hiddenSolution.keyEvidenceIds.length, 1)) *
      scoringRules.correctEvidence
  );

  // Sequence (basic: if the description mentions key events)
  const seqLower = deduction.sequenceDescription.toLowerCase();
  const sequenceScore = seqLower.length > 50
    ? Math.round(scoringRules.correctSequence * 0.6)
    : seqLower.length > 20
      ? Math.round(scoringRules.correctSequence * 0.3)
      : 0;

  // Contradictions
  const contradictionScore = Math.round(
    (contradictionsFound / scoringRules.totalContradictions) *
      scoringRules.contradictionsDiscovered
  );

  // Hint penalty
  const hintPenalty = hintsUsed * scoringRules.hintPenalty;

  // Time penalty (more than 30 minutes)
  const timeMinutes = timeElapsed / 60;
  const timePenalty =
    timeMinutes > 30
      ? Math.min(
          scoringRules.timePenalty,
          Math.round((timeMinutes - 30) / 10)
        )
      : 0;

  const total = Math.max(
    0,
    Math.min(
      100,
      suspectScore +
        motiveScore +
        evidenceScore +
        sequenceScore +
        contradictionScore -
        hintPenalty -
        timePenalty
    )
  );

  let rank = "NOVICE";
  if (total >= 95) rank = "MASTER DETECTIVE";
  else if (total >= 85) rank = "LEAD INVESTIGATOR";
  else if (total >= 75) rank = "SENIOR DETECTIVE";
  else if (total >= 65) rank = "DETECTIVE";
  else if (total >= 50) rank = "JUNIOR DETECTIVE";
  else if (total >= 35) rank = "TRAINEE";

  return {
    total,
    correctSuspect,
    correctMotive,
    correctSequence: sequenceScore > scoringRules.correctSequence * 0.5,
    evidenceScore,
    contradictionsFound,
    hintsUsed,
    timeTaken: timeElapsed,
    rank,
    breakdown: {
      suspect: suspectScore,
      motive: motiveScore,
      sequence: sequenceScore,
      evidence: evidenceScore,
      contradictions: contradictionScore,
      hints: -hintPenalty,
      time: -timePenalty,
    },
  };
}
