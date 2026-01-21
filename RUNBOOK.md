# SEMO-Kids V1.0｜RUNBOOK

## 1. 系统定位（冻结事实）
- 类型：家庭情绪决策执行器
- 已完成主树：Document → Generator → Run
- 未做（冻结）：Source / Dashboard

## 2. 三条唯一命令

### 编译
npm run build

### 启动
npm run start

### 内核验收
npm run test:smoke

## 3. HTTP 验收

Invoke-RestMethod -Method Post `
  -Uri http://localhost:3000/emotion/judge `
  -ContentType "application/json" `
  -Body '{"level":1}' | ConvertTo-Json -Depth 10

验收标准：返回包含 gate / state / templateId / run.runId
