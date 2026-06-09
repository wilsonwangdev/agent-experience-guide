# Agent Experience Guide — Dense Reference

> Agent-oriented summary. For the full narrative with examples, see the linked chapters.

## What This Is

An open-source handbook for making services agent-ready. Covers the six-stage agent journey: Discovery → Identity → Auth & Access → Integration → Errors & Recovery → End-User Experience.

## Six-Stage Model

| # | Stage | Question | Quick Win |
|---|-------|----------|------------|
| 1 | Discovery | Can agents find you? | Add `/llms.txt` |
| 2 | Identity | Do agents understand what you do? | Write a capability index |
| 3 | Auth & Access | Can agents authenticate? | Support scoped API tokens |
| 4 | Integration | Is the plumbing there? | Build an MCP server |
| 5 | Errors & Recovery | Can agents self-heal? | Return typed JSON errors |
| 6 | End-User Experience | Can humans interact through agents? | Design handoff flows with context |

## AX Maturity Model

```
Level 0 — Invisible      Agents can't find or parse your site
Level 1 — Discoverable    Agents can find you and understand what you do
Level 2 — Accessible      Agents can authenticate and make basic API calls
Level 3 — Integrated      Agents can use tools, stream responses, recover from errors
Level 4 — Agent-Ready     Agents can complete full workflows with human handoff
Level 5 — Agent-Native    Agents and humans share the same action model, state, and permissions
```

## Key Patterns (Quick Reference)

### Discovery
- **`/llms.txt`** — Agent homepage at site root. Markdown, <500 lines, describes capabilities.
- **`/robots.txt`** — Allow ChatGPT-User, ClaudeBot, Google-Extended, DeepSeekBot explicitly.
- **`/sitemap.xml`** — List all pages. Only 69% of sites have one.
- **JSON-LD** — Add `SoftwareApplication` schema with name, category, pricing, features.
- **Well-known paths** — `/.well-known/openapi.json`, `/.well-known/mcp`, `/agents.json`.
- **A2A Agent Cards** — JSON at `/.well-known/agent-card.json` describing capabilities and auth.

### Identity
- **Capability index** — List every action an agent can take with scope requirements.
- **Boundaries** — Document what agents CANNOT do, not just what they can.
- **Consistency** — `llms.txt`, JSON-LD, OpenAPI, and homepage must all agree.
- **Pricing** — Machine-readable pricing, not just "Contact Sales".

### Auth & Access
- **Scoped tokens** — `contacts:read`, `contacts:write`, `contacts:delete`. Never `*` by default.
- **OAuth + PKCE** — The gold standard for agents acting on behalf of users.
- **auth.md** — WorkOS protocol for agent-on-behalf-of-user authentication. Two flows: agent-verified and user-claimed.
- **x402** — Payment-is-auth for stateless transactions. Not for relational interactions.
- **Progressive scoping** — Start minimal, upgrade on demand, time-bound, classified as read/write/destructive.

### Integration
- **MCP** — Model Context Protocol. Agent ↔ Tool standard. Use Streamable HTTP, not stdio.
- **A2A** — Agent-to-Agent. Agent ↔ Agent communication. Complements MCP.
- **REST foundations** — Consistent URLs, response envelopes, pagination, idempotency keys, versioning.
- **Streaming** — SSE for long-running ops. Progress events, not just final results.
- **Webhooks** — Push events to agents. Include full payloads, not just IDs.

### Errors & Recovery
- **Typed errors** — Every error has `type`, `code`, `retryable`, `message`. Never "something went wrong."
- **Retry guidance** — `Retry-After` header, `retryable: true/false`, suggested alternatives.
- **Idempotency** — `Idempotency-Key` header on all mutations. No duplicates on retry.
- **Partial success** — Batch operations return per-item results, not all-or-nothing.
- **Side effect documentation** — Mark mutations as `destructive`, `sends_email`, etc.

### Agent-Native Architecture
- **Shared action model** — Define once, expose to UI + API + MCP + CLI. No drift.
- **Agent UI parity** — Anything the UI can do, the agent can do.
- **Governed execution** — Same permissions, same audit trail, same scope boundaries.
- **AGENTS.md** — Project-level file for agent onboarding (conventions, guidelines, test commands).

### End-User Experience
- **Context transfer** — Not just a URL. Include what the agent was doing and why.
- **MCP Apps** — Render interactive UIs inside the agent conversation (`_meta.ui`).
- **Activity transparency** — Audit trail, state snapshots, undo capability.
- **Resumable workflows** — Agent can resume after human confirmation.

## Anti-Patterns (Quick List)

1. Browser-only auth flow
2. "Something went wrong" errors
3. PDF documentation
4. Rate limit without Retry-After
5. Silent mutations
6. Kitchen sink endpoint
7. 100 tools with no categories
8. Pretty website, useless API
9. JavaScript-only site
10. Authentication maze
11. Global API key
12. CAPTCHA on API endpoints
13. Flat error code ("invalid_request")
14. Mystery status code (200 for errors)
15. Undocumented pagination
16. Vanishing state
17. Inconsistent naming
18. Monolithic response
19. Undocumented side effects
20. Forced browser flow
21. Unversioned API
22. One-true-token
23. "Contact support" error
24. Inconsistently nested resources
25. Human-only design review

## Checklist Scoring

| Score | Level | Meaning |
|-------|-------|---------|
| 0–20 | Not Ready | Agents can't find or use your service |
| 21–40 | Discoverable | Agents can find you but can't do much |
| 41–60 | Accessible | Agents can authenticate and make basic calls |
| 61–75 | Integrated | Agents can use your tools and recover from errors |
| 76–90 | Agent-Ready | Solid AX across all stages |
| 91–105 | Agent-Native | Best-in-class |
| 106+ | Leading | Setting the standard |

## 3 Things You Can Do Today

1. Add `/llms.txt` to your site root
2. Return typed JSON errors from every API endpoint
3. Let agents authenticate with scoped API tokens

## Key References

- AX Design Standard: https://axd.md/
- ora.ai Scoring: https://ora.ai/
- MCP Spec: https://modelcontextprotocol.io/
- A2A Protocol: https://github.com/google/A2A
- auth.md Spec: https://workos.com/auth-md
- Full references: [references.md](references.md)