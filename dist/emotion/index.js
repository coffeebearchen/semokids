"use strict";
// PRD 对应：emotion 模块入口导出（供后端路由调用）
// 约束：不引入新概念，仅做导出聚合
Object.defineProperty(exports, "__esModule", { value: true });
exports.emotionJudge = void 0;
var judge_1 = require("./judge");
Object.defineProperty(exports, "emotionJudge", { enumerable: true, get: function () { return judge_1.emotionJudge; } });
