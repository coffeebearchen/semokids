// PRD 对应：状态矩阵 S11 / S12 / S13 / S21 / S22 / S23
// 约束：纯函数、确定性 if/switch、不推理

export type EmotionState =
  | "S11"
  | "S12"
  | "S13"
  | "S21"
  | "S22"
  | "S23";

export function resolveState(signals: Record<string, any>): EmotionState {
  // TODO：状态矩阵规则待按冻结 PRD 映射；此处不补全
  switch (signals?.level) {
    case 1:
      return "S11";
    case 2:
      return "S21";
    default:
      return "S12";
  }
}
