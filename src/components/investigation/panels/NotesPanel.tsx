"use client";

import { useInvestigationStore } from "@/stores/investigation-store";
import { useState } from "react";
import { PenLine } from "lucide-react";

export default function NotesPanel() {
  const { state, addNote } = useInvestigationStore();
  const [notes, setNotes] = useState<Record<string, string>>(
    state?.notes || {}
  );

  const handleSave = (key: string, value: string) => {
    setNotes((prev) => ({ ...prev, [key]: value }));
    addNote(key, value);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-white font-heading tracking-tight">
          INVESTIGATION NOTES
        </h2>
        <div className="text-[10px] font-mono text-detective-muted tracking-widest mt-1">
          YOUR OBSERVATIONS & THEORIES
        </div>
      </div>

      <div className="space-y-4">
        {[
          { key: "general", label: "GENERAL NOTES" },
          { key: "suspects", label: "SUSPECT THEORIES" },
          { key: "evidence", label: "EVIDENCE OBSERVATIONS" },
          { key: "timeline", label: "TIMELINE NOTES" },
          { key: "final", label: "FINAL THEORY" },
        ].map((section) => (
          <div key={section.key} className="glass-panel border border-white/5 p-4">
            <div className="flex items-center gap-2 mb-3">
              <PenLine className="w-3.5 h-3.5 text-detective-red/60" />
              <span className="text-[10px] font-mono text-detective-muted tracking-widest">
                {section.label}
              </span>
            </div>
            <textarea
              value={notes[section.key] || ""}
              onChange={(e) => handleSave(section.key, e.target.value)}
              placeholder="Write your observations here..."
              className="w-full h-32 bg-white/[0.02] border border-white/5 p-3 text-xs font-mono text-white/70 placeholder:text-detective-muted/40 focus:outline-none focus:border-white/15 resize-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
