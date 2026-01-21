"use strict";
// PRD 对应：对外入口 /emotion/judge（单次请求、单次响应）
// 主树定位：Document(HTTP JSON) → Generator(emotionJudge) → Run(writeRun) → Response
// 约束：不做多轮交互；不做解释；只返回结构化结果
Object.defineProperty(exports, "__esModule", { value: true });
exports.emotionRouter = void 0;
const express_1 = require("express");
const emotion_1 = require("../emotion");
exports.emotionRouter = (0, express_1.Router)();
exports.emotionRouter.post("/judge", async (req, res) => {
    try {
        // PRD：输入为结构化对象；此处不补全字段，只透传
        const input = (req.body ?? {});
        const out = await (0, emotion_1.emotionJudge)(input);
        // PRD：确定性输出（不加解释性文本）
        res.json(out);
    }
    catch (e) {
        res.status(500).json({
            error: "INTERNAL_ERROR",
            message: e?.message ?? String(e),
        });
    }
});
