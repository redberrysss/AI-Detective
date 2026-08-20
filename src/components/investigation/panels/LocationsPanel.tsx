"use client";

import { useInvestigationStore } from "@/stores/investigation-store";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

export default function LocationsPanel() {
  const { currentCase, setSelectedLocation, selectedLocation } =
    useInvestigationStore();
  if (!currentCase) return null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white font-heading tracking-tight">
          LOCATIONS
        </h2>
        <div className="text-[10px] font-mono text-detective-muted tracking-widest mt-1">
          {currentCase.locations.length} LOCATIONS
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentCase.locations.map((loc, i) => (
          <motion.div
            key={loc.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() =>
              setSelectedLocation(
                selectedLocation === loc.id ? null : loc.id
              )
            }
            className={`glass-panel p-5 border cursor-pointer transition-all duration-200 ${
              selectedLocation === loc.id
                ? "border-detective-red/40 bg-detective-red/5"
                : "border-white/5 hover:border-white/10"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-detective-red/60" />
                <div>
                  <div className="text-[9px] font-mono text-detective-muted tracking-widest">
                    {loc.id}
                  </div>
                  <div className="text-sm font-mono text-white font-bold">
                    {loc.name}
                  </div>
                </div>
              </div>
              <span className="text-[9px] font-mono text-detective-muted px-1.5 py-0.5 border border-white/8">
                {loc.type.toUpperCase()}
              </span>
            </div>

            <div className="text-[10px] font-mono text-detective-muted mb-2">
              {loc.address}
            </div>

            <p className="text-xs font-mono text-white/60 leading-relaxed mb-3">
              {loc.description}
            </p>

            <div className="h-px bg-white/5 mb-3" />

            <div className="space-y-2">
              <div>
                <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                  RELEVANT EVIDENCE
                </div>
                <div className="flex flex-wrap gap-1">
                  {loc.relevantEvidence.map((eId) => (
                    <span
                      key={eId}
                      className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/8 text-white/60"
                    >
                      {eId}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[9px] font-mono text-detective-muted tracking-widest mb-1">
                  RELEVANT SUSPECTS
                </div>
                <div className="flex flex-wrap gap-1">
                  {loc.relevantSuspects.map((sId) => {
                    const s = currentCase.suspects.find((su) => su.id === sId);
                    return (
                      <span
                        key={sId}
                        className="text-[9px] font-mono px-1.5 py-0.5 bg-white/5 border border-white/8 text-white/60"
                      >
                        {s?.name || sId}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
