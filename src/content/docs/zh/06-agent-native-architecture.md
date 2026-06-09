---
stage: architecture
title: "Agent-Native Architecture"
key_concepts: [shared action model, agent UI parity, governed execution, AGENTS.md, workspace customization, protocol-ready]
practical_steps: 7
anti_patterns: 0
prev: "05-errors-and-recovery"
next: "06b-end-user-experience"
lang: zh
zh_title: "智能体原生架构"
---

# 智能体原生架构

前几章专注于让现有服务更好地服务于智能体（Agent）——添加 `llms.txt`、修复认证、改进错误响应。本章关注的是不同的事情：**从第一天起就将智能体视为一等用户来构建服务。**

当今大多数“AI 功能”都是附加式的：角落里一个聊天面板，可以总结文档或起草回复，但无法做人类在产品中能做的所有事情。智能体原生是一种架构原则：构建应用程序，使智能体和人类通过共享的动作、数据、权限和上下文来操作同一个产品。

## 支持 AI vs. AI 原生 vs. 智能体原生

| 阶段 | 定义 | 测试方式 |
|-------|-----------|------|
| 支持 AI | 在现有产品中添加 AI 功能 | 移除 AI，产品还能用吗？如果能，就是支持 AI。 |
| AI 原生 | AI 是产品价值的核心 | 移除 AI，产品会崩溃吗？如果能，就是 AI 原生。 |
| 智能体原生 | AI 是核心，且智能体拥有与 UI 完全对等的产品能力 | UI 和智能体都能操作相同的工作流吗？如果能，就是智能体原生。 |

你的 CRM 中一个可以草拟邮件的聊天机器人是支持 AI。一个只能通过自然语言操作的研究工具是 AI 原生。一个邮件客户端，你既可以手动整理邮件，智能体也可以通过相同的底层动作来归档、起草、标记和路由——这就是智能体原生。

## 智能体原生架构的五大原则

### 1. 智能体 UI 对等

**UI 能做的任何事，智能体都能做。** 智能体能做的任何事，都应该通过产品界面可见、可检查或可控制。

如果你可以归档一封邮件、创建一个仪表盘、安排一个会议或渲染一个视频，那么智能体也应该能通过相同的底层能力执行相同的动作。智能体不应该去屏幕抓取 UI 或使用脆弱的旁路通道。

这并不意味着智能体使用视觉界面。这意味着视觉界面和智能体界面都调用相同的底层动作模型。

```
┌──────────────────────────────────────┐
│              Product                  │
│                                       │
│  ┌──────────┐    ┌────────────────┐  │
│  │  Human   │    │     Agent      │  │
│  │  UI      │    │  (MCP/API)     │  │
│  └────┬─────┘    └───────┬────────┘  │
│       │                  │           │
│       └──────┬───────────┘           │
│              │                       │
│     ┌────────▼────────┐             │
│     │  Shared Actions  │             │
│     │  (single model)  │             │
│     └────────┬────────┘             │
│              │                       │
│     ┌────────▼────────┐             │
│     │   Database       │             │
│     └─────────────────┘             │
└──────────────────────────────────────┘
```

### 2. 一个共享动作模型

将每个产品能力定义一次。从单一定义生成：
- UI 组件
- API 端点
- MCP 工具
- A2A 能力
- CLI 命令
- 文档

```typescript
import { defineAction } from "@your-app/core";
import { z } from "zod";

export const archiveEmail = defineAction({
  name: "archive_email",
  description: "Archive an email thread and remove from inbox",
  input: z.object({
    emailId: z.string(),
    reason: z.enum(["done", "spam", "later"]).optional(),
  }),
  output: z.object({
    archived: z.boolean(),
    threadId: z.string(),
  }),
  scope: "emails:write",
  destructive: false,
  idempotent: true,
  sideEffects: ["removes_from_inbox", "updates_unread_count"],
  async run({ emailId, reason }) {
    return await db.emails.archive(emailId, { reason });
  },
});
```

一个动作。多个界面。零漂移。

### 3. 共享状态、数据和上下文

智能体必须知道人类正在看什么。如果你正在查看一个客户记录，智能体应该在该记录上操作。如果你选中一个段落并要求重写，智能体应该知道是哪个段落。

这意味着：
- **UI 在用户浏览应用时写入导航状态**
- **一个 `view-context` 动作**为智能体提供当前视图的快照
- **一个 `navigate` 动作**让智能体可以移动 UI
- **双方读写同一个数据库**

