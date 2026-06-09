# 智能体体验指南

> 如何让你的服务、应用或工具对 AI 智能体更友好。

Web 是为人而建的——每个按钮、每个表单、每个导航菜单都默认用户是有眼睛和双手的人。但增长最快的用户群体不是人类，而是 AI 智能体。**每个网站已经存在一种智能体体验，问题只在于它是好是坏。**

正如 UX 教我们为用户设计、DX 教我们为开发者设计，**AX（智能体体验）** 是为智能体设计的学科。本指南是一本实用的开源手册，教你如何做好这件事。

## 为什么需要本指南

- **ora.ai** 告诉你*你在哪里* — 它对数千个网站评分并排名智能体就绪度。
- **axd.md** 告诉你*目标是什么* — 它定义了智能体体验设计的 12 条原则和 15 个原语。
- **agentexperience.ax** 策划*对话和文章*关于 AX 运动。

**本指南**告诉你*怎么到达* — 具体的、可操作的步骤，附带代码示例、模式和反模式。

## 智能体旅程

一个智能体试图使用你的产品时会经历六个阶段。你的工作是优化每一个：

```
可发现性 → 身份标识 → 认证与访问 → 集成 → 错误与恢复 → 终端用户体验
```

## 目录

### 基础

1. [什么是智能体体验？](https://ax.wilsonhandbook.online/zh/docs/00-what-is-ax) — 为什么 AX 重要，UX → DX → AX 演进

### 六个阶段

2. [可发现性](https://ax.wilsonhandbook.online/zh/docs/01-discovery) — 智能体能找到你吗？llms.txt、robots.txt、站点地图
3. [身份标识](https://ax.wilsonhandbook.online/zh/docs/02-identity) — 智能体能理解你的产品吗？机器可读描述、元数据
4. [认证与访问](https://ax.wilsonhandbook.online/zh/docs/03-auth-and-access) — 智能体能认证并执行操作吗？OAuth、auth.md、作用域令牌
5. [集成](https://ax.wilsonhandbook.online/zh/docs/04-integration) — 管道就绪了吗？MCP、A2A、流式、SDK
6. [错误与恢复](https://ax.wilsonhandbook.online/zh/docs/05-errors-and-recovery) — 智能体能自愈吗？类型化错误、重试指引

### 架构与实践

7. [智能体原生架构](https://ax.wilsonhandbook.online/zh/docs/06-agent-native-architecture) — 共享动作模型、智能体 UI 对等
8. [终端用户体验](https://ax.wilsonhandbook.online/zh/docs/06b-end-user-experience) — 交接流程、MCP Apps
9. [反模式](https://ax.wilsonhandbook.online/zh/docs/07-anti-patterns) — 25 个破坏智能体体验的常见错误
10. [就绪度检查清单](https://ax.wilsonhandbook.online/zh/docs/08-checklist) — 实践评估

### 参考

- [参考资料](https://ax.wilsonhandbook.online/zh/docs/references) — 精选链接和标准

## 快速开始：今天就能做的 3 件事

1. **添加 `/llms.txt`** 到网站根目录，描述你的网站做什么
2. **返回类型化错误**，从每个 API 端点返回带重试指引的错误
3. **让智能体认证**使用作用域 API 令牌，而非仅限浏览器的 OAuth 流程

## AX 成熟度模型

```
Level 0 — 无法感知    智能体无法找到或解析你的网站
Level 1 — 可发现     智能体能找到你并理解你做什么
Level 2 — 可访问     智能体能认证并进行基本 API 调用
Level 3 — 已集成     智能体能使用你的工具、流式响应、从错误中恢复
Level 4 — 就绪       智能体能完成完整工作流并交接给人类
Level 5 — 原生       智能体和人类共享相同的动作模型、状态和权限
```

## 术语说明

本指南采用以下术语约定：
- **Agent** 译为**智能体**（不译为"代理"，"代理"用于 proxy 场景）
- 首次出现时采用"中文（英文）"格式，如"模型上下文协议（MCP）"
- 专有名词和文件名（llms.txt, auth.md, MCP, A2A）保留英文

## 在线阅读

访问 **[ax.wilsonhandbook.online](https://ax.wilsonhandbook.online)** 阅读完整指南。

使用右上角的切换按钮在 **人类模式** 和 **智能体模式** 之间切换。

## 贡献

欢迎提交 PR、Issue 和讨论：[GitHub Issues](https://github.com/wilsonwangdev/agent-experience-guide/issues)

## 许可证

MIT