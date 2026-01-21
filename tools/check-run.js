require("dotenv/config");
const path = require("path");
const { PrismaClient } = require("@prisma/client");
const libsqlAdapterMod = require("@prisma/adapter-libsql");
const libsqlMod = require("@libsql/client");

function pickAdapterCtor(mod) {
  if (mod && typeof mod.PrismaLibSql === "function") return mod.PrismaLibSql;
  if (mod && typeof mod.PrismaLibSQL === "function") return mod.PrismaLibSQL;
  if (mod && typeof mod.default === "function") return mod.default;
  for (const k of Object.keys(mod || {})) if (typeof mod[k] === "function") return mod[k];
  throw new Error("Cannot find adapter ctor in @prisma/adapter-libsql: " + JSON.stringify(Object.keys(mod || {})));
}

function mustGetDatabaseUrl() {
  const url = process.env.DATABASE_URL;
  if (!url || !url.trim()) throw new Error("DATABASE_URL missing");
  return url.trim();
}

function normalizeToFilePath(databaseUrl) {
  // 支持: file:./dev.db  /  file:dev.db  /  file:D:\...\dev.db
  if (databaseUrl.startsWith("file:")) {
    const rest = databaseUrl.slice("file:".length);
    if (rest.startsWith("./") || rest.startsWith(".\\")) {
      return path.resolve(process.cwd(), rest);
    }
    // file:dev.db -> 当作相对路径
    if (!rest.includes(":") && !rest.startsWith("/") && !rest.startsWith("\\")) {
      return path.resolve(process.cwd(), rest);
    }
    // file:D:\x\y.db
    return rest;
  }
  // 如果用户给的是裸路径
  if (databaseUrl.endsWith(".db") || databaseUrl.includes("\\") || databaseUrl.includes("/")) {
    return path.resolve(process.cwd(), databaseUrl);
  }
  return databaseUrl; // 兜底
}

function createLibsqlClient(databaseUrl) {
  const createClient = libsqlMod.createClient;
  if (typeof createClient !== "function") {
    throw new Error("@libsql/client.createClient not found. keys=" + JSON.stringify(Object.keys(libsqlMod)));
  }

  const filePath = normalizeToFilePath(databaseUrl);

  // 先尝试 url 方式（file: 绝对路径）
  try {
    return createClient({ url: "file:" + filePath });
  } catch (e1) {
    // 再尝试 path 方式
    try {
      return createClient({ path: filePath });
    } catch (e2) {
      throw new Error("Failed to create libsql client. urlTry=" + e1.message + " pathTry=" + e2.message);
    }
  }
}

async function main() {
  const databaseUrl = mustGetDatabaseUrl();
  const libsql = createLibsqlClient(databaseUrl);

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
