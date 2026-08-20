"use client";

import { useInvestigationStore } from "@/stores/investigation-store";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  Search,
  Users,
  AlertTriangle,
  Eye,
} from "lucide-react";

export default function OverviewPanel() {
  const { currentCase, state } = useInvestigationStore();
  if (!currentCase || !state) return null;
  const { metadata, victim } = currentCase;

  const stats = [
    {
      icon: Search,
      label: "EVIDENCE FOUND",
      value: `${state.discoveredEvidence.length}/${currentCase.evidence.length}`,
    },
    {
      icon: Users,
      label: "SUSPECTS INTERVIEWED",
      value: `${state.interviewedSuspects.length}/${currentCase.suspects.length}`,
    },
    {
      icon: AlertTriangle,
      label: "CONTRADICTIONS",
      value: `${state.contradictionsFound.length}/${currentCase.contradictions.length}`,
    },
    {
      icon: Eye,
      label: "HINTS USED",
      value: `${state.hintsUsed}`,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white font-heading tracking-tight mb-1">
          CASE OVERVIEW
        </h2>
        <div className="text-[10px] font-mono text-detective-muted tracking-widest">
          {metadata.id} — {metadata.title.toUpperCase()}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel p-4 border border-white/5"
          >
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-3.5 h-3.5 text-detective-red/60" />
              <span className="text-[9px] font-mono text-detective-muted tracking-widest">
                {s.label}
              </span>
            </div>
            <div className="text-xl font-mono text-white">{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Confidence Meter */}
      <div className="glass-panel p-4 border border-white/5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono text-detective-muted tracking-widest">
            INVESTIGATION CONFIDENCE
          </span>
          <span className="text-sm font-mono text-white">
            {state.currentConfidence}%
          </span>
        </div>
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${state.currentConfidence}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full suspicion-bar rounded-full"
          />
        </div>
      </div>

      {/* Victim Summary */}
      <div className="glass-panel p-4 border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-3.5 h-3.5 text-detective-amber" />
          <span className="text-[10px] font-mono text-detective-muted tracking-widest">
            VICTIM
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-0.5">
              NAME
            </div>
            <div className="text-sm font-mono text-white">{victim.name}</div>
          </div>
          <div>
            <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-0.5">
              AGE / OCCUPATION
            </div>
            <div className="text-sm font-mono text-white">
              {victim.age} — {victim.occupation}
            </div>
          </div>
          {victim.causeOfDeath && (
            <div className="col-span-2">
              <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-0.5">
                CAUSE OF DEATH
              </div>
              <div className="text-sm font-mono text-detective-red/80">
                {victim.causeOfDeath}
              </div>
            </div>
          )}
          <div className="col-span-2">
            <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-0.5">
              DESCRIPTION
            </div>
            <p className="text-xs font-mono text-white/60 leading-relaxed">
              {victim.description}
            </p>
          </div>
        </div>
      </div>

      {/* Case Briefing */}
      <div className="glass-panel p-4 border border-white/5">
        <div className="flex items-center gap-2 mb-3">
          <FileText className="w-3.5 h-3.5 text-detective-red/60" />
          <span className="text-[10px] font-mono text-detective-muted tracking-widest">
            CASE BRIEFING
          </span>
        </div>
        <p className="text-xs font-mono text-white/60 leading-relaxed">
          {metadata.description}
        </p>
      </div>
    </div>
  );
}
