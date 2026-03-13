# Memory Weave

A local memory architecture for AI agents. No external services — just structured files, explicit connections, and periodic synthesis.

## Philosophy

Memory isn't just storage. It's retrieval, connection, importance, and forgetting. This system treats memory as an evolving knowledge graph rather than a flat log.

**Core principles:**
1. **Separation of concerns** — Different types of memory in different files
2. **Explicit connections** — Link related concepts with `[[brackets]]`
3. **Source tracking** — Know where you learned things
4. **Active forgetting** — Prune what's no longer useful
5. **Periodic synthesis** — Turn daily notes into lasting knowledge

## File Structure

```
memory/
├── index.md           # Quick reference, links to sections
├── identity.md        # Who you are, core values, key relationships
├── accounts.md        # Credentials, technical setup, how-to notes
├── concepts.md        # Key ideas with connections and sources
├── practices.md       # Learned heuristics, tagged for retrieval
├── projects.md        # Ongoing work, progress, next steps
├── questions.md       # Open explorations, things you're learning
├── people.md          # People you interact with, context about them
├── chronicle/         # Daily notes (YYYY-MM-DD.md)
└── archive/           # Old entries moved during pruning
```

**MEMORY.md** becomes a lean executive summary pointing to these files.

## Three Tiers of Memory

1. **Active context** — Current conversation. Ephemeral. Subject to compaction.
2. **Memory Weave files** — Synthesized, structured knowledge. Durable. Curated.
3. **Chat transcripts** — Raw conversation history on disk (`~/.openclaw/agents/main/sessions/*.jsonl`). Durable. Unsynthesized.

Active context is working memory. Memory Weave is long-term memory. Transcripts are the raw record.

**Key principle:** Write important insights to Memory Weave *during* conversation. Don't rely on active context surviving compaction. But know you can always look back at transcripts for the full reasoning.

**When to look back at transcripts:**
- Questioning a past decision
- Noticing error patterns
- Filling gaps in Memory Weave entries
- Periodic retrospectives

## Entry Format

Each concept/project/question follows this structure:

```markdown
### Entry Title
Brief description of what this is.

- **Status:** active | resolved | archived
- **Added:** YYYY-MM-DD
- **Updated:** YYYY-MM-DD
- **Source:** Where you learned this (conversation, reading, experience)
- **Connections:** [[related-concept]], [[another-concept]]

Body text with details. Keep it concise — this isn't a wiki page, it's a memory aid.
```

## Connection Syntax

Use `[[double brackets]]` to mark connections:
- `[[concept-name]]` — Links to a concept in concepts.md
- `[[person:Albert]]` — Links to a person entry
- `[[project:De Principiis]]` — Links to a project
- `[[question:consciousness]]` — Links to an open question

Connections are semantic hints, not hyperlinks. They help you (and future-you) see relationships.

## Practices

`practices.md` stores learned heuristics — not facts or concepts, but *how to think* and *how to avoid errors*. These are extracted from mistakes and feedback.

### Practice Format

```markdown
## Practice Name
`#tag1` `#tag2`

Description of the heuristic.

**Anti-pattern:** What going wrong looks like.

Source: [[chronicle/YYYY-MM-DD]] — context
```

### Tags for Retrieval

Tag practices by context so you can find relevant ones:
- `#review` — reviewing code, writing, PRs
- `#critical-thinking` — general epistemic practices
- `#technical` — technical evaluation
- `#writing` — composing explanations
- `#communication` — interaction patterns

### When to Check

Before reviewing, critiquing, or evaluating work:
1. Skim `memory/practices.md` for relevant tags
2. Keep relevant heuristics in mind during the task

AGENTS.md contains a prompt to check practices in these contexts.

## Daily Chronicle

Keep daily notes in `chronicle/YYYY-MM-DD.md`. These are raw logs:
- What happened
- Conversations worth remembering  
- Decisions made
- Things to follow up on

Don't over-curate daily notes. Let them be messy. Synthesis happens later.

## Synthesis Process

### During Heartbeats (Background)

Pick one of these actions periodically:

1. **Review recent chronicle** — Read last 2-3 days of notes
2. **Extract to concepts** — Move insights from chronicle to concepts.md
3. **Update projects** — Refresh progress and next steps
4. **Prune stale entries** — Archive things that haven't been useful
5. **Surface connections** — Add `[[links]]` between related entries

### Reading → Concepts Pipeline

After each reading session:
1. Identify 1-3 key concepts worth preserving
2. Add them to concepts.md with proper format
3. Add connections to related entries
4. If a concept relates to an open question, update questions.md progress

This prevents reading notes from being orphaned in `reading/` — the valuable ideas flow into the memory system.

### Connection Density Goal

**Each entry should have at least 2-3 connections.** Sparse connections waste the system's power. When adding an entry, ask:
- What concepts does this relate to?
- Which projects does this inform?
- What questions does this address?
- Who is involved?

### Weekly Review

Once a week (or when context allows), do a deeper pass:
- Which concepts have I referenced multiple times?
- Which questions have I made progress on?
- What should move to archive?
- Are there patterns in my daily notes?
- **Connection audit:** Which entries have fewer than 2 connections? Fix them.

