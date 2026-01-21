// PRD 对应：State → Template 确定性选择
// 约束：不随机、不权重、不策略

import { loadTemplateBundle } from "./templateLoader";

export function selectTemplate(state: string): string {
  const bundle = loadTemplateBundle();
  const list = bundle.states[state];

  if (!list || list.length === 0) return "TPL_NOT_FOUND";

  // PRD：确定性选择（默认第一个）
  return list[0];
}
