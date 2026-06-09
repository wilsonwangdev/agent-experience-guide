---
stage: reference
title: "References"
key_concepts: [standards, specifications, articles, protocols, community]
lang: zh
zh_title: "参考资料"
---

# 参考资料

面向智能体体验设计的精选链接、标准和延伸阅读资料。

## 标准与规范

| 资源 | URL | 描述 |
|----------|-----|-------------|
| AX Design Standard | [axd.md](https://axd.md/) | 12 条原则、15 个原语、反模式、评分体系 |
| MCP Specification | [modelcontextprotocol.io](https://modelcontextprotocol.io/) | 模型上下文协议，用于连接智能体与工具 |
| A2A Protocol | [github.com/google/A2A](https://github.com/google/A2A) | 智能体到智能体通信协议 |
| auth.md | [workos.com/auth-md](https://workos.com/auth-md) | 智能体认证协议 |
| llms.txt | [llmstxt.org](https://llmstxt.org/) | AI 友好的网站描述标准 |
| agents.json | [agents.json](https://agents.json/) | 智能体能力注册表格式 |
| AgentReady Standard | [agentready.org](https://agentready.org/) | 智能体就绪度开放标准 |
| OpenAPI 3.1 | [spec.openapis.org](https://spec.openapis.org/oas/v3.1.0) | API 描述规范 |
| RFC 8414 | [tools.ietf.org](https://datatracker.ietf.org/doc/html/rfc8414) | OAuth 授权服务器元数据 |
| RFC 9427 | [tools.ietf.org](https://datatracker.ietf.org/doc/html/rfc9427) | API 版本化的结构化后缀 |
| RFC 9421 | [tools.ietf.org](https://datatracker.ietf.org/doc/html/rfc9421) | HTTP 消息签名（Web Bot Auth） |
| x402 Payment Protocol | [x402.org](https://x402.org/) | 面向智能体的 HTTP 402 Payment Required 协议 |

## 评估与评分

| 资源 | URL | 描述 |
|----------|-----|-------------|
| ora.ai | [ora.ai](https://ora.ai/) | 智能体就绪度评分与排名（11,000+ 站点） |
| ora.ai Methodology | [ora.ai/methodology](https://ora.ai/methodology) | ora 如何跨 5 个层级和 110 项检查进行评分 |
| AX Scoring Rubric | [github.com/souls-zip/ax](https://github.com/souls-zip/ax/blob/main/content/metrics.md) | 对任意站点按 15 个原语评分（0-30 量表） |

## 关键文章与演讲

### 基础
- Matt Biilmann, "Introducing AX" (2025年1月) — AX 的首次提出：[biilmann.blog/articles/introducing-ax](https://biilmann.blog/articles/introducing-ax/)
- Matt Biilmann, "One Year of AX" (2026年1月) — 第一年的回顾：[biilmann.blog/articles/one-year-of-ax](https://biilmann.blog/articles/one-year-of-ax/)
- Sean Roberts, "AX: The Next Evolution in UX" (2025年3月) — [agentexperience.ax/all/ax-the-next-evolution-in-ux](https://agentexperience.ax/all/ax-the-next-evolution-in-ux)
- Zeno Rocha, "What is AX and How to Improve It" (2025年2月) — [resend.com/blog/agent-experience](https://resend.com/blog/agent-experience)

### 智能体原生架构
- Builder.io, "Agent-Native: The Next Architecture for Software" (2026年5月) — [builder.io/blog/agent-native-architecture](https://www.builder.io/blog/agent-native-architecture)
- Every, "Agent-Native Architectures" — [every.to/guides/agent-native](https://every.to/guides/agent-native)
- Microsoft Design, "UX Design for Agents" — [microsoft.design/articles/ux-design-for-agents](https://microsoft.design/articles/ux-design-for-agents/)

### 认证与身份
- WorkOS, "auth.md: Agent Auth is the Last Mile" (2026年5月) — [workos.com/auth-md](https://workos.com/auth-md)
- ora.ai, "Agent auth is the last mile, and auth.md is the first real path through it" — [ora.ai/blog/deep-scan-v1-2](https://ora.ai/blog/deep-scan-v1-2)
- Descope, "Securing Your APIs with Progressive Scoping" — [descope.com/blog/post/progressive-scoping](https://www.descope.com/blog/post/progressive-scoping)

### 行业报告
- ora.ai, "The State of Agent Readiness" (2026年4月) — [ora.ai/blog/state-of-agent-readiness-2026](https://ora.ai/blog/state-of-agent-readiness-2026)
- Stytch, "The Age of Agent Experience" (2025年2月) — [stytch.com/blog/the-age-of-agent-experience](https://stytch.com/blog/the-age-of-agent-experience/)

## 社区与讨论

| 资源 | URL |
|----------|-----|
| AX Community Discussions | [github.com/orgs/agentexperience/discussions](https://github.com/orgs/agentexperience/discussions) |
| AX Standard (Open Source) | [github.com/souls-zip/ax](https://github.com/souls-zip/ax) |
| MCP Community | [modelcontextprotocol.io/community](https://modelcontextprotocol.io/community) |

## 智能体协议对比

| 协议 | 解决的问题 | 方向 | 状态 |
|----------|---------------|-----------|--------|
| MCP | 智能体 ↔ 工具 | 智能体调用服务上的工具 | 已被 Anthropic、OpenAI 等采用 |
| A2A | 智能体 ↔ 智能体 | 智能体将任务委派给其他智能体 | 由 Google 提出 |
| x402 | 智能体 ↔ 支付 | 智能体为 API 访问付费 | 已被 Coinbase、AWS Bedrock 采用 |
| auth.md | 智能体 ↔ 认证 | 智能体代表用户进行认证 | 由 WorkOS 提出 |
| agents.json | 智能体 ↔ 发现 | 智能体发现服务能力 | 已提出 |
| llms.txt | 智能体 ↔ 上下文 | 智能体理解服务的功能 | 被广泛采用 |
| Arazzo | 智能体 ↔ 工作流 | 智能体执行多步 API 工作流 | OpenAPI Initiative 标准 |

## 书籍与长文

- OpenAI, "A Practical Guide to Building Agents" — [openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)
- Anthropic, "Building Effective AI Agents: Architecture Patterns and Implementation Frameworks" — [resources.anthropic.com](https://resources.anthropic.com/hubfs/Building%20Effective%20AI%20Agents-%20Architecture%20Patterns%20and%20Implementation%20Frameworks.pdf)
- Mockplus, "The Ultimate Guide to Agent Experience Design in 2025" — [mockplus.com/blog/post/ultimate-guide-to-agent-experience-design](https://www.mockplus.com/blog/post/ultimate-guide-to-agent-experience-design)

---

→ **[返回检查清单](08-checklist)** | **[返回引言](00-what-is-ax)**
