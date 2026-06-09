---
stage: anti-patterns
title: "Anti-Patterns: 25 Things That Break Agent Experience"
key_concepts: [browser-only auth, silent mutation, kitchen sink endpoint, something went wrong, PDF docs, rate limit without retry-after]
practical_steps: 0
anti_patterns: 25
prev: "06b-end-user-experience"
next: "08-checklist"
lang: en
zh_title: "反模式：25个破坏智能体体验的常见错误"
---

# Anti-Patterns: 25 Things That Break Agent Experience

These are the most common ways websites and APIs break agent experience. Most of them are obvious once you see them — and invisible until someone points them out.

---

## 1. The Browser-Only Auth Flow

Auth requires visual browser interaction with no programmatic alternative. Click "Sign in with Google," wait for a popup, solve a CAPTCHA, check your email for a verification code. A human can do this. An autonomous agent cannot.

**Fix:** Offer OAuth device flow, scoped API tokens, or `auth.md` as a programmatic alternative.

---

## 2. The "Something Went Wrong" Error

```json
{ "error": "Something went wrong" }
```

No error code. No classification. No recovery guidance. The agent is stuck.

**Fix:** Return structured errors with types, codes, `retryable` flags, and recovery guidance.

---

## 3. The PDF Documentation

Product docs are a 200-page PDF. Not searchable, not linkable, not parseable by agents. The information is technically available but practically invisible.

**Fix:** Publish docs as markdown or HTML. Add an `llms.txt` that summarizes the key pages.

---

## 4. The Rate Limit Without Retry-After

```http
HTTP/1.1 429 Too Many Requests
Content-Type: text/html
```

No `Retry-After` header. No information about when to retry. The agent must guess.

**Fix:** Always include `Retry-After` and a structured JSON response with rate limit details.

---

## 5. The Silent Mutation

A `POST /contacts` endpoint that sends a welcome email, creates a CRM record, and charges a credit card — all documented nowhere. The agent creates a "contact" and accidentally sends three emails and bills a card.

**Fix:** Document all side effects in the endpoint description and MCP tool metadata. Use `sideEffects` and `destructive` flags.

---

## 6. The Kitchen Sink Endpoint

One endpoint that does five different things depending on which parameters you send. `/api/do?action=create&target=contact&also_send_email=true&format=full` — this forces the agent to understand a single endpoint's undocumented branching logic.

**Fix:** One action, one endpoint. `create_contact`, `update_contact`, `delete_contact` — not `/api/do`.

---

## 7. The 100 Tools With No Categories

An MCP server that dumps 100 tools in a flat list with no organization. The agent has to read all 100 descriptions to find the one it needs.

**Fix:** Group tools into logical categories. Use consistent `verb_noun` naming. Provide a summary at the top of your `llms.txt`.

---

## 8. The Pretty Website, Useless API

Beautiful landing page with animations, testimonials, and pricing cards. But the API docs are a single Swagger page from 2019 with half the endpoints missing.

**Fix:** Invest equally in API docs and visual design. The API IS the agent's UI.

---

## 9. The JavaScript-Only Site

Everything renders client-side. The HTML returned by the server is a blank `<div id="root">`. An agent fetching the page gets nothing.

**Fix:** Server-side rendering for key content, or at minimum a comprehensive `llms.txt` that describes capabilities.

---

## 10. The Authentication Maze

To get an API key: sign up → verify email → fill out a developer application → wait for approval → create a project → generate a key → copy the key → configure environments. Each step requires a browser.

**Fix:** Support device authorization flow, self-service API keys, or agent-native auth via `auth.md`.

---

## 11. The Global API Key

One API key that does everything. No scopes. No expiration. No way to attribute actions to specific agents or users. When it leaks, it's game over for the entire account.

**Fix:** Scoped, time-limited tokens. Progressive permissions. Audit trails per token.

---

## 12. The CAPTCHA on the API

CAPTCHAs on API endpoints designed to block bots. They block agents by definition. If you need rate limiting, use rate limiting.

**Fix:** Remove CAPTCHAs from API endpoints. Use rate limits, IP allowlisting, or authenticated request quotas instead.

---

## 13. The Flat Error Code

```json
{ "error": "invalid_request" }
```

Which field was invalid? What should the agent do? This tells the agent nothing useful.

