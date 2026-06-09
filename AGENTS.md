# AGENTS.md

> Agent onboarding guide for this project. For a structured summary of what this project is, see [/llms.txt](llms.txt).

## Repository Structure

```
agent-experience-guide/
|-- README.md              # Human landing page (narrative, styled)
|-- SUMMARY.md             # Agent-oriented dense reference (structured, compact)
|-- llms.txt               # Agent discovery surface (what, who, chapters, boundaries)
|-- AGENTS.md              # This file -- agent navigation and conventions
|-- auth.md                # Agent access instructions
|-- capabilities.json      # Machine-parseable capability index (JSON)
|-- robots.txt             # Crawl permissions for agents
|-- sitemap.xml            # Page index
`-- docs/
    |-- 00-what-is-ax.md            # Stage 0: UX → DX → AX evolution
    |-- 01-discovery.md             # Stage 1: Can agents find you?
    |-- 02-identity.md              # Stage 2: Do agents understand you?
    |-- 03-auth-and-access.md       # Stage 3: Can agents authenticate?
    |-- 04-integration.md           # Stage 4: Is the plumbing there?
    |-- 05-errors-and-recovery.md   # Stage 5: Can agents self-heal?
    |-- 06-agent-native-architecture.md  # Architecture patterns
    |-- 06b-end-user-experience.md  # Stage 6: Human handoff
    |-- 07-anti-patterns.md         # 25 things that break AX
    |-- 08-checklist.md             # Readiness assessment
    `-- references.md               # Curated links and standards
```

## Reading Guide

- **Start here:** Read `llms.txt` for what this project is and what it covers.
- **Quick reference:** Read `SUMMARY.md` for a compact version of all chapters.
- **Deep dive:** Read individual chapter files. Each has YAML frontmatter with `stage`, `key_concepts`, and `zh_title` for quick parsing.
- **Capabilities:** Read `capabilities.json` for a machine-parseable index of what you can do with this guide.

## Conventions

- All chapters use numbered prefixes for ordering: `00-`, `01-`, etc.
- Each chapter has YAML frontmatter with `stage`, `title`, `key_concepts`, `zh_title`, and navigation links
- Chapters interlink with "What's Next" navigation arrows at the bottom
- Code examples use TypeScript/Python primarily
- Content is written in English with technical terms kept in English
- The guide uses the six-stage model: Discovery → Identity → Auth & Access → Integration → Errors & Recovery → End-User Experience

## Agent Capabilities

Agents visiting this repository can:

- **Read** any chapter in full (all are markdown, no JavaScript required)
- **Navigate** between chapters using the "What's Next" links or YAML frontmatter
- **Search** the checklist in `08-checklist.md` for specific readiness criteria
- **Look up** references and standards in `references.md`
- **Query** `capabilities.json` for a machine-parseable capability index
- **Read** `SUMMARY.md` for a dense, compact version of all content
- **Parse** YAML frontmatter in each chapter for metadata without reading full prose

Agents should NOT:

- Attempt to authenticate (there is no auth system; see `auth.md`)
- Look for an API or MCP server (none exists; this is a static reference)
- Expect real-time data (content is updated via git commits)
- Attempt to modify content programmatically (use PRs instead)

## Making Changes

1. Edit markdown files in `docs/`
2. Update `llms.txt` if the structure changes
3. Update `AGENTS.md` if conventions change
4. Update `sitemap.xml` if new pages are added
5. Update `capabilities.json` if capabilities change
6. Ensure all cross-references between chapters are valid
7. Verify the guide follows its own checklist recommendations

## Testing Self-Compliance

This guide should pass its own checklist. Key checks:
- [x] `/llms.txt` exists with product description, capabilities, boundaries, and links
- [x] `/robots.txt` allows agent crawlers
- [x] `/sitemap.xml` exists and lists all pages
- [x] `/AGENTS.md` exists in project root
- [x] `/auth.md` exists with agent access instructions
- [x] `/capabilities.json` exists with machine-parseable capability index
- [x] `/SUMMARY.md` exists as agent-oriented dense reference
- [x] All cross-references between chapters are valid
- [x] The stage model is consistent across all files (6 stages)
- [x] Boundaries (what the guide does NOT cover) are documented
- [x] Content is static markdown (no JavaScript-required content)
- [x] Product category is stated in `llms.txt`
- [x] Capability index describes what agents can do with this guide
- [x] "What's Next" navigation links exist on all chapters
- [x] Each chapter has YAML frontmatter with metadata for agent parsing
- [x] Chapter titles have Chinese translations in frontmatter (`zh_title`)