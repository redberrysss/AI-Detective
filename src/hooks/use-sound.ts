"use client";

import { useCallback, useRef } from "react";

type SoundType =
  | "evidence-open"
  | "evidence-found"
  | "clue-found"
  | "ai-response"
  | "contradiction"
  | "case-solved"
  | "click";

const SOUND_FILES: Record<SoundType, string> = {
  "evidence-open": "/sounds/evidence-open.mp3",
  "evidence-found": "/sounds/clue-found.mp3",
  "clue-found": "/sounds/clue-found.mp3",
  "ai-response": "/sounds/click.mp3",
  contradiction: "/sounds/contradiction.mp3",
  "case-solved": "/sounds/case-solved.mp3",
  click: "/sounds/click.mp3",
};

export function useSound(enabled: boolean) {
  const audioRefs = useRef<Map<SoundType, HTMLAudioElement>>(new Map());

  const play = useCallback(
    (type: SoundType) => {
      if (!enabled) return;
      try {
        let audio = audioRefs.current.get(type);
        if (!audio) {
          audio = new Audio(SOUND_FILES[type]);
          audio.volume = 0.3;
          audioRefs.current.set(type, audio);
        }
        audio.currentTime = 0;
        audio.play().catch(() => {});
      } catch {
        // Silently fail — sounds are optional
      }
    },
    [enabled]
  );

  return { play };
}
