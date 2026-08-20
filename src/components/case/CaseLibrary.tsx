"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Lock, Archive, Phone, Eye, ArrowLeft, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getCaseList } from "@/cases";
import { getDifficultyColor } from "@/lib/utils";

const caseIcons: Record<string, typeof Lock> = {
  "CASE-001": Lock,
  "CASE-002": Archive,
  "CASE-003": Phone,
  "CASE-004": Eye,
};

const caseDates: Record<string, string> = {
  "CASE-001": "March 15, 2024",
  "CASE-002": "June 22, 2024",
  "CASE-003": "September 8, 2024",
  "CASE-004": "December 1, 2024",
};

export default function CaseLibrary() {
  const router = useRouter();
  const caseList = getCaseList();

  return (
    <div className="min-h-screen bg-detective-surface">
      <div className="absolute inset-0 investigation-grid opacity-20" />
      <div className="absolute inset-0 grain-overlay" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-detective-muted hover:text-white/80 transition-colors mb-8 font-mono text-xs tracking-wider"
          >
            <ArrowLeft className="w-3 h-3" />
            BACK TO SYSTEM
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight font-heading">
                CASE LIBRARY
              </h1>
              <p className="text-sm font-mono text-detective-muted mt-1 tracking-wider">
                {caseList.length} CASES AVAILABLE
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-3 py-1.5 border border-white/8 text-detective-muted text-xs font-mono tracking-wider hover:border-white/15 hover:text-white/70 transition-all">
                <Filter className="w-3 h-3" />
                FILTER
              </button>
            </div>
          </div>

          <div className="h-px bg-white/5 mt-6" />
        </motion.div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {caseList.map((caseMeta, i) => {
            const Icon = caseIcons[caseMeta.id] || Lock;
            return (
              <motion.div
                key={caseMeta.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
              >
                <button
                  onClick={() => router.push(`/cases/${caseMeta.id}`)}
                  className="w-full text-left group glass-panel p-6 hover:border-white/12 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border border-white/8 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-detective-red/60" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-detective-muted tracking-widest">
                          {caseMeta.id}
                        </div>
                        <div className="text-sm font-mono text-white/50">
                          {caseDates[caseMeta.id] || caseMeta.date}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono tracking-wider ${getDifficultyColor(caseMeta.difficulty)}`}
                    >
                      {caseMeta.difficulty.toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 font-heading tracking-tight">
                    {caseMeta.title.toUpperCase()}
                  </h3>

                  <p className="text-xs text-detective-muted mb-4 line-clamp-2 font-mono leading-relaxed">
                    {caseMeta.description}
                  </p>

                  <div className="flex items-center gap-4 text-[10px] font-mono text-detective-muted">
                    <span>{caseMeta.location.split(",")[0]}</span>
                    <span className="text-white/10">|</span>
                    <span>{caseMeta.evidenceCount} EVIDENCE</span>
                    <span className="text-white/10">|</span>
                    <span>{caseMeta.suspectCount} SUSPECTS</span>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                    <span className="text-[10px] font-mono text-detective-muted tracking-widest uppercase">
                      {caseMeta.status === "unsolved"
                        ? "UNSOLVED"
                        : caseMeta.status === "in_progress"
                          ? "IN PROGRESS"
                          : "COMPLETED"}
                    </span>
                    <span className="text-[10px] font-mono text-detective-red/60 group-hover:text-detective-red transition-colors tracking-wider">
                      OPEN CASE →
                    </span>
                  </div>
                </button>
              </motion.div>
            );
          })}

          {/* Placeholder Cases */}
          {["CASE-002", "CASE-003", "CASE-004"].map((id, i) => {
            const titles = ["THE MISSING ARCHIVE", "THE MIDNIGHT CALL", "THE SILENT WITNESS"];
            const difficulties = ["medium", "hard", "expert"] as const;
            const Icon =
              id === "CASE-002"
                ? Archive
                : id === "CASE-003"
                  ? Phone
                  : Eye;
            return (
              <motion.div
                key={id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (caseList.length + i) * 0.1, duration: 0.5 }}
              >
                <div className="glass-panel p-6 opacity-40 cursor-not-allowed">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 border border-white/8 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-detective-red/40" />
                      </div>
                      <div>
                        <div className="text-[10px] font-mono text-detective-muted tracking-widest">
                          {id}
                        </div>
                        <div className="text-sm font-mono text-white/30">
                          {caseDates[id]}
                        </div>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono tracking-wider ${getDifficultyColor(difficulties[i])}`}
                    >
                      {difficulties[i].toUpperCase()}
                    </Badge>
                  </div>

                  <h3 className="text-lg font-bold text-white/60 mb-2 font-heading tracking-tight">
                    {titles[i]}
                  </h3>

                  <p className="text-xs text-detective-muted/60 mb-4 font-mono leading-relaxed">
                    Case data not yet available. Coming soon.
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <span className="text-[10px] font-mono text-detective-muted/60 tracking-widest uppercase">
                      LOCKED
                    </span>
                    <span className="text-[10px] font-mono text-white/20 tracking-wider">
                      COMING SOON
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
