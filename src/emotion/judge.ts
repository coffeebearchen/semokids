// PRD 对应：/emotion/judge（家庭情绪决策执行器的“判定入口”）
// 主树定位：Generator 节点的出口（Gate → Matrix → Template → Run）
// 约束：确定性 if/switch；不推理；不补全规则；不引入新概念

import { gateCheck, GateResult } from "./modules/gate";
import { resolveState, EmotionState } from "./modules/matrix";
import { selectTemplate } from "./modules/template";
import { writeRun, RunRecord } from "./modules/run";

// PRD：输入为“信号/特征”的结构化对象；此处保持宽松类型，不擅自补全字段
export type JudgeInput = Record<string, any>;

// PRD：输出必须可用于后续 Run/Dashboard；此处返回 runRecord + 关键决策字段
export type JudgeOutput = {
  gate: GateResult;
  state?: EmotionState;
  templateId?: string;
  run: RunRecord;
};

export async function emotionJudge(input: JudgeInput): Promise<JudgeOutput> {
  // 1) PRD：Gate（止损优先）
  const gate = gateCheck(input);

  // Gate STOP：不进入 Matrix/Template，但仍写一条 Run（占位），便于可回溯
  if (gate === "STOP") {
    const run = await writeRun({ gate });
    return { gate, run };
  }

  // 2) PRD：状态矩阵（S11~S23）
  const state = resolveState(input);

  // 3) PRD：模板选择（确定性）
  const templateId = selectTemplate(state);

  // 4) PRD：Run 写入（占位）
  const run = await writeRun({ gate, state, templateId });

  return { gate, state, templateId, run };
}
