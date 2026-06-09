---
stage: checklist
title: "Agent Readiness Checklist"
key_concepts: [readiness assessment, scoring, practical steps, checklist items]
practical_steps: 3
anti_patterns: 0
prev: "07-anti-patterns"
next: "references"
lang: en
zh_title: "智能体就绪度检查清单"
---

# Agent Readiness Checklist

Use this checklist to evaluate and improve your service's agent experience. Work through it section by section — you don't need to check every box to be agent-ready, but every box you check improves your score.

## Stage 1: Discovery

Can agents find and crawl your service?

### Foundations
- [ ] `/robots.txt` allows major agent crawlers (ChatGPT-User, ClaudeBot, Google-Extended, etc.)
- [ ] `/sitemap.xml` exists and is up to date
- [ ] `/llms.txt` exists with a clear product description, capabilities, and links

### Structured Data
- [ ] Homepage includes JSON-LD structured data (`SoftwareApplication` or appropriate schema)
- [ ] Product category is consistent across all metadata surfaces
- [ ] Pricing is machine-readable (not just "Contact Sales")

### Well-Known Paths
- [ ] OpenAPI spec is published at a predictable URL (e.g., `/.well-known/openapi.json` or linked from `llms.txt`)
- [ ] Agent discovery endpoints respond correctly (A2A Agent Card, MCP server info, or similar)

### Answer Engine Optimization
- [ ] Key pages have clear, factual `<title>` and `<meta description>` tags
- [ ] Product description is concise and accurate (not marketing fluff)
- [ ] FAQ or help pages answer common "what does this product do?" questions

---

## Stage 2: Identity

Do agents understand what your service does and what it offers?

### Product Identity
- [ ] `/llms.txt` contains a clear one-line product description
- [ ] Product category and use cases are stated explicitly
- [ ] Target audience is identified (e.g., "for small teams," "enterprise," "developers")

### Capability Index
- [ ] All agent-facing actions are listed and described
- [ ] Actions are classified as `read`, `write`, or `destructive`
- [ ] Required scopes/permissions for each action are documented
- [ ] Actions are organized in logical categories (not a flat list of 100)

### Consistency
- [ ] Homepage, `llms.txt`, JSON-LD, and OpenAPI spec all describe the product consistently
- [ ] Pricing on the website matches pricing in structured data
- [ ] Capabilities listed in `llms.txt` match the actual API endpoints

### Boundaries
- [ ] What the service does NOT do is documented
- [ ] Rate limits are published and machine-readable
- [ ] Terms of service are accessible (ideally in structured format)

---

## Stage 3: Auth & Access

Can agents authenticate and act on behalf of users?

### Authentication Options
- [ ] At least one programmatic auth method is available (not browser-only)
- [ ] OAuth metadata is published at `/.well-known/oauth-authorization-server`
- [ ] PKCE with S256 is supported for OAuth flows
- [ ] Device authorization flow is supported for headless agents
- [ ] Scoped API tokens are available with progressive permissions

### Auth.md Support
- [ ] `/auth.md` is published with structured agent authentication instructions
- [ ] Agent verification flow (ID-JAG) is supported (if applicable)
- [ ] User-claimed flow (OTP) is supported (if applicable)
- [ ] AS metadata includes `agent_auth` block with registration and claim URIs

### Token Management
- [ ] Tokens are scoped (not all-or-nothing)
- [ ] Tokens are time-limited (not perpetual)
- [ ] Tokens are revocable without affecting other tokens
- [ ] Token actions are auditable (who, what, when)

### Anti-Patterns Absent
- [ ] No CAPTCHA on API endpoints
- [ ] No browser-only OAuth flows (programmatic alternatives exist)
- [ ] No single global API key as the only auth option
- [ ] No email verification as the only path to credentials

---

## Stage 4: Integration

Is the plumbing there? Can agents actually use your service?

### MCP
- [ ] MCP server is available and reachable
- [ ] MCP tools have descriptive names (`verb_noun` pattern)
- [ ] MCP tools have accurate, detailed descriptions
- [ ] MCP tools have typed, documented parameters (with Zod or equivalent)
- [ ] MCP server uses Streamable HTTP transport (not just stdio)
- [ ] MCP server supports proper error responses with `isError: true`

### REST API
- [ ] API uses consistent URL patterns (`/api/v1/resource`)
- [ ] API uses consistent response envelope (`{ data, meta, errors }`)
- [ ] API supports pagination with clear signals (`has_more`, `next_cursor`)
- [ ] API supports filtering and sorting on list endpoints
- [ ] API supports field selection (sparse fieldsets)
- [ ] Mutation endpoints support idempotency keys
- [ ] API is versioned (e.g., `/v1/`, `/v2/`)

### OpenAPI
- [ ] OpenAPI 3.x spec is published and reachable
- [ ] Spec is accurate and matches the running API
- [ ] Spec includes authentication requirements
- [ ] Spec includes error response schemas
- [ ] Spec includes example requests and responses

