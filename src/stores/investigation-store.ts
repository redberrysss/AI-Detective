import { create } from "zustand";
import { InvestigationState, Case, Connection } from "@/types";

interface InvestigationStore {
  currentCase: Case | null;
  state: InvestigationState | null;
  activePanel: string;
  selectedEvidence: string | null;
  selectedSuspect: string | null;
  selectedLocation: string | null;
  showDeduction: boolean;
  showResolution: boolean;
  investigationComplete: boolean;
  muteSound: boolean;
  setCurrentCase: (c: Case) => void;
  startInvestigation: (caseId: string) => void;
  setActivePanel: (panel: string) => void;
  discoverEvidence: (evidenceId: string) => void;
  interviewSuspect: (suspectId: string) => void;
  addNote: (key: string, note: string) => void;
  addConnection: (conn: Connection) => void;
  removeConnection: (connId: string) => void;
  addTimelineEvent: (event: import("@/types").TimelineEvent) => void;
  incrementHints: () => void;
  findContradiction: (contId: string) => void;
  setSelectedEvidence: (id: string | null) => void;
  setSelectedSuspect: (id: string | null) => void;
  setSelectedLocation: (id: string | null) => void;
  setShowDeduction: (show: boolean) => void;
  setShowResolution: (show: boolean) => void;
  setInvestigationComplete: (complete: boolean) => void;
  setMuteSound: (mute: boolean) => void;
  updateConfidence: (score: number) => void;
}

export const useInvestigationStore = create<InvestigationStore>((set, get) => ({
  currentCase: null,
  state: null,
  activePanel: "overview",
  selectedEvidence: null,
  selectedSuspect: null,
  selectedLocation: null,
  showDeduction: false,
  showResolution: false,
  investigationComplete: false,
  muteSound: false,

  setCurrentCase: (c) => set({ currentCase: c }),

  startInvestigation: (caseId) => {
    const c = get().currentCase;
    if (!c || c.metadata.id !== caseId) return;
    set({
      state: {
        caseId,
        discoveredEvidence: [],
        interviewedSuspects: [],
        connectedNodes: [],
        notes: {},
        timeline: c.timeline,
        hintsUsed: 0,
        contradictionsFound: [],
        startTime: Date.now(),
        lastActivity: Date.now(),
        currentConfidence: 0,
      },
      investigationComplete: false,
      showDeduction: false,
      showResolution: false,
    });
  },

  setActivePanel: (panel) => set({ activePanel: panel }),

  discoverEvidence: (evidenceId) => {
    const { state } = get();
    if (!state) return;
    if (state.discoveredEvidence.includes(evidenceId)) return;
    const newDiscovered = [...state.discoveredEvidence, evidenceId];
    const discovered = newDiscovered.length;
    const total = get().currentCase?.evidence.length ?? 1;
    const confidence = Math.min(95, Math.round((discovered / total) * 80 + (get().state?.contradictionsFound.length ?? 0) * 5));
    set({
      state: {
        ...state,
        discoveredEvidence: newDiscovered,
        lastActivity: Date.now(),
        currentConfidence: confidence,
      },
    });
  },

  interviewSuspect: (suspectId) => {
    const { state } = get();
    if (!state) return;
    if (state.interviewedSuspects.includes(suspectId)) return;
    set({
      state: {
        ...state,
        interviewedSuspects: [...state.interviewedSuspects, suspectId],
        lastActivity: Date.now(),
      },
    });
  },

  addNote: (key, note) => {
    const { state } = get();
    if (!state) return;
    set({
      state: {
        ...state,
        notes: { ...state.notes, [key]: note },
        lastActivity: Date.now(),
      },
    });
  },

  addConnection: (conn) => {
    const { state } = get();
    if (!state) return;
    set({
      state: {
        ...state,
        connectedNodes: [...state.connectedNodes, conn],
        lastActivity: Date.now(),
      },
    });
  },

  removeConnection: (connId) => {
    const { state } = get();
    if (!state) return;
    set({
      state: {
        ...state,
        connectedNodes: state.connectedNodes.filter((c) => c.id !== connId),
        lastActivity: Date.now(),
      },
    });
  },

  addTimelineEvent: (event) => {
    const { state } = get();
    if (!state) return;
    set({
      state: {
        ...state,
        timeline: [...state.timeline, event],
        lastActivity: Date.now(),
      },
    });
  },

  incrementHints: () => {
    const { state } = get();
    if (!state) return;
    set({
      state: {
        ...state,
        hintsUsed: state.hintsUsed + 1,
        lastActivity: Date.now(),
      },
    });
  },

  findContradiction: (contId) => {
    const { state } = get();
    if (!state) return;
    if (state.contradictionsFound.includes(contId)) return;
    const found = [...state.contradictionsFound, contId];
    const confidence = Math.min(95, Math.round((state.discoveredEvidence.length / (get().currentCase?.evidence.length ?? 1)) * 80 + found.length * 5));
    set({
      state: {
        ...state,
        contradictionsFound: found,
        lastActivity: Date.now(),
        currentConfidence: confidence,
      },
    });
  },

  setSelectedEvidence: (id) => set({ selectedEvidence: id }),
  setSelectedSuspect: (id) => set({ selectedSuspect: id }),
  setSelectedLocation: (id) => set({ selectedLocation: id }),
  setShowDeduction: (show) => set({ showDeduction: show }),
  setShowResolution: (show) => set({ showResolution: show }),
  setInvestigationComplete: (complete) => set({ investigationComplete: complete }),
  setMuteSound: (mute) => set({ muteSound: mute }),
  updateConfidence: (score) => {
    const { state } = get();
    if (!state) return;
    set({ state: { ...state, currentConfidence: score } });
  },
}));
