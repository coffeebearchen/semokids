"use strict";
// PRD 对应：/emotion/judge（家庭情绪决策执行器的“判定入口”）
// 主树定位：Generator 节点的出口（Gate → Matrix → Template → Run）
// 约束：确定性 if/switch；不推理；不补全规则；不引入新概念
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emotionJudge = emotionJudge;
var gate_1 = require("./modules/gate");
var matrix_1 = require("./modules/matrix");
var template_1 = require("./modules/template");
var run_1 = require("./modules/run");
function emotionJudge(input) {
    return __awaiter(this, void 0, void 0, function () {
        var gate, run_2, state, templateId, run;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gate = (0, gate_1.gateCheck)(input);
                    if (!(gate === "STOP")) return [3 /*break*/, 2];
                    return [4 /*yield*/, (0, run_1.writeRun)({ gate: gate })];
                case 1:
                    run_2 = _a.sent();
                    return [2 /*return*/, { gate: gate, run: run_2 }];
                case 2:
                    state = (0, matrix_1.resolveState)(input);
                    templateId = (0, template_1.selectTemplate)(state);
                    return [4 /*yield*/, (0, run_1.writeRun)({ gate: gate, state: state, templateId: templateId })];
                case 3:
                    run = _a.sent();
                    return [2 /*return*/, { gate: gate, state: state, templateId: templateId, run: run }];
            }
        });
    });
}
