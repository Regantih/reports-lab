# Fact-check audit — per-chapter instructions

You are auditing chapters of a book, *From Sand to Superintelligence*, on the
silicon supply chain and inference economics. The book is technical but
written for an educated lay audience. Your job is to find factual errors —
not stylistic ones.

## What to check

For every chapter prose file you receive:

1. **Hard numbers** (temperatures, dimensions, percentages, dates,
   throughput, costs, energy, counts). Cross-reference each against
   authoritative sources: peer-reviewed papers, vendor docs (TSMC, ASML,
   NVIDIA, Intel, etc.), USGS, IEA, IEEE, Wikipedia for non-controversial
   items.
2. **Named entities and proper nouns** — process names (Czochralski,
   Siemens, FinFET, GAA), tools (EUV NXE:3600, IBM 2nm), companies, places,
   people, dates of founding, attributions of inventions.
3. **Quantitative comparisons / superlatives** — claims like
   "the most-mined commodity", "the tightest purity humanity routinely
   achieves", "the only company that…". Flag when the qualifier is
   contestable.
4. **Mechanism descriptions** — *how* something works. Catch oversimplified
   or wrong causal stories. Mark "oversimplified-but-fair" vs
   "oversimplified-and-misleading".

## Output format (strict)

Write your findings to a single file:
`/home/user/workspace/sand-to-superintelligence/audit/findings_<batch>.md`

For each chapter you audit, append a block in this exact format:

```
## Chapter NN — <chapter title>

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|------------------------------------|-------------------|---------|----------|
| 1 | "1,700°C minimum operating temperature" | [USGS](url), [IEA report](url) | matches | ok |
| 2 | "the most-mined commodity on earth" | [USGS Mineral Commodity Summary 2024](url) | disputed; sand+gravel and crushed stone outrank silica specifically | judgment |

Verdicts: `matches` | `wrong` | `disputed` | `unverifiable`
Severity: `ok` | `auto-fix` (clear typo/number error) | `judgment` (debatable, surface to author) | `oversimplified-misleading`

### Mechanism explanations to flag
- **Quote:** "Without KV caching, every new generated token would require a
  fresh forward pass over the entire growing prefix"
  - **Status:** technically right but oversimplified — clarify that the
    forward pass is over the prefix's existing K/V projections, not the raw
    tokens.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes (clear errors only)
- Replace "13.4 nm" with "13.5 nm" — EUV is universally documented at 13.5 nm.

### Open questions for the author
- The chapter says "X". I couldn't find an authoritative source that
  confirms or denies. Flag for human review.
```

## Rules

- **Quote verbatim** when stating a claim from the book. Don't paraphrase.
- **Cite real URLs** for sources. Use markdown links. No fake URLs.
- **Be conservative on auto-fixes.** Only mark `auto-fix` when the error is
  unambiguous (typo, off-by-one in a well-documented number). Anything
  contestable is `judgment`.
- **Do not edit the prose files** — your output is the findings markdown
  only.
- **If a chapter has no issues, still write its block** with the verdict
  table populated and "no issues found" in the prose explanations section.
- Use `search_web` and `fetch_url`. For each numeric claim, do at least one
  fresh search; do not rely solely on prior knowledge.
- Be efficient: one search per claim is usually enough; cluster related
  claims into a single search where possible.
