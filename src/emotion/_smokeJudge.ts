import { emotionJudge } from "./judge";

async function main() {
  const input = { level: 1 };

  const out = await emotionJudge(input);

  console.log("gate:", out.gate);
  console.log("state:", out.state);
  console.log("templateId:", out.templateId);
  console.log("runId:", out.run.runId);
  console.log("createdAt:", out.run.createdAt);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
