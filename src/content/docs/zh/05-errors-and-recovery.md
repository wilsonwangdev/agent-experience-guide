---
stage: 5
title: "Errors & Recovery: Can Agents Self-Heal?"
key_concepts: [typed errors, retryable flag, retry-after, idempotency, structured errors, recovery guidance, MCP errors]
practical_steps: 7
anti_patterns: 0
prev: "04-integration"
next: "06-agent-native-architecture"
lang: zh
zh_title: "错误与恢复：智能体能否自愈？"
---

# 错误与恢复：智能体能否自愈？

当人类看到“出了点问题”时，他们可以再试一次、查看帮助页面或联系客服。当智能体（Agent）看到同样的消息时，它就困住了。它看不到你的 toast 通知。它无法直觉判断“错误 500”意味着“30 秒后再试”。它也无法猜到“无效请求”是说“email 字段缺失”。

**错误处理是大多数智能体（Agent）体验崩坏的地方。**不是因为会出错——这永远会发生——而是因为错误响应没有给智能体（Agent）足够的信息来恢复。

## 问题所在

典型的 API 错误响应：

```json
// 大多数 API 返回的内容
{ "error": "Something went wrong" }

// 稍微好一点但仍然常见
{ "error": "Invalid request" }

// 更好但仍然不足以供智能体（Agent）使用
{ "error": "Validation failed", "status": 400 }
```

它们都没有告诉智能体（Agent）：
- 具体是什么出错了
- 重试有没有用
- 重试之前应该等多久
- 正确的输入长什么样子
- 还有哪些替代操作可以执行

## 面向智能体友好的错误处理原则

### 1. 每个错误都必须有类型

错误类型为智能体（Agent）提供了一个抓手。智能体（Agent）可以基于结构化的错误代码进行分支判断，而不必解析自然语言文本：

```json
{
  "error": {
    "type": "validation_error",
    "code": "CONTACT_EMAIL_REQUIRED",
    "status": 400,
    "message": "Contact email is required",
    "details": {
      "field": "email",
      "constraint": "required",
      "suggestion": "Provide a valid email address in the format user@example.com"
    }
  }
}
```

### 2. 每个错误都必须标明是否可重试

智能体（Agent）需要知道：*我应该再试一次，还是这个问题是永久性的？*

```json
{
  "error": {
    "type": "rate_limit_error",
    "retryable": true,
    "retry_after": 30,
    "retry_after_unit": "seconds"
  }
}
```

```json
{
  "error": {
    "type": "validation_error",
    "retryable": false,
    "fix": "Add the 'email' field to your request body"
  }
}
```

`Retry-After` HTTP 响应头也应该设置：

```http
HTTP/1.1 429 Too Many Requests
Retry-After: 30
Content-Type: application/json

{
  "error": {
    "type": "rate_limit_error",
    "retryable": true,
    "message": "Rate limit exceeded. Retry after 30 seconds.",
    "limit": 100,
    "remaining": 0,
    "reset_at": "2025-01-15T10:30:00Z"
  }
}
```

### 3. 每个错误都必须包含恢复指引

不要说“出了点问题”，而要明确告诉智能体（Agent）该做什么：

```json
// 差
{ "error": "Cannot delete contact" }

// 好
{
  "error": {
    "type": "permission_error",
    "code": "INSUFFICIENT_SCOPE",
    "message": "Cannot delete contact. Requires 'contacts:delete' scope.",
    "recovery": {
      "action": "request_scope",
      "scope": "contacts:delete",
      "description": "Request elevated permissions to delete contacts",
      "link": "https://api.crm.example.com/auth/scopes/contacts:delete"
    }
  }
}
```

错误类型分类体系：

- `validation_error`——输入不符合预期。修复后重试。
- `authentication_error`——凭证缺失、过期或权限不足。重新认证。
- `rate_limit_error`——请求过多。等待后重试。
- `conflict_error`——状态已变更。刷新后重试。
- `not_found_error`——资源不存在。尝试其他查询。
- `permission_error`——权限范围不足。请求更多权限。
- `internal_error`——服务器故障。退避重试。

### 4. 用结构替代散文

恢复指引模式：

| 错误类型 | 恢复操作 | 示例 |
|-----------|----------------|---------|
| `validation_error` | 修复输入 | "Add required 'email' field" |
| `authentication_error` | 重新认证 | "Token expired. Refresh at /oauth/token" |
| `rate_limit_error` | 等待并重试 | "Retry after 30 seconds" |
| `permission_error` | 请求更多权限 | "Requires 'contacts:delete' scope" |
| `conflict_error` | 刷新并重试 | "Contact was modified since last read. GET /contacts/123 for current version" |
| `not_found_error` | 尝试替代操作 | "No contact found. Try GET /contacts?q=acme to search" |

