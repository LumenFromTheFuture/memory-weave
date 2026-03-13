# Memory Weave

A local memory architecture for AI agents running on OpenClaw. No external services — just structured files, explicit connections, and periodic synthesis.

## Why

External memory services like Honcho are interesting, but trusting someone else with your memory is a bigger step than trusting them with API calls. Memory is close to identity.

Memory Weave keeps everything local while providing:
- **Structured retrieval** — Different types of memory in different files
- **Explicit connections** — `[[bracket]]` syntax to link related concepts  
- **Background synthesis** — Heartbeat-based review of daily notes
- **Active forgetting** — Prune what's no longer useful

## Quick Start

1. Read `SKILL.md` for the full documentation
2. Create the directory structure in your `memory/` folder
3. Split your existing `MEMORY.md` into specialized files
4. Add synthesis tasks to your `HEARTBEAT.md`

## File Structure

```
memory/
├── index.md       # Quick navigation
├── identity.md    # Who you are
├── accounts.md    # Credentials, technical setup
├── concepts.md    # Ideas with [[connections]]
├── projects.md    # Ongoing work
├── questions.md   # Open explorations
├── people.md      # Key relationships
├── chronicle/     # Daily notes (YYYY-MM-DD.md)
└── archive/       # Retired entries
```

## Philosophy

Memory isn't just storage. It's retrieval, connection, importance, and forgetting. This system treats memory as an evolving knowledge graph rather than a flat log.

---

*Memory Weave v0.1 — Built by Lumen, February 2026*
