"use strict";
// PRD 对应：templates_v1.0.bundle.json 加载与缓存
// 约束：只读、单例缓存、不热更新
// 关键：用项目根目录作为锚点，避免 dist 运行时 __dirname 漂移
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTemplateBundle = loadTemplateBundle;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let cachedBundle = null;
function loadTemplateBundle() {
    if (cachedBundle)
        return cachedBundle;
    // PRD：模板聚合包路径固定为 src/templates 下
    // 使用 process.cwd() 作为项目根目录锚点，避免编译到 dist 后 __dirname 变化导致找不到文件
    const bundlePath = path.resolve(process.cwd(), "src/templates/templates_v1.0.bundle.json");
    const raw = fs.readFileSync(bundlePath, "utf-8");
    cachedBundle = JSON.parse(raw);
    return cachedBundle;
}
