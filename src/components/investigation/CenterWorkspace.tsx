"use client";

import { useInvestigationStore } from "@/stores/investigation-store";
import { motion, AnimatePresence } from "framer-motion";
import OverviewPanel from "./panels/OverviewPanel";
import EvidencePanel from "./panels/EvidencePanel";
import SuspectsPanel from "./panels/SuspectsPanel";
import WitnessesPanel from "./panels/WitnessesPanel";
import LocationsPanel from "./panels/LocationsPanel";
import TimelinePanel from "./panels/TimelinePanel";
import BoardPanel from "./panels/BoardPanel";
import AnalysisPanel from "./panels/AnalysisPanel";
import NotesPanel from "./panels/NotesPanel";

const panels: Record<string, React.ComponentType> = {
  overview: OverviewPanel,
  evidence: EvidencePanel,
  suspects: SuspectsPanel,
  witnesses: WitnessesPanel,
  locations: LocationsPanel,
  timeline: TimelinePanel,
  board: BoardPanel,
  analysis: AnalysisPanel,
  notes: NotesPanel,
};

export default function CenterWorkspace() {
  const { activePanel } = useInvestigationStore();
  const Panel = panels[activePanel] || OverviewPanel;

  return (
    <div className="min-h-full p-6 investigation-grid">
      <AnimatePresence mode="wait">
        <motion.div
          key={activePanel}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          <Panel />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
