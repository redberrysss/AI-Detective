import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDifficultyColor(difficulty: string) {
  switch (difficulty) {
    case "easy":
      return "text-green-400 bg-green-400/10 border-green-400/20";
    case "medium":
      return "text-amber-400 bg-amber-400/10 border-amber-400/20";
    case "hard":
      return "text-orange-400 bg-orange-400/10 border-orange-400/20";
    case "expert":
      return "text-red-400 bg-red-400/10 border-red-400/20";
    default:
      return "text-neutral-400 bg-neutral-400/10 border-neutral-400/20";
  }
}

export function getReliabilityColor(reliability: string) {
  switch (reliability) {
    case "high":
      return "text-green-400";
    case "medium":
      return "text-amber-400";
    case "low":
      return "text-red-400";
    case "unverified":
      return "text-neutral-400";
    default:
      return "text-neutral-400";
  }
}

export function getSuspicionColor(score: number) {
  if (score >= 70) return "text-red-400";
  if (score >= 50) return "text-amber-400";
  return "text-green-400";
}

export function formatTimestamp(ts: string) {
  const date = new Date(ts);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function getCategoryIcon(category: string) {
  const icons: Record<string, string> = {
    photograph: "📷",
    document: "📄",
    cctv: "📹",
    audio: "🎵",
    message: "💬",
    email: "📧",
    location: "📍",
    fingerprint: "🔍",
    object: "📦",
    financial: "💰",
    forensic: "🔬",
    digital: "💻",
  };
  return icons[category] || "📋";
}
