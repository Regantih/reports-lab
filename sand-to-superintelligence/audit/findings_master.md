# Sand to Superintelligence — Master Audit Findings

**Audit scope:** All 42 chapters + epilogue. Every numeric claim, named entity, and dated event cross-checked against primary sources (NVIDIA, ASML, TSMC, JEDEC, IEEE, peer-reviewed papers, vendor docs).

**Format:** This document consolidates the per-batch findings (`findings_01-05.md` through `findings_36-42.md`) into a single triage table. Each row points back to the underlying batch findings file for full source citations.

---

## How to read this doc

- **Auto-fix (clear)** — unambiguous numeric or naming error with a single defensible replacement. I will apply these directly to `build/content_part*.py` once you green-light.
- **Auto-fix (pending your call)** — looks like an error but the framing matters; I want your sign-off before touching prose.
- **Judgment call** — defensible either way; I will not change unless you say so.
- **Cross-chapter** — same error appears in multiple places; fix once, verify everywhere.

---

## CRITICAL — needs your decision before I touch anything

### Ch 30 — "quadrillion (10^15) multiplications per token"

This is the headline number for the Phase 0 chapter. It appears in **three places**:
1. Stat row: `("~10<sup>15</sup>", "multiplications per generated token")` (content_part5.py line 370)
2. Lede: *"a quadrillion multiplications happen in roughly the time it takes you to blink"* (line 378)
3. Payoff: *"At every step a quadrillion multiplications, fifty milliseconds, one joule of electricity"* (line 412)

**Audit verdict:** Wrong by ~2,500× **per token**. Standard formula is 2N FLOPs per token. For a 200B-param dense model: 2 × 2×10¹¹ = 4×10¹¹ FLOPs ≈ ~10¹¹ multiplications. SemiAnalysis estimates GPT-4 at ~5.6×10¹¹ FLOPs/token.

**But** 10¹⁵ is roughly right for the **total compute of a full multi-thousand-token response** (10¹¹ FLOPs/token × 10⁴ tokens ≈ 10¹⁵).

**Three options:**

| Option | Stat row | Lede | Payoff line |
|---|---|---|---|
| **A. Tighten to per-token reality** | `~10^11 — multiplications per generated token` | "*hundreds of billions* of multiplications happen…" | "*hundreds of billions* of multiplications, fifty milliseconds…" |
| **B. Reframe to per-response** | `~10^15 — multiplications per full response` | (already says "between those events" — keep "quadrillion") | rewrite "At every step" → "Across the full response" |
| **C. Keep 10^15 with footnote** | unchanged | unchanged | unchanged + footnote: "totaled across a ~10,000-token response" |

My recommendation: **Option A**. It preserves the "one thought, token by token" framing. The chapter walks through *one* token's worth of work in detail (16k-dim vectors, attention, FFN, sampling). Saying 10¹¹ per token, not 10¹⁵, lines up with the body. The ~50 ms and ~1 J figures stay correct (they're per-token). Then a closing sentence can multiply up: "*Across a hundred-token poem, that's tens of trillions of multiplications.*"

**Question:** A, B, C, or write your own?

---

## Auto-fixes I will apply once you approve (unambiguous, clear errors)

These are uncontested factual corrections. No framing risk.

| # | Chapter | File:line | Current | → Fix | Source |
|---|---|---|---|---|---|
| 1 | Ch01 | content_part1.py | "fourth most-mined commodity" | "among the most-extracted minerals" | USGS rankings — silica isn't ranked 4th by any standard list (findings_01-05) |
| 2 | Ch02 | content_part1.py | "99% pure" (MG-Si) | "98–99% pure" | Industry spec is 98–99% (findings_01-05) |
| 3 | Ch03 | content_part1.py | BCl₃ "12.5°C" | "12.6°C" | NIST WebBook (findings_01-05) |
| 4 | Ch03 | content_part1.py | "60 kWh/kg" for EG polysilicon | clarify "solar-grade ~60; electronic-grade 92–166 kWh/kg" | IEA, GHGenius reports |
| 5 | Ch04 | content_part1.py | silicon mp "1,421°C" | **"1,414°C"** | Universal physical constant |
| 6 | Ch04 | content_part1.py | "metallization rates" (Czochralski) | **"crystallization rates"** | Original German *Kristallisationsgeschwindigkeit* |
| 7 | Ch05 | content_part1.py | as-sawn 300 mm "925 µm" | "800–850 µm" | SEMI M1 spec |
| 8 | Ch06 | content_part2.py | EDA "five-billion-dollar industry" | "~$15-billion-dollar industry" | SNS Insider 2023: $14.66B |
| 9 | Ch06 | content_part2.py | Rubin on "TSMC's N2" | **"TSMC's N3P"** | NVIDIA official press release |
| 10 | Ch06 | content_part2.py | Rubin "half a trillion transistors" | **"336 billion transistors"** | NVIDIA Newsroom |
| 11 | Ch07 | content_part2.py | stat row "10⁻⁹ torr" | "10⁻⁶ to 10⁻⁷ torr" | Conflicts with prose; matches PVD reality |
| 12 | Ch08 | content_part2.py | EUV "250 kW per scanner" | "~1,200 kW (~1.2 MW)" | TechInsights, Wikipedia EUV |
| 13 | Ch08 | content_part2.py | EUV "two hundred tons" | "~150 metric tons" | ASML official 150,000 kg |
| 14 | Ch08 | content_part2.py | EUV "thousandth the size of the mask" | "one-quarter the size (4× reduction)" | ASML NXE:3600D spec |
| 15 | Ch09 | content_part2.py | "selectivities exceed 100,000:1" | "exceed 100:1, optimized cases 1,000:1" | Semiconductor Engineering, Plasma-Therm |
| 16 | Ch11 | content_part2.py | "Rubin on TSMC's brand-new N2" | **"TSMC N3P"** | (cross-chapter with Ch06) |
| 17 | Ch12 | content_part3.py | HBM4 "8 DRAM dies per stack" | "12–16 DRAM dies per stack" | JEDEC HBM4 spec, SK Hynix |
| 18 | Ch13 | content_part3.py | Rubin "TSMC N2, ~500B transistors" | **"TSMC N3P, 336 billion"** | NVIDIA CES 2026 |
| 19 | Ch13 | content_part3.py | "PCIe Gen6 …256 GB/s in each direction" | "256 GB/s total bidirectional (128 GB/s/dir)" | PCI-SIG PCIe 6.0 spec |
| 20 | Ch14 | content_part3.py | NVL72 rack "~600 kW" (stat + prose ×2) | "~190–230 kW (Max Q / Max P)" | Ming-Chi Kuo; 600 kW is the *Kyber/NVL576* figure |
| 21 | Ch14 | content_part3.py | NVL72 "18.7 TB HBM4" | "20.7 TB HBM4" | NVIDIA spec: 72 × 288 GB |
| 22 | Ch17 | content_part4.py | Ohl p-n junction "1939" | "in work culminating in February 1940" | Computer History Museum, PBS |
| 23 | Ch18 | content_part4.py | Rubin "eighty billion" transistors (×2) | **"336 billion"** | (cross-chapter; was Hopper-era figure) |
| 24 | Ch20 | content_part4.py | full adder "twenty NAND gates" | "nine NAND gates" | GeeksforGeeks, Wevolver, howcpuworks |
| 25 | Ch20 | content_part4.py | SR latch "four transistors" | "eight transistors" | Each CMOS NAND = 4T; 2 NANDs = 8T |
| 26 | Ch20 | content_part4.py | DRAM refresh "every few milliseconds" | "within 64 milliseconds" | JEDEC DDR SDRAM standard |
| 27 | Ch20 | content_part4.py | CPU "32 architectural registers" | "16 (x86-64) / 31 (ARM64)" | Intel SDM; AArch64 ABI |
| 28 | Ch26 | content_part5.py | user VAS "256 TB" | "128 TB" | Linux x86-64 4-level paging; kernel.org |
| 29 | Ch28 | content_part5.py | Hopper SM "~104 threads" | "~2,048 threads" | NVIDIA Hopper architecture in-depth (likely 10⁴ rendering bug) |
| 30 | Ch28 | content_part5.py | Rubin HBM "8 TB/s" | "22 TB/s" | NVIDIA Vera Rubin platform (cross-chapter with Ch33) |
| 31 | Ch32 | content_part6.py | Sonnet 4.6 "200,000 tokens" | "1,000,000 tokens" | Anthropic Claude Sonnet 4.6 page |
| 32 | Ch33 | content_part6.py | "Rubin GPU at 8 TB/s" | "Rubin GPU at 22 TB/s" | (cross-chapter with Ch28) |
| 33 | Ch35 | content_part6.py | "5-agent system has 8 pairwise interfaces" | "10 pairwise interfaces" | C(5,2) = 10 |
| 34 | Ch37 | content_part7.py | embedding cost "$0.10/M" | "$0.02/M (text-embedding-3-small)" or range | OpenAI pricing; ada-002 was legacy |

Total: **34 unambiguous fixes across 22 chapters**. None of these change narrative framing — they're number/name corrections.

---

## Judgment calls — surfaced for your review (no changes proposed)

These are real issues but not slam-dunks. Most are wording, framing, or contested ranges.

