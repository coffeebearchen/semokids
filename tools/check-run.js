require("dotenv/config");
const { PrismaClient } = require("@prisma/client");

function mustGetDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.trim()) {
    throw new Error("DATABASE_URL is missing. Check .env and dotenv loading.");
  }
  return url;
}

async function main() {
  const p = new PrismaClient({
    datasourceUrl: mustGetDatabaseUrl(),
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
