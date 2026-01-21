import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function mustGetDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.trim()) {
    throw new Error("DATABASE_URL is missing. Make sure .env contains DATABASE_URL and the process loads it.");
  }
  return url;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: mustGetDatabaseUrl(),
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;