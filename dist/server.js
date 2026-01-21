"use strict";
// PRD 对应：后端最小可运行服务（仅用于暴露 /emotion/judge）
// 约束：不做 UI；不做多租户；不引入新概念；只做单次请求/响应
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var emotion_1 = require("./routes/emotion");
var app = express();
// PRD：只接收 JSON 输入（Document）
app.use(express.json({ limit: "256kb" }));
// 主树：把 emotion judge 接到 HTTP
app.use("/emotion", emotion_1.emotionRouter);
var port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, function () {
    console.log("[SEMO-Kids] server listening on http://localhost:".concat(port));
    console.log("[SEMO-Kids] POST http://localhost:".concat(port, "/emotion/judge"));
});
