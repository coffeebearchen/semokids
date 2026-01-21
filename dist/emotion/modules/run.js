"use strict";
// PRD 对应：Run 写入（Run 表复用概念）
// 约束：不接 Prisma 也可以；接口必须 async；不补全字段规则
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeRun = writeRun;
async function writeRun(record) {
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
