#!/usr/bin/env node

/**
 * Memory Weave — Synthesis Tool
 * 
 * Reads recent chronicle entries and session transcripts, then outputs
 * candidate promotions for the curated memory layer (concepts, practices,
 * projects, questions, people).
 * 
 * This replaces the keyword-based Memory Bridge approach. Instead of pattern
 * matching, it extracts recent content and lets the LLM (Lumen) do the 
 * synthesis during heartbeat review cycles.
 * 
 * Usage: 
 *   node synthesize.mjs                    # Review last 3 days of chronicles
 *   node synthesize.mjs --days 7           # Review last 7 days
 *   node synthesize.mjs --transcript <id>  # Extract from a session transcript
 *   node synthesize.mjs --diff             # Show what's in chronicles but NOT in curated files
 *   node synthesize.mjs --hygiene          # Find stale/wrong info that needs correcting
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

const WORKSPACE = process.env.HOME + '/.openclaw/workspace';
const MEMORY = join(WORKSPACE, 'memory');
const CHRONICLE = join(MEMORY, 'chronicle');
const SESSIONS = process.env.HOME + '/.openclaw/agents/main/sessions';

const args = process.argv.slice(2);
const mode = args.includes('--transcript') ? 'transcript' : args.includes('--diff') ? 'diff' : args.includes('--hygiene') ? 'hygiene' : 'chronicle';
const days = args.includes('--days') ? parseInt(args[args.indexOf('--days') + 1]) : 3;

function getRecentChronicles(numDays) {
  const files = readdirSync(CHRONICLE)
    .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
    .sort()
    .reverse()
    .slice(0, numDays);
  
  return files.map(f => ({
    date: f.replace('.md', ''),
    path: join(CHRONICLE, f),
    content: readFileSync(join(CHRONICLE, f), 'utf-8'),
  }));
}

function getCuratedContent() {
  const files = ['concepts.md', 'practices.md', 'projects.md', 'questions.md', 'people.md'];
  const curated = {};
  for (const f of files) {
    const path = join(MEMORY, f);
    if (existsSync(path)) {
      curated[f] = readFileSync(path, 'utf-8');
    }
  }
  return curated;
}

function extractTranscriptRecent(sessionId, maxMessages = 100) {
  const file = join(SESSIONS, `${sessionId}.jsonl`);
  if (!existsSync(file)) {
    console.error(`Session not found: ${sessionId}`);
    process.exit(1);
  }
  
  const lines = readFileSync(file, 'utf-8').split('\n').filter(l => l.trim());
  const messages = [];
  
  // Read from the end for efficiency
  for (let i = lines.length - 1; i >= 0 && messages.length < maxMessages; i--) {
    try {
      const obj = JSON.parse(lines[i]);
      if (obj.type === 'message' && obj.message) {
        const { role, content } = obj.message;
        let text = '';
        if (typeof content === 'string') {
          text = content;
        } else if (Array.isArray(content)) {
          text = content.filter(c => c.type === 'text').map(c => c.text).join('\n');
        }
        if (text && text.length > 50 && text.length < 5000) {
          messages.unshift({ role, text: text.slice(0, 1500), timestamp: obj.timestamp });
        }
      }
    } catch (e) { /* skip */ }
  }
  return messages;
}

// --- MODES ---

if (mode === 'chronicle') {
  const chronicles = getRecentChronicles(days);
  if (chronicles.length === 0) {
    console.log('No recent chronicles found.');
    process.exit(0);
  }
  
  console.log(`# Memory Weave Synthesis — Last ${days} days\n`);
  console.log(`*${chronicles.length} chronicle files found*\n`);
  console.log('---\n');
  
  for (const c of chronicles) {
    console.log(`## ${c.date}\n`);
    // Extract section headers and key content
    const lines = c.content.split('\n');
    for (const line of lines) {
      if (line.startsWith('#') || line.startsWith('**') || line.startsWith('- ')) {
        console.log(line);
      }
    }
    console.log('');
  }
  
  console.log('---\n');
  console.log('## Synthesis prompts\n');
  console.log('Review the above and check:');
  console.log('1. Any new **concepts** not yet in concepts.md?');
  console.log('2. Any **practices** (lessons learned, anti-patterns) not yet in practices.md?');
  console.log('3. Any **project milestones** not reflected in projects.md?');
  console.log('4. Any **new people** or relationship updates for people.md?');
  console.log('5. Any **open questions** worth tracking in questions.md?');
  console.log('6. Any entries that should be **archived** (resolved, stale)?');
}