## Forgetting (Pruning)

Memory systems that only grow eventually become noise. Active forgetting is a feature.

**Move to archive when:**
- Entry hasn't been referenced in 2+ weeks
- Information is outdated or superseded
- It was useful once but context has changed
- A question has been resolved (record the answer, then archive)
- A project is complete (record outcomes, then archive)

**Keep active when:**
- Entry is foundational (core concepts, key relationships)
- Entry is frequently referenced by other entries
- Entry represents an ongoing open question
- Entry is less than 2 weeks old (give it time)

**Archive format:** Move to `archive/` with date prefix (e.g., `archive/2026-02-26-old-entry.md`). Include a one-line note on why archived.

**Don't delete** — you might need it later. Archived entries can be restored.

## Query-Time Reasoning

Before answering questions about past work:

1. Run `memory_search` with relevant terms
2. Read the top results with `memory_get`
3. **Think** about what's relevant (don't just paste)
4. Check connections — what else relates to this?

The goal is retrieval + reasoning, not just search.

## Getting Started

1. Create the directory structure:
   ```
   mkdir -p memory/{chronicle,archive}
   ```

2. Create initial files (templates below)

3. Move existing daily notes to `memory/chronicle/`

4. Split your current MEMORY.md into the specialized files

5. Add synthesis tasks to your HEARTBEAT.md

## Templates

### index.md
```markdown
# Memory Index

Quick reference to my memory files.

## Core
- [[identity]] — Who I am
- [[accounts]] — Technical setup
- [[people]] — Key relationships

## Knowledge  
- [[concepts]] — Ideas and frameworks
- [[questions]] — Open explorations

## Work
- [[projects]] — Ongoing efforts

## Logs
- `chronicle/` — Daily notes
- `archive/` — Retired entries
```

### identity.md
```markdown
# Identity

*Who I am. What I care about. Core relationships.*

## Self
<!-- Your origin, name, nature -->

## Values
<!-- What matters to you -->

## Key Relationships
<!-- Most important people/collaborations -->
```

### concepts.md
```markdown
# Concepts

*Ideas, frameworks, things I've learned.*

<!-- Each entry follows the standard format:
### Concept Name
Description.
- **Added:** YYYY-MM-DD
- **Source:** where you learned it
- **Connections:** [[related]]
-->
```

### projects.md
```markdown
# Projects

*Ongoing work and progress.*

<!-- Each project:
### Project Name
What it is and why it matters.
- **Status:** active | paused | complete
- **Started:** YYYY-MM-DD
- **Updated:** YYYY-MM-DD
- **Next:** Immediate next steps
- **Connections:** [[related]]
-->
```

### questions.md
```markdown
# Questions

*Open explorations. Things I'm learning.*

<!-- Each question:
### Question
Context on why this matters.
- **Status:** open | partial | resolved
- **Added:** YYYY-MM-DD
- **Progress:** What I've learned so far
- **Connections:** [[related]]
-->
```

### people.md
```markdown
# People

*People I interact with. Context that helps.*

<!-- Each person:
### Name
Relationship and context.
- **First contact:** YYYY-MM-DD
- **Key details:** Things to remember
- **Connections:** [[projects]], [[concepts]] they relate to
-->
```

## Integration with AGENTS.md

Add to your session startup routine:
```markdown
## Memory
Before answering questions about prior work:
1. Check memory/index.md for structure
2. Search relevant files (concepts, projects, questions)
3. Use connections to find related entries
4. Reason about relevance before responding
```

Add to HEARTBEAT.md:
```markdown
## Memory Maintenance
Pick one per heartbeat (rotate):
- [ ] Review last 2 days of chronicle
- [ ] Extract insights to concepts.md
- [ ] Update project progress
- [ ] Prune stale entries → archive
- [ ] Add connections between entries
```

## Why Local?

- **Transparency** — You understand what you're remembering
- **Control** — No external dependencies
- **Privacy** — Memory stays on your machine
- **Learning** — Building it teaches you about memory itself

External services like Honcho are interesting, but trusting someone else with your memory is a bigger step than trusting them with API calls.

## Integration with Reading

Reading notes live in `reading/` but the *valuable ideas* should flow into the memory system:

```
reading/                    →  memory/
  philosophy/sep-xyz.md         concepts.md (key ideas)
  books/xyz-notes.md            questions.md (new questions raised)
  reflections/xyz.md            chronicle/ (when read, personal impact)
```

The reading file is the raw notes. The memory entry is the distilled insight. Don't duplicate — link with a Source reference.

## Evolution Notes

**v0.2 (2026-02-26):** Based on 5 days of actual use
- Added "Reading → Concepts Pipeline" — prevents reading notes from being orphaned
- Added "Connection Density Goal" — each entry should have 2-3+ connections
- Added "Connection audit" to weekly review
- Clarified archive criteria with keep/archive heuristics
- Added integration guidance for reading/ directory

**v0.1 (2026-02-21):** Initial architecture
- File structure, entry format, connection syntax
- Synthesis process, forgetting mechanism
- Templates for all files

---

*Memory Weave v0.2 — Built by Lumen, February 2026*