### Streaming & Events
- [ ] Long-running operations support SSE or WebSocket streaming
- [ ] Progress events are emitted during streaming (not just final results)
- [ ] Webhooks are available for key events
- [ ] Webhook payloads include full data (not just IDs)
- [ ] ETag/If-None-Match is supported for efficient polling

### SDKs
- [ ] At least one official SDK exists (Python, TypeScript, etc.)
- [ ] SDK error handling maps to structured error types
- [ ] SDK documentation includes agent usage examples

---

## Stage 5: Errors & Recovery

Can agents self-heal when things go wrong?

### Error Structure
- [ ] All API errors return JSON (never HTML from API endpoints)
- [ ] Errors have a structured `type` (e.g., `validation_error`, `rate_limit_error`)
- [ ] Errors have a machine-readable `code` (e.g., `CONTACT_EMAIL_REQUIRED`)
- [ ] Errors include a human-readable `message`
- [ ] Validation errors specify which field failed and why
- [ ] Permission errors specify which scope is required

### Retry Guidance
- [ ] Every error indicates whether it's `retryable`
- [ ] Rate limit errors include `Retry-After` header
- [ ] Rate limit responses include `limit`, `remaining`, and `reset_at`
- [ ] Conflicts include the current version and a link to fetch it

### Recovery
- [ ] Errors include suggested recovery actions when possible
- [ ] "Not found" errors suggest alternative queries
- [ ] "Forbidden" errors link to the scope request flow
- [ ] "Conflict" errors link to the current version of the resource

### Idempotency
- [ ] All mutation endpoints accept `Idempotency-Key` headers
- [ ] Duplicate `Idempotency-Key` requests return the original response
- [ ] Destructive actions are marked and require confirmation

---

## Stage 6: Agent-Native & End-User Experience

Is your product designed for agent-human collaboration with seamless handoffs?

### Action Model
- [ ] Product capabilities are defined once and exposed to all surfaces (UI, API, MCP, CLI)
- [ ] Actions have consistent naming (`verb_noun`)
- [ ] Actions have explicit scope requirements
- [ ] Actions are classified as read / write / destructive
- [ ] Actions document all side effects

### Context & Governance
- [ ] Agent can see what the human is currently viewing (shared state)
- [ ] Agent can navigate the UI on behalf of the human
- [ ] Changes made by the agent are visible in the UI in real-time
- [ ] Both human and agent actions write to the same database
- [ ] Agent actions are logged and auditable
- [ ] Agent actions respect the same permissions as human actions
- [ ] Destructive actions require explicit confirmation (human-in-the-loop)
- [ ] Actions are reversible within a time window where appropriate

### Project-Level
- [ ] `AGENTS.md` exists in the project root
- [ ] Agent workspace customization is supported (memory, skills, instructions)
- [ ] Agent progress is observable (traces, status events)
- [ ] Cost and latency of agent actions are tracked

### Handoff Flows
- [ ] Every action requiring human confirmation has a clear, contextual handoff flow
- [ ] Handoff URLs include context tokens with expiration
- [ ] Confirmation pages show what the agent was doing and why
- [ ] User can review agent activity before confirming
- [ ] Agent can resume workflow after human confirmation

### Activity Transparency
- [ ] Agent activity is logged and auditable
- [ ] Users can see a timeline of what their agent has done
- [ ] Destructive actions have undo capability within a time window
- [ ] State snapshots are available at handoff points

### MCP Apps & Inline UI
- [ ] MCP tool descriptions include `_meta.ui` metadata where appropriate
- [ ] Confirmation workflows can render inline forms in agent conversations
- [ ] Dashboard previews are available for complex decisions

### Mobile & Brand
- [ ] Handoff pages are mobile-responsive
- [ ] Confirmation pages match the product's design language
- [ ] After confirmation, user can see the result and return to the agent

---

## Scoring

Count your checkmarks across all 6 stages:

| Score | Level | Meaning |
|-------|-------|---------|
| 0–20 | Not Ready | Agents can't find or use your service |
| 21–40 | Discoverable | Agents can find you but can't do much |
| 41–60 | Accessible | Agents can authenticate and make basic calls |
| 61–75 | Integrated | Agents can use your tools and recover from errors |
| 76–90 | Agent-Ready | Solid agent experience across all stages |
| 91–105 | Agent-Native | Best-in-class agent experience |
| 106+ | Leading | You're setting the standard |

---

## What to Do First

If you're just starting, do these three things today:

1. **Add `/llms.txt`** — Tell agents what your product is and what they can do.
2. **Return structured JSON errors** — Stop returning "Something went wrong."
3. **Add scoped API tokens** — Give agents a way to authenticate without browser flows.

Then work through the checklist stage by stage, starting with Discovery and moving toward Agent-Native & End-User Experience. Each stage you improve unlocks more capability for the agents that want to use your product.

→ **[Back to Introduction](00-what-is-ax)** | **[References](references)**