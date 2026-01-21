import { PrismaClient } from "@prisma/client";

export type RunRecord = { id: string; createdAt: Date };

export type RunPayload = {
  from: string;
  gate: string;
  state: string;
  templateId: string;
  runId: string;
  createdAt: string;
  input?: any;
  output?: any;
};

// 兼容模式：
// A) writeRun(prisma, payload)  —— 新主线（推荐）
// B) writeRun({ gate, state, templateId, ... }) —— 旧代码兼容（内部自动创建 PrismaClient）
export async function writeRun(prisma: PrismaClient, payload: RunPayload): Promise<RunRecord>;
export async function writeRun(payload: Partial<RunPayload> & { gate: string }): Promise<RunRecord>;
export async function writeRun(
  a: PrismaClient | (Partial<RunPayload> & { gate: string }),
  b?: RunPayload
): Promise<RunRecord> {
  const isPrisma =
    typeof (a as any)?.$disconnect === "function" &&
    typeof (a as any)?.$connect === "function";

  // ---------- 新用法：writeRun(prisma, payload) ----------
  if (isPrisma) {
    const prisma = a as PrismaClient;
    const payload = b as RunPayload;

    const created = await prisma.run.create({
      data: {
        inputJson: JSON.stringify({
          from: payload.from,
          gate: payload.gate,
          state: payload.state,
          templateId: payload.templateId,
          runId: payload.runId,
          createdAt: payload.createdAt,
          input: payload.input ?? null,
        }),
        outputJson: JSON.stringify({
          ok: true,
          gate: payload.gate,
          state: payload.state,
          output: payload.output ?? null,
        }),
      },
      select: { id: true, createdAt: true },
    });

    return created;
  }

  // ---------- 旧用法：writeRun({gate,...})：内部自建 PrismaClient ----------
  const partial = a as Partial<RunPayload> & { gate: string };

  const prisma = new PrismaClient();
  try {
    const nowIso = new Date().toISOString();
    const payload: RunPayload = {
      from: partial.from ?? "judge",
      gate: partial.gate,
      state: partial.state ?? "NA",
      templateId: partial.templateId ?? "NA",
      runId: partial.runId ?? `run_${Date.now()}`,
      createdAt: partial.createdAt ?? nowIso,
      input: partial.input ?? null,
      output: partial.output ?? null,
    };

    const created = await prisma.run.create({
      data: {
        inputJson: JSON.stringify({
          from: payload.from,
          gate: payload.gate,
          state: payload.state,
          templateId: payload.templateId,
          runId: payload.runId,
          createdAt: payload.createdAt,
          input: payload.input ?? null,
        }),
        outputJson: JSON.stringify({
          ok: true,
          gate: payload.gate,
          state: payload.state,
          output: payload.output ?? null,
        }),
      },
      select: { id: true, createdAt: true },
    });

    return created;
  } finally {
    await prisma.$disconnect();
  }
}