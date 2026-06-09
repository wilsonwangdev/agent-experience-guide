---
stage: reference
title: "References"
key_concepts: [standards, specifications, articles, protocols, community]
lang: en
zh_title: "参考资料"
---

# References

Curated links, standards, and further reading for agent experience design.

## Standards & Specifications

| Resource | URL | Description |
|----------|-----|-------------|
| AX Design Standard | [axd.md](https://axd.md/) | 12 principles, 15 primitives, anti-patterns, scoring |
| MCP Specification | [modelcontextprotocol.io](https://modelcontextprotocol.io/) | Model Context Protocol for connecting agents to tools |
| A2A Protocol | [github.com/google/A2A](https://github.com/google/A2A) | Agent-to-Agent communication protocol |
| auth.md | [workos.com/auth-md](https://workos.com/auth-md) | Agent authentication protocol |
| llms.txt | [llmstxt.org](https://llmstxt.org/) | Standard for AI-friendly site descriptions |
| agents.json | [agents.json](https://agents.json/) | Agent capability registry format |
| AgentReady Standard | [agentready.org](https://agentready.org/) | Open standard for agent readiness |
| OpenAPI 3.1 | [spec.openapis.org](https://spec.openapis.org/oas/v3.1.0) | API description specification |
| RFC 8414 | [tools.ietf.org](https://datatracker.ietf.org/doc/html/rfc8414) | OAuth Authorization Server Metadata |
| RFC 9427 | [tools.ietf.org](https://datatracker.ietf.org/doc/html/rfc9427) | structured suffixes for API versioning |
| RFC 9421 | [tools.ietf.org](https://datatracker.ietf.org/doc/html/rfc9421) | HTTP Message Signatures (Web Bot Auth) |
| x402 Payment Protocol | [x402.org](https://x402.org/) | HTTP 402 Payment Required protocol for agents |

## Assessment & Scoring

| Resource | URL | Description |
|----------|-----|-------------|
| ora.ai | [ora.ai](https://ora.ai/) | Agent readiness scoring and ranking (11,000+ sites) |
| ora.ai Methodology | [ora.ai/methodology](https://ora.ai/methodology) | How ora scores across 5 layers and 110 checks |
| AX Scoring Rubric | [github.com/souls-zip/ax](https://github.com/souls-zip/ax/blob/main/content/metrics.md) | Score any site across 15 primitives (0-30 scale) |

## Key Articles & Talks

### Foundational
- Matt Biilmann, "Introducing AX" (Jan 2025) — The original AX formulation: [biilmann.blog/articles/introducing-ax](https://biilmann.blog/articles/introducing-ax/)
- Matt Biilmann, "One Year of AX" (Jan 2026) — Reflections on the first year: [biilmann.blog/articles/one-year-of-ax](https://biilmann.blog/articles/one-year-of-ax/)
- Sean Roberts, "AX: The Next Evolution in UX" (Mar 2025) — [agentexperience.ax/all/ax-the-next-evolution-in-ux](https://agentexperience.ax/all/ax-the-next-evolution-in-ux)
- Zeno Rocha, "What is AX and How to Improve It" (Feb 2025) — [resend.com/blog/agent-experience](https://resend.com/blog/agent-experience)

### Agent-Native Architecture
- Builder.io, "Agent-Native: The Next Architecture for Software" (May 2026) — [builder.io/blog/agent-native-architecture](https://www.builder.io/blog/agent-native-architecture)
- Every, "Agent-Native Architectures" — [every.to/guides/agent-native](https://every.to/guides/agent-native)
- Microsoft Design, "UX Design for Agents" — [microsoft.design/articles/ux-design-for-agents](https://microsoft.design/articles/ux-design-for-agents/)

### Auth & Identity
- WorkOS, "auth.md: Agent Auth is the Last Mile" (May 2026) — [workos.com/auth-md](https://workos.com/auth-md)
- ora.ai, "Agent auth is the last mile, and auth.md is the first real path through it" — [ora.ai/blog/deep-scan-v1-2](https://ora.ai/blog/deep-scan-v1-2)
- Descope, "Securing Your APIs with Progressive Scoping" — [descope.com/blog/post/progressive-scoping](https://www.descope.com/blog/post/progressive-scoping)

### Industry Reports
- ora.ai, "The State of Agent Readiness" (Apr 2026) — [ora.ai/blog/state-of-agent-readiness-2026](https://ora.ai/blog/state-of-agent-readiness-2026)
- Stytch, "The Age of Agent Experience" (Feb 2025) — [stytch.com/blog/the-age-of-agent-experience](https://stytch.com/blog/the-age-of-agent-experience/)

## Community & Discussion

| Resource | URL |
|----------|-----|
| AX Community Discussions | [github.com/orgs/agentexperience/discussions](https://github.com/orgs/agentexperience/discussions) |
| AX Standard (Open Source) | [github.com/souls-zip/ax](https://github.com/souls-zip/ax) |
| MCP Community | [modelcontextprotocol.io/community](https://modelcontextprotocol.io/community) |

## Comparison of Agent Protocols

| Protocol | What it solves | Direction | Status |
|----------|---------------|-----------|--------|
| MCP | Agent ↔ Tool | Agent calls tools on a service | Adopted by Anthropic, OpenAI, others |
| A2A | Agent ↔ Agent | Agents delegate tasks to other agents | Proposed by Google |
| x402 | Agent ↔ Payment | Agents pay for API access | Adopted by Coinbase, AWS Bedrock |
| auth.md | Agent ↔ Auth | Agents authenticate on behalf of users | Proposed by WorkOS |
| agents.json | Agent ↔ Discovery | Agents discover service capabilities | Proposed |
| llms.txt | Agent ↔ Context | Agents understand what a service does | Widely adopted |
| Arazzo | Agent ↔ Workflow | Agents execute multi-step API workflows | OpenAPI Initiative standard |

## Books & Longer Reads

- OpenAI, "A Practical Guide to Building Agents" — [openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/)
- Anthropic, "Building Effective AI Agents: Architecture Patterns and Implementation Frameworks" — [resources.anthropic.com](https://resources.anthropic.com/hubfs/Building%20Effective%20AI%20Agents-%20Architecture%20Patterns%20and%20Implementation%20Frameworks.pdf)
- Mockplus, "The Ultimate Guide to Agent Experience Design in 2025" — [mockplus.com/blog/post/ultimate-guide-to-agent-experience-design](https://www.mockplus.com/blog/post/ultimate-guide-to-agent-experience-design)

---

→ **[Back to Checklist](08-checklist)** | **[Back to Introduction](00-what-is-ax)**