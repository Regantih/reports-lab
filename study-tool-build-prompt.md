# Reusable build prompt — Study-tool layer for a long-form study site

Paste this whole document into a fresh project as the brief. It encodes the principles, architecture, four features, and build order I used on the Sand-to-Superintelligence site so the next build can reproduce them on different content.

---

## What this is

I am building a static, multi-chapter study site. The site is **not** a book — it is study material I read non-linearly to go from basic to expert level. Build a study-tool layer on top of plain chapter HTML so I can predict, retrieve, take margin notes, see my progress, and run spaced repetition — all client-side, no backend.

---

## Non-negotiable principles

1. **Frictionless delivery; deliberate friction in assessment.** Reading is fast and clean. Self-rating, drills, and ladder checks are slow on purpose.
2. **Self-rating is anchored in demonstrable behaviors, never feelings.** Objectives use verbs like *trace, explain, state, derive, compute, contrast* — never *understand* or *appreciate*.
3. **Don't break what works.** Every feature is additive. No existing block is removed; new blocks slot in around them.
4. **Voice matches the existing prose register.** No AI-slop adverbs. Banned list: *essentially, fundamentally, ultimately, moreover, furthermore, indeed, notably, interestingly, importantly*.
5. **State persists in localStorage.** No new backend services. No accounts. No telemetry.
6. **Prototype on one chapter first.** Build every feature on a single gold-standard chapter. Get sign-off. Only then roll out to the rest.

---

## Architecture (what to build)

A static-site generator in Python (or your preferred language) reads chapter content + a per-chapter learning-data dict and emits HTML. Every chapter page includes the same JS modules.

### File layout

```
project/
  build/
    build_site.py        # generator: reads content + learn_data, writes HTML
    template.py          # page template — header, nav, footer, script tags
    learn_data.py        # per-chapter dict: predict, retrieval, ladder, drills,
                         #                   memory_map, objectives, etc.
    content_part*.py     # raw chapter prose (your fact-checked source)
    paragraph_ids.json   # generated manifest of stable paragraph IDs
  chapters/
    <slug>.html          # one per chapter
    <slug>-drills.html   # drills page per chapter
    <slug>-drills.tsv    # Anki export per chapter
    me.html              # personal dashboard
    notes.html           # margin-note index
  css/
    style.css            # main stylesheet
    dashboard.css        # dashboard-only styles
  js/
    app.js               # existing site behavior (audio, search, tutor, etc.)
    learn.js             # predict / retrieval / ladder / quiz wiring
    notes.js             # margin notes
    srs.js               # spaced repetition
    dashboard.js         # /me.html
```

### localStorage namespacing

All state lives under one prefix so it's easy to clear or migrate:

- `fsts.learn.<slug>` — predict answer, retrieval ratings, ladder checks
- `fsts.notes.<slug>` — array of margin notes for that chapter
- `fsts.srs.<slug>` — SRS state per drill card (interval, ease, due date)
- `fsts.bookmarks` — array of bookmarked slugs

Replace `fsts` with your project's three-letter prefix.

### Learn-data schema (per chapter)

```python
LEARN["<slug>"] = {
  "memory_map": "node1 → node2 → node3 → ... → node8",   # 5–8 nodes
  "objectives": [
    "Trace ...",        # behavioral verb
    "Explain ...",      # behavioral verb
    "State ...",        # behavioral verb
  ],
  "one_sentence": "The chapter's argument in one sentence.",
  "limits": ["What this chapter does NOT tell you", "..."],
  "heuristic": "Rule-of-thumb you can carry away.",
  "predict": {
    "question": "Before you read — about how many X happen during Y?",
    "hint": "Pick the order of magnitude.",
    "choices": [("a", "~10^9"), ("b", "~10^12"), ("c", "~10^15"), ("d", "~10^18")],
    "answer_key": "c",
    "answer": "Roughly 10^15 because ...",
  },
  "retrieval": [
    {"id": "r1", "kind": "recall",  "q": "...", "a": "..."},
    {"id": "r2", "kind": "apply",   "q": "...", "a": "..."},
    {"id": "r3", "kind": "explain", "q": "...", "a": "..."},
  ],
  "ladder": [
    {"level": 1, "name": "Curious",       "check": "Can name the topic..."},
    {"level": 2, "name": "Practitioner",  "check": "Can compute..."},
    {"level": 3, "name": "Expert",        "check": "Can derive..."},
    {"level": 4, "name": "Research-grade","check": "Can extend..."},
  ],
  "drills": [
    ("front of card", "back of card"),
    ...
  ],
}
```

