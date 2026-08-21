import postgres from "postgres";

export interface ScoreRow {
  id: number;
  case_id: string;
  player_name: string;
  duration_seconds: number;
  hints_used: number;
  total_score: number;
  correct: boolean;
  created_at: Date;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

declare global {
  var __detectiveSql: ReturnType<typeof postgres> | undefined;
  var __detectiveSchemaReady: Promise<void> | undefined;
}

function getClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return null;
  if (!globalThis.__detectiveSql) {
    globalThis.__detectiveSql = postgres(connectionString, {
      max: 1,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }
  return globalThis.__detectiveSql;
}

async function initSchema(sql: ReturnType<typeof postgres>) {
  await sql.unsafe(`
    CREATE TABLE IF NOT EXISTS scores (
      id SERIAL PRIMARY KEY,
      case_id TEXT NOT NULL,
      player_name TEXT NOT NULL,
      duration_seconds INTEGER NOT NULL,
      hints_used INTEGER NOT NULL DEFAULT 0,
      total_score INTEGER NOT NULL DEFAULT 0,
      correct BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS scores_case_time_idx ON scores (case_id, duration_seconds);
  `);
}

export async function getDb() {
  const sql = getClient();
  if (!sql) return null;
  if (!globalThis.__detectiveSchemaReady) {
    globalThis.__detectiveSchemaReady = initSchema(sql).catch((err) => {
      globalThis.__detectiveSchemaReady = undefined;
      throw err;
    });
  }
  await globalThis.__detectiveSchemaReady;
  return sql;
}
