import { gateCheck } from "./modules/gate";
import { resolveState } from "./modules/matrix";
import { selectTemplate } from "./modules/template";

function main() {
  const signals = { level: 1 };

  const gate = gateCheck(signals);
  console.log("gate:", gate);

  if (gate === "STOP") return;

  const state = resolveState(signals);
  console.log("state:", state);

  const templateId = selectTemplate(state);
  console.log("templateId:", templateId);
}

main();