---

## The four study-tool features

### Feature A — Memory map + behavioral objectives

**Purpose:** orient the reader before they read; give them three success criteria they can actually check.

**Memory map block** sits at the very top of every chapter, before any other content:

- Eyebrow label `MEMORY MAP` in monospace, uppercase, letter-spaced.
- 5–8 short text nodes joined by `→` arrows.
- Render each node as a pill-shaped chip; the arrow between them is colored with the accent color.
- One line on desktop, wraps gracefully on mobile.

**Objectives block** sits inside the chapter header, right after the dek:

- Eyebrow label `AFTER THIS CHAPTER, YOU CAN:` in the accent color.
- Three list items, each starting with a behavioral verb (trace, explain, state, derive, compute, contrast).
- Left-border accent bar in the accent color.
- Reject any draft using *understand* or *appreciate* — those are feelings, not behaviors.

### Feature B — Personal study dashboard at `/chapters/me.html`

**Purpose:** one-glance map of where I am across all chapters.

Sections, in order:

1. **Hero** — title + one-sentence subtitle.
2. **Next-step nudge** — a single accent-bordered card with one sentence telling me what to do next. Use a simple priority heuristic:
   - If any drills are due → "Review N due cards in <chapter>."
   - Else if any chapters have unresolved stuck-on notes → "Resolve your stuck-on note in <chapter>."
   - Else if any chapter has predict but no retrieval done → "Finish retrieval in <chapter>."
   - Else → "Pick any chapter — your map is balanced."
3. **KPI tiles** — Chapters started · Chapters at L3+ · Predict accuracy · Drills due today.
4. **Chapter heatmap** — one cell per chapter in a responsive grid. Color = ladder level (L0 = empty, L1 = pale tint, L2 = mid, L3 = strong, L4 = darkest). Each cell shows chapter number + short title and links to the chapter.
5. **Ladder legend** — five swatches showing what L0–L4 mean.
6. **Drills due today** — list of chapters with due cards; "Review now" buttons that deep-link to the drill page.
7. **Stuck-on** — list of all margin notes flagged as `stuck-on`, each linking to its paragraph anchor.

Empty states must be honest: "No drills due — pick any chapter and review manually." Not cheerleading.

### Feature C — Margin notes with stable paragraph IDs

**Purpose:** I want to scribble in the margins like a real book.

**Stable paragraph IDs** are assigned at build time. For each `<p>` inside `<article class="prose">`:

1. Compute SHA-1 of the paragraph's normalized text (lowercase, collapse whitespace).
2. Take the first 8 hex chars and assign `<p id="p-XXXXXXXX">`.
3. Write the manifest to `build/paragraph_ids.json` so you can detect orphaned notes after content edits.

This means notes survive prose edits as long as the paragraph wording is mostly stable. When a paragraph changes enough to get a new hash, the note is "orphaned" and the user gets a one-click reattach UI.

**Note interaction:**

- On hover of any paragraph, a small pen button (`.note-gutter`) appears in the left margin.
- Click pen → side panel slides in from the right showing:
  - Eyebrow `MARGIN NOTE` and a paragraph excerpt for context.
  - Type chooser: ❓ Question · 💡 Analogy · 😩 Stuck-on · ✅ Got-it (radio-style buttons; selected one fills with accent).
  - Textarea.
  - Save button.
- Notes attached to a paragraph show as a small marker on the paragraph; clicking it reopens the editor.
- Storage: `fsts.notes.<slug>` is an array of `{id, paragraphId, type, text, createdAt, updatedAt}`.

**Notes index page at `/chapters/notes.html`:**

- Hero: "My margin notes" + count.
- Filter chips: All · Question · Analogy · Stuck-on · Got-it.
- Export markdown button.
- List of notes grouped by chapter; each item links to `chapters/<slug>.html#p-XXXXXXXX`.
- Empty state: "No notes yet — hover any paragraph and click the pen to add your first."

### Feature D — In-site spaced repetition for drill cards

**Purpose:** review without leaving the site. Anki TSV export still works for power users.

**Algorithm:** SM-2.

- Each card has `{interval, ease, dueDate, lapses}` in `fsts.srs.<slug>`.
- Rate buttons after each card: Again (1) · Hard (3) · Good (4) · Easy (5).
- Update interval and ease per standard SM-2.

**Drill page integration:**

- Banner above the existing static Anki table: `<N> cards due for review · [Review now]`.
- Hide banner when zero are due.
- Static TSV download and the existing card table are preserved untouched.

**Review modal:**

- Full-screen overlay.
- Header: progress `1 / 10 due` and a close button.
- Body: card front · divider · `Show answer (SPACE)` prompt.
- After reveal: rating buttons.
- Keyboard: SPACE reveals; 1/2/3/4 rate; ESC closes.
- Exposes `window.__FSTS_SRS__ = { dueCards(slug), openReview(slug), stats(slug), rate(...) }` so the dashboard can read counts and link in.

---

## Voice rules (apply to every author-facing string)

- No AI-slop adverbs: *essentially, fundamentally, ultimately, moreover, furthermore, indeed, notably, interestingly, importantly*.
- No *understand* / *appreciate* in objectives.
- Eyebrow labels are short, uppercase, monospace, letter-spaced — they look like field labels in a lab notebook.
- Empty states tell the truth ("No drills due — pick any chapter and review manually") — they do not cheerlead.
- Buttons use verbs: *Review now, Reveal answer, Save, Export markdown, Start chapter 1*.

---

## Visual register

Match whatever the host site already does. The patterns I used:

- Accent color = a single warm copper/terracotta tone, used sparingly for left-borders, eyebrows, arrows in the memory map, primary buttons, and active-tab states.
- Monospace font for eyebrows, memory-map nodes, drill-card fronts, KPI labels.
- Display serif for chapter titles and "in one sentence" callouts.
- Sans for body copy.
- Surface variations: base, surface-2 (for callouts), surface-offset (for limits boxes).
- Generous spacing tokens; type scale is 4–5 sizes max.

If the host site has no design system yet, use the Nexus/Swiss defaults from the website-building skill and pick one warm accent based on the subject.

---

## Build order (do not reorder)

1. **Phase 0 — One chapter only.**
   - Pick a gold-standard chapter. Build the per-chapter learn data for it (memory_map, objectives, predict, retrieval, ladder, drills, one_sentence, optional limits, optional heuristic).
   - Wire predict + retrieval + ladder + drills page + Anki TSV.
   - Stop. Show the demo. Wait for explicit approval.

2. **Phase 1 — Roll out to all chapters.**
   - Author per-chapter learn data for every chapter.
   - Roll out one_sentence / limits / heuristic across the book.
   - Stop. Show the demo. Wait for approval.

3. **Phase 2 — Study-tool layer (the four features above).**
   - Each feature is independent and can be built in parallel. Spawn four parallel subagents:
     - 2A: memory_map + objectives across all chapters
     - 2B: dashboard at /me.html
     - 2C: margin notes with paragraph IDs
     - 2D: in-site spaced repetition for drills
   - Merge: render 2A blocks, build, QA two chapters in a real browser, deploy.

4. **Phase 3 onward — Decide based on usage data.** Don't pre-build features that haven't proven they're needed.

After every phase: stop, demo, wait for approval before the next phase.

---

## Quality gates (must pass before each deploy)

- Static-site build is clean — no warnings, no missing fields.
- A real browser (Playwright) opens at least two chapters and the dashboard with zero console errors.
- The memory map renders with the right node count.
- The objectives block has exactly the count specified per chapter and contains no banned verbs.
- The drill page shows the SRS banner with the correct count.
- The notes editor opens on click and saves a note that survives a page reload.
- All `fsts.*` localStorage keys round-trip cleanly through `JSON.parse(JSON.stringify(...))`.
- No new network requests at runtime — confirm the page works fully offline after first load.

---

## What success looks like

A reader can land on a chapter, read the memory map in 5 seconds, take the predict question seriously, read the prose, run the retrieval block, optionally drop margin notes, mark their ladder level honestly, then jump to drills and run a spaced-repetition review — all without leaving the site, without an account, and without the prose ever feeling like AI wrote it.

---

## How to use this prompt

1. Drop this whole file into the new project as `study-tool-spec.md`.
2. Tell the agent: *"Read `study-tool-spec.md` and the existing site code, then propose a Phase 0 plan for one chapter. Don't build anything yet."*
3. Approve the plan. Build Phase 0 on one chapter. Demo.
4. Approve and roll out per the build order above.
