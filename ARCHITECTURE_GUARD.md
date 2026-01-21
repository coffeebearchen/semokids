# SEMO-Kids V1.0｜ARCHITECTURE GUARD（防漂移护栏）

> 目的：保证系统永远保持“家庭情绪决策执行器”定位，不漂移成聊天/咨询/心理分析系统。  
> 用法：任何改动前先看本页；改动后跑 smoke + HTTP 验收。

---

## 1. 冻结定位（不可修改）

- 产品：SEMO-Kids V1.0
- 定位：家庭情绪决策执行器  
  **不是**聊天、不是心理分析、不是 AI 咨询
- 主树（单向）：  
  **Source → Document → Generator → Run → Dashboard**
- 算法结构（确定性）：  
  - Gate（止损优先）
  - 状态矩阵：S11 / S12 / S13 / S21 / S22 / S23
- 模板系统：  
  - Gate 模板
  - 6 个 State TemplatePack
  - templates_v1.0.bundle.json（模板聚合包）

---

## 2. 防漂移红线（出现即视为漂移）

### 禁止：系统“解释/建议/推理”
- 禁止输出“建议、分析、解释、原因、安慰、心理判断”等文本
- 禁止多轮对话（只能单次请求/单次响应）
- 禁止引入 Agent / Chain / LLM 推理
- 禁止“学习、自动优化、根据历史调整策略”

### 禁止：模块职责扩张
- Gate 不得做 Matrix 的事
- Matrix 不得做 Template 的事
- Template 不得做策略/权重/随机
- Run 不得参与决策（只能记录）

---

## 3. 允许改动的范围（不会导致漂移）

### ✅ 允许：改模板内容（推荐）
- `src/templates/templates_v1.0.bundle.json`
  - 增加模板ID、模板正文
  - 调整 state→template 的映射（仍需确定性）

### ✅ 允许：补全 if/switch 映射（严格确定性）
- `src/emotion/modules/gate.ts`：补全 STOP/PASS 的 if/switch 规则
- `src/emotion/modules/matrix.ts`：补全 S11~S23 的 if/switch 映射

### ✅ 允许：Run 从占位写入升级为 Prisma 写入（不改变接口形状）
- `src/emotion/modules/run.ts`：把 writeRun 的内部实现替换为 Prisma
- 注意：不得改变 `writeRun()` 的输入/输出结构，不得让 Run 反向影响决策

---

## 4. 代码约束（必须保持）

- 所有决策逻辑必须是确定性的 `if / switch`
- 不允许随机、权重、评分、模型推理
- 不明确之处：保留空函数/占位，不自行补全
- 输出必须结构化 JSON（不输出解释性废话）

---

## 5. 主树“验收命令”（任何改动后必须跑）

### 5.1 内核 smoke（Generator 链路）
> 证明：Gate → Matrix → Template → Run 可跑通
- 运行（你当前稳定方式）：
  - `npx tsc --module commonjs --verbatimModuleSyntax false --outDir dist src\emotion\_smokeJudge.ts`
  - `node dist\_smokeJudge.js`

### 5.2 HTTP 验收（主树接通）
> 证明：Document(HTTP JSON) → Generator → Run → Response
- 编译：
  - `npx tsc --module commonjs --verbatimModuleSyntax false --outDir dist src\server.ts src\routes\emotion.ts`
- 启动：
  - `node dist\server.js`
- 请求：
  - `Invoke-RestMethod -Method Post -Uri http://localhost:3000/emotion/judge -ContentType "application/json" -Body "{\"level\":1}"`

验收标准：返回 JSON 必须包含：
- gate
- state（当 gate=PASS）
- templateId（当 gate=PASS）
- run.runId / run.createdAt

---

## 6. 一句话锚定（永远不丢）

这个系统像“红绿灯控制箱 + 行车记录仪”：
- Gate = 红灯闸门（先停）
- Matrix = 路口编号（Sxx）
- Template = 固定方案（选第一个）
- Run = 记录（可回溯，不参与决策）