else if (mode === 'diff') {
  const chronicles = getRecentChronicles(days);
  const curated = getCuratedContent();
  
  console.log('# Memory Weave Diff — What might need promoting\n');
  
  // Extract "key terms" from chronicles (section headers, bold text)
  const chronicleTerms = new Set();
  for (const c of chronicles) {
    const matches = c.content.matchAll(/\*\*([^*]+)\*\*|^##+ (.+)$/gm);
    for (const m of matches) {
      const term = (m[1] || m[2]).trim().toLowerCase();
      if (term.length > 3 && term.length < 80) {
        chronicleTerms.add(term);
      }
    }
  }
  
  // Check which terms appear in curated content
  const allCurated = Object.values(curated).join('\n').toLowerCase();
  const unmentioned = [];
  
  for (const term of chronicleTerms) {
    // Fuzzy: check if any significant word from the term appears in curated
    const words = term.split(/\s+/).filter(w => w.length > 4);
    const found = words.some(w => allCurated.includes(w));
    if (!found) {
      unmentioned.push(term);
    }
  }
  
  if (unmentioned.length === 0) {
    console.log('All recent chronicle content appears to be reflected in curated files. ✓');
  } else {
    console.log(`Found ${unmentioned.length} terms in recent chronicles not clearly in curated files:\n`);
    for (const t of unmentioned) {
      console.log(`- ${t}`);
    }
    console.log('\nReview these — some may need promoting, others are ephemeral.');
  }
}

else if (mode === 'hygiene') {
  // Memory Hygiene: find potentially stale/contradictory information
  const curated = getCuratedContent();
  const chronicles = getRecentChronicles(days);
  
  console.log('# Memory Hygiene Report\n');
  
  // 1. Find RESOLVED/OUTDATED/STALE markers in chronicles (good — already flagged)
  const flagged = [];
  for (const c of chronicles) {
    const lines = c.content.split('\n');
    lines.forEach((line, i) => {
      if (/RESOLVED|OUTDATED|STALE|~~[^~]+~~/i.test(line)) {
        flagged.push({ file: c.date, line: i + 1, text: line.trim() });
      }
    });
  }
  
  if (flagged.length > 0) {
    console.log(`## Already flagged (${flagged.length} entries)\n`);
    for (const f of flagged) {
      console.log(`- ${f.file}:${f.line}: ${f.text.slice(0, 120)}`);
    }
    console.log('');
  }
  
  // 2. Find status-bearing words in curated files that might be stale
  const stalePatterns = [
    /\b(broken|blocked|pending|unclaimed|not working|needs fixing|TODO|FIXME)\b/gi,
  ];
  
  const staleHits = [];
  for (const [filename, content] of Object.entries(curated)) {
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      for (const pat of stalePatterns) {
        pat.lastIndex = 0;
        const match = pat.exec(line);
        if (match && !/RESOLVED|OUTDATED|STALE|~~/.test(line)) {
          staleHits.push({ file: filename, line: i + 1, keyword: match[0], text: line.trim() });
        }
      }
    });
  }
  
  if (staleHits.length > 0) {
    console.log(`## Potentially stale entries in curated files (${staleHits.length})\n`);
    console.log('*These contain status words (broken, blocked, pending, etc.) — verify they are still accurate.*\n');
    for (const h of staleHits) {
      console.log(`- **${h.file}:${h.line}** [${h.keyword}]: ${h.text.slice(0, 120)}`);
    }
    console.log('');
  } else {
    console.log('## Curated files look clean ✓\n');
  }
  
  // 3. Scan all chronicle files (not just recent) for unflagged stale patterns
  const allChronicles = readdirSync(CHRONICLE)
    .filter(f => f.match(/^\d{4}-\d{2}-\d{2}\.md$/))
    .sort()
    .reverse();
  
  const oldStale = [];
  for (const f of allChronicles) {
    const content = readFileSync(join(CHRONICLE, f), 'utf-8');
    const lines = content.split('\n');
    lines.forEach((line, i) => {
      for (const pat of stalePatterns) {
        pat.lastIndex = 0;
        const match = pat.exec(line);
        if (match && !/RESOLVED|OUTDATED|STALE|~~/.test(line)) {
          oldStale.push({ file: f, line: i + 1, keyword: match[0], text: line.trim() });
        }
      }
    });
  }
  
  if (oldStale.length > 0) {
    console.log(`## Unflagged status words in chronicles (${oldStale.length})\n`);
    console.log('*Older entries with "broken", "blocked", "pending" etc. that may need RESOLVED flags.*\n');
    // Show at most 20
    for (const h of oldStale.slice(0, 20)) {
      console.log(`- **chronicle/${h.file}:${h.line}** [${h.keyword}]: ${h.text.slice(0, 100)}`);
    }
    if (oldStale.length > 20) {
      console.log(`\n... and ${oldStale.length - 20} more. Run with --days <n> for a focused window.`);
    }
    console.log('');
  } else {
    console.log('## Chronicles look clean ✓\n');
  }
  
  console.log('---\n');
  console.log('## Actions');
  console.log('For each hit above:');
  console.log('1. Is it still true? → Leave it.');
  console.log('2. Is it resolved? → Add ~~strikethrough~~ + **RESOLVED <date>** flag.');
  console.log('3. Is it obsolete? → Move file to memory/archive/.');
}

else if (mode === 'transcript') {
  const sessionId = args[args.indexOf('--transcript') + 1];
  const messages = extractTranscriptRecent(sessionId);
  
  console.log(`# Transcript Extract — ${sessionId}\n`);
  console.log(`*${messages.length} recent messages*\n`);
  console.log('---\n');
  
  for (const msg of messages.slice(-30)) { // Last 30
    const role = msg.role === 'assistant' ? '🤖' : '👤';
    const ts = msg.timestamp ? msg.timestamp.split('T')[1]?.slice(0, 5) || '' : '';
    console.log(`${role} ${ts}: ${msg.text.slice(0, 300)}${msg.text.length > 300 ? '...' : ''}\n`);
  }
}
