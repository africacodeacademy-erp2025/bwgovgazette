import fs from "fs";
import path from "path";
import { Pool, PoolConfig } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

loadEnvFromFile();

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function loadEnvFromFile() {
  if (process.env.DATABASE_URL) {
    return;
  }

  const envPath = path.join(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    return;
  }

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) {
      continue;
    }

    const eqIndex = line.indexOf("=");
    if (eqIndex === -1) {
      continue;
    }

    const key = line.slice(0, eqIndex).trim();
    if (!key || process.env[key]) {
      continue;
    }

    const value = line
      .slice(eqIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, "");
    process.env[key] = value;
  }
}

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  // For local development with Supabase's self-signed certs / pooler,
  // disable strict TLS verification. This avoids `self-signed certificate in certificate chain` errors.
  // NOTE: This weakens TLS verification and should NOT be used in production.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED =
    process.env.NODE_TLS_REJECT_UNAUTHORIZED ?? "0";

  // Configure pool with SSL settings for Supabase
  // Force SSL but don't verify the certificate chain (required for Supabase pooler)
  //
  // keepAlive + keepAliveInitialDelayMillis: emits TCP keep-alive probes so
  //   the OS/network layer detects dead connections before Prisma tries to
  //   reuse them.  Critical for long-running uploads (OCR / embedding) where
  //   the pg server or Supabase pooler drops idle connections.
  //
  // idleTimeoutMillis: proactively retire idle pool connections after 30 s,
  //   well before Supabase's server_idle_timeout (600 s by default).  When
  //   the next query arrives it gets a fresh connection instead of a stale one.
  //
  // connectionTimeoutMillis: fail fast (10 s) when no connection is available
  //   rather than blocking indefinitely.
  const poolConfig: PoolConfig = {
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
    keepAlive: true,
    keepAliveInitialDelayMillis: 10_000,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
  };

  const pool = new Pool(poolConfig);
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
