import { NextRequest } from "next/server";
import { getDb, isDbConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export interface LeaderboardEntry {
  playerName: string;
  durationSeconds: number;
  hintsUsed: number;
  totalScore: number;
  createdAt: string;
}

export async function GET(request: NextRequest) {
  if (!isDbConfigured()) {
    return Response.json({ configured: false, entries: [] });
  }

  const caseId = request.nextUrl.searchParams.get("caseId");
  if (!caseId) {
    return Response.json({ error: "caseId is required" }, { status: 400 });
  }

  try {
    const sql = await getDb();
    if (!sql) {
      return Response.json({ configured: false, entries: [] });
    }
    const rows = await sql`
      SELECT player_name, duration_seconds, hints_used, total_score, created_at
      FROM scores
      WHERE case_id = ${caseId} AND correct = TRUE
      ORDER BY duration_seconds ASC, created_at ASC
      LIMIT 10
    `;
    const entries: LeaderboardEntry[] = rows.map((row) => ({
      playerName: row.player_name,
      durationSeconds: row.duration_seconds,
      hintsUsed: row.hints_used,
      totalScore: row.total_score,
      createdAt: row.created_at.toISOString(),
    }));
    return Response.json({ configured: true, entries });
  } catch (err) {
    console.error("Failed to load leaderboard:", err);
    return Response.json(
      { error: "Failed to load leaderboard" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isDbConfigured()) {
    return Response.json({ ok: false, reason: "not_configured" }, { status: 200 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { caseId, playerName, durationSeconds, hintsUsed, totalScore, correct } =
    (body ?? {}) as Record<string, unknown>;

  if (
    typeof caseId !== "string" ||
    typeof playerName !== "string" ||
    typeof durationSeconds !== "number" ||
    typeof correct !== "boolean"
  ) {
    return Response.json(
      { error: "caseId, playerName, durationSeconds and correct are required" },
      { status: 400 }
    );
  }

  const name = playerName.trim().slice(0, 40);
  if (!name) {
    return Response.json({ error: "playerName cannot be empty" }, { status: 400 });
  }

  const safeDuration = Math.max(0, Math.floor(durationSeconds));
  const safeHints = Math.max(0, Math.floor(hintsUsed as number) || 0);
  const safeTotal = Math.max(0, Math.min(100, Math.floor(totalScore as number) || 0));

  try {
    const sql = await getDb();
    if (!sql) {
      return Response.json({ ok: false, reason: "not_configured" }, { status: 200 });
    }
    await sql`
      INSERT INTO scores (case_id, player_name, duration_seconds, hints_used, total_score, correct)
      VALUES (${caseId}, ${name}, ${safeDuration}, ${safeHints}, ${safeTotal}, ${correct})
    `;
    let rank: number | null = null;
    if (correct) {
      const [{ faster }] = await sql`
        SELECT COUNT(*)::int AS faster
        FROM scores
        WHERE case_id = ${caseId} AND correct = TRUE AND duration_seconds < ${safeDuration}
      `;
      rank = faster + 1;
    }
    return Response.json({ ok: true, rank });
  } catch (err) {
    console.error("Failed to save score:", err);
    return Response.json({ error: "Failed to save score" }, { status: 500 });
  }
}
