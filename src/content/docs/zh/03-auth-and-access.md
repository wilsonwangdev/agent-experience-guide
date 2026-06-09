---
stage: 3
title: "Auth & Access: Can Agents Authenticate and Act?"
key_concepts: [OAuth, PKCE, auth.md, x402, scoped tokens, progressive scoping, device flow, ID-JAG]
practical_steps: 6
anti_patterns: 5
prev: "02-identity"
next: "04-integration"
lang: zh
zh_title: "认证与访问：智能体能否认证并执行操作？"
---

# 认证与访问：智能体能否认证并执行操作？

大多数智能体（Agent）的旅程就断在这里。

智能体已经找到了你的产品，理解了它是做什么的，并想要使用它。但它做不到。注册表单需要浏览器。OAuth 流程需要点击同意屏幕。API 密钥需要人类访问开发者门户、填写表单，然后将生成的密钥粘贴到配置文件中。

每一个需要人类的障碍对自主智能体来说都是死胡同。**认证（Auth）是智能体就绪的最后一公里，也是最未被解决的一层。**

## 问题所在

当前面向智能体的认证状态是：

- **静态 API 密钥**——通用，但作用域是非白即黑的，无法归属到具体用户，且泄露的密钥与 prompt 注入载荷无法区分。
- **带浏览器同意的 OAuth 2.0**——成熟且支持作用域，但同意屏幕是自主智能体在没有人类干预时无法跨越的墙。
- **客户端凭证（M2M）**——有作用域且短效，但令牌代表的是服务而非用户。当智能体操作用户数据时，这是错误的基础原语。
- **没有面向智能体的上手指南**——注册表单假设有浏览器，邮箱验证假设有邮箱，SMS 2FA 假设有手机。

智能体继承了一个人类必须为它获取的凭证。这不是自主性。这只是更快的人工交接。

## 面向智能体的认证模式

### 1. 作用域 API 令牌（快速见效）

面向智能体认证的最快路径：签发有作用域、有时限的 API 令牌，智能体可以直接使用。

```
Authorization: Bearer crm_read_2025abc123def
```

最佳实践：
- **有作用域**——`crm:read`、`crm:write`、`crm:admin`。默认绝不使用 `*`。
- **有时限**——几小时或几天后过期，而非数年。
- **可归属**——每个令牌绑定到特定的智能体、用户和用途。
- **可撤销**——一个端点即可撤销，不影响其他令牌。
- **可审计**——每个操作都记录在对应的令牌上。

```json
{
  "token": "crm_2025abc_read",
  "scopes": ["contacts:read", "deals:read"],
  "expires_at": "2025-02-01T00:00:00Z",
  "created_by": "agent:claude-prod-v2",
  "on_behalf_of": "user:alice@example.com"
}
```

### 2. 带 PKCE 的 OAuth 2.0（生产就绪）

对于代表用户执行操作的智能体，带 PKCE（Proof Key for Code Exchange，代码交换证明密钥）的 OAuth 2.0 是黄金标准——当它真正能运作时。

挑战在于：标准 OAuth 流程需要一个基于浏览器的同意屏幕。对智能体来说，这意味着：

**方案 A：预授权作用域**——用户为其智能体预先授权特定的作用域。智能体可以在这些边界内执行操作，无需重新提示。

```json
{
  "grant_types": ["urn:ietf:params:oauth:grant-type:device_code", "authorization_code"],
  "code_challenge_methods_supported": ["S256"],
  "scopes_supported": ["contacts:read", "contacts:write", "deals:read"],
  "pre_authorized_scopes": ["contacts:read", "deals:read"]
}
```

**方案 B：设备授权流程**——适用于无头智能体。智能体获取一个代码，用户访问一个 URL 进行批准，智能体轮询获取令牌。

```
1. Agent: POST /oauth/device → gets device_code + user_code + verification_uri
2. Agent tells user: "Visit https://crm.example.com/device and enter code ABC-123"
3. User approves in browser
4. Agent polls: POST /oauth/token → gets access_token
```

**方案 C：OAuth 元数据可发现性**——智能体需要以编程方式找到你的 OAuth 端点。发布 RFC 8414 元数据：

```
GET /.well-known/oauth-authorization-server
```

```json
{
  "issuer": "https://crm.example.com",
  "authorization_endpoint": "https://crm.example.com/oauth/authorize",
  "token_endpoint": "https://crm.example.com/oauth/token",
  "device_authorization_endpoint": "https://crm.example.com/oauth/device",
  "scopes_supported": ["contacts:read", "contacts:write", "deals:read", "admin"],
  "code_challenge_methods_supported": ["S256"],
  "grant_types_supported": ["authorization_code", "device_code", "client_credentials"]
}
```

### 3. auth.md（新兴标准）

WorkOS 的 `auth.md` 是首个专为"智能体代用户"认证而设计的协议。它在 `/auth.md` 提供结构化文件，告诉智能体如何进行认证。

两种流程：

