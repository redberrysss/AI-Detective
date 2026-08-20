export type Difficulty = "easy" | "medium" | "hard" | "expert";

export type CaseStatus = "unsolved" | "in_progress" | "completed";

export type EvidenceCategory =
  | "photograph"
  | "document"
  | "cctv"
  | "audio"
  | "message"
  | "email"
  | "location"
  | "fingerprint"
  | "object"
  | "financial"
  | "forensic"
  | "digital";

export type EvidenceReliability = "high" | "medium" | "low" | "unverified";

export type ConnectionLabel =
  | "seen_at"
  | "owns"
  | "communicated_with"
  | "contradicts"
  | "proves"
  | "located_near"
  | "possible_motive"
  | "connected_to";

export interface CaseMetadata {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  location: string;
  date: string;
  evidenceCount: number;
  suspectCount: number;
  witnessCount: number;
  status: CaseStatus;
  type: string;
}

export interface Victim {
  name: string;
  age: number;
  occupation: string;
  description: string;
  causeOfDeath?: string;
  lastSeen?: string;
}

export interface Suspect {
  id: string;
  name: string;
  age: number;
  occupation: string;
  relationshipToVictim: string;
  motive: string;
  alibi: string;
  alibiVerified: boolean;
  knownLocations: string[];
  communicationHistory: string[];
  evidenceConnections: string[];
  suspicionScore: number;
  personality: string;
  secrets: string[];
  truthfulStatements: string[];
  lies: string[];
  refusesToDiscuss: string[];
  image?: string;
}

export interface Witness {
  id: string;
  name: string;
  age: number;
  occupation: string;
  relationshipToVictim: string;
  statement: string;
  reliability: EvidenceReliability;
  evidenceConnections: string[];
  personality: string;
}

export interface Location {
  id: string;
  name: string;
  type: string;
  address: string;
  description: string;
  relevantEvidence: string[];
  relevantSuspects: string[];
}

export interface Evidence {
  id: string;
  caseId: string;
  title: string;
  category: EvidenceCategory;
  description: string;
  timestamp: string;
  location: string;
  source: string;
  reliability: EvidenceReliability;
  metadata: Record<string, string>;
  linkedSuspects: string[];
  linkedEvidence: string[];
  isRedHerring: boolean;
  importance: number;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  date: string;
  description: string;
  evidenceIds: string[];
  suspectIds: string[];
  locationId?: string;
  verified: boolean;
  isGap?: boolean;
  gapStart?: string;
  gapEnd?: string;
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  label: ConnectionLabel;
  description: string;
}

export interface Contradiction {
  id: string;
  statementText: string;
  contradictingEvidenceId: string;
  suspectId: string;
  confidence: number;
  explanation: string;
}

export interface HiddenSolution {
  guiltySuspectId: string;
  motive: string;
  sequenceOfEvents: string[];
  keyEvidenceIds: string[];
  redHerringIds: string[];
  fullNarrative: string;
}

export interface ScoringRules {
  correctSuspect: number;
  correctMotive: number;
  correctSequence: number;
  correctEvidence: number;
  contradictionsDiscovered: number;
  totalContradictions: number;
  hintPenalty: number;
  timePenalty: number;
  unnecessaryAccusationPenalty: number;
}

export interface Case {
  metadata: CaseMetadata;
  victim: Victim;
  suspects: Suspect[];
  witnesses: Witness[];
  locations: Location[];
  evidence: Evidence[];
  timeline: TimelineEvent[];
  connections: Connection[];
  contradictions: Contradiction[];
  hiddenSolution: HiddenSolution;
  scoringRules: ScoringRules;
}

export interface InvestigationState {
  caseId: string;
  discoveredEvidence: string[];
  interviewedSuspects: string[];
  connectedNodes: Connection[];
  notes: Record<string, string>;
  timeline: TimelineEvent[];
  hintsUsed: number;
  contradictionsFound: string[];
  startTime: number;
  lastActivity: number;
  currentConfidence: number;
}

export interface Deduction {
  suspectId: string;
  motive: string;
  evidenceIds: string[];
  sequenceDescription: string;
}

export interface InvestigationScore {
  total: number;
  correctSuspect: boolean;
  correctMotive: boolean;
  correctSequence: boolean;
  evidenceScore: number;
  contradictionsFound: number;
  hintsUsed: number;
  timeTaken: number;
  rank: string;
  breakdown: {
    suspect: number;
    motive: number;
    sequence: number;
    evidence: number;
    contradictions: number;
    hints: number;
    time: number;
  };
}

export interface BoardNode {
  id: string;
  type: "suspect" | "evidence" | "location" | "event" | "motive" | "witness";
  label: string;
  data: Record<string, unknown>;
  position: { x: number; y: number };
}

export interface AISource {
  type: "evidence" | "timeline" | "suspect" | "witness";
  id: string;
  label: string;
}

export interface AIResponse {
  content: string;
  sources: AISource[];
  confidence: number;
}
