# Fact-check findings — Chapters 31–35

---

## Chapter 31 — The Second Wire

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "The Baltimore-to-Washington telegraph line opened in May 1844" | [Smithsonian Institution](https://www.si.edu/object/what-hath-god-wrought-telegraph-message:nmah_713485), [U.S. Senate](https://www.senate.gov/artandhistory/senate-stories/morses-telegraph-in-the-capitol.htm) | matches — line completed May 1844, famous message sent 24 May 1844 | ok |
| 2 | "with the famous message 'What hath God wrought.'" | [Smithsonian Institution](https://www.si.edu/object/what-hath-god-wrought-telegraph-message:nmah_713485) | matches | ok |
| 3 | "By 1867, the stock ticker was decoupling the price of a share" | [History of Information](https://historyofinformation.com/detail.php?id=493), [National Inventors Hall of Fame](https://www.invent.org/inductees/edward-calahan) | matches — Edward Calahan invented the stock ticker in 1867 | ok |
| 4 | "Telephone (1876). Alexander Graham Bell's patent moved the unit of value" | [Library of Congress](https://guides.loc.gov/chronicling-america-telephone-invention), [Smithsonian](https://www.si.edu/object/alexander-graham-bell-experimental-telephone:nmah_689864) | matches — Bell received patent 174,465 on 7 March 1876 | ok |
| 5 | "TCP/IP (1983). The DARPA-sponsored switch to the Internet Protocol" | [ARPANET Wikipedia](https://en.wikipedia.org/wiki/ARPANET), [Tom's Hardware](https://www.tomshardware.com/networking/arpanet-standardized-tcp-ip-on-this-day-in-1983-43-year-old-standard-set-the-foundations-for-todays-internet), [DARPA](https://www.darpa.mil/about/innovation-timeline/tcp-ip) | matches — ARPANET switched to TCP/IP on 1 January 1983 | ok |
| 6 | "HTTP and the Web (1991). Tim Berners-Lee's 'Information Management: A Proposal' at CERN" | [W3C original proposal](https://www.w3.org/History/1989/proposal.html), [CERN birth of the Web](https://home.cern/science/computing/birth-web), [TIME](https://time.com/21039/tim-berners-lee-web-proposal-at-25/) | disputed — the proposal was written in March 1989, not 1991; 1991 was when the first public website went live. The prose places the proposal under the "1991" chronological entry, conflating the 1989 proposal with the 1991 public launch. | judgment |
| 7 | "1989 — Tim Berners-Lee proposes the World Wide Web at CERN" (stat row) | [W3C original proposal](https://www.w3.org/History/1989/proposal.html), [CERN](https://home.cern/science/computing/birth-web) | matches — proposal submitted March 1989 | ok |
| 8 | "Mobile data and the API (2007 onwards). The iPhone shipped with a cellular data radio" | [Apple iPhone history, broadly documented] | matches — original iPhone launched June 2007 | ok |

### Mechanism explanations to flag

- **Quote:** "HTTP and the Web (1991). Tim Berners-Lee's 'Information Management: A Proposal' at CERN laid down a hypertext protocol on top of TCP/IP."
  - **Status:** Misleading placement. The proposal "Information Management: A Proposal" was written in March 1989. The "1991" milestone refers to the public deployment of the first website (August 1991). By placing the proposal under the 1991 heading, the chapter implies Berners-Lee wrote the proposal in 1991; the stat row correctly says 1989. The prose should either reference the 1989 proposal separately or clarify that 1991 marks the web's public debut.
  - **Severity:** judgment

### Suggested auto-fixes (clear errors only)

None — the 1989/1991 date confusion in the prose is a framing issue requiring author judgment, not a simple number swap.

### Open questions for the author

- The "HTTP and the Web (1991)" section applies "1991" to the chronological bullet but then describes the 1989 *proposal*, not the 1991 public launch. Consider splitting into two events or clarifying that 1991 is the public launch date of the web, while the conceptual proposal was 1989.

---

## Chapter 32 — Tokens on the Wire

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "~4 chars — average bytes per English token" | [OpenAI Help Center](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) | matches — OpenAI documentation states "1 token ≈ 4 characters" | ok |
| 2 | "a vocabulary of around 100,000 subword units" | [arXiv tokenizer bias paper](https://arxiv.org/html/2406.11214v2), [Towards AI](https://pub.towardsai.net/understanding-tokenization-in-large-language-models-25402f51461e) | matches — GPT-4 uses cl100k_base with 100,256 tokens | ok |
| 3 | "one token is roughly four characters, or three quarters of a word" | [OpenAI Help Center](https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them) | matches — OpenAI docs give "1 token ≈ ¾ of a word" | ok |
| 4 | "3,072 dims — size of an OpenAI text-embedding-3 vector" | [OpenAI Embeddings API docs](https://developers.openai.com/api/docs/guides/embeddings), [Zilliz model page](https://zilliz.com/ai-models/text-embedding-3-large) | matches — text-embedding-3-large defaults to 3072 dimensions | ok |
| 5 | "typically 768, 1,536, or 3,072 dimensions" | [OpenAI Embeddings API docs](https://developers.openai.com/api/docs/guides/embeddings) | matches | ok |
| 6 | "200,000 tokens for Claude Sonnet 4.6" | [Anthropic Claude Sonnet 4.6 page](https://www.anthropic.com/claude/sonnet), [LinkedIn post on 1M context](https://www.linkedin.com/posts/latifamahna_anthropic-says-goodbye-200k-hello-1-million-activity-7429901165880000512-5gHG), [Claude Help Center](https://support.claude.com/en/articles/8606394-how-large-is-the-context-window-on-paid-claude-plans) | wrong — Claude Sonnet 4.6 has a 1M (1,000,000) token context window, not 200,000. 200K was the limit for earlier Claude 3 models. | auto-fix |
| 7 | "~$0.30 — median price of one million input tokens, end of 2025" | General knowledge of Anthropic/OpenAI pricing; no single authoritative source for a "median" | unverifiable — individual model prices vary widely; no published industry median. Plausible as a rough midpoint across commodity/OSS providers but unsourced. | judgment |

### Mechanism explanations to flag

None in this chapter.

### Suggested auto-fixes (clear errors only)

- Replace "200,000 tokens for Claude Sonnet 4.6" with "1,000,000 tokens for Claude Sonnet 4.6" — Anthropic's own product page and announcement confirm Sonnet 4.6 carries a 1M token context window. Note: if the manuscript was drafted before Sonnet 4.6's February 2026 launch, an earlier Sonnet model (e.g., 3.5 or 3.7) would have had the 200K window — consider whether the model name should be updated to match the intended timeframe.

### Open questions for the author

- The "$0.30 / 1M input tokens" median price at end-of-2025 is difficult to verify against a published authoritative source. This may be accurate as a rough estimate across a blended landscape of providers, but the figure should be footnoted or sourced.

---

## Chapter 33 — Latency Is Cognition

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "~80 ms — transcontinental TCP round trip on the public internet" (stat row) | [General networking references; fiber propagation physics] | judgment — the stat row labels this "transcontinental" but the prose specifies "US-to-Europe" (transatlantic). The prose figure of "~80ms" for a US-to-Europe round-trip is correct; a purely domestic (US coast-to-coast) TCP round-trip is closer to 60–70ms. The mismatch between stat row ("transcontinental") and prose ("US-to-Europe") should be reconciled. | judgment |
| 2 | "Speed-of-light gives you about 200,000 km/s in fibre" | [Wecom Fiber](https://wecomfiber.com/fiber-optic-speed-internet-at-the-speed-of-light/), [LinkedIn technical post](https://www.linkedin.com/posts/marklewis8_the-speed-of-light-isnt-constant-everywhere-activity-7416138885627301889-xvCO) | matches — light travels at ~2/3 of c in standard silica fiber, approximately 200,000 km/s | ok |
| 3 | "even on a Rubin GPU at 8 TB/s, reading 200 GB of model weights" | [NVIDIA Vera Rubin page](https://www.nvidia.com/en-us/data-center/technologies/rubin/), [Hashrate Index Rubin NVL72](https://hashrateindex.com/blog/nvidia-vera-rubin-nvl72-specs-breakdown/), [Spheron Rubin R100 guide](https://www.spheron.network/blog/nvidia-rubin-r100-guide/) | wrong — the Rubin GPU (R100) has 22 TB/s HBM4 bandwidth. 8 TB/s is the Blackwell (B200/B300) HBM3e specification. | auto-fix |
| 4 | "Leviathan et al. (2022) introduced the technique" (speculative decoding) | [arXiv:2211.17192](https://arxiv.org/abs/2211.17192), [Google Research retrospective](https://research.google/blog/looking-back-at-speculative-decoding/) | judgment — the paper was submitted to arXiv on 30 November 2022 (hence "2022" is consistent with the arXiv preprint date); the formal ICML publication year is 2023. Citing as "Leviathan et al. (2022)" is accurate for the arXiv version. The author names are correct (Yaniv Leviathan, Matan Kalman, Yossi Matias). | ok |
| 5 | "ten seconds is the limit at which the user's attention starts wandering off" | [Nielsen Norman Group article](https://www.nngroup.com/articles/powers-of-10-time-scales-in-ux/), [IXD@Pratt citing Nielsen (1993)](https://ixd.prattsi.org/2015/04/response-time-is-speed-the-ultimate-usability-metric/) | matches — Nielsen's 1993 "Usability Engineering" establishes 10 seconds as the attention limit | ok |
| 6 | "Nielsen's classic response-time work from 1993 still applies" | [Aaron Jorbin archive of Nielsen article](https://aaron.jorb.in/response-time-limits-article-by-jakob-nielsen/), [Nielsen Norman Group](https://www.nngroup.com/videos/3-response-time-limits-interaction-design/) | matches — the 10-second limit originates with Nielsen's 1993 work and is well-documented | ok |

### Mechanism explanations to flag

- **Quote:** "Token generation is bounded by HBM bandwidth: even on a Rubin GPU at 8 TB/s, reading 200 GB of model weights once per token sets a hard floor under per-token latency"
  - **Status:** The bandwidth figure is wrong (see row 3 above). The underlying mechanism — that token generation is memory-bandwidth-bound because model weights must be read once per decoding step — is correct and well-established. The illustrative numbers are just pegged to the wrong GPU generation.
  - **Severity:** auto-fix (change 8 TB/s to 22 TB/s for Rubin, or change the GPU reference to Blackwell/B200 if 8 TB/s is intended)

### Suggested auto-fixes (clear errors only)

- Replace "Rubin GPU at 8 TB/s" with "Rubin GPU at 22 TB/s" — NVIDIA's official Rubin R100 specification lists 22 TB/s HBM4 bandwidth. If the intent was to illustrate with Blackwell hardware, replace "Rubin" with "Blackwell B200" (8 TB/s HBM3e).

### Open questions for the author

- The stat row says "~80 ms — transcontinental TCP round trip" while the prose says "a US-to-Europe round-trip cannot be much under 80ms." Transatlantic (US–Europe) and transcontinental (US coast-to-coast) are meaningfully different distances. Please clarify which is intended; the prose text appears to be the more accurate pairing with ~80ms.

---

## Chapter 34 — Agents

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "on SWE-bench Verified…the best published agents in late 2025 solve 60-70% of tasks" | [SWE-bench official leaderboard](https://www.swebench.com), [HAL SWE-bench Verified Mini](https://hal.cs.princeton.edu/swebench_verified_mini), [Manifold Markets resolution](https://manifold.markets/SG/top-swebench-verified-score-in-2025) | matches — by mid-to-late 2025, top agents reached 61–73% on SWE-bench Verified (e.g., Claude Opus tools scored ~73.2% in May 2025; SWE-Agent with Claude Sonnet 4.5 scored 72% by September 2025). "60-70%" is slightly conservative for the trailing edge of 2025. | ok |
| 2 | "on harder, longer benchmarks like AgentBench the numbers are closer to 30%" | [O-Mega benchmark guide](https://o-mega.ai/articles/the-best-ai-agent-evals-and-benchmarks-full-2025-guide), [Emergent Mind 2025 AI Agent Index](https://www.emergentmind.com/topics/2025-ai-agent-index) | unverifiable — no authoritative 2025 AgentBench score of ~30% was found. SWE-bench Pro (a harder benchmark) shows top agents at ~23% in 2026. The stated "30%" for AgentBench specifically is plausible but could not be confirmed against primary sources. | judgment |
| 3 | "Two years ago the same numbers were near zero" | [MarkTechPost SWE-bench trajectory](https://www.marktechpost.com/2026/04/26/top-7-benchmarks-that-actually-matter-for-agentic-reasoning-in-large-language-models/) | matches — Claude 2 in 2023 scored 1.96% on SWE-bench Verified | ok |
| 4 | "Anthropic's Claude with computer use, OpenAI's Operator, and the OpenHands open-source agent" | Generally verifiable | matches — all three are real and documented products/projects | ok |
| 5 | "Cursor, GitHub Copilot Workspace, and the open Aider" | Generally verifiable | matches — all real coding agent tools | ok |
| 6 | "Intercom's Fin" | Generally verifiable | matches — Intercom Fin is a real customer support AI product | ok |

### Mechanism explanations to flag

- **Quote:** "That loop, repeated, is what people now mean by an 'agent'."
  - **Status:** Accurate description of the perceive–plan–act–observe loop as the dominant architectural pattern for LLM agents as of 2024–2026.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes (clear errors only)

None.

### Open questions for the author

- The AgentBench "30%" figure needs a source citation. The best public AgentBench numbers available at time of writing should be footnoted, as the benchmark has multiple versions and scoring methodologies. Consider replacing with a directly verifiable benchmark score (e.g., WebArena or SWE-bench Pro).

---

## Chapter 35 — Swarm

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "Du et al. (2023) showed measurable accuracy gains from this on math and reasoning benchmarks" | [arXiv:2305.14325](https://arxiv.org/abs/2305.14325), [ICML 2024 proceedings](https://openreview.net/pdf?id=zj7YuTE4t8), [project page](https://composable-models.github.io/llm_debate/) | matches — paper submitted May 2023 (arXiv), published at ICML 2024; shows accuracy improvements on arithmetic, GSM8K, MMLU, and chess tasks | ok |
| 2 | "~10-25% — accuracy lift from debate over best single agent on hard tasks" (stat row) | [Du et al. arXiv:2305.14325](https://arxiv.org/abs/2305.14325) | disputed — the paper reports more modest gains for most tasks: arithmetic ~81.8% → ~88% single-to-debate (+6pp), MMLU ~63.9% → ~71.1% (+7pp), biographies ~66% → ~81% (+15pp). A 10-25 percentage-point range overstates most reported results; "10-25%" is achievable only on select tasks under favorable conditions. | judgment |
| 3 | "A debate between three agents on a hard reasoning task can easily cost 5× the tokens" | No primary source found confirming a specific 5× multiplier | unverifiable — plausible as an order-of-magnitude estimate (3 agents × ~2 debate rounds ≈ several times single-agent token cost) but not directly documented in Du et al. or other primary sources. | judgment |
| 4 | "a five-agent system has eight pairwise interfaces" | Mathematical calculation | wrong — C(5,2) = 5×4/2 = **10** pairwise interfaces, not 8. Eight would correspond to a 4-agent system: C(4,2) = 6, or a 5-agent directed count would be 20. | auto-fix |
| 5 | "AutoGen and LangGraph formalize this pattern" | Generally verifiable | matches — both are real multi-agent orchestration frameworks | ok |
| 6 | "Du et al. (2023)…Debate works best when the agents are genuinely heterogeneous" | [Du et al. arXiv:2305.14325](https://arxiv.org/abs/2305.14325) | matches — the paper does find performance improvements when mixing different model types (chatGPT + Bard experiments) | ok |
| 7 | "AutoGen and the proposed Agent2Agent (A2A) protocol from Google are in this camp" | Generally verifiable | matches — Google announced the A2A protocol in 2025; AutoGen is a real Microsoft framework | ok |

### Mechanism explanations to flag

- **Quote:** "a swarm of GPT-4-class agents will not collectively do GPT-6 work"
  - **Status:** Accurate characterization of the consensus view in the multi-agent literature. A swarm does not unlock reasoning above the ceiling of the best individual model; it primarily improves reliability and reduces error rates.
  - **Severity:** oversimplified-fair

- **Quote:** "what looks like emergence is usually the underlying model's capability finally being elicited by better scaffolding"
  - **Status:** Defensible but contested in the literature. Some researchers argue that certain coordination patterns do produce behaviors not present in any individual agent; the claim as written is a reasonable engineering heuristic but should not be stated as settled fact.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes (clear errors only)

- Replace "a five-agent system has eight pairwise interfaces" with "a five-agent system has ten pairwise interfaces" — the combinatorial formula C(n,2) = n(n−1)/2 gives C(5,2) = 10, not 8.

### Open questions for the author

- The "~10-25% accuracy lift from debate" figure in the stat row appears to overstate results from Du et al. (2023). The majority of task-level improvements reported in that paper fall in the 5–15 percentage-point range, with a handful of tasks reaching higher. Please verify the source for the upper bound of 25% or consider revising to "~5–15%."
- The "~5× token cost of debate" figure (stat row) is widely cited as an intuition but is not directly sourced in the Du et al. paper or other primary literature found. A footnote citing the source or labeling this as an author estimate would strengthen the claim.
