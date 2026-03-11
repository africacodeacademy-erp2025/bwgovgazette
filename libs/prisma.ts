import { Pool, PoolConfig } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

loadEnvFromFile();

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  // For local development with Supabase's self-signed certs / pooler,
  // disable strict TLS verification. This avoids `self-signed certificate in certificate chain` errors.
  // NOTE: This weakens TLS verification and should NOT be used in production.
  process.env.NODE_TLS_REJECT_UNAUTHORIZED =
    process.env.NODE_TLS_REJECT_UNAUTHORIZED ?? "0";

  // Configure pool with SSL settings for Supabase
  // Force SSL but don't verify the certificate chain (required for Supabase pooler)
  const poolConfig: PoolConfig = {
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  };

  const pool = new Pool(poolConfig);
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
