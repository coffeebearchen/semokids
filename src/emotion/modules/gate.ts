// PRD 对应：Gate（止损优先）
// 约束：纯函数、确定性 if/switch、不补全规则

export type GateResult = "PASS" | "STOP";

export function gateCheck(signals: Record<string, any>): GateResult {
  // TODO：实际 STOP 规则由 Gate 模板决定；此处不补全
  if (!signals) return "STOP";
  return "PASS";
}
