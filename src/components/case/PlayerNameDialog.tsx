"use client";

import { useState } from "react";
import { Fingerprint } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PlayerNameDialogProps {
  open: boolean;
  onConfirm: (name: string) => void;
}

export default function PlayerNameDialog({
  open,
  onConfirm,
}: PlayerNameDialogProps) {
  return (
    <Dialog open={open}>{open && <NameForm onConfirm={onConfirm} />}</Dialog>
  );
}

function NameForm({ onConfirm }: { onConfirm: (name: string) => void }) {
  const [name, setName] = useState("");
  const canConfirm = name.trim().length > 0;

  return (
    <DialogContent
      showCloseButton={false}
      className="bg-detective-surface border border-white/10 sm:max-w-sm"
    >
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-white font-mono tracking-wider">
          <Fingerprint className="w-4 h-4 text-detective-red" />
          DETECTIVE IDENTIFICATION
        </DialogTitle>
        <DialogDescription className="font-mono text-xs">
          Enter your name for the case records. It will be shown on the
          leaderboard if you crack the case.
        </DialogDescription>
      </DialogHeader>
      <input
        autoFocus
        value={name}
        maxLength={40}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && canConfirm) onConfirm(name);
        }}
        placeholder="DETECTIVE NAME"
        className="w-full bg-white/5 border border-white/10 px-3 py-2 font-mono text-sm text-white placeholder:text-detective-muted/50 outline-none focus:border-detective-red/60 transition-colors"
      />
      <DialogFooter className="bg-transparent border-0 -mx-4 -mb-4 p-4">
        <button
          disabled={!canConfirm}
          onClick={() => canConfirm && onConfirm(name)}
          className="w-full px-6 py-2.5 bg-detective-red text-white font-mono text-xs tracking-wider hover:bg-detective-red-dim transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none"
        >
          CONFIRM &amp; BEGIN
        </button>
      </DialogFooter>
    </DialogContent>
  );
}
