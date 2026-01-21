"use strict";
// PRD 对应：State → Template 确定性选择
// 约束：不随机、不权重、不策略
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectTemplate = selectTemplate;
const templateLoader_1 = require("./templateLoader");
function selectTemplate(state) {
    const bundle = (0, templateLoader_1.loadTemplateBundle)();
    const list = bundle.states[state];
    if (!list || list.length === 0)
        return "TPL_NOT_FOUND";
    // PRD：确定性选择（默认第一个）
    return list[0];
}