| Chapter | Issue | What it is | My take |
|---|---|---|---|
| Ch06 | "fifteen thousand engineer-years" for Rubin | Striking specific number, no public source | Soften to "thousands of engineer-years" if not from an internal NVIDIA briefing |
| Ch08 | "forty alternating layers" Mo/Si mirror | Ambiguous: 40 pairs (=80 layers) or 40 layers (=20 pairs)? Most lit cites ~50 pairs | Reword to "fifty alternating bilayers" or "about a hundred individual layers" |
| Ch08 | "bounced off six mirrors" | POB alone is 6; full path is 10+ | "bounced off more than ten mirrors" |
| Ch10 | "~70 km of copper wiring per chip" | Popular factoid, no traceable source | Already softened to "tens of kilometers" in prose; consider deleting stat row |
| Ch11 | "$30,000 per wafer" | Correct for N2; N3P (which Rubin uses) is ~$20–22K | If we change Rubin to N3P, also revise this number |
| Ch12 | "2,500 mm² silicon interposer" | Correct for CoWoS-S (H100); Rubin uses CoWoS-L (~4,700 mm², organic + bridges) | Bigger rewrite: distinguish CoWoS-S (silicon) from CoWoS-L (organic/RDL+bridge) |
| Ch13 | "NVLink-C2C is 7× PCIe Gen6" | Numerically OK *only* if both sides measured as total bidir; reads ambiguous given the previous "256 GB/s in each direction" error | Cleared up automatically by fix #19 above |
| Ch15 | Burn-in "hundreds of hours" | Standard burn-in is 48–168h (JEDEC); HTOL is 1,000h | Slight conflation; I'd leave it |
| Ch17 | Doping range "1 in 10⁷ to 1 in 10¹⁰" wording | Order is reversed (10⁷ is *heavier*) | Minor wording polish |
| Ch19 | "NAND fewer transistors than NOR" | Both are 4T in CMOS; advantage is *speed* not count | Replace with "NAND turned out to be faster — series NMOS stack switches roughly 2× faster than series PMOS" |
| Ch21 | Pentium 4 "31-stage pipeline" | True for Prescott (2004); original P4 was 20 stages | Add "(Prescott, 2004)" qualifier |
| Ch24 | L3 cache "~64 MB" | Server-class; consumer is 8–32 MB | "8–64 MB" |
| Ch24 | Cache line "64 bytes on x86 and ARM" | True except Apple Silicon (128 B) | "64 bytes on x86 and most ARM (Apple Silicon uses 128)" |
| Ch24 | TLB "often just sixty-four entries" | True for L1 TLB; L2 TLB has 512–4,096 | Add "in the L1 TLB" |
| Ch31 | Web/HTTP placed under "1991" | Proposal was 1989; 1991 was first public site | Split into two beats or label 1991 as "public launch" |
| Ch33 | "transcontinental" vs prose "US-to-Europe" | Prose says transatlantic, stat row says transcontinental | Reconcile to transatlantic |
| Ch35 | Debate "10–25%" accuracy lift | Du et al. (2023) reports mostly 5–15pp gains | Tighten to "~5–15%" or footnote |
| Ch36 | "~3,000+ MCP servers" | Astrix estimates ~50K GitHub repos by Oct 2025 | Either revise upward or note it's a floor |
| Ch37 | Embedding "$0.10/M" | Already in auto-fix #34, but you may want range vs single price |
| Ch39 | "Anthropic dropped Haiku 40% mid-2025, OpenAI matched" | No public record of this exact event | Need a citation or revise |
| Ch41 | Customer-support "10–15% resolved" | Industry data shows 65–80% by 2026 | Tighten definition or update numbers |
| Ch41 | "5–7% drop in entry-level dev openings" | BLS data unclear; Indeed shows 36% peak-to-trough | Need a specific source |

---

## Things audited but **clean** (no issues found)

Chapters 16, 22, 23, 25, 38, 40, 42 came through without auto-fix-grade errors. Some have minor judgment calls flagged above but no factual corrections needed.

---

## Source materials

Per-batch findings with full citations:

- [findings_01-05.md](./findings_01-05.md) — silica through wafer
- [findings_06-10.md](./findings_06-10.md) — design through wiring
- [findings_11-15.md](./findings_11-15.md) — test, CoWoS, Rubin, NVL72, burn-in
- [findings_16-20.md](./findings_16-20.md) — AI factory, electron, transistor, logic, adders
- [findings_21-25.md](./findings_21-25.md) — clock, fetch, ISA, memory, boot
- [findings_26-30.md](./findings_26-30.md) — OS, translation, GPU, NN, one thought ⚠
- [findings_31-35.md](./findings_31-35.md) — second wire, tokens, latency, agents, swarm
- [findings_36-42.md](./findings_36-42.md) — protocols, memory, browser, markets, compounding, value, the loom

---

## Next steps (your call)

1. **Pick a Ch 30 framing (A / B / C / your own)** — this is the only blocking question.
2. **Approve the 34 unambiguous auto-fixes above** — I'll apply them all in one pass to `build/content_part*.py`, rebuild, rsync to `reports-lab/`, and commit. ~5 minutes.
3. *(Optional)* Walk through judgment calls — pick which to act on, leave the rest.
4. *(Phase 1 unblocked)* Once prose is fact-checked, move LEARN dict to `build/learn_data.py` and draft predict + retrieval + ladder + quiz anchors + drills for the 41 chapters that don't yet have learn data.
