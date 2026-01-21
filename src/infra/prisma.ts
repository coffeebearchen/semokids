import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { createClient } from "@libsql/client";
import * as libsqlAdapterMod from "@prisma/adapter-libsql";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function mustGetDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.trim()) {
    throw new Error("DATABASE_URL is missing. Ensure .env has DATABASE_URL and runtime loads it.");
  }
  return url.trim();
}

function pickAdapterCtor(mod: any) {
  if (mod && typeof mod.PrismaLibSql === "function") return mod.PrismaLibSql;
  if (mod && typeof mod.default === "function") return mod.default;
  for (const k of Object.keys(mod || {})) if (typeof mod[k] === "function") return mod[k];
  throw new Error("Cannot find adapter ctor in @prisma/adapter-libsql: " + JSON.stringify(Object.keys(mod || {})));
}

function createPrisma() {
  const dbUrl = mustGetDatabaseUrl();
  const libsql = createClient({ url: dbUrl });
  const AdapterCtor = pickAdapterCtor(libsqlAdapterMod);
  const adapter = new AdapterCtor(libsql);

  return new PrismaClient({
    adapter,
    datasources: { db: { url: dbUrl } },
  });
}

export const prisma = globalForPrisma.prisma ?? createPrisma();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;