"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var gate_1 = require("./modules/gate");
var matrix_1 = require("./modules/matrix");
var template_1 = require("./modules/template");
function main() {
    var signals = { level: 1 };
    var gate = (0, gate_1.gateCheck)(signals);
    console.log("gate:", gate);
    if (gate === "STOP")
        return;
    var state = (0, matrix_1.resolveState)(signals);
    console.log("state:", state);
    var templateId = (0, template_1.selectTemplate)(state);
    console.log("templateId:", templateId);
}
main();
