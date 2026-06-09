---
stage: 2
title: "Identity: Do Agents Understand What You Do?"
key_concepts: [llms.txt, capability index, metadata consistency, boundaries, agents.json, pricing transparency]
practical_steps: 6
anti_patterns: 0
prev: "01-discovery"
next: "03-auth-and-access"
lang: en
zh_title: "身份标识：智能体能否理解你的产品？"
---

# Identity: Do Agents Understand What You Do?

Discovery gets agents to your site. Identity determines whether they understand what they found.

After an agent lands on your domain, it builds a mental model: what is this product, who is it for, and what can it do here? If your site's structure is weak, the agent hallucinates — it fills gaps with guesses, recommends you for the wrong use cases, or describes your product inaccurately.

Weak identity doesn't just confuse agents. It causes real downstream damage: wrong recommendations in answer engines, misattributed capabilities, and lost users who were sent to you for the wrong reasons.

## The Problem

Most websites are built for human visual consumption. They have:
- Animated hero sections with aspirational messaging
- JavaScript-rendered content that requires running code to read
- Vague product descriptions ("empowering teams to achieve more")
- Pricing hidden behind "Contact Sales" buttons
- Capability documentation scattered across blogs, changelogs, and outdated wiki pages

A human can piece this together. An agent has to guess.

## What Agents Need to Understand You

### 1. Foundation Surfaces: The Minimum Viable Identity

Your site should provide at least these machine-readable foundation surfaces:

**Clear, structured product description** — At the top of `llms.txt`, on your homepage, or in JSON-LD, state plainly: what is this product, what category does it belong to, and who is it for?

```
# AcmeCRM

> A lightweight CRM for small teams. Manage contacts, track deals, and automate follow-ups.

## Categories
- Customer Relationship Management
- Sales Automation
- Small Business Tools
```

**Pricing transparency** — Agents need to know if your product is free, freemium, or paid. Vague "Contact Sales" pages create dead ends.

```json
{
  "@type": "OfferCatalog",
  "offers": [
    { "name": "Free", "price": "0", "description": "Up to 100 contacts, 1 user" },
    { "name": "Pro", "price": "29", "priceCurrency": "USD", "description": "Unlimited contacts, 5 users, API access" }
  ]
}
```

**API documentation that's actually reachable** — Your OpenAPI/Swagger spec should be at a predictable URL. The best location is `/.well-known/openapi.json` or linked from `llms.txt`.

### 2. Metadata Consistency

Agent identity breaks when different surfaces contradict each other.

Common inconsistencies:
- Homepage says "CRM" but docs say "project management tool"
- Pricing page shows $29/mo but metadata says "Free"
- `llms.txt` links to `docs/` but the real API docs are at `developers/v2/`
- JSON-LD says "SoftwareApplication" with category "Finance" but you're actually in marketing tech

Consistency matters because agents don't have the human ability to resolve contradictions. If three sources say different things, an agent picks one — maybe the wrong one.

### 3. Capability Indexes

Don't make agents crawl 47 pages of API documentation to figure out what they can do. Provide a capability index — a structured list of what actions your service exposes.

```markdown
## Capabilities

### Contacts
- List contacts (GET /contacts)
- Search contacts (GET /contacts?q={query})
- Create contact (POST /contacts)
- Update contact (PATCH /contacts/{id})
- Delete contact (DELETE /contacts/{id}) — requires destructive scope

### Deals
- List deals (GET /deals)
- Create deal (POST /deals)
- Update deal stage (PATCH /deals/{id}/stage)
- Close deal (POST /deals/{id}/close) — requires confirmation scope
```

This is the agent equivalent of a site map for *actions*, not just *pages*.

### 4. Clear Scoping and Boundaries

Agents need to know what they *can't* do just as much as what they can. Explicit boundaries prevent:
- Agents trying actions that don't exist
- Agents escalating to dangerous operations without recognizing them
- Agents interpreting partial access as full access

Make your scope boundaries explicit:

```markdown
## What this service does NOT do
- No batch deletion of contacts (must delete one at a time)
- No email sending through the API (use the integration partner)
- No real-time sync (changes propagate within 5 minutes)
```

### 5. Agents.json / Agent Skills Manifest

The emerging `agents.json` standard and agent skills manifests let you declare your capabilities in a structured, machine-readable format:

```json
{
  "name": "AcmeCRM",
  "description": "Lightweight CRM for small teams",
  "capabilities": [
    {
      "name": "search_contacts",
      "description": "Search contacts by name, email, or company",
      "parameters": {
        "type": "object",
        "properties": {
          "query": { "type": "string", "description": "Search term" },
          "limit": { "type": "integer", "description": "Max results", "default": 20 }
        },
        "required": ["query"]
      }
    }
  ],
  "authentication": {
    "type": "oauth2",
    "authorization_url": "https://acme.crm/auth",
    "scopes": ["read", "write", "admin"]
  }
}
```

## Metadata That Matters

| Surface | Format | Location | Purpose |
|---------|--------|----------|---------|
| Product summary | Markdown | `/llms.txt` | What is this? Who is it for? |
| Structured data | JSON-LD | HTML `<head>` | Category, pricing, feature list |
| API definition | OpenAPI 3.x | `/.well-known/openapi.json` | Endpoints, parameters, responses |
| Capability index | Markdown / JSON | `/llms.txt` or `/agents.json` | What can agents do here? |
| Auth instructions | Markdown | `/llms.txt` or `/auth.md` | How to authenticate |
| Sitemap | XML | `/sitemap.xml` | What pages exist |

## Practical Steps

1. **Write a clear, factual product description** — No hype. What does it do, for whom, in plain language.
2. **Ensure `llms.txt` matches your actual product** — Test it by asking an LLM what your product does after reading only your `llms.txt`.
3. **Publish pricing details** — Even approximate tiers help agents understand eligibility.
4. **Create a capability index** — List every action an agent can take, with scope requirements.
5. **Validate metadata consistency** — Your homepage, `llms.txt`, JSON-LD, and OpenAPI spec should all agree.
6. **Document boundaries explicitly** — What agents *can't* do is as important as what they can.

## Measuring Identity

Ask yourself:

- [ ] Can an LLM accurately describe my product after reading only my `llms.txt`?
- [ ] Is my product category consistent across all metadata surfaces?
- [ ] Is my pricing machine-readable (not just "Contact Sales")?
- [ ] Is my OpenAPI spec both reachable and accurate?
- [ ] Does my capability index clearly distinguish read vs. write vs. destructive actions?
- [ ] Would a new agent, encountering my site for the first time, know what to recommend me for?

## What's Next

Now agents can find you and understand you. But can they *use* you?

→ **[Auth & Access: Can Agents Authenticate and Act?](03-auth-and-access)**