---
stage: 1
title: "Discovery: Can Agents Find You?"
key_concepts: [llms.txt, robots.txt, sitemap, JSON-LD, AEO, A2A Agent Card, well-known paths]
practical_steps: 6
anti_patterns: 0
prev: "00-what-is-ax"
next: "02-identity"
lang: en
zh_title: "可发现性：智能体能否找到你？"
---

# Discovery: Can Agents Find You?

The first question of agent experience is the simplest: when an agent searches for a product or service like yours, does it find you?

If an agent can't find your site, nothing else matters. No API, no MCP server, no OAuth flow will help. The agent simply picks a competitor it can discover.

Discovery is the foundation of the agent journey — and it's where most of the web is actually doing okay. ChatGPT-User reaches 81% of sites, ClaudeBot reaches 82%, and Google-Extended reaches 87%. The gap is in *what happens next*.

## The Problem

Traditional SEO optimizes for humans searching on Google. Agent discovery — sometimes called **AEO (Answer Engine Optimization)** or **GEO (Generative Engine Optimization)** — optimizes for agents searching for capabilities. These are not the same.

When a human searches "best CRM for small business," they see a list of blue links and read reviews. When an agent searches for the same thing, it needs structured, machine-readable information about *what your product does, what actions it exposes, and how to use them*.

## What Agents Need to Find You

### 1. `/llms.txt` — Your Agent Homepage

The single highest-impact thing you can do today is add an `llms.txt` file to your site root.

`llms.txt` is a markdown file that gives agents a concise, structured summary of your product. It's the equivalent of a `robots.txt` for AI — but instead of rules about crawling, it provides information about understanding.

```
# YourProduct

> One-line description of what you do

## What we offer

- Core capability 1: description
- Core capability 2: description

## API

- Base URL: https://api.yourproduct.com/v1
- Auth: Bearer token
- OpenAPI spec: https://yourproduct.com/docs/openapi.json

## Agent capabilities

- Search: find items by keyword
- Create: create new records with structured data
- Update: modify existing records
- Delete: remove records (requires confirmation scope)

## Documentation

- API docs: https://yourproduct.com/docs
- Quickstart: https://yourproduct.com/docs/quickstart
```

**How to add it:** Create a plain markdown file at `https://yourdomain.com/llms.txt`. Keep it concise (under 500 lines). Focus on what agents need: capabilities, endpoints, auth, and links to structured docs.

**What it does:** When an agent (or a model powering an agent) encounters your domain, it fetches `/llms.txt` first. This gives it a concise, accurate summary of your service instead of forcing it to guess from HTML, JavaScript, and marketing copy.

### 2. `/robots.txt` — Crawl Permissions

Your `robots.txt` should explicitly allow major agent crawlers. Many sites block unknown bots by default, which means newer agents get locked out.

```
User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: *
Allow: /
Disallow: /admin/
Disallow: /internal/
```

The key insight from ora.ai's research: **sites serve the bot names they know and block the ones they don't.** OpenClaw, a newer agent, only reaches 59% of sites — 20-30 points below established crawlers. If you want agent readiness, allow agent crawlers explicitly.

### 3. Sitemap — Machine-Readable Navigation

A sitemap tells agents what pages exist. It's simple, well-established, and still not universal (only 69% of sites have one).

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourproduct.com/</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://yourproduct.com/docs</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

### 4. Structured Data (JSON-LD)

Schema.org structured data helps both search engines and agents understand what your site is, what it offers, and how to interact with it.

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "YourProduct",
  "applicationCategory": "CRM",
  "description": "Lightweight CRM for small teams",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Free tier available"
  },
  "featureList": ["Contact management", "Pipeline tracking", "Email integration"]
}
```

### 5. Well-Known URIs

Several emerging standards use well-known paths that agents can discover:

| Path | Purpose | Status |
|------|---------|--------|
| `/.well-known/ai-plugin.json` | OpenAI plugin manifest | Deployed |
| `/.well-known/openapi.json` | OpenAPI specification | Standard |
| `/.well-known/mcp` | MCP server discovery | Emerging |
| `/agents.json` | Agent capability registry | Proposed |
| `/llms.txt` | AI-friendly site description | Adopted |

### 6. A2A Agent Cards

Google's Agent-to-Agent (A2A) protocol uses Agent Cards — JSON documents that describe what an agent can do, its authentication requirements, and how to reach it.

```json
{
  "name": "CRM Agent",
  "description": "Manages customer relationships, deals, and pipelines",
  "url": "https://crm.example.com/a2a",
  "capabilities": [
    { "name": "search_contacts", "description": "Search contacts by name or email" },
    { "name": "create_deal", "description": "Create a new deal in the pipeline" }
  ],
  "authentication": {
    "schemes": ["oauth2"],
    "credentials": "https://crm.example.com/.well-known/oauth-authorization-server"
  }
}
```

## Practical Steps

Here's what to do, in priority order:

1. **Add `/llms.txt`** (30 minutes, massive impact)
2. **Update `/robots.txt`** to allow agent crawlers (15 minutes)
3. **Add a sitemap** if you don't have one (1-2 hours)
4. **Add JSON-LD structured data** to your homepage (1-2 hours)
5. **Publish OpenAPI spec** at a well-known URL (varies by API size)
6. **Consider an Agent Card** if you're building agent-to-agent interactions (half day)

## Common Mistakes

- **Blocking all bots** in robots.txt — this is the #1 reason agents can't find you
- **JavaScript-only navigation** — agents that fetch HTML can't follow JS-rendered menus
- **Marketing copy instead of capability descriptions** — agents need to know what your product *does*, not how innovative your team is
- **Missing sitemap** — without it, agents have to guess what pages exist
- **PDF documentation** — not searchable, not linkable, not parseable by agents

## Measuring Discovery

You can assess your discovery layer by asking:

- [ ] Does my site have a valid `/llms.txt`?
- [ ] Does my `robots.txt` allow major agent crawlers?
- [ ] Does my site have a valid sitemap?
- [ ] Does my homepage include JSON-LD structured data?
- [ ] Can an agent find my OpenAPI spec at a well-known path?
- [ ] If I ask an LLM "what does [my product] do?", does it answer accurately?

## What's Next

Discovery gets agents to your door. The next step is making sure they understand what they find when they arrive.

→ **[Identity: Do Agents Understand You?](02-identity)**