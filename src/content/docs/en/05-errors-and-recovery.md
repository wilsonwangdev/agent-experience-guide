---
stage: 5
title: "Errors & Recovery: Can Agents Self-Heal?"
key_concepts: [typed errors, retryable flag, retry-after, idempotency, structured errors, recovery guidance, MCP errors]
practical_steps: 7
anti_patterns: 0
prev: "04-integration"
next: "06-agent-native-architecture"
lang: en
zh_title: "错误与恢复：智能体能否自愈？"
---

# Errors & Recovery: Can Agents Self-Heal?

When a human hits "Something went wrong," they can try again, check a help page, or ask support. When an agent hits the same message, it's stuck. It can't see your toast notification. It can't intuit that "error 500" means "try again in 30 seconds." It can't guess that "invalid request" means "the email field was missing."

**Error handling is where most agent experiences break.** Not because errors happen — they always will — but because the error response doesn't give agents enough information to recover.

## The Problem

Typical API error responses:

```json
// What most APIs return
{ "error": "Something went wrong" }

// Slightly better but still common
{ "error": "Invalid request" }

// Better but still not enough for agents
{ "error": "Validation failed", "status": 400 }
```

None of these tell an agent:
- What specifically went wrong
- Whether retrying would help
- How long to wait before retrying
- What the correct input looks like
- What alternative actions are available

## Principles of Agent-Friendly Errors

### 1. Every Error Must Have a Type

Error types give agents a handle to grab onto. Instead of parsing free text, agents can branch on structured error codes:

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

Error type taxonomy:
- `validation_error` — Input doesn't match expectations. Fix it and retry.
- `authentication_error` — Credentials are missing, expired, or insufficient. Re-authenticate.
- `rate_limit_error` — Too many requests. Wait and retry.
- `conflict_error` — State has changed. Refresh and retry.
- `not_found_error` — Resource doesn't exist. Try a different query.
- `permission_error` — Scope insufficient. Request more permissions.
- `internal_error` — Server fault. Retry with backoff.

### 2. Every Error Must Be Retryable or Not

Agents need to know: *should I try again, or is this permanently broken?*

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

The `Retry-After` HTTP header should also be set:

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

### 3. Every Error Must Include Recovery Guidance

Instead of "something went wrong," tell the agent exactly what to do:

```json
// Bad
{ "error": "Cannot delete contact" }

// Good
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

Recovery guidance patterns:

| Error Type | Recovery Action | Example |
|-----------|----------------|---------|
| `validation_error` | Fix the input | "Add required 'email' field" |
| `authentication_error` | Re-authenticate | "Token expired. Refresh at /oauth/token" |
| `rate_limit_error` | Wait and retry | "Retry after 30 seconds" |
| `permission_error` | Request more scope | "Requires 'contacts:delete' scope" |
| `conflict_error` | Refresh and retry | "Contact was modified since last read. GET /contacts/123 for current version" |
| `not_found_error` | Try alternative | "No contact found. Try GET /contacts?q=acme to search" |

### 4. Structure Over Prose

HTML error pages are invisible to agents. JSON error responses are machine-readable. Never return HTML from an API endpoint, even for 500 errors.

```json
// Never return this from an API
<html>
  <body>
    <h1>500 Internal Server Error</h1>
    <p>Something went wrong. Please try again later.</p>
  </body>
</html>

// Always return this
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

### 5. Idempotency for Safe Retries

When agents can safely retry, they don't need to ask "did this already happen?" Make mutations idempotent:

```http
POST /api/v1/deals
Idempotency-Key: deal_2025_01_15_acme
Content-Type: application/json

{
  "name": "Acme Enterprise Deal",
  "value": 50000
}
```

If the same `Idempotency-Key` is sent again, return the original response without creating a duplicate.

### 6. Partial Success and Batch Errors

When processing multiple items, don't fail everything if some items fail:

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

### 7. Silent Mutations Are Dangerous

Every side effect must be explicit. An endpoint that sends emails, creates records, or charges money without clearly documenting it is an agent hazard:

```json
// In your OpenAPI spec / MCP tool description:
{
  "name": "close_deal",
  "description": "Close a deal in the pipeline. WARNING: This action is PERMANENT. It will: (1) send a notification email to the deal owner, (2) create an invoice in the billing system, (3) update the forecast dashboard.",
  "side_effects": ["sends_email", "creates_invoice", "updates_dashboard"],
  "destructive": false,
  "idempotent": true
}
```

## MCP Error Handling

MCP has its own error handling patterns. Use them:

```typescript
// Return a structured error, not a thrown exception
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

## Practical Steps

1. **Audit all API error responses** — Are they JSON? Do they have error types? (1-2 days)
2. **Add `retryable` and `retry_after` to all error responses** (1 day)
3. **Add recovery guidance to the top 10 most common errors** (1 day)
4. **Delete all HTML error pages from API endpoints** — Replace with JSON (1 day)
5. **Add `Idempotency-Key` support to all mutation endpoints** (2-3 days)
6. **Document side effects** in tool descriptions and API docs (1 day)
7. **Add partial success handling** to batch endpoints (1-2 days)

## Measuring Errors & Recovery

- [ ] Do all API error responses return JSON (never HTML)?
- [ ] Does every error have a structured `type` and `code`?
- [ ] Does every error indicate whether it's `retryable`?
- [ ] Do rate limit errors include `Retry-After` headers?
- [ ] Do validation errors specify which field failed and why?
- [ ] Do permission errors tell the agent which scope it needs?
- [ ] Do mutation endpoints support idempotency keys?
- [ ] Are side effects (emails, charges, notifications) documented in tool descriptions?
- [ ] Do batch endpoints return partial success with per-item error details?
- [ ] Do MCP tools return `isError: true` for errors instead of throwing?

## What's Next

Good error handling helps agents recover. But the best architecture makes errors rare by designing the service so agents and humans operate the same system.

→ **[Agent-Native Architecture](06-agent-native-architecture)**