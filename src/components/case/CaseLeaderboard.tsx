"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Timer, Lightbulb, ShieldQuestion } from "lucide-react";
import { formatDuration } from "@/lib/player";

interface LeaderboardEntry {
  playerName: string;
  durationSeconds: number;
  hintsUsed: number;
  totalScore: number;
  createdAt: string;
}

interface CaseLeaderboardProps {
  caseId: string;
}

export default function CaseLeaderboard({ caseId }: CaseLeaderboardProps) {
  const [entries, setEntries] = useState<LeaderboardEntry[] | null>(null);
  const [configured, setConfigured] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/scores?caseId=${encodeURIComponent(caseId)}`)
      .then((res) => res.json())
      .then((data: { configured?: boolean; entries?: LeaderboardEntry[] }) => {
        if (cancelled) return;
        setConfigured(data.configured !== false);
        setEntries(data.entries ?? []);
      })
      .catch(() => {
        if (!cancelled) {
          setConfigured(true);
          setEntries([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [caseId]);

  if (!configured) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="glass-panel p-6 mb-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4 text-detective-amber" />
        <h2 className="text-sm font-mono text-detective-amber tracking-wider">
          FASTEST DETECTIVES
        </h2>
        <span className="ml-auto text-[9px] font-mono text-detective-muted tracking-widest">
          TOP 10 — TIME TO SOLVE
        </span>
      </div>

      {entries === null ? (
        <div className="text-xs font-mono text-detective-muted py-3">
          Loading records...
        </div>
      ) : entries.length === 0 ? (
        <div className="flex items-center gap-2 text-xs font-mono text-detective-muted py-3">
          <ShieldQuestion className="w-3.5 h-3.5" />
          No one has cracked this case yet. Be the first.
        </div>
      ) : (
        <div className="space-y-1">
          {entries.map((entry, i) => (
            <div
              key={`${entry.playerName}-${entry.createdAt}-${i}`}
              className={`flex items-center gap-3 px-3 py-2 border ${
                i === 0
                  ? "border-detective-amber/30 bg-detective-amber/[0.04]"
                  : "border-white/5 bg-white/[0.02]"
              }`}
            >
              <span
                className={`w-6 text-xs font-mono shrink-0 ${
                  i === 0
                    ? "text-detective-amber"
                    : i < 3
                      ? "text-white/70"
                      : "text-detective-muted/60"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 truncate text-sm font-mono text-white/85">
                {entry.playerName}
              </span>
              {entry.hintsUsed > 0 && (
                <span className="flex items-center gap-1 text-[10px] font-mono text-detective-muted/70 shrink-0">
                  <Lightbulb className="w-3 h-3" />
                  {entry.hintsUsed}
                </span>
              )}
              <span className="text-[10px] font-mono text-white/40 shrink-0 hidden sm:inline">
                {entry.totalScore}/100
              </span>
              <span className="flex items-center gap-1.5 text-sm font-mono text-detective-red/80 shrink-0 w-[72px] justify-end">
                <Timer className="w-3 h-3" />
                {formatDuration(entry.durationSeconds)}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
