"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Users,
  FileSearch,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDifficultyColor } from "@/lib/utils";
import { useInvestigationStore } from "@/stores/investigation-store";
import { Case } from "@/types";
import { getPlayerName, savePlayerName } from "@/lib/player";
import PlayerNameDialog from "./PlayerNameDialog";
import CaseLeaderboard from "./CaseLeaderboard";

interface CaseBriefingProps {
  caseData: Case;
}

export default function CaseBriefing({ caseData }: CaseBriefingProps) {
  const router = useRouter();
  const { setCurrentCase, startInvestigation } = useInvestigationStore();
  const { metadata, victim, suspects, evidence } = caseData;
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [playerName] = useState(() => getPlayerName() ?? "");

  const beginCase = () => {
    setCurrentCase(caseData);
    startInvestigation(metadata.id);
    router.push(`/cases/${metadata.id}/investigate`);
  };

  const handleStart = () => {
    const existing = getPlayerName();
    if (existing) {
      beginCase();
    } else {
      setNameDialogOpen(true);
    }
  };

  const handleConfirmName = (name: string) => {
    savePlayerName(name);
    setNameDialogOpen(false);
    beginCase();
  };

  return (
    <div className="min-h-screen bg-detective-surface">
      <div className="absolute inset-0 investigation-grid opacity-20" />
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        <button
          onClick={() => router.push("/cases")}
          className="flex items-center gap-2 text-detective-muted hover:text-white/80 transition-colors mb-8 font-mono text-xs tracking-wider"
        >
          <ArrowLeft className="w-3 h-3" />
          BACK TO CASES
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1 bg-detective-red/30" />
            <span className="text-[10px] font-mono text-detective-red tracking-[0.3em]">
              CLASSIFIED
            </span>
            <div className="h-px flex-1 bg-detective-red/30" />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] font-mono text-detective-muted tracking-widest mb-1">
                {metadata.id}
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight font-heading">
                {metadata.title.toUpperCase()}
              </h1>
            </div>
            <Badge
              variant="outline"
              className={`text-xs font-mono tracking-wider ${getDifficultyColor(metadata.difficulty)}`}
            >
              {metadata.difficulty.toUpperCase()}
            </Badge>
          </div>
        </motion.div>

        {/* Case Info Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { icon: MapPin, label: "LOCATION", value: metadata.location.split(",")[0] },
            { icon: Calendar, label: "DATE", value: metadata.date },
            { icon: FileSearch, label: "EVIDENCE", value: `${evidence.length} ITEMS` },
            { icon: Users, label: "SUSPECTS", value: `${suspects.length} PERSONS` },
          ].map((info) => (
            <div
              key={info.label}
              className="glass-panel p-3 border border-white/5"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <info.icon className="w-3 h-3 text-detective-red/60" />
                <span className="text-[9px] font-mono text-detective-muted tracking-widest">
                  {info.label}
                </span>
              </div>
              <div className="text-xs font-mono text-white/80">{info.value}</div>
            </div>
          ))}
        </motion.div>

        {/* Briefing */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-6 mb-8"
        >
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-detective-amber" />
            <h2 className="text-sm font-mono text-detective-amber tracking-wider">
              CASE BRIEFING
            </h2>
          </div>
          <p className="text-sm text-white/70 font-mono leading-relaxed">
            {metadata.description}
          </p>
        </motion.div>

        {/* Victim Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-6 mb-8"
        >
          <h2 className="text-sm font-mono text-detective-muted tracking-wider mb-4">
            VICTIM
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-[10px] font-mono text-detective-muted tracking-widest mb-1">
                NAME
              </div>
              <div className="text-sm font-mono text-white">{victim.name}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-detective-muted tracking-widest mb-1">
                AGE
              </div>
              <div className="text-sm font-mono text-white">{victim.age}</div>
            </div>
            <div>
              <div className="text-[10px] font-mono text-detective-muted tracking-widest mb-1">
                OCCUPATION
              </div>
              <div className="text-sm font-mono text-white">
                {victim.occupation}
              </div>
            </div>
            {victim.causeOfDeath && (
              <div>
                <div className="text-[10px] font-mono text-detective-muted tracking-widest mb-1">
                  CAUSE OF DEATH
                </div>
                <div className="text-sm font-mono text-detective-red/80">
                  {victim.causeOfDeath}
                </div>
              </div>
            )}
          </div>
          <div className="mt-4">
            <div className="text-[10px] font-mono text-detective-muted tracking-widest mb-1">
              DESCRIPTION
            </div>
            <p className="text-xs font-mono text-white/60 leading-relaxed">
              {victim.description}
            </p>
          </div>
        </motion.div>

        {/* Suspects Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel p-6 mb-8"
        >
          <h2 className="text-sm font-mono text-detective-muted tracking-wider mb-4">
            PERSONS OF INTEREST
          </h2>
          <div className="space-y-3">
            {suspects.map((suspect) => (
              <div
                key={suspect.id}
                className="flex items-center justify-between p-3 border border-white/5 bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 border border-white/10 flex items-center justify-center text-xs font-mono text-white/40">
                    {suspect.id.split("-")[1]}
                  </div>
                  <div>
                    <div className="text-sm font-mono text-white">
                      {suspect.name}
                    </div>
                    <div className="text-[10px] font-mono text-detective-muted">
                      {suspect.relationshipToVictim}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-mono text-detective-muted tracking-widest">
                    SUSPICION
                  </div>
                  <div className="text-sm font-mono text-white/80">
                    {suspect.suspicionScore}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Leaderboard */}
        <CaseLeaderboard caseId={metadata.id} />

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center gap-3"
        >
          {playerName && (
            <span className="text-[10px] font-mono text-detective-muted tracking-widest">
              PLAYING AS <span className="text-white/70">{playerName}</span>
            </span>
          )}
          <button
            onClick={handleStart}
            className="group relative px-12 py-4 bg-detective-red text-white font-mono text-sm tracking-wider hover:bg-detective-red-dim transition-all duration-300 flex items-center gap-3"
          >
            <Clock className="w-4 h-4" />
            BEGIN INVESTIGATION
          </button>
        </motion.div>
      </div>

      <PlayerNameDialog open={nameDialogOpen} onConfirm={handleConfirmName} />
    </div>
  );
}
