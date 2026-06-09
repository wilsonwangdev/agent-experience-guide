---
stage: 3
title: "Auth & Access: Can Agents Authenticate and Act?"
key_concepts: [OAuth, PKCE, auth.md, x402, scoped tokens, progressive scoping, device flow, ID-JAG]
practical_steps: 6
anti_patterns: 5
prev: "02-identity"
next: "04-integration"
lang: en
zh_title: "认证与访问：智能体能否认证并执行操作？"
---

# Auth & Access: Can Agents Authenticate and Act?

This is where most agent journeys die.

An agent has found your product, understands what it does, and wants to use it. But it can't. The sign-up form requires a browser. The OAuth flow requires clicking through a consent screen. The API key requires a human to visit a developer portal, fill out a form, and paste the resulting key into a config file.

Every barrier that requires a human is a dead end for an autonomous agent. **Auth is the last mile of agent readiness, and it's the least solved layer.**

## The Problem

The current state of authentication for agents is:

- **Static API keys** — Universal, but all-or-nothing scope, impossible to attribute to specific users, and a leaked key is indistinguishable from a prompt injection payload.
- **OAuth 2.0 with browser consent** — Mature and scoped, but the consent screen is a wall autonomous agents can't cross without a human.
- **Client credentials (M2M)** — Scoped and short-lived, but the token represents the service, not the user. Wrong primitive when an agent acts on user data.
- **No onboarding for agents** — Sign-up forms assume a browser, email verification assumes a mailbox, SMS 2FA assumes a phone.

The agent inherits a credential a human had to obtain for it. That's not autonomy. That's a faster handoff.

## Auth Patterns for Agents

### 1. Scoped API Tokens (Quick Win)

The fastest path to agent auth: issue scoped, time-limited API tokens that agents can use directly.

```
Authorization: Bearer crm_read_2025abc123def
```

Best practices:
- **Scoped** — `crm:read`, `crm:write`, `crm:admin`. Never `*` by default.
- **Time-limited** — Expire after hours or days, not years.
- **Attributable** — Each token ties to a specific agent, user, and purpose.
- **Revocable** — One endpoint to revoke without affecting other tokens.
- **Audited** — Every action is logged against the token that performed it.

```json
{
  "token": "crm_2025abc_read",
  "scopes": ["contacts:read", "deals:read"],
  "expires_at": "2025-02-01T00:00:00Z",
  "created_by": "agent:claude-prod-v2",
  "on_behalf_of": "user:alice@example.com"
}
```

### 2. OAuth 2.0 with PKCE (Production-Ready)

For agents acting on behalf of users, OAuth 2.0 with PKCE (Proof Key for Code Exchange) is the gold standard — when it works.

The challenge: the standard OAuth flow requires a browser-based consent screen. For agents, this means:

**Option A: Pre-authorized scopes** — The user pre-authorizes specific scopes for their agent. The agent can then act within those bounds without re-prompting.

```json
{
  "grant_types": ["urn:ietf:params:oauth:grant-type:device_code", "authorization_code"],
  "code_challenge_methods_supported": ["S256"],
  "scopes_supported": ["contacts:read", "contacts:write", "deals:read"],
  "pre_authorized_scopes": ["contacts:read", "deals:read"]
}
```

**Option B: Device authorization flow** — For headless agents. The agent gets a code, the user visits a URL to approve, and the agent polls for the token.

```
1. Agent: POST /oauth/device → gets device_code + user_code + verification_uri
2. Agent tells user: "Visit https://crm.example.com/device and enter code ABC-123"
3. User approves in browser
4. Agent polls: POST /oauth/token → gets access_token
```

**Option C: OAuth metadata discovery** — Agents need to find your OAuth endpoints programmatically. Publish RFC 8414 metadata:

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

### 3. auth.md (Emerging Standard)

WorkOS's `auth.md` is the first protocol designed specifically for agent-on-behalf-of-user authentication. It provides a structured file at `/auth.md` that tells agents how to authenticate.

Two flows:

**Agent-verified flow:**
1. Agent's identity provider mints an ID-JAG assertion ("this agent is acting for this user")
2. Agent POSTs it to `register_uri`
3. Service verifies and returns a scoped credential
4. No consent screen, no OTP, no email round-trip

**User-claimed flow:**
1. Agent requests anonymous access at low trust
2. Service issues a scoped credential immediately
3. User verifies via OTP when ready
4. Agent's scopes upgrade after verification

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

### 4. x402 / Payment-as-Auth (Stateless)

x402 (by Coinbase, adopted by AWS Bedrock) embeds payment directly in the HTTP request. No account, no signup, no token. The payment *is* the credential.

```http
GET /api/search?q=hello
HTTP/1.1 402 Payment Required
X-402-Payment: amount=0.01, address=0x...

GET /api/search?q=hello
X-402-Payment: <signed-payment>
HTTP/1.1 200 OK
```

Good for: stateless, transactional calls — pay-per-fetch, pay-per-inference, pay-per-search.

Limitations: doesn't work for relational interactions (writing to a CRM, holding a booking, per-user audit trails) where the service needs to know *which user* the agent is acting for.

## Progressive Scoping

Regardless of auth method, the principle of **progressive scoping** should apply:

1. **Start minimal** — An agent authenticating for the first time gets the narrowest possible scopes.
2. **Upgrade on demand** — When the agent needs to write, it requests write scope. When it needs to delete, it requests destructive scope.
3. **Time-bound** — Scopes expire. The agent can re-authorize, but it doesn't hold permanent god-mode access.
4. **Scope classification** — Clearly label actions as `read`, `write`, or `destructive`. This lets agents move fast within known-safe boundaries and slow down at destructive edges.

```json
{
  "scopes": {
    "contacts:read": { "risk": "low", "description": "Read contact data" },
    "contacts:write": { "risk": "medium", "description": "Create and update contacts", "requires": "user_approval" },
    "contacts:delete": { "risk": "high", "description": "Permanently delete contacts", "requires": "explicit_confirmation" }
  }
}
```

## Auth Anti-Patterns

- **Browser-only OAuth with no programmatic alternative** — Agents can't click through a browser popup.
- **Global API keys with no scoping** — If your only auth option is a god-mode key, agents will use it, and the blast radius of a leak is total.
- **CAPTCHA on API endpoints** — This blocks agents by design. If you need rate limiting, use rate limiting.
- **Email verification as the only path to credentials** — Agents don't have email accounts.
- **"Create an account" forms designed for humans** — 12-field forms with CAPTCHAs, email verification, and SMS OTP are not an agent onboarding flow.

## Practical Steps

1. **Publish OAuth metadata** at `/.well-known/oauth-authorization-server` (1-2 hours)
2. **Support device authorization flow** for headless agents (1-2 days)
3. **Add scoped tokens** with progressive permissions (1-3 days)
4. **Publish `/auth.md`** following the WorkOS spec (half day)
5. **Classify all actions** as read/write/destructive (1 day)
6. **Remove CAPTCHA from API endpoints** and replace with rate limiting (1 day)

**Further reading:** [auth.md specification](https://workos.com/auth-md), [Progressive Scoping](https://www.descope.com/blog/post/progressive-scoping), [MCP Authorization Spec](https://www.descope.com/blog/post/mcp-auth-spec) — see [References](references) for complete links.

## Measuring Auth & Access

- [ ] Can an agent discover your auth endpoints programmatically?
- [ ] Does your OAuth server publish RFC 8414 metadata?
- [ ] Do you support PKCE with S256?
- [ ] Can an agent authenticate without browser interaction?
- [ ] Are your scopes classified as read/write/destructive?
- [ ] Can an agent request and receive progressively scoped access?
- [ ] Do you support `auth.md` or equivalent agent auth discovery?
- [ ] Are API tokens time-limited and revocable?
- [ ] Is every API action logged against the credential that performed it?

## What's Next

The agent can find you, understand you, and authenticate. Now it needs to actually *use* your service through tools and protocols.

→ **[Integration: Is the Plumbing There?](04-integration)**