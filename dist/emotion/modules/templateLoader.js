"use strict";
// PRD 对应：templates_v1.0.bundle.json 加载与缓存
// 约束：只读、单例缓存、不热更新
// 关键：用项目根目录作为锚点，避免 dist 运行时 __dirname 漂移
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTemplateBundle = loadTemplateBundle;
var fs = require("fs");
var path = require("path");
var cachedBundle = null;
function loadTemplateBundle() {
    if (cachedBundle)
        return cachedBundle;
    // PRD：模板聚合包路径固定为 src/templates 下
    // 使用 process.cwd() 作为项目根目录锚点，避免编译到 dist 后 __dirname 变化导致找不到文件
    var bundlePath = path.resolve(process.cwd(), "src/templates/templates_v1.0.bundle.json");
    var raw = fs.readFileSync(bundlePath, "utf-8");
    cachedBundle = JSON.parse(raw);
    return cachedBundle;
}
