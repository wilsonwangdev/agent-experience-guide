---
stage: 2
title: "Identity: Do Agents Understand What You Do?"
key_concepts: [llms.txt, capability index, metadata consistency, boundaries, agents.json, pricing transparency]
practical_steps: 6
anti_patterns: 0
prev: "01-discovery"
next: "03-auth-and-access"
lang: zh
zh_title: "身份标识：智能体能否理解你的产品？"
---

# 身份标识：智能体能否理解你的产品？

可发现性（Discovery）让智能体（Agent）找到你的网站。身份标识（Identity）则决定它们是否理解找到的内容。

当智能体进入你的域名后，它会构建一个心智模型：这是什么产品、面向谁、能在这里做什么？如果你的网站结构薄弱，智能体就会产生幻觉——用猜测填补空白，为错误的用例推荐你，或对你产品的描述失实。

薄弱的身份标识不仅仅让智能体困惑，还会造成实际的连锁损失：答案引擎中的错误推荐、能力归属错误，以及因错误原因被引导到你这里的流失用户。

## 问题所在

大多数网站是为人类视觉消费而构建的，它们有：
- 带有雄心壮志信息的动画头图区域
- 需要执行代码才能读取的 JavaScript 渲染内容
- 模糊的产品描述（"赋能团队成就更多"）
- 隐藏在"联系销售"按钮背后的定价
- 散落在博客、更新日志和过时 wiki 页面中的能力文档

人类可以拼凑这些信息。智能体只能猜测。

## 智能体理解你需要什么

### 1. 基础接口：最小可行身份标识

你的网站应至少提供以下机器可读的基础接口：

**清晰、结构化的产品描述**——在 `llms.txt` 顶部、你的首页或 JSON-LD 中，直接说明：这是什么产品、属于什么类别、面向谁？

```
# AcmeCRM

> A lightweight CRM for small teams. Manage contacts, track deals, and automate follow-ups.

## Categories
- Customer Relationship Management
- Sales Automation
- Small Business Tools
```

**定价透明度**——智能体需要知道你的产品是免费、免费增值还是付费。模糊的"联系销售"页面会变成死胡同。

```json
{
  "@type": "OfferCatalog",
  "offers": [
    { "name": "Free", "price": "0", "description": "Up to 100 contacts, 1 user" },
    { "name": "Pro", "price": "29", "priceCurrency": "USD", "description": "Unlimited contacts, 5 users, API access" }
  ]
}
```

**可实际访问的 API 文档**——你的 OpenAPI/Swagger 规范应放在可预测的 URL 上。最佳位置是 `/.well-known/openapi.json` 或从 `llms.txt` 中链接。

### 2. 元数据一致性

当不同接口相互矛盾时，智能体的身份标识就会崩溃。

常见的不一致：
- 首页说"CRM"，但文档说"项目管理工具"
- 定价页面显示 $29/月，但元数据说"免费"
- `llms.txt` 链接到 `docs/`，但真正的 API 文档在 `developers/v2/`
- JSON-LD 标注为"SoftwareApplication"，类别是"Finance"，但你实际做的是营销技术

一致性很重要，因为智能体不具备人类解决矛盾的能力。如果三个来源说法不同，智能体会选一个——可能是错的那个。

### 3. 能力索引

不要让智能体爬 47 页 API 文档才能搞清楚它们能做什么。提供一个能力索引（Capability Index）——你的服务暴露了哪些操作的结构化列表。

```markdown
## Capabilities

### Contacts
- List contacts (GET /contacts)
- Search contacts (GET /contacts?q={query})
- Create contact (POST /contacts)
- Update contact (PATCH /contacts/{id})
- Delete contact (DELETE /contacts/{id}) — requires destructive scope

### Deals
- List deals (GET /deals)
- Create deal (POST /deals)
- Update deal stage (PATCH /deals/{id}/stage)
- Close deal (POST /deals/{id}/close) — requires confirmation scope
```

这相当于智能体的站点地图，但面向的是*操作*，而不仅仅是*页面*。

### 4. 明确的作用域和边界

智能体需要知道它们*不能*做什么，这与知道它们能做什么同等重要。明确的边界可以防止：
- 智能体尝试不存在的操作
- 智能体在未意识到的情况下升级到危险操作
- 智能体将部分访问解释为完全访问

明确你的作用域边界：

```markdown
## What this service does NOT do
- No batch deletion of contacts (must delete one at a time)
- No email sending through the API (use the integration partner)
- No real-time sync (changes propagate within 5 minutes)
```

### 5. agents.json / Agent Skills Manifest

新兴的 `agents.json` 标准和智能体技能清单让你可以以结构化的机器可读格式声明你的能力：

```json
{
  "name": "AcmeCRM",
  "description": "Lightweight CRM for small teams",
  "capabilities": [
    {
      "name": "search_contacts",
      "description": "Search contacts by name, email, or company",
      "parameters": {
        "type": "object",
        "properties": {
          "query": { "type": "string", "description": "Search term" },
          "limit": { "type": "integer", "description": "Max results", "default": 20 }
        },
        "required": ["query"]
      }
    }
  ],
  "authentication": {
    "type": "oauth2",
    "authorization_url": "https://acme.crm/auth",
    "scopes": ["read", "write", "admin"]
  }
}
```

## 关键元数据

| 内容 | 格式 | 位置 | 用途 |
|---------|--------|----------|---------|
| 产品摘要 | Markdown | `/llms.txt` | 这是什么？面向谁？ |
| 结构化数据 | JSON-LD | HTML `<head>` | 类别、定价、功能列表 |
| API 定义 | OpenAPI 3.x | `/.well-known/openapi.json` | 端点、参数、响应 |
| 能力索引 | Markdown / JSON | `/llms.txt` 或 `/agents.json` | 智能体在这里能做什么？ |
| 认证说明 | Markdown | `/llms.txt` 或 `/auth.md` | 如何认证 |
| 站点地图 | XML | `/sitemap.xml` | 哪些页面存在 |

## 实操步骤

1. **写一份清晰、事实性的产品描述**——不要空话。用平实语言说明它做什么、面向谁。
2. **确保 `llms.txt` 与你实际的产品匹配**——测试方法：让 LLM 仅读完你的 `llms.txt` 后描述你的产品。
3. **发布定价详情**——即使是近似的档位也能帮助智能体理解适用范围。
4. **创建能力索引**——列出智能体可以执行的每一个操作及其作用域要求。
5. **验证元数据一致性**——你的首页、`llms.txt`、JSON-LD 和 OpenAPI 规范应该保持一致。
6. **明确记录边界**——智能体*不能*做什么与它们能做什么同样重要。

## 衡量身份标识

问问自己：

- [ ] LLM 仅读完我的 `llms.txt` 后能否准确描述我的产品？
- [ ] 我的产品类别在所有元数据接口上是否一致？
- [ ] 我的定价是否机器可读（而不只是"联系销售"）？
- [ ] 我的 OpenAPI 规范是否既能访问又准确？
- [ ] 我的能力索引是否清晰区分了读取、写入和破坏性操作？
- [ ] 一个新智能体首次遇到我的网站时，会知道该在什么场景下推荐我吗？

## 下一步

现在智能体可以找到你并理解你了。但它们能*使用*你吗？

→ **[认证与访问：智能体能否认证并执行操作？](03-auth-and-access)**