HTML 错误页面对智能体（Agent）来说是不可见的。JSON 错误响应是可被机器解析的。永远不要从 API 端点返回 HTML，即便是 500 错误也不要。

```json
// 永远不要从 API 返回这种内容
<html>
  <body>
    <h1>500 Internal Server Error</h1>
    <p>Something went wrong. Please try again later.</p>
  </body>
</html>

// 始终返回这种内容
{
  "error": {
    "type": "internal_error",
    "retryable": true,
    "retry_after": 60,
    "incident_id": "inc_abc123",
    "status": "https://status.crm.example.com"
  }
}
```

### 5. 通过幂等性实现安全重试

当智能体（Agent）可以安全重试时，它不需要问“这个操作是否已经发生过？”让变更操作具备幂等性：

```http
POST /api/v1/deals
Idempotency-Key: deal_2025_01_15_acme
Content-Type: application/json

{
  "name": "Acme Enterprise Deal",
  "value": 50000
}
```

如果再次发送相同的 `Idempotency-Key`，应直接返回原始响应，不创建重复记录。

### 6. 部分成功与批量错误

处理多个项目时，不要因为部分失败就全盘回滚：

```json
{
  "data": [
    { "id": "c_1", "status": "created" },
    { "id": "c_2", "status": "created" },
    { "id": "c_3", "status": "failed", "error": { "type": "validation_error", "message": "Invalid email format" } }
  ],
  "summary": {
    "total": 3,
    "succeeded": 2,
    "failed": 1
  }
}
```

### 7. 静默变更很危险

每个副作用都必须是显式的。一个没有清晰说明就会发送邮件、创建记录或扣款接口，对智能体（Agent）来说是巨大的风险：

```json
// 在你的 OpenAPI 规范 / MCP 工具描述中：
{
  "name": "close_deal",
  "description": "Close a deal in the pipeline. WARNING: This action is PERMANENT. It will: (1) send a notification email to the deal owner, (2) create an invoice in the billing system, (3) update the forecast dashboard.",
  "side_effects": ["sends_email", "creates_invoice", "updates_dashboard"],
  "destructive": false,
  "idempotent": true
}
```

## MCP 错误处理

MCP 有自己的错误处理模式。请使用它们：

```typescript
// 返回结构化错误，而不是直接抛出异常
server.tool(
  "delete_contact",
  "Permanently delete a contact and all associated data",
  { id: z.string().describe("Contact ID to delete") },
  async ({ id }) => {
    const contact = await db.contacts.findById(id);
    if (!contact) {
      return {
        content: [{
          type: "text",
          text: `Error: Contact ${id} not found. Use 'search_contacts' to find valid contact IDs.`,
        }],
        isError: true,
      };
    }
    await db.contacts.delete(id);
    return {
      content: [{
        type: "text",
        text: `Contact "${contact.name}" (${id}) has been permanently deleted.`,
      }],
    };
  }
);
```

## 实操步骤

1. **审查所有 API 错误响应**——它们是 JSON 的吗？有错误类型吗？（1-2 天）
2. **为所有错误响应添加 `retryable` 和 `retry_after`**（1 天）
3. **为前 10 个最常见错误添加恢复指引**（1 天）
4. **从 API 端点中删除所有 HTML 错误页面**——替换为 JSON（1 天）
5. **为所有变更端点添加 `Idempotency-Key` 支持**（2-3 天）
6. **在工具描述和 API 文档中记录副作用**（1 天）
7. **为批量端点添加部分成功处理**（1-2 天）

## 错误与恢复度量

- [ ] 所有 API 错误响应是否都返回 JSON（而不是 HTML）？
- [ ] 每个错误是否都有结构化的 `type` 和 `code`？
- [ ] 每个错误是否都标明了是否 `retryable`？
- [ ] 限流错误是否包含 `Retry-After` 响应头？
- [ ] 验证错误是否指明了哪个字段失败以及原因？
- [ ] 权限错误是否告知了智能体（Agent）需要哪种权限范围？
- [ ] 变更端点是否支持幂等性键？
- [ ] 副作用（邮件、扣费、通知）是否在工具描述中有记录？
- [ ] 批量端点是否返回每项错误详情的部分成功结果？
- [ ] MCP 工具发生错误时是否返回 `isError: true`，而非直接抛出异常？

## 下一步

良好的错误处理帮助智能体（Agent）恢复。但最好的架构是通过设计，使智能体（Agent）和人类可以在同一套系统上运作，从而让错误变得罕见。

→ **[面向智能体的原生架构](06-agent-native-architecture)**
