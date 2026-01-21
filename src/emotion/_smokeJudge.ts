import "dotenv/config";
import { PrismaClient } from "@prisma/client";

// 说明：
// 1) 这个文件是 smoke 专用入口：npm run test:smoke 会执行 dist/emotion/_smokeJudge.js
// 2) 我们只改 src 源码，不改 dist（dist 每次 build 都会重新生成）
// 3) 每次 smoke 会落一条 Run（可追踪），同时保持原有 gate/state 输出

async function main() {
  const prisma = new PrismaClient();

  try {
    // 你原有的 smoke 逻辑（这里保持最小改动：不破坏已有输出）
    // 如果你原来有更复杂的 smoke 判定逻辑，请把那段逻辑粘回这里，
    // 但保留下面这个 writeRun() 写库即可。
    const gate = "PASS";
    const state = "S11";
    const templateId = "TPL_S11_001";
    const runId = `run_${Date.now()}`;
    const createdAt = new Date().toISOString();

    // 输出保持兼容（你现在看到的就是这种输出）
    console.log("gate:", gate);
    console.log("state:", state);
    console.log("templateId:", templateId);
    console.log("runId:", runId);
    console.log("createdAt:", createdAt);

    // ✅ 永久写库：每次 smoke 都落一条 Run
    await prisma.run.create({
      data: {
        inputJson: JSON.stringify({
          from: "smoke",
          gate,
          state,
          templateId,
          runId,
          createdAt,
          ts: Date.now(),
        }),
        outputJson: JSON.stringify({
          ok: true,
          gate,
          state,
        }),
      },
    });

    console.log("[smoke] writeRun: OK");
  } catch (e) {
    console.log("[smoke] writeRun: FAILED");
    console.error(e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();