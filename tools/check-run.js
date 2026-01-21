require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const libsqlAdapterMod = require("@prisma/adapter-libsql");
const { createClient } = require("@libsql/client");

function mustGetDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.trim()) throw new Error("DATABASE_URL missing");
  return url.trim();
}

function pickAdapterCtor(mod) {
  // 你机器上已验证：keys = ['PrismaLibSql']
  if (mod && typeof mod.PrismaLibSql === "function") return mod.PrismaLibSql;
  if (mod && typeof mod.default === "function") return mod.default;
  for (const k of Object.keys(mod || {})) if (typeof mod[k] === "function") return mod[k];
  throw new Error("Cannot find adapter ctor in @prisma/adapter-libsql: " + JSON.stringify(Object.keys(mod || {})));
}

async function main() {
  const dbUrl = mustGetDatabaseUrl();

  // libsql 直接用原始 DATABASE_URL（file:./dev.db）
  const libsql = createClient({ url: dbUrl });

  const AdapterCtor = pickAdapterCtor(libsqlAdapterMod);
  const adapter = new AdapterCtor(libsql);

  // 关键：显式传 datasources.db.url，避免 Prisma 认为 url=undefined
  const p = new PrismaClient({
    adapter,
    datasources: { db: { url: dbUrl } },
  });

  try {
    const count = await p.run.count();
    console.log("Run.count =", count);

    const latest = await p.run.findFirst({
      orderBy: { createdAt: "desc" },
      select: { id: true, createdAt: true },
    });
    console.log("Latest Run =", latest);
  } finally {
    await p.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
