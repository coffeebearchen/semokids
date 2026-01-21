// PRD 对应：Run 写入（Run 表复用概念）
// 约束：不接 Prisma 也可以；接口必须 async；不补全字段规则

export type RunRecord = {
  runId: string;           // PRD：运行记录唯一ID（占位）
  createdAt: string;       // PRD：运行时间（ISO 字符串）
  gate: "PASS" | "STOP";   // PRD：Gate 结果
  state?: string;          // PRD：状态矩阵输出（S11~S23）
  templateId?: string;     // PRD：选中的模板ID
};

export async function writeRun(record: Omit<RunRecord, "runId" | "createdAt">): Promise<RunRecord> {
  // TODO：后续接 Prisma Run 表写入；此处不补全
  // PRD：最小可运行占位实现：生成 runId + 时间戳，返回结构供上层链路继续
  const now = new Date().toISOString();
  const runId = `run_${Date.now()}`;

  return {
    runId,
    createdAt: now,
    gate: record.gate,
    state: record.state,
    templateId: record.templateId,
  };
}
