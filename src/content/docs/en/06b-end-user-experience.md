---
stage: 6
title: "End-User Experience: Can Humans Interact Through Agents?"
key_concepts: [handoff flows, MCP Apps, activity transparency, resumable workflows, context transfer, brand consistency]
practical_steps: 6
anti_patterns: 0
prev: "06-agent-native-architecture"
next: "07-anti-patterns"
lang: en
zh_title: "终端用户体验：人类能否通过智能体交互？"
---

# Agent Experience Guide — End-User Experience

> Can humans interact with your service *through* agents?

The previous stages focus on the agent's journey: finding you, understanding you, authenticating, integrating, and recovering from errors. But agents don't exist in isolation. They act on behalf of humans, and at critical moments — payments, confirmations, visual decisions — the agent must hand control back to a person.

If that handoff is broken, the entire loop collapses. The agent did 90% of the work, but the last 10% — the part a human needs to see, verify, or approve — fails silently or produces a poor experience.

End-User Experience (EUX) is about making that handoff seamless. It's the final stage of agent readiness, and the one most often overlooked.

## The Problem

When agents reach a human-required step, things break in predictable ways:

- **The agent sends a raw URL** that opens a desktop login page on mobile, with tiny text and no context about what the agent was doing.
- **The confirmation flow requires re-authentication** even though the agent already authenticated on the user's behalf.
- **The handoff has no context** — the user sees "Confirm your action" without knowing what action, why, or what the agent already did.
- **The user can't see what the agent did** — there's no activity log, no dashboard, no way to review the agent's work before approving.
- **The agent can't resume** — after the human completes the handoff, the agent has lost all context and must start over.

## Principles of Agent-Human Handoff

### 1. Context Transfer, Not Just Control Transfer

When an agent hands off to a human, the human should see everything the agent was doing, why, and what's needed. This isn't just a URL redirect — it's a context transfer.

**Bad handoff:**
```
Agent: "I need you to confirm. Visit https://app.example.com/confirm"
```

**Good handoff:**
```
Agent: "I've drafted an offer for $45,000 to Acme Corp. 
The deal includes 12-month licensing with premium support.
To approve, visit: https://app.example.com/confirm/deal_abc123
This link includes your context and expires in 15 minutes."
```

The URL contains a session token, the context of what's being confirmed, and a time window.

### 2. Rendered UIs in Conversation (MCP Apps)

The emerging standard for agent-to-human handoff is **MCP Apps** — the ability for agents to render interactive UIs directly inside the conversation, rather than sending users to external pages.

MCP Apps let an agent present:
- **Forms** for user confirmation with prefilled data
- **Dashboards** showing the current state before a decision
- **Approval workflows** where the user clicks "Confirm" or "Reject" inline
- **Rich previews** of what the agent is about to do

This is done through `ui://` resources and `_meta.ui` tool metadata in MCP, or through the OpenAI Apps SDK:

```json
{
  "name": "approve_deal",
  "description": "Approve a deal with embedded confirmation UI",
  "meta": {
    "ui": {
      "type": "form",
      "title": "Approve Deal",
      "fields": [
        { "name": "amount", "label": "Deal Amount", "type": "currency", "value": 45000 },
        { "name": "company", "label": "Company", "type": "text", "value": "Acme Corp" }
      ],
      "actions": [
        { "label": "Approve", "type": "submit" },
        { "label": "Reject", "type": "cancel" }
      ]
    }
  }
}
```

### 3. Activity Transparency

Users should be able to see what their agents have been doing. This means:

- **Activity logs** — Every action the agent took, with timestamps and outcomes
- **State snapshots** — What the agent was working on when it handed off
- **Audit trails** — Who authorized what, when, and on whose behalf
- **Undo capability** — The ability to reverse agent actions within a time window

```json
{
  "agent_actions": [
    { "action": "search_contacts", "params": {"query": "acme"}, "result": "3 contacts found", "timestamp": "2025-01-15T10:00:00Z" },
    { "action": "create_deal", "params": {"name": "Acme Enterprise", "value": 45000}, "result": "deal_abc123 created", "timestamp": "2025-01-15T10:00:05Z" },
    { "action": "approve_deal", "params": {"deal_id": "deal_abc123"}, "result": "AWAITING_USER_CONFIRMATION", "timestamp": "2025-01-15T10:00:06Z" }
  ],
  "handoff_context": {
    "summary": "Agent created deal #deal_abc123 for Acme Corp ($45,000). Awaiting your approval.",
    "confirm_url": "https://app.example.com/confirm/deal_abc123?token=xyz",
    "expires_at": "2025-01-15T10:15:06Z"
  }
}
```

### 4. Resumable Workflows

After the human completes a handoff step, the agent should be able to resume from where it left off — not start over.

This requires:
- **Workflow state persistence** — The agent's working context is saved, not just in memory
- **Session resumption** — The agent can pick up a workflow after a human interruption
- **Notification mechanisms** — The agent is notified when the human completes their part
- **Graceful timeout handling** — If the human doesn't respond in time, the agent can retry or cancel cleanly

### 5. Brand Consistency in Handoffs

When an agent hands off to a human, the experience should feel like it belongs to the same product:

- **Visual consistency** — Confirmation pages match the product's design language
- **Context preservation** — The user sees what the agent was doing, not a generic "confirm your action" page
- **Return paths** — After confirming, the user can see the result and optionally return to the agent conversation
- **Mobile-responsive** — Many handoffs happen on mobile; pages must work on small screens

## Practical Steps

1. **Design handoff flows** for every action that requires human confirmation (1-2 weeks)
2. **Implement MCP App metadata** for confirmation tools (2-3 days per tool)
3. **Add activity logging** for all agent-performed actions (1-2 weeks)
4. **Build resumable workflows** with state persistence (1-2 weeks)
5. **Create handoff pages** that include agent context, not just bare confirmation forms (1 week)
6. **Test on mobile** — Most handoffs happen when a notification reaches a user on their phone (2-3 days)

## Measuring End-User Experience

- [ ] Every action requiring human confirmation has a clear, contextual handoff flow
- [ ] Handoff URLs include context tokens with expiration
- [ ] Confirmation pages show what the agent was doing and why
- [ ] User can review agent activity before confirming
- [ ] Agent can resume workflow after human confirmation
- [ ] Agent activity is logged and auditable
- [ ] Destructive actions have undo capability within a time window
- [ ] MCP Apps or equivalent UI resources are available for inline confirmation
- [ ] Handoff pages are mobile-responsive
- [ ] After confirmation, user can see the result and return to the agent

## What's Next

This completes the six stages of agent readiness. The remaining chapters cover advanced patterns and a practical assessment.

→ **[Anti-Patterns: What Breaks Agent Experience](07-anti-patterns)**