"use client";

import { useState, useCallback, useRef, useMemo } from "react";
import { useInvestigationStore } from "@/stores/investigation-store";
import { Link2 } from "lucide-react";
import { ConnectionLabel } from "@/types";

interface BoardItem {
  id: string;
  type: "suspect" | "evidence" | "location" | "witness";
  label: string;
  x: number;
  y: number;
}

const LABELS: { value: ConnectionLabel; label: string }[] = [
  { value: "seen_at", label: "Seen at" },
  { value: "owns", label: "Owns" },
  { value: "communicated_with", label: "Communicated with" },
  { value: "contradicts", label: "Contradicts" },
  { value: "proves", label: "Proves" },
  { value: "located_near", label: "Located near" },
  { value: "possible_motive", label: "Possible motive" },
  { value: "connected_to", label: "Connected to" },
];

function buildBoardItems(
  currentCase: NonNullable<ReturnType<typeof useInvestigationStore.getState>["currentCase"]>,
  discoveredEvidence: string[]
): BoardItem[] {
  const newItems: BoardItem[] = [];
  currentCase.suspects.forEach((s, i) => {
    newItems.push({
      id: s.id,
      type: "suspect",
      label: s.name,
      x: 80 + (i % 3) * 220,
      y: 60 + Math.floor(i / 3) * 120,
    });
  });
  currentCase.witnesses.forEach((w, i) => {
    newItems.push({
      id: w.id,
      type: "witness",
      label: w.name,
      x: 80 + i * 220,
      y: 300,
    });
  });
  currentCase.locations.forEach((l, i) => {
    newItems.push({
      id: l.id,
      type: "location",
      label: l.name,
      x: 80 + i * 220,
      y: 420,
    });
  });
  discoveredEvidence.slice(0, 6).forEach((eId, i) => {
    const ev = currentCase.evidence.find((e) => e.id === eId);
    if (ev) {
      newItems.push({
        id: ev.id,
        type: "evidence",
        label: ev.title.slice(0, 25),
        x: 80 + (i % 4) * 200,
        y: 540 + Math.floor(i / 4) * 120,
      });
    }
  });
  return newItems;
}

export default function BoardPanel() {
  const { currentCase, state, addConnection } =
    useInvestigationStore();
  const initialItems = useMemo(
    () => (currentCase && state ? buildBoardItems(currentCase, state.discoveredEvidence) : []),
    [currentCase, state]
  );
  const [items, setItems] = useState<BoardItem[]>(initialItems);
  const [connections, setConnections] = useState<
    { from: string; to: string; label: ConnectionLabel }[]
  >([]);
  const [connectMode, setConnectMode] = useState(false);
  const [connectFrom, setConnectFrom] = useState<string | null>(null);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  const [pendingConnection, setPendingConnection] = useState<{
    from: string;
    to: string;
  } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const connIdRef = useRef(0);

  const handleMouseDown = useCallback(
    (id: string, e: React.MouseEvent) => {
      if (connectMode) {
        if (!connectFrom) {
          setConnectFrom(id);
        } else if (connectFrom !== id) {
          setPendingConnection({ from: connectFrom, to: id });
          setShowLabelPicker(true);
        }
        return;
      }
      setDragging(id);
      const startX = e.clientX;
      const startY = e.clientY;
      const item = items.find((i) => i.id === id);
      if (!item) return;

      const onMove = (me: MouseEvent) => {
        const dx = me.clientX - startX;
        const dy = me.clientY - startY;
        setItems((prev) =>
          prev.map((i) =>
            i.id === id ? { ...i, x: item.x + dx, y: item.y + dy } : i
          )
        );
      };
      const onUp = () => {
        setDragging(null);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [connectMode, connectFrom, items]
  );

  const addLabelConnection = (label: ConnectionLabel) => {
    if (!pendingConnection) return;
    const conn = {
      id: `CONN-${++connIdRef.current}`,
      sourceId: pendingConnection.from,
      targetId: pendingConnection.to,
      label,
      description: "",
    };
    addConnection(conn);
    setConnections((prev) => [
      ...prev,
      { from: conn.sourceId, to: conn.targetId, label },
    ]);
    setShowLabelPicker(false);
    setPendingConnection(null);
    setConnectFrom(null);
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case "suspect":
        return "border-detective-red/40 bg-detective-red/5 text-detective-red";
      case "evidence":
        return "border-amber-400/40 bg-amber-400/5 text-amber-400";
      case "location":
        return "border-green-400/40 bg-green-400/5 text-green-400";
      case "witness":
        return "border-blue-400/40 bg-blue-400/5 text-blue-400";
      default:
        return "border-white/20 bg-white/5 text-white/60";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white font-heading tracking-tight">
            INVESTIGATION BOARD
          </h2>
          <div className="text-[10px] font-mono text-detective-muted tracking-widest mt-1">
            CONNECT EVIDENCE TO SUSPECTS
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setConnectMode(!connectMode);
              setConnectFrom(null);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-wider border transition-all ${
              connectMode
                ? "border-detective-red/40 text-detective-red bg-detective-red/5"
                : "border-white/8 text-detective-muted hover:text-white/70"
            }`}
          >
            <Link2 className="w-3 h-3" />
            {connectMode ? "CONNECTING..." : "CONNECT"}
          </button>
        </div>
      </div>

      {connectMode && connectFrom && (
        <div className="text-[10px] font-mono text-detective-amber px-2 py-1.5 bg-detective-amber/5 border border-detective-amber/20">
          Click another node to create a connection. Press ESC to cancel.
        </div>
      )}

      {/* Label Picker Modal */}
      {showLabelPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="glass-panel border border-white/10 p-5 w-72">
            <h3 className="text-xs font-mono text-white mb-3 tracking-wider">
              CONNECTION TYPE
            </h3>
            <div className="space-y-1">
              {LABELS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => addLabelConnection(l.value)}
                  className="w-full text-left px-3 py-2 text-xs font-mono text-white/70 hover:bg-white/5 transition-colors"
                >
                  {l.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                setShowLabelPicker(false);
                setPendingConnection(null);
                setConnectFrom(null);
              }}
              className="w-full mt-3 px-3 py-2 text-xs font-mono text-detective-muted border border-white/8 hover:text-white/70 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}

      {/* Board */}
      <div
        ref={boardRef}
        className="relative w-full h-[600px] border border-white/5 bg-detective-surface overflow-hidden investigation-grid"
      >
        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          {connections.map((conn, i) => {
            const fromItem = items.find((it) => it.id === conn.from);
            const toItem = items.find((it) => it.id === conn.to);
            if (!fromItem || !toItem) return null;
            const fx = fromItem.x + 60;
            const fy = fromItem.y + 20;
            const tx = toItem.x + 60;
            const ty = toItem.y + 20;
            const mx = (fx + tx) / 2;
            const my = (fy + ty) / 2 - 30;
            return (
              <g key={i}>
                <path
                  d={`M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`}
                  stroke="rgba(220,38,38,0.3)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="4 4"
                />
                <text
                  x={mx}
                  y={my - 5}
                  textAnchor="middle"
                  className="fill-white/30 text-[8px]"
                  style={{ fontFamily: "monospace" }}
                >
                  {LABELS.find((l) => l.value === conn.label)?.label || conn.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Nodes */}
        {items.map((item) => (
          <div
            key={item.id}
            onMouseDown={(e) => handleMouseDown(item.id, e)}
            className={`absolute z-20 cursor-grab active:cursor-grabbing border px-3 py-2 text-[10px] font-mono select-none transition-shadow hover:shadow-lg ${getItemColor(item.type)} ${
              dragging === item.id ? "opacity-80" : ""
            } ${connectFrom === item.id ? "ring-2 ring-detective-red/50" : ""}`}
            style={{ left: item.x, top: item.y }}
          >
            <div className="text-[8px] tracking-widest opacity-50 mb-0.5">
              {item.type.toUpperCase()}
            </div>
            <div className="text-white/90 font-bold">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
