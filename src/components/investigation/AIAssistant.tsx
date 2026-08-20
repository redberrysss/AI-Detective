"use client";

import { useState, useRef, useEffect } from "react";
import { useInvestigationStore } from "@/stores/investigation-store";
import { Send, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

export default function AIAssistant() {
  const { currentCase, state, incrementHints } = useInvestigationStore();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "I am your AI Detective Assistant. I have access to the case data and evidence you've discovered. Ask me anything about the case.\n\nTry:\n• \"What do we know about [suspect]?\"\n• \"Which evidence contradicts [suspect]'s alibi?\"\n• \"What happened between [time]?\"\n• \"Give me a hint.\"",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getHint = () => {
    if (!currentCase || !state) return "No active case.";
    const hintLevel = state.hintsUsed + 1;

    if (hintLevel === 1) {
      return "Look more closely at the contradictions between witness statements and physical evidence. Some statements don't align with timestamps.";
    }
    if (hintLevel === 2) {
      return "Two pieces of evidence appear inconsistent with Dr. Reeves' statement about the visit being 'routine.' Compare the communications evidence with her testimony.";
    }
    if (hintLevel >= 3) {
      const cont = currentCase.contradictions[0];
      if (cont) {
        return `Compare ${cont.statementText.slice(0, 60)}... with the contradicting evidence. The confidence is ${cont.confidence}%.`;
      }
    }
    return "You've used all available hints. Trust your instincts.";
  };

  const generateResponse = (query: string): ChatMessage => {
    if (!currentCase || !state) {
      return { role: "assistant", content: "No active case loaded." };
    }

    const lower = query.toLowerCase();

    if (lower.includes("hint")) {
      incrementHints();
      return { role: "assistant", content: getHint() };
    }

    // Suspect queries
    for (const suspect of currentCase.suspects) {
      if (lower.includes(suspect.name.toLowerCase().split(" ")[0].toLowerCase())) {
        const discovered = state.discoveredEvidence;
        const relevantEvidence = currentCase.evidence.filter(
          (e) =>
            e.linkedSuspects.includes(suspect.id) &&
            discovered.includes(e.id)
        );

        let response = `**${suspect.name}** (${suspect.relationshipToVictim})\n\n`;
        response += `Occupation: ${suspect.occupation}\n`;
        response += `Alibi: "${suspect.alibi}"\n`;
        response += `Alibi Verified: ${suspect.alibiVerified ? "Yes" : "No"}\n`;
        response += `Motive: ${suspect.motive}\n\n`;

        if (relevantEvidence.length > 0) {
          response += `Connected Evidence:\n`;
          relevantEvidence.forEach((e) => {
            response += `• ${e.title} [SOURCE: ${e.id}]\n`;
          });
        } else {
          response += "No relevant evidence discovered yet.\n";
        }

        return { role: "assistant", content: response, sources: relevantEvidence.map((e) => e.id) };
      }
    }

    // Contradiction queries
    if (lower.includes("contradict") || lower.includes("inconsist")) {
      const found = state.contradictionsFound;
      const relevant = currentCase.contradictions.filter((c) =>
        found.includes(c.id)
      );

      if (relevant.length === 0) {
        return {
          role: "assistant",
          content:
            "No contradictions have been formally identified yet. Review suspect statements against the timeline and physical evidence. Look for timestamps that don't match.",
        };
      }

      let response = "Identified Contradictions:\n\n";
      relevant.forEach((c) => {
        response += `${c.statementText}\n`;
        response += `Contradicted by: ${c.contradictingEvidenceId} (Confidence: ${c.confidence}%)\n\n`;
      });

      return { role: "assistant", content: response, sources: relevant.map((c) => c.contradictingEvidenceId) };
    }

    // Timeline queries
    if (lower.includes("timeline") || lower.includes("happened between") || lower.includes("what happened")) {
      let response = "Key Timeline Events:\n\n";
      currentCase.timeline
        .filter((e) => e.verified)
        .forEach((e) => {
          response += `${e.timestamp} — ${e.description}\n`;
        });

      const gaps = currentCase.timeline.filter((e) => e.isGap);
      if (gaps.length > 0) {
        response += "\nUnexplained Gaps:\n";
        gaps.forEach((g) => {
          response += `⚠ ${g.gapStart} → ${g.gapEnd}: ${g.description}\n`;
        });
      }

      return { role: "assistant", content: response };
    }

    // General fallback
    const discovered = state.discoveredEvidence.length;
    const total = currentCase.evidence.length;
    return {
      role: "assistant",
      content: `I can help with that. Currently you've discovered ${discovered}/${total} pieces of evidence.\n\nTry asking about:\n• Specific suspects (e.g., "What do we know about Victoria?")\n• Contradictions in statements\n• The timeline of events\n• Request a hint\n\nI reference evidence IDs when providing information so you can verify my claims.`,
    };
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { role: "user" as const, content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(userMsg.content);
      setMessages((prev) => [...prev, response]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-detective-red" />
          <span className="text-[10px] font-mono text-detective-muted tracking-[0.15em]">
            AI DETECTIVE ASSISTANT
          </span>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-3">
        <div className="space-y-4">
          {messages.map((msg, i) => (
            <div key={i}>
              <div
                className={`text-xs font-mono leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "text-white/80 pl-3 border-l border-white/10"
                    : "text-white/60"
                }`}
              >
                {msg.content}
              </div>
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {msg.sources.map((s) => (
                    <span
                      key={s}
                      className="text-[9px] font-mono px-1.5 py-0.5 bg-detective-red/10 text-detective-red border border-detective-red/20"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="text-detective-muted text-xs font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-detective-red/60 rounded-full pulse-dot" />
              Analyzing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      <div className="px-4 py-2 border-t border-white/5 shrink-0">
        <div className="flex flex-wrap gap-1 mb-2">
          {["Give me a hint", "What contradictions exist?", "Timeline summary"].map(
            (q) => (
              <button
                key={q}
                onClick={() => {
                  setInput(q);
                }}
                className="text-[9px] font-mono px-2 py-1 border border-white/5 text-detective-muted hover:text-white/70 hover:border-white/10 transition-all"
              >
                {q}
              </button>
            )
          )}
        </div>
      </div>

      {/* Input */}
      <div className="px-4 pb-3 shrink-0">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask the detective..."
            className="flex-1 bg-white/[0.03] border border-white/8 px-3 py-2 text-xs font-mono text-white/80 placeholder:text-detective-muted focus:outline-none focus:border-white/15 transition-colors"
          />
          <button
            onClick={handleSend}
            className="px-3 py-2 bg-white/[0.06] border border-white/8 hover:bg-white/[0.1] transition-colors"
          >
            <Send className="w-3.5 h-3.5 text-white/60" />
          </button>
        </div>
      </div>
    </div>
  );
}
