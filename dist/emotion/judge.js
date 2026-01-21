"use strict";
// PRD 对应：/emotion/judge（家庭情绪决策执行器的“判定入口”）
// 主树定位：Generator 节点的出口（Gate → Matrix → Template → Run）
// 约束：确定性 if/switch；不推理；不补全规则；不引入新概念
Object.defineProperty(exports, "__esModule", { value: true });
exports.emotionJudge = emotionJudge;
const gate_1 = require("./modules/gate");
const matrix_1 = require("./modules/matrix");
const template_1 = require("./modules/template");
const run_1 = require("./modules/run");
async function emotionJudge(input) {
    // 1) PRD：Gate（止损优先）
    const gate = (0, gate_1.gateCheck)(input);
    // Gate STOP：不进入 Matrix/Template，但仍写一条 Run（占位），便于可回溯
    if (gate === "STOP") {
        const run = await (0, run_1.writeRun)({ gate });
        return { gate, run };
    }
    // 2) PRD：状态矩阵（S11~S23）
    const state = (0, matrix_1.resolveState)(input);
    // 3) PRD：模板选择（确定性）
    const templateId = (0, template_1.selectTemplate)(state);
    // 4) PRD：Run 写入（占位）
    const run = await (0, run_1.writeRun)({ gate, state, templateId });
    return { gate, state, templateId, run };
}
