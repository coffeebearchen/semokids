// PRD 对应：emotion 模块入口导出（供后端路由调用）
// 约束：不引入新概念，仅做导出聚合

export { emotionJudge } from "./judge";
export type { JudgeInput, JudgeOutput } from "./judge";
