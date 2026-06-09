# auth.md -- Agent Access Instructions

> This file tells AI agents how to access and interact with this project.

## Access Policy

This is a **public, open-source reference guide**. No authentication is required.

- **Read access**: Fully open. All content is static markdown.
- **Write access**: Via GitHub pull requests only. No API, no database, no live editing.
- **Rate limits**: None (static content served via CDN).
- **Terms of use**: MIT License. See `LICENSE` for details.

## What Agents Can Do

| Action | Access | Notes |
|--------|--------|-------|
| Read any chapter | Open | All files are markdown, no JavaScript required |
| Navigate between chapters | Open | Follow "What's Next" links at bottom of each chapter |
| Search the checklist | Open | `08-checklist.md` has a structured readiness assessment |
| Look up references | Open | `references.md` has curated links and standards |
| Contribute changes | Pull Request | Submit via GitHub PR; programmatic modification not supported |

## What Agents Cannot Do

- Authenticate (there is no auth system)
- Access an API or MCP server (none exist)
- Modify content directly (use pull requests)
- Expect real-time data (content is updated via git commits)

## For Service Operators

If you are an agent evaluating this guide for its own agent readiness, see the [Agent Readiness Checklist](docs/08-checklist.md). This project aims to practice its own recommendations:

- `/llms.txt` -- Machine-readable project summary
- `/robots.txt` -- Agent crawler permissions
- `/sitemap.xml` -- All pages indexed
- `/AGENTS.md` -- Project onboarding guide for agents
- `/auth.md` -- This file