# Agent Experience Guide

> How to make your service, application, or tool great for AI agents.

**English** | [中文](README.zh.md)

The web was built for humans. Every button, form, and navigation menu assumes a person with eyes and hands. But the fastest-growing user base isn't human — it's AI agents. **Every website already has an agent experience. The question is whether it's good or bad.**

Just as UX taught us to design for users, and DX taught us to design for developers, **AX (Agent Experience)** is the discipline of designing for agents. This guide is a practical, open-source handbook on how to do it well.

## Why This Guide Exists

- **ora.ai** tells you *where you stand* — it scores and ranks agent readiness across thousands of sites.
- **axd.md** tells you *what to aim for* — it defines 12 principles and 15 primitives of agent experience design.
- **agentexperience.ax** curates *conversations and articles* about the AX movement.

**This guide** tells you *how to get there* — concrete, actionable steps with code examples, patterns, and anti-patterns for making your service agent-ready.

## The Agent Journey

An agent trying to use your product follows a journey with six stages. Your job is to optimize each one:

```
Discovery → Identity → Auth & Access → Integration → Errors & Recovery → End-User Experience
```

If an agent can't find you, nothing else matters. If it can find you but can't understand what you do, it picks someone else. If it understands but can't authenticate, it's stuck. If it can authenticate but the plumbing is broken, tasks fail silently. If the plumbing works but errors aren't recoverable, the agent gives up. If all the plumbing works but the final handoff to the human is broken, the whole loop collapses.

This guide walks through each stage in detail.

## Contents

### Foundations

1. [What is Agent Experience?](docs/00-what-is-ax.md) — Why AX matters, the UX → DX → AX evolution, and how to think about agents as a user persona.

### The Six Stages

2. [Discovery](docs/01-discovery.md) — Can agents find you? llms.txt, robots.txt, sitemap, AEO/GEO, structured data.
3. [Identity](docs/02-identity.md) — Do agents understand what you do? Machine-readable descriptions, metadata, pricing, capabilities.
4. [Auth & Access](docs/03-auth-and-access.md) — Can agents authenticate and act? OAuth, API keys, auth.md, scoped tokens, x402.
5. [Integration](docs/04-integration.md) — Is the plumbing there? MCP, A2A, streaming, SDKs, function calling, webhooks.
6. [Errors & Recovery](docs/05-errors-and-recovery.md) — Can agents self-heal? Typed errors, retry guidance, structured responses.

### Architecture & Practice

7. [Agent-Native Architecture](docs/06-agent-native-architecture.md) — Shared action models, agent UI parity, governed execution, cloneable apps.
8. [End-User Experience](docs/06b-end-user-experience.md) — Can humans interact through agents? Handoff flows, MCP Apps, activity transparency.
9. [Anti-Patterns](docs/07-anti-patterns.md) — 25+ things that break agent experience on the web.
10. [Agent Readiness Checklist](docs/08-checklist.md) — A practical checklist to evaluate and improve your agent experience score.

### Reference

- [References](docs/references.md) — Curated links, standards, and further reading.

## Quick Start: 3 Things You Can Do Today

1. **Add `/llms.txt`** to your site root describing what your site does and what agents can do there.
2. **Return typed errors** with retry guidance from every API endpoint — not "something went wrong."
3. **Let agents authenticate** with scoped API tokens instead of browser-only OAuth flows.

## The AX Maturity Model

```
Level 0 — Invisible       Agents can't find or parse your site at all.
Level 1 — Discoverable    Agents can find you and understand what you do.
Level 2 — Accessible      Agents can authenticate and make basic API calls.
Level 3 — Integrated      Agents can use your tools, stream responses, recover from errors.
Level 4 — Agent-Ready     Agents can complete full workflows with human handoff.
Level 5 — Agent-Native    Agents and humans share the same action model, state, and permissions.
```

Most of the web sits at Level 0 or 1 today. This guide helps you move up.

## Contributing

This is an open project. PRs, issues, and discussions are welcome. The goal is to build the most comprehensive, actionable guide for agent experience — together.

## License

MIT

## Acknowledgments

This guide draws on ideas and work from many sources including:
- [AX Design Standard](https://axd.md/) — 12 principles and 15 primitives of agent experience design
- [ora.ai](https://ora.ai/) — Agent readiness scoring and ranking
- [Agent Experience Community](https://agentexperience.ax/) — AX movement and articles
- [Netlify](https://www.netlify.com/) — Matt Biilmann's original AX formulation
- [Builder.io](https://www.builder.io/blog/agent-native-architecture) — Agent-native architecture patterns
- [WorkOS auth.md](https://workos.com/auth-md) — Agent authentication protocol