require("dotenv/config");
const { PrismaClient } = require("@prisma/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");
const { createClient } = require("@libsql/client");

function mustGetDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.trim()) throw new Error("DATABASE_URL missing");
  return url;
}

async function main() {
  const url = mustGetDatabaseUrl();
  const libsql = createClient({ url });
  const adapter = new PrismaLibSQL(libsql);
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