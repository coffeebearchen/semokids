require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const libsqlAdapterMod = require("@prisma/adapter-libsql");
const { createClient } = require("@libsql/client");

function pickAdapterCtor(mod) {
  // 兼容各种导出形态
  if (typeof mod === "function") return mod;
  if (mod && typeof mod.default === "function") return mod.default;
  if (mod && typeof mod.PrismaLibSQL === "function") return mod.PrismaLibSQL;
  if (mod && typeof mod.PrismaLibsql === "function") return mod.PrismaLibsql;
  if (mod && typeof mod.PrismaLibSQLAdapter === "function") return mod.PrismaLibSQLAdapter;

  // 兜底：找第一个 function
  if (mod && typeof mod === "object") {
    for (const k of Object.keys(mod)) {
      if (typeof mod[k] === "function") return mod[k];
    }
  }
  throw new Error("Cannot find libsql adapter constructor in @prisma/adapter-libsql exports: " + JSON.stringify(Object.keys(mod || {})));
}

function mustGetDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.trim()) throw new Error("DATABASE_URL missing");
  return url;
}

async function main() {
  const url = mustGetDatabaseUrl();
  const libsql = createClient({ url });

  const AdapterCtor = pickAdapterCtor(libsqlAdapterMod);
  const adapter = new AdapterCtor(libsql);

  const p = new PrismaClient({ adapter });

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