**智能体验证流程：**
1. 智能体的身份提供方签发一个 ID-JAG 断言（"此智能体正在为此用户操作"）
2. 智能体将其 POST 到 `register_uri`
3. 服务验证并返回一个作用域凭证
4. 无需同意屏幕、无需 OTP、无需邮件往返

**用户认领流程：**
1. 智能体在低信任级别请求匿名访问
2. 服务立即签发一个作用域凭证
3. 用户在就绪时通过 OTP 进行验证
4. 验证后智能体的作用域升级

```json
{
  "agent_auth": {
    "skill": "https://crm.example.com/auth.md",
    "register_uri": "https://auth.crm.example.com/agent/auth",
    "claim_uri": "https://auth.crm.example.com/agent/auth/claim",
    "revocation_uri": "https://auth.crm.example.com/agent/auth/revoke",
    "identity_types_supported": ["anonymous", "identity_assertion"],
    "identity_assertion": {
      "assertion_types_supported": ["urn:ietf:params:oauth:token-type:id-jag"],
      "credential_types_supported": ["access_token", "api_key"]
    }
  }
}
```

### 4. x402 / 支付即认证（无状态）

x402（由 Coinbase 提出，AWS Bedrock 已采用）直接将支付嵌入 HTTP 请求。无需账户、无需注册、无需令牌。支付*本身就是*凭证。

```http
GET /api/search?q=hello
HTTP/1.1 402 Payment Required
X-402-Payment: amount=0.01, address=0x...

GET /api/search?q=hello
X-402-Payment: <signed-payment>
HTTP/1.1 200 OK
```

适用场景：无状态、事务性调用——按获取付费（pay-per-fetch）、按推理付费（pay-per-inference）、按搜索付费（pay-per-search）。

局限性：不适用于关系型交互（写入 CRM、持有预订、按用户审计追踪），这些场景需要知道智能体在为*哪个用户*执行操作。

## 渐进式授权

无论采用何种认证方式，都应遵循**渐进式授权（Progressive Scoping）**原则：

1. **从最小权限开始**——智能体首次认证时获得尽可能窄的作用域。
2. **按需升级**——当智能体需要写入时，它请求写入作用域。当需要删除时，它请求破坏性作用域。
3. **有时限**——作用域会过期。智能体可以重新授权，但不会持有永久的上帝模式访问权限。
4. **作用域分类**——明确将操作标注为 `read`、`write` 或 `destructive`。这使智能体能在已知安全的边界内快速行动，在破坏性边缘减速。

```json
{
  "scopes": {
    "contacts:read": { "risk": "low", "description": "Read contact data" },
    "contacts:write": { "risk": "medium", "description": "Create and update contacts", "requires": "user_approval" },
    "contacts:delete": { "risk": "high", "description": "Permanently delete contacts", "requires": "explicit_confirmation" }
  }
}
```

## 认证反模式

- **仅有浏览器的 OAuth，无编程替代方案**——智能体无法点击浏览器弹窗。
- **无作用域的全域 API 密钥**——如果你唯一的认证选项是上帝模式的密钥，智能体会使用它，而泄露的爆炸半径是全部。
- **API 端点上使用 CAPTCHA**——这在设计上就阻止了智能体。如果你需要限流，请使用限流。
- **邮箱验证是获取凭证的唯一途径**——智能体没有邮箱账户。
- **为人类设计的"创建账户"表单**——带 CAPTCHA、邮箱验证和 SMS OTP 的 12 字段表单不是智能体的上手指南。

## 实操步骤

1. **在 `/.well-known/oauth-authorization-server` 发布 OAuth 元数据**（1-2 小时）
2. **支持设备授权流程**以服务无头智能体（1-2 天）
3. **添加作用域令牌**并配备渐进式权限（1-3 天）
4. **发布 `/auth.md`**，遵循 WorkOS 规范（半天）
5. **将所有操作分类**为 read/write/destructive（1 天）
6. **从 API 端点移除 CAPTCHA**，用限流替代（1 天）

**延伸阅读：** [auth.md specification](https://workos.com/auth-md)、[Progressive Scoping](https://www.descope.com/blog/post/progressive-scoping)、[MCP Authorization Spec](https://www.descope.com/blog/post/mcp-auth-spec)——完整链接见 [References](references)。

## 衡量认证与访问

- [ ] 智能体能否以编程方式发现你的认证端点？
- [ ] 你的 OAuth 服务器是否发布了 RFC 8414 元数据？
- [ ] 你是否支持带 S256 的 PKCE？
- [ ] 智能体能否在不与浏览器交互的情况下认证？
- [ ] 你的作用域是否分类为 read/write/destructive？
- [ ] 智能体能否请求并获得渐进式授权的作用域访问？
- [ ] 你是否支持 `auth.md` 或同等的智能体认证发现机制？
- [ ] API 令牌是否有时限且可撤销？
- [ ] 每个 API 操作是否都记录了对应的执行凭证？

## 下一步

智能体可以找到你、理解你并通过认证了。现在它需要通过工具和协议实际*使用*你的服务。

→ **[集成：基础设施到位了吗？](04-integration)**