不存在独立于“用户会话状态”的“智能体上下文窗口”。数据库就是协调层。

### 4. 从设计上就为协议做好准备

协议支持不是一次性集成项目，而是架构的属性。如果动作是产品行为的共享单元，那么将它们暴露给 MCP、A2A、CLI 或 API 就变成了路由问题，而不是重新实现的问题。

```
Shared Action Model ──► Route to MCP
                    ──► Route to REST API
                    ──► Route to A2A
                    ──► Route to CLI
                    ──► Route to UI component
```

当你定义一个新动作时，它会自动在所有界面上可用。无需构建会逐渐产生差异的独立 MCP 工具、API 端点、UI 按钮和 CLI 命令。

### 5. 受管控的执行

智能体在产品相同的权限模型内运行：

- 如果你不能访问某条记录，智能体也不能代表你访问它
- 如果发送邮件需要确认，智能体就遵守该边界
- 每个动作都有日志记录、可审计，并且（在适当情况下）可撤销

```typescript
export const deleteContact = defineAction({
  name: "delete_contact",
  scope: "contacts:delete",
  destructive: true,
  requiresConfirmation: true,    // Agent must ask human before executing
  auditLog: true,                 // Log every invocation
  reversible: true,               // Can be undone within 24h
  maxRetries: 0,                  // Don't auto-retry destructive actions
});
```

管控是使智能体原生值得信赖的原因。没有管控，你有一个强大但危险的助手。有了管控，你就有了一个强大且安全的协作伙伴。

## AGENTS.md：引导文件

正如 `llms.txt` 帮助智能体发现你的服务，`AGENTS.md`（或 `.cursorrules`、`.claude/`、`CLAUDE.md`）帮助智能体了解如何处理你的代码库或项目。

项目根目录中的 `AGENTS.md` 文件告诉来访的智能体：

```markdown
# Project: AcmeCRM

## Architecture
- Next.js frontend, Express API backend, PostgreSQL database
- Actions defined in `src/actions/` (single action model)
- MCP server in `src/mcp/`
- All endpoints documented in `openapi.yaml`

## Conventions
- Use `verb_noun` naming for all actions
- All responses follow `{ data, meta, errors }` envelope
- Destructive actions require `requiresConfirmation: true`
- All database queries use parameterized statements

## Agent Guidelines
- Always read the relevant action file before modifying an action
- Test all changes against `src/actions/__tests__/`
- Never modify database migrations directly; create new ones
- Run `npm run check` before committing
```

## 工作区定制

智能体原生应用应该附带一个工作区：

```
my-app/
├── AGENTS.md           # Shared instructions
├── LEARNINGS.md        # Durable team memory
├── skills/             # Custom agent skills
│   ├── triage-email.md
│   └── weekly-report.md
├── .mcp.json           # Connected MCP servers
└── src/
    └── actions/        # Shared action model
```

这就是让智能体变得个性化、让产品变得可编程的方式。智能体学习你的约定，记住团队的决策，并能访问自定义工作流——所有这些都和产品的其余部分一样，存储在同一个基于数据库的状态中。

## 实操步骤

1. **审计你当前的架构** — UI 有哪些能力是 API 不具备的？（1-2 天）
2. **定义共享动作模型** — 从你最重要的 10 个动作开始，将它们重构为单一定义（1 周）
3. **在你的项目中添加 `AGENTS.md`**（1 小时）
4. **从你的动作模型构建 MCP 支持**（已定义的前提下，2-3 天）
5. **为所有动作添加权限范围**（读/写/破坏性）（3-5 天）
6. **为所有智能体执行的动作添加审计日志**（1-2 周）
7. **在 UI 和智能体上下文之间构建状态同步**（1-2 周）

## 衡量智能体原生成熟度

- [ ] 智能体能否执行 UI 能执行的每个动作？
- [ ] 是否存在单一的动作定义，能同时生成 UI 和 API？
- [ ] UI 动作和智能体动作是否读写同一个数据库？
- [ ] 智能体能否看到用户当前在查看什么？
- [ ] 破坏性动作是否被标记并需要确认？
- [ ] 每个动作是否记录了是谁（人类还是智能体）执行的？
- [ ] 动作是否可以撤销或回退？
- [ ] 你的项目是否有 `AGENTS.md` 文件？

## 下一步

智能体原生架构是理想状态。但一路上有许多陷阱。让我们梳理一下最常见的那些。

→ **[终端用户体验](06b-end-user-experience)**
