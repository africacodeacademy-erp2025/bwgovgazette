import { PrismaClient } from "@/app/generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Pass empty object or configuration options
export const prisma = globalThis.prisma || new PrismaClient({

    accelerateUrl: process.env.SHADOW_DATABASE_URL || '',
    
    // Add logging in development
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}