**Fix:** `{ "error": { "type": "validation_error", "code": "EMAIL_REQUIRED", "field": "email", "message": "Email is required", "fix": "Add a valid email address to the request body" }}`

---

## 14. The Mystery Status Code

`200 OK` for errors. `200 OK` for partial failures. `200 OK` for everything. The agent can't tell if the operation succeeded.

**Fix:** Use proper HTTP status codes. `201` for creation, `400` for validation errors, `409` for conflicts, `429` for rate limits, `500` for server errors. Always.

---

## 15. The Undocumented Pagination

```json
{ "results": [...50 items...] }
```

Is there a next page? How does the agent get it? No `has_more`, no `next_cursor`, no `Link` header. The agent doesn't know if it has all the data.

**Fix:** Always include pagination metadata: `{ "data": [...], "meta": { "has_more": true, "next_cursor": "abc123" }}`

---

## 16. The Vanishing State

The agent creates a record, but the ID wasn't in the response. Or the agent starts a workflow, but there's no way to check its status. Or the agent performs an action, but there's no way to undo it.

**Fix:** Every creation returns the created resource with its ID. Every workflow returns a status URL. Every mutation includes undo information.

---

## 17. The Inconsistent Naming

`GET /contacts` returns `{ "contacts": [...] }` but `GET /deals` returns `{ "data": [...] }`. Field names alternate between `snake_case` and `camelCase`. The same field is called `id` in one endpoint and `contact_id` in another.

**Fix:** Establish and enforce naming conventions. Use the same envelope structure for all responses. Be consistent.

---

## 18. The Monolithic Response

A `GET /contact/123` that returns 200 fields, including nested objects with 50 fields each. The agent asked for a name and email; it got the contact's entire life story plus 30 related records.

**Fix:** Support field selection: `GET /contacts/123?fields=name,email`. Return summaries by default with links to expanded resources.

---

## 19. The Undocumented Side Effect

The docs say `POST /deals` creates a deal. What they don't mention: it also sends an email to the deal owner, creates a forecast entry, and triggers a Slack notification. Transparent to humans (they see the notifications). Invisible to agents.

**Fix:** Document all side effects in the endpoint/tool description. Better: make side effects explicit in the action definition.

---

## 20. The Forced Browser Flow

"Click here to view your invoice." "Download your report at this link." "Accept the terms by visiting this page." Every time an agent needs a human to click through a browser, it's a hand-off that breaks autonomy.

**Fix:** Provide API equivalents for every browser action. `GET /invoices/123/pdf` instead of "click to download." `POST /terms/accept` instead of "visit this page."

---

## 21. The Unversioned API

`https://api.example.com/contacts` — no version prefix. When you change the response format, every agent integration breaks without warning.

**Fix:** Always version your API: `https://api.example.com/v1/contacts`. Use header-based versioning for minor changes.

---

## 22. The One-True-Token

Auth returns a single token that never expires, has all permissions, and can't be scoped or rotated. When it leaks, you revoke everything.

**Fix:** Short-lived tokens with refresh tokens. Scoped access. Per-agent attribution.

---

## 23. The "Contact Support" Error

```json
{ "error": "Please contact support for assistance" }
```

Agents can't open support tickets (usually). And even if they could, the relevant information about what went wrong is lost.

**Fix:** Include the error details in the response. If a human needs to get involved, provide a structured handoff: `{ "error": { "type": "account_locked", "action": "contact_support", "support_url": "https://...", "reference": "INC-12345" }}`

---

## 24. The Inconsistently Nested Resource

`GET /contacts/123` works but `GET /contacts/123/deals` returns 404. Some contacts have nested deals, some don't, and there's no pattern.

**Fix:** Consistent resource nesting. Document which sub-resources exist. Use links: `{ "contact": { "id": "123", "_links": { "deals": "/contacts/123/deals" }}}`

---

## 25. The Human-Only Design Review

Design review processes that only consider human users. No accessibility review for agents. No testing of API responses in agent-like conditions. No `llms.txt` in the design checklist.

**Fix:** Add agent experience to your design review checklist. Test with an actual agent before shipping.

---

## The Meta Anti-Pattern

The most common anti-pattern of all: **not thinking about agents at all.** Most agent experience failures happen because no one considered agents as a user persona during design, development, or testing.

The fix isn't technical. It's cultural: add "can an agent use this?" to every design review, every sprint demo, and every retrospective.

→ **[Agent Readiness Checklist](08-checklist)**