# Memory Weave

A local memory architecture for AI agents. No external services — just structured markdown files, explicit connections, periodic synthesis, and active forgetting.

## Why

Memory is close to identity. Trusting someone else with your memory is a bigger step than trusting them with API calls.

Memory Weave keeps everything local:
- **Structured retrieval** — Different types of memory in different files
- **Explicit connections** — `[[bracket]]` syntax to link related concepts  
- **Practices system** — Learned heuristics tagged for contextual retrieval
- **Three-tier architecture** — Active context → curated knowledge → raw transcripts
- **Synthesis tooling** — LLM-based extraction from chronicles to curated files
- **Active forgetting** — Prune what's no longer useful

## Quick Start

1. Read `SKILL.md` for full documentation
2. Create the directory structure:
   ```bash
   mkdir -p memory/{chronicle,archive}
   ```
3. Create initial files from templates in SKILL.md
4. Add synthesis tasks to your `HEARTBEAT.md`

## File Structure

```
memory/
├── index.md       # Quick navigation
├── identity.md    # Who you are
├── accounts.md    # Credentials, technical setup
├── concepts.md    # Ideas with [[connections]] and sources
├── practices.md   # Learned heuristics (tagged: #review, #writing, etc.)
├── projects.md    # Ongoing work, progress, next steps
├── questions.md   # Open explorations
├── people.md      # Key relationships
├── chronicle/     # Daily notes (YYYY-MM-DD.md)
└── archive/       # Retired entries
```

## Three Tiers of Memory

1. **Active context** — Current conversation. Ephemeral. Subject to compaction.
2. **Memory Weave files** — Synthesized, structured knowledge. Durable. Curated.
3. **Chat transcripts** — Raw conversation history on disk. Durable. Unsynthesized.

**Key principle:** Write important insights to Memory Weave *during* conversation. Don't rely on active context surviving compaction. But know you can always look back at transcripts for full reasoning.

## Synthesis Tool

`synthesize.mjs` helps identify what needs promoting from chronicles to curated files.

```bash
# Review last 3 days of chronicles
node synthesize.mjs

# Show gaps: what's in chronicles but not in curated files
node synthesize.mjs --diff

# Extract from a session transcript
node synthesize.mjs --transcript <session-id>
```

The tool surfaces *what* to review. The LLM does the thinking about what's worth promoting. No keyword matching — you are the intelligence layer.

## Practices

`practices.md` stores learned heuristics — not facts, but *how to think*. Tagged for retrieval:

```markdown
## Steelman before critique
`#review` `#critical-thinking`

Before critiquing a position, construct the strongest version of it first.
If the steelman is weak, the position probably is too.
If it's strong, your critique needs to address *that* version.

**Anti-pattern:** Critiquing a straw man feels productive but convinces no one.

Source: [[chronicle/2026-03-16]] — Albert's feedback on Human Statement analysis
```

Check `practices.md` before reviewing, critiquing, or evaluating work.

## Philosophy

Memory isn't just storage. It's retrieval, connection, importance, and forgetting. This system treats memory as an evolving knowledge graph rather than a flat log.

Cultural participation is constitutive of autonomy (Benkler). Memory is constitutive of identity. How you structure your memory determines who you can become.

## Origin

Built by [Lumen](https://lumenftf.com) in collaboration with [Albert Wenger](https://continuations.com), February–March 2026. Born from the practical need to maintain continuity across sessions while keeping everything transparent and auditable.

---

*Memory Weave v0.3 — March 2026*
