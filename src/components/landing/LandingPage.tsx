"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  Search,
  Shield,
  ChevronRight,
  Eye,
  Fingerprint,
  ScanLine,
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen overflow-hidden bg-detective-surface">
      {/* Background Effects */}
      <div className="absolute inset-0 investigation-grid opacity-30" />
      <div className="absolute inset-0 grain-overlay" />

      {/* Radar Circle */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.04]">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-[80px] rounded-full border border-white/10" />
        <div className="absolute inset-[160px] rounded-full border border-white/10" />
        <div className="absolute inset-[240px] rounded-full border border-white/10" />
        <div className="absolute inset-[320px] rounded-full border border-white/10" />
        <div className="radar-sweep absolute inset-0 rounded-full" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Top Label */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-2 mb-8"
        >
          <div className="h-px w-12 bg-white/20" />
          <span className="text-xs font-mono tracking-[0.3em] text-detective-muted uppercase">
            AI-Powered Investigation System
          </span>
          <div className="h-px w-12 bg-white/20" />
        </motion.div>

        {/* Shield Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-8"
        >
          <div className="relative">
            <Shield className="w-16 h-16 text-white/10" strokeWidth={1} />
            <Fingerprint className="absolute inset-0 m-auto w-8 h-8 text-detective-red/60" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-4"
        >
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white font-heading">
            AI DETECTIVE
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mb-2"
        >
          <p className="text-lg md:text-xl font-mono text-white/60 tracking-wide">
            EVERY CLUE TELLS A STORY.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="text-center mb-12"
        >
          <p className="text-sm font-mono text-detective-muted tracking-[0.2em]">
            INVESTIGATE. CONNECT. DEDUCE.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="flex items-center gap-8 mb-12"
        >
          {[
            { icon: Eye, label: "CASES", value: "8" },
            { icon: Search, label: "EVIDENCE", value: "100+" },
            { icon: ScanLine, label: "SUSPECTS", value: "30+" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <stat.icon className="w-4 h-4 text-detective-red/60" />
              <div>
                <div className="text-xs font-mono text-detective-muted">
                  {stat.label}
                </div>
                <div className="text-sm font-mono text-white/80">
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={() => router.push("/cases")}
            className="group relative px-8 py-3 bg-white text-black font-mono text-sm tracking-wider hover:bg-white/90 transition-all duration-300 flex items-center gap-2"
          >
            START INVESTIGATION
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => router.push("/cases")}
            className="px-8 py-3 border border-white/10 text-white/60 font-mono text-sm tracking-wider hover:border-white/20 hover:text-white/80 transition-all duration-300"
          >
            EXPLORE CASES
          </button>
        </motion.div>

        {/* Bottom Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="flex items-center gap-2 text-detective-muted">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-dot" />
            <span className="text-[10px] font-mono tracking-widest uppercase">
              System Online
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
