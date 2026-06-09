---
stage: 0
title: "What is Agent Experience (AX)?"
key_concepts: [UX, DX, AX, agent journey, maturity model]
practical_steps: 0
anti_patterns: 0
next: "01-discovery"
lang: en
zh_title: "什么是智能体体验（AX）？"
---

# What is Agent Experience (AX)?

## The Evolution: UX → DX → AX

Design disciplines emerge when a new type of user arrives.

In the 1980s–2000s, **User Experience (UX)** taught us to design graphical interfaces for humans. GUIs, mouse clicks, visual hierarchies, responsive layouts — all optimized for people with eyes and hands.

In the 2000s–2010s, **Developer Experience (DX)** taught us to design tools for developers. APIs, documentation, CLIs, SDKs, error messages, developer portals — all optimized for people who write code and integrate systems.

Now, in the 2020s, **Agent Experience (AX)** is the discipline of designing for AI agents — software that browses sites, calls APIs, reads docs, and completes tasks on behalf of people.

```
UX:  Human ↔ GUI           (Visual interaction)
DX:  Developer ↔ API/CLI   (Programmatic interaction)
AX:  Agent ↔ Service/Tool  (Autonomous interaction)
```

## Agents Are Users

The single most important mindset shift: **agents are a user persona**, not a hack or an edge case.

When you design for accessibility, you consider screen readers, keyboard navigation, and contrast ratios. You don't build a "separate accessible version" — you build the same site better.

When you design for agents, the principle is identical. You don't build a separate "agent version" of your service. You build the same service so that both humans and agents can use it. The improvements often benefit everyone: structured data helps search engines, typed errors help debugging, and clear API boundaries help integrators.

## Why AX Matters Now

Three converging trends make AX urgent:

### 1. Agents are the fastest-growing user base

ChatGPT, Claude, Gemini, Copilot, and hundreds of specialized agents are already browsing the web, calling APIs, and completing tasks. An agent from a major platform visits your site whether you designed for it or not.

### 2. Agent-unfriendly services get routed around

When an agent can't find your product, understand it, authenticate, or use it, it simply picks a competitor that works. There's no loyalty, no second chance. Theora.ai data shows that 73% of scanned products still grade D or F on agent readiness. The median score is 35/100.

### 3. The gap between "can read" and "can act" is widening

Agents can already crawl and read most of the web. ChatGPT-User reaches 81% of sites. ClaudeBot reaches 82%. But the moment an agent tries to *do something* — authenticate, call an API, complete a workflow — the numbers collapse. OAuth metadata sits at 1%. Spec-compliant MCP with PKCE sits at 1%. **Agents can read. They can't act.**

## How to Think About Agent Experience

AX is not about building chatbots. It's not about adding an AI feature to your product. It's about making your service's capabilities accessible, understandable, and usable by autonomous agents — the same way you'd make them accessible to developers via APIs or to users via GUIs.

The key dimensions:

| Dimension | UX | DX | AX |
|-----------|----|----|-----|
| **Primary user** | Human (visual) | Developer (code) | Agent (autonomous) |
| **Interface** | GUI, buttons, forms | API docs, SDKs, CLI | llms.txt, MCP, structured responses |
| **Onboarding** | Sign up, tutorial | Docs, quickstart, sandbox | Self-serve auth, capability discovery |
| **Error handling** | Toast messages, tooltips | Error codes, stack traces | Typed errors, retry guidance, machine-readable status |
| **Navigation** | Menus, links, breadcrumbs | API reference, sitemap | Sitemap, llms.txt, capability index |
| **Feedback** | Visual state changes | Response codes, logs | Structured results, progress events |
| **Trust** | Brand, reviews, social proof | Uptime SLA, versioning | Machine-readable provenance, scoped permissions |

## The Six Stages of Agent Readiness

An agent trying to use your product follows a journey with six stages. Each stage is a potential dead end — or an opportunity to excel.

### Stage 1: Discovery (Can agents find you?)
When an agent needs a product or service to complete a task, it searches. If agents can't find you — or have never heard of you — they pick someone else.

### Stage 2: Identity (Do agents understand what you do?)
After landing, the agent builds a mental model: what your product is, who it's for, and when to use it. Weak structure creates hallucinated positioning and wrong recommendations.

### Stage 3: Auth & Access (Can agents authenticate and act?)
Intent becomes execution only when the agent can authenticate, request scopes, and call usable endpoints. Broken auth paths create dead ends.

### Stage 4: Integration (Have you built the plumbing?)
Now the agent tries repeated calls, tool invocation, streaming output, and error recovery. Brittle responses or missing platform primitives cause silent task failure.

### Stage 5: Errors & Recovery (Can agents self-heal?)
When things go wrong, agents need typed errors, retry guidance, and structured responses — not "something went wrong." Good error handling turns dead ends into recoverable paths.

### Stage 6: End-User Experience (Can humans interact through agents?)
When a payment, confirmation, or visual decision is needed, the agent must pass control to a person. If the handoff UX is weak, the whole loop collapses.

## The AX Maturity Model

```
Level 0 — Invisible       Agents can't find or parse your site at all.
Level 1 — Discoverable    Agents can find you and understand what you do.
Level 2 — Accessible      Agents can authenticate and make basic API calls.
Level 3 — Integrated      Agents can use your tools, stream responses, recover from errors.
Level 4 — Agent-Ready     Agents can complete full workflows with human handoff.
Level 5 — Agent-Native    Agents and humans share the same action model, state, and permissions.
```

Think of it like web accessibility standards — there are levels, and each level unlocks more capability for the user (in this case, the agent).

## What This Guide Covers

The following chapters walk through practical, actionable steps for each stage:

1. **[Discovery](01-discovery)** — Making your service findable by agents
2. **[Identity](02-identity)** — Helping agents understand your capabilities
3. **[Auth & Access](03-auth-and-access)** — Enabling agents to authenticate and act
4. **[Integration](04-integration)** — Building the plumbing (MCP, A2A, streaming, SDKs)
5. **[Errors & Recovery](05-errors-and-recovery)** — Designing for agent self-healing
6. **[Agent-Native Architecture](06-agent-native-architecture)** — Going beyond bolt-on AI
7. **[End-User Experience](06b-end-user-experience)** — Making human handoffs seamless
8. **[Anti-Patterns](07-anti-patterns)** — What breaks agent experience
9. **[Checklist](08-checklist)** — A practical readiness assessment

→ **Next: [Discovery — Can Agents Find You?](01-discovery)**