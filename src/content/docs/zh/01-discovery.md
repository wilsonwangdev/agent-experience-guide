---
stage: 1
title: "Discovery: Can Agents Find You?"
key_concepts: [llms.txt, robots.txt, sitemap, JSON-LD, AEO, A2A Agent Card, well-known paths]
practical_steps: 6
anti_patterns: 0
prev: "00-what-is-ax"
next: "02-identity"
lang: zh
zh_title: "可发现性：智能体能否找到你？"
---

# 可发现性：智能体能否找到你？

智能体体验（AX）的第一个问题是最简单的：当智能体搜索像你这样的产品或服务时，它找得到你吗？

如果智能体找不到你的网站，其他一切都无从谈起。再好的 API、MCP 服务器、OAuth 流程都无济于事。智能体只会选择一个它能找到的竞品。

可发现性（Discovery）是智能体旅程的基石——也是整个互联网目前表现尚可的环节。ChatGPT-User 能访问 81% 的网站，ClaudeBot 能访问 82%，Google-Extended 能访问 87%。差距在*接下来会发生什么*。

## 问题所在

传统的 SEO 为在 Google 上搜索的人类优化。智能体可发现性——有时被称为 **AEO（Answer Engine Optimization，答案引擎优化）** 或 **GEO（Generative Engine Optimization，生成式引擎优化）**——为搜索能力的智能体优化。这两者不是一回事。

当人类搜索"最适合小型企业的 CRM"时，他们会看到一列蓝色链接并阅读评论。当智能体搜索同样的内容时，它需要的是结构化、机器可读的信息，包括*你的产品做什么、它暴露了哪些操作以及如何使用它们*。

## 智能体找到你需要什么

### 1. `/llms.txt`——你的智能体主页

你当下能做的、影响最大的事情就是在你的网站根目录添加一个 `llms.txt` 文件。

`llms.txt` 是一个 Markdown 文件，为智能体提供关于你产品的简洁、结构化的摘要。它相当于面向 AI 的 `robots.txt`——但提供的不是爬取规则，而是用于理解的信息。

```
# YourProduct

> 一句话描述你是做什么的

## 我们提供什么

- 核心能力 1：描述
- 核心能力 2：描述

## API

- Base URL：https://api.yourproduct.com/v1
- 认证方式：Bearer token
- OpenAPI 规范：https://yourproduct.com/docs/openapi.json

## 智能体能力

- 搜索：按关键词查找项目
- 创建：使用结构化数据创建新记录
- 更新：修改现有记录
- 删除：移除记录（需要确认作用域）

## 文档

- API 文档：https://yourproduct.com/docs
- 快速入门：https://yourproduct.com/docs/quickstart
```

**如何添加：** 在 `https://yourdomain.com/llms.txt` 创建一个纯 Markdown 文件。保持简洁（500 行以内）。聚焦于智能体需要的内容：能力、端点、认证以及指向结构化文档的链接。

**它的作用：** 当智能体（或驱动智能体的模型）遇到你的域名时，它会首先获取 `/llms.txt`。这让智能体获得你服务的简洁、准确的摘要，而不是被迫从 HTML、JavaScript 和营销文案中猜测。

### 2. `/robots.txt`——爬取权限

你的 `robots.txt` 应该明确允许主要的智能体爬虫。许多网站默认屏蔽未知的爬虫，这意味着较新的智能体会被拒之门外。

```
User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /internal/
```

ora.ai 研究的关键发现：**网站会放行它们认识的爬虫名称，但屏蔽它们不认识的。** OpenClaw 是一个较新的智能体，只能访问 59% 的网站——比成熟爬虫低 20 到 30 个百分点。如果你想要智能体就绪，请明确放行智能体爬虫。

### 3. 站点地图——机器可读的导航

站点地图告诉智能体存在哪些页面。这很简单、成熟，但仍然不普遍（只有 69% 的网站有）。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourproduct.com/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourproduct.com/docs</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

### 4. 结构化数据（JSON-LD）

Schema.org 结构化数据能帮助搜索引擎和智能体理解你的网站是什么、提供什么以及如何与之交互。

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "YourProduct",
  "applicationCategory": "CRM",
  "description": "适合小型团队的轻量级 CRM",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "提供免费套餐"
  },
  "featureList": ["联系人管理", "管道跟踪", "邮件集成"]
}
```

### 5. Well-Known URI

若干新兴标准使用智能体可发现的 well-known 路径：

| 路径 | 用途 | 状态 |
|------|---------|--------|
| `/.well-known/ai-plugin.json` | OpenAI 插件清单 | 已部署 |
| `/.well-known/openapi.json` | OpenAPI 规范 | 标准 |
| `/.well-known/mcp` | MCP 服务器发现 | 新兴 |
| `/agents.json` | 智能体能力注册表 | 提案中 |
| `/llms.txt` | AI 友好的网站描述 | 已采纳 |

### 6. A2A 智能体卡片

Google 的智能体对智能体协议（A2A）使用 Agent Card——这是一种 JSON 文档，描述智能体能做什么、其认证要求以及如何访问它。

```json
{
  "name": "CRM Agent",
  "description": "管理客户关系、交易和管道",
  "url": "https://crm.example.com/a2a",
  "capabilities": [
    { "name": "search_contacts", "description": "按姓名或邮件搜索联系人" },
    { "name": "create_deal", "description": "在管道中创建新交易" }
  ],
  "authentication": {
    "schemes": ["oauth2"],
    "credentials": "https://crm.example.com/.well-known/oauth-authorization-server"
  }
}
```

## 实操步骤

以下是按优先级排列的待办事项：

1. **添加 `/llms.txt`**（30 分钟，影响巨大）
2. **更新 `/robots.txt`** 以放行智能体爬虫（15 分钟）
3. **添加站点地图**（如果你还没有）（1-2 小时）
4. **在首页添加 JSON-LD 结构化数据**（1-2 小时）
5. **在 well-known URL 发布 OpenAPI 规范**（取决于 API 规模）
6. **考虑制作 Agent Card**（如果你正在构建智能体对智能体的交互）（半天）

## 常见错误

- **在 robots.txt 中屏蔽所有爬虫**——这是智能体找不到你的头号原因
- **纯 JavaScript 导航**——获取 HTML 的智能体无法跟随 JS 渲染的菜单
- **营销文案代替能力描述**——智能体需要知道你的产品*做什么*，而不是你的团队有多创新
- **缺少站点地图**——没有它，智能体只能猜测存在哪些页面
- **PDF 文档**——无法搜索、无法链接、智能体无法解析

## 测量可发现性

你可以通过以下问题评估你的可发现性层面：

- [ ] 我的网站是否有有效的 `/llms.txt`？
- [ ] 我的 `robots.txt` 是否放行主要智能体爬虫？
- [ ] 我的网站是否有有效的站点地图？
- [ ] 我的首页是否包含 JSON-LD 结构化数据？
- [ ] 智能体能否在 well-known 路径找到我的 OpenAPI 规范？
- [ ] 如果我问大语言模型"[我的产品]是做什么的？"，它的回答是否准确？

## 下篇预告

可发现性能让智能体到达你的门口。下一步是确保它们到达后能理解所看到的内容。

→ **[身份标识：智能体理解你吗？](02-identity)**
