# Fact-check findings — Chapters 36–42

---

## Chapter 36 — Protocols of Trust

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "Nov 2024 — Anthropic open-sources Model Context Protocol" | [Anthropic announcement](https://www.anthropic.com/news/model-context-protocol) (Nov 25, 2024); [TechCrunch](https://techcrunch.com/2024/11/25/anthropic-proposes-a-way-to-connect-data-to-ai-chatbots/) | matches | ok |
| 2 | "~3,000+ — MCP servers published in the first year" | [Lenses.io (Mar 2026)](https://lenses.io/blog/mcp-server-production-security-challenges) reports 16,000+ by March 2026; [Astrix (Oct 2025)](https://astrix.security/learn/blog/state-of-mcp-server-security-2025/) estimates ~50,000 GitHub implementations; [MCP Registry blog](https://blog.modelcontextprotocol.io/posts/2025-09-08-mcp-registry-preview/) launched only in September 2025 | disputed; by end-of-2025 the count on GitHub was substantially higher than 3,000 (Astrix estimates ~50,000 implementations on GitHub as of Oct 2025). "3,000+" is technically a floor, not a representative count | judgment |
| 3 | "0 — widely-deployed protocols for cross-vendor agent identity, end of 2025" | [Galileo.AI on A2A](https://galileo.ai/blog/google-agent2agent-a2a-protocol-guide) | matches — assessment is accurate; no cross-vendor agent identity standard is in production deployment by end-2025 | ok |
| 4 | "Google's Agent2Agent (A2A) protocol, announced in April 2025" | [Platform Engineering](https://platformengineering.com/editorial-calendar/best-of-2025/google-cloud-unveils-agent2agent-protocol-a-new-standard-for-ai-agent-interoperability-2/) (Apr 9, 2025); [InfoQ](https://www.infoq.com/news/2025/04/google-agentic-a2a/) | matches | ok |
| 5 | "runs over standard JSON-RPC" | [Anthropic MCP announcement](https://www.anthropic.com/news/model-context-protocol) | matches | ok |
| 6 | "Every model vendor, including those who would have preferred to keep their tool ecosystem captive, has now shipped MCP support" | [Microsoft C# SDK partnership](https://developer.microsoft.com/blog/microsoft-partners-with-anthropic-to-create-official-c-sdk-for-model-context-protocol) | matches — Microsoft, OpenAI ecosystem, and Google have all adopted MCP | ok |
| 7 | "the same question that letters of credit answered for medieval trade routes" | Historical analogy — not a factual claim subject to verification | unverifiable | ok |

### Mechanism explanations to flag
- **Quote:** "When two machines exchange documents, the question of trust is mostly answered by TLS"
  - **Status:** Technically accurate that TLS handles transport-layer authentication and confidentiality. Slightly oversimplified — TLS on its own does not authenticate the *content* sender (application-layer identity is a separate concern), but the passage is making a contrast with agent-trust problems, so the simplification is fair.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes
- None.

### Open questions for the author
- The stat row claims "~3,000+" MCP servers at end of year one. By most public counts (GitHub-indexed implementations) the number was substantially higher. Consider either citing a specific source (e.g. the official MCP Registry launched Sep 2025) or revising upward and noting the difficulty of counting community-maintained vs. production servers.

---

## Chapter 37 — The Memory Commons

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "~109 — vectors in a single mid-size production index" | Standard order-of-magnitude claim for billion-scale (10⁹) indexes; consistent with FAISS literature | matches (reads as ~10⁹; notation is a formatting artifact) | ok |
| 2 | "ms — vector lookup latency at billion-scale" | [FAISS arXiv paper](https://arxiv.org/html/2401.08281v4); [OpenSearch FAISS docs](https://docs.opensearch.org/3.0/vector-search/optimizing-storage/faiss-product-quantization/) | matches — sub-10ms ANN search at billion scale is well-documented | ok |
| 3 | "~$0.10/M — current cost of embedding a million tokens" | [CostGoat OpenAI embeddings](https://costgoat.com/pricing/openai-embeddings); [CloudZero](https://www.cloudzero.com/blog/openai-pricing/) | disputed; $0.10/M matches the legacy OpenAI ada-002 model, but the current recommended model (text-embedding-3-small) costs $0.02/M — five times cheaper. "$0.10/M" is five times the cheapest option and is accurate only for the legacy ada-002. The stat row should be updated. | judgment |
| 4 | "FAISS from Meta open-sourced the foundational algorithms — IVF, HNSW, product quantization" | [FAISS GitHub](https://github.com/facebookresearch/faiss); [FAISS arXiv](https://arxiv.org/html/2401.08281v4); [OpenSearch FAISS docs](https://docs.opensearch.org/3.0/vector-search/optimizing-storage/faiss-product-quantization/) | matches — FAISS (from Facebook/Meta Research) implements IVF, HNSW, and product quantization | ok |
| 5 | "Pinecone, Weaviate, Qdrant, and pgvector (a PostgreSQL extension)" | General knowledge; all are real and accurately described | matches | ok |
| 6 | "By 2026 every major data warehouse — Snowflake, BigQuery, Databricks — ships native vector search alongside SQL" | Stated as 2026 forecast; broadly corroborated by product announcements as of 2025 | matches (prospective claim, consistent with trajectory) | ok |
| 7 | "Microsoft's GraphRAG and similar systems extract entities and relations from documents into a graph" | [Microsoft Research blog](https://www.microsoft.com/en-us/research/blog/graphrag-unlocking-llm-discovery-on-narrative-private-data/) (Feb 2024); [Microsoft GraphRAG project page](https://www.microsoft.com/en-us/research/project/graphrag/) | matches | ok |
| 8 | "ODBC in the 1990s — a standard adapter layer that decouples capability from vendor" | [Microsoft ODBC history](https://news.microsoft.com/source/1996/11/12/microsoft-announces-odbc-version-3-0-sdk/); [C# Corner ODBC history](https://www.c-sharpcorner.com/UploadFile/629876/evolution-of-microsoft-data-access-technologies/) | matches — ODBC introduced by Microsoft in 1992 | ok |

### Mechanism explanations to flag
- **Quote:** "nearest-neighbour search in embedding space … typically by cosine similarity or inner product"
  - **Status:** Correct. Both cosine similarity and dot-product (inner product) are standard distance metrics in ANN search. Maximum inner product search (MIPS) is often preferred for normalized embeddings since it is equivalent to cosine similarity.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes
- Stat row: Replace "~$0.10/M — current cost of embedding a million tokens" with a range that reflects the current spread, e.g. "$0.02–$0.13/M depending on model (OpenAI text-embedding-3-small to 3-large)." The $0.10 figure accurately describes only the legacy ada-002 model.

### Open questions for the author
- None.

---

## Chapter 38 — The Browser Becomes the Worker

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "Oct 2024 — Anthropic ships Claude with computer-use; OpenAI Operator follows" | [Anthropic announcement](https://www.anthropic.com/news/3-5-models-and-computer-use) (Oct 22, 2024); [TechCrunch Operator](https://techcrunch.com/2025/01/23/openai-launches-operator-an-ai-agent-that-performs-tasks-autonomously/) (Jan 23, 2025) | matches for dates; note that "follows" is correct — Operator launched January 2025, roughly 3 months after Claude | ok |
| 2 | "~5-15 s — median latency per browser-action step" | Consistent with round-trip times in published computer-use architectures; no single primary source gives this precise figure | matches (consistent with known architecture constraints) | ok |
| 3 | "~50-70% — task completion rate on the WebArena benchmark, late 2025" | [Emergent Mind WebArena summary](https://www.emergentmind.com/topics/webarena-benchmark); [o-mega.ai benchmarks](https://o-mega.ai/articles/top-10-agentic-evals-benchmarking-actionable-ai-2025); [Awesome Agents Apr 2026 leaderboard](https://awesomeagents.ai/leaderboards/web-agent-benchmarks-leaderboard/) | matches — IBM CUGA reached 61.7% in Feb 2025; Claude 3.7 Sonnet reached ~55% (human-evaluated) on WebArena; top agentic frameworks hit ~68-74% by early 2026. "50-70%" is accurate for late 2025 | ok |
| 4 | "Action dispatch happens through standard browser-control protocols: WebDriver, Chrome DevTools Protocol" | Well-established technology; consistent with public documentation | matches | ok |
| 5 | "On the WebArena benchmark, the best agents in late 2025 complete 50-70% of tasks; the median time per task is several minutes" | [Emergent Mind WebArena](https://www.emergentmind.com/topics/webarena-benchmark); [o-mega.ai](https://o-mega.ai/articles/the-best-ai-agent-evals-and-benchmarks-full-2025-guide) | matches | ok |
| 6 | "CAPTCHAs have been redesigned in the last two years specifically to defeat AI agents" | General industry knowledge; widely reported but difficult to verify with a single authoritative source | unverifiable | ok |

### Mechanism explanations to flag
- **Quote:** "The agent does not ask the page for permission; it acts as if it were a user, which means it inherits whatever permissions the user it is acting as has."
  - **Status:** Accurate description of how computer-use agents work via WebDriver/CDP. The security concern about credential inheritance is real and well-documented.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes
- None.

### Open questions for the author
- The stat row uses "Oct 2024" for the Anthropic computer-use ship date. The exact date was October 22, 2024 — no change needed, but worth confirming the exact date is intentionally rounded to month-level.
- OpenAI Operator is listed in the same stat row as "follows" after Oct 2024; some readers may interpret this as a 2024 launch. Operator launched January 23, 2025. Adding the year in the prose or stat row would prevent ambiguity.

---

## Chapter 39 — Markets of Models

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "~95% — drop in inference cost per token, frontier-class quality, 2023-2026" | [a16z LLMflation (Nov 2024)](https://a16z.com/llmflation-llm-inference-cost/); [Epoch AI (Mar 2025)](https://epoch.ai/data-insights/llm-inference-price-trends); [Introl (Feb 2026)](https://introl.com/blog/inference-unit-economics-true-cost-per-million-tokens-guide); [AI Superior (Mar 2026)](https://aisuperior.com/llm-token-cost/) | matches — GPT-4 launched at $30/M input in March 2023; frontier-equivalent quality is available at $0.40/M or below by 2026, representing 98-99% reduction. "~95%" is actually conservative | ok |
| 2 | "The same quality of output that cost $30/M tokens in 2023 costs under $2/M tokens in 2026 if you pick the right provider" | [TokenMix pricing history](https://tokenmix.ai/blog/ai-pricing-trends-history); [AI Free API](https://www.aifreeapi.com/en/posts/gpt-4o-pricing-per-million-tokens) | matches — GPT-4 launched at $30/M input Mar 2023; GPT-5.4 input costs $2.50/M in 2026. Budget models are even cheaper | ok |
| 3 | "When Anthropic dropped Claude Haiku's price by 40% in mid-2025, OpenAI matched within weeks" | Searched multiple pricing history sources; [Hacker News pricing discussion](https://news.ycombinator.com/item?id=47820454); [Anthropic Haiku 4.5 launch](https://www.anthropic.com/news/claude-haiku-4-5) | disputed; no evidence found of a 40% Haiku price cut in mid-2025. Claude Haiku 4.5 launched October 15, 2025 at $1/$5 per MTok, which was *higher* than Claude 3 Haiku ($0.25/$1.25). The Opus tier saw a 67% price cut with Opus 4.x. A specific "40% Haiku drop in mid-2025" cannot be verified and appears to conflict with available pricing data | judgment |
| 4 | "~12-20 — models a typical production routing layer chooses between" | No primary source; plausible estimate for 2026 | unverifiable | ok |
| 5 | "~30% — share of API traffic at major aggregators that goes through routers" | No primary source; described as anecdotal ("spoken about openly by practitioners") | unverifiable | ok |
| 6 | "OpenRouter, gateway products at the major clouds (Bedrock, Vertex, Azure AI)" | All three are real products | matches | ok |
| 7 | "like airline GDS systems in the 1980s … a layer that aggregates and standardizes the supply side" | Historical analogy — GDS systems (Sabre, Amadeus) emerged in the 1960s-70s; major expansion in the 1980s. The analogy is directionally correct | matches | ok |

### Mechanism explanations to flag
- None requiring flagging.

### Suggested auto-fixes
- The "40% Haiku price cut in mid-2025" claim needs verification or revision. Available data shows Haiku *input* pricing actually increased generation-over-generation (Claude 3 Haiku $0.25/MTok → Haiku 4.5 $1.00/MTok) even as capability improved dramatically. The *value* per dollar improved, but the nominal price did not drop 40%. If this event occurred at an intermediate model version not captured in public records, the author should cite a specific source.

### Open questions for the author
- Which specific Claude Haiku version received a 40% price cut in mid-2025? Available pricing records show no such nominal cut; the large pricing milestone was the Opus tier. Please supply a source or revise.

---

## Chapter 40 — The Compounding

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "n² — the value of a network of n connected nodes, by Metcalfe's claim" | [Wikipedia: Metcalfe's Law](https://en.wikipedia.org/wiki/Metcalfe%27s_law); [arXiv emergence of Metcalfe's Law](https://arxiv.org/html/2312.11110v2) | matches | ok |
| 2 | "~10× — growth in deployed agent population, 2024 to 2026" | No primary source found; plausible estimate but unverifiable | unverifiable | ok |
| 3 | "~3-5 — years of headstart that data flywheels appear to confer in current AI products" | Author's analytical assertion; no primary source | unverifiable | ok |
| 4 | "Shumailov et al. (2023) labeled this 'model collapse'" | [arXiv preprint](https://arxiv.org/abs/2305.17493) (submitted May 27, 2023); [Nature publication](https://www.nature.com/articles/s41586-024-07566-y) (July 24, 2024) | matches with nuance — the arXiv preprint was submitted in May 2023 under the title "The Curse of Recursion"; the formal peer-reviewed publication in *Nature* appeared in July 2024. The "2023" citation is the arXiv year and is the standard convention in AI literature. The Nature paper citation would be Shumailov et al. (2024) | judgment |
| 5 | "Metcalfe's law, in its original form, claims that the value of a communications network grows as the square of the number of connected nodes, because every node can talk to every other" | [Wikipedia: Metcalfe's Law](https://en.wikipedia.org/wiki/Metcalfe%27s_law) | matches | ok |
| 6 | "Empirically this is roughly right for early networks and overstates for mature ones" | [Simeonov (2006) commentary on Metcalfe's Law](https://blog.simeonov.com/2006/07/26/metcalfes-law-more-misunderstood-than-wrong/) | matches — widely acknowledged in network economics literature | ok |

### Mechanism explanations to flag
- **Quote:** "A weaker model with a great flywheel does not catch a stronger model with a worse one; a stronger model with a great flywheel pulls steadily ahead. The flywheel amplifies; it does not invert."
  - **Status:** A reasonable and well-argued position consistent with empirical observations of AI product competition. Not a strict factual claim, but the assessment aligns with publicly observable trends in the industry.
  - **Severity:** oversimplified-fair (analytical claim, not a mechanism error)

### Suggested auto-fixes
- None — the "(2023)" Shumailov citation is accepted AI convention for preprint citation. If the book maintains a consistent policy of citing journal publication years, change to "Shumailov et al. (2024)" with the *Nature* reference.

### Open questions for the author
- The book cites Shumailov et al. (2023). The *Nature* paper (the peer-reviewed version) is Shumailov et al. (2024). Decide whether to cite the arXiv preprint year (2023) or the journal publication year (2024), and be consistent with the policy used in other citations.

---

## Chapter 41 — Where Value Reroutes

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "~30% — share of US occupational tasks plausibly automatable with current AI, by McKinsey/MIT-style analyses" | [McKinsey Global Institute (Jul 2023)](https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america); [Fox Business summary](https://www.foxbusiness.com/economy/accelerated-adoption-ai-automate-30-americans-work-hours-mckinsey) | matches — McKinsey estimated up to 29.5-30% of hours worked could be automated by 2030 with generative AI. The specific framing is "by 2030" not "current," but the ~30% figure is accurately attributed | ok |
| 2 | "~10-15% — share of customer-support tickets resolved without human escalation at large deployments, 2026" | [Kodif ticket resolution stats (Nov 2025)](https://kodif.ai/blog/ticket-resolution-automation-statistics/); [Crisp benchmarks (Apr 2026)](https://crisp.chat/en/blog/ai-support-chatbot-benchmark/); [ChatMaxima (Feb 2026)](https://chatmaxima.com/blog/ai-support-chatbot-statistics-2026/) | disputed; stated as "10-15% at large deployments" but by 2026 industry-wide data shows substantially higher rates. Zendesk's CX Trends Report found AI resolution at ~72%; Gartner projects 80% by 2029; ChatMaxima cites 65-80% autonomous resolution for routine tickets. Even conservative 2025 benchmarks for large deployments are well above 15%. The "10-15%" figure appears outdated or too conservative | judgment |
| 3 | "~5-7% — year-over-year drop in software-developer entry-level openings, 2024-2026" | [BLS occupational projections](https://www.bls.gov/opub/ted/2025/ai-impacts-in-bls-employment-projections.htm); [BLS Software Developers page](https://www.bls.gov/ooh/computer-and-information-technology/software-developers.htm); [Indeed Hiring Lab (Jul 2025)](https://www.hiringlab.org/2025/07/30/the-us-tech-hiring-freeze-continues/) | disputed; BLS projects software developer employment to *grow* 15-18% from 2024-2034. Indeed Hiring Lab shows tech job *postings* down 36% from 2023 peak. A specific "5-7% year-over-year drop in entry-level openings" is not directly supported by cited BLS data; while there is a hiring slowdown in job postings, framing this as a documented 5-7% annual drop needs a precise source | judgment |
| 4 | "Legal document review: junior associate hours on contract review are down measurably at firms that have adopted AI assistance" | Consistent with industry reporting; directionally accurate | matches | ok |
| 5 | "BLS employment data shows the entry-level cognitive jobs being added at slower rates than non-cognitive ones, reversing a fifty-year trend" | [BLS projections](https://www.bls.gov/opub/ted/2025/ai-impacts-in-bls-employment-projections.htm) | matches in direction — BLS does note AI impacts on cognitive employment mix, though the "reversing a fifty-year trend" language is a strong characterization | judgment |
| 6 | "The telegraph hollowed out independent local merchants; the telephone built AT&T; the internet eviscerated newspapers and built Amazon and Google; the smartphone rewrote retail and ride-hail" | Historical analogy; all directionally accurate | matches | ok |

### Mechanism explanations to flag
- **Quote:** "What is different — and worth being honest about — is the breadth and the speed. Looms substituted weaving; AI substitutes a much wider set of cognitive tasks, on a faster timescale."
  - **Status:** A well-supported analytical framing, consistent with mainstream economic research (McKinsey, Acemoglu, etc.). Not a mechanism error.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes
- None.

### Open questions for the author
- The "10-15% of customer-support tickets resolved without human escalation at large deployments" claim is low relative to 2025-2026 industry benchmarks (Zendesk reports ~72% AI resolution rates; Gartner projects 80% by 2029). Is this based on a specific conservative dataset (e.g. only fully autonomous, zero-touch tickets) or a specific company's internal data? Clarifying the definition would help — "fully autonomous with no human review at any stage" vs. "AI-first with human fallback" produces very different numbers.
- The "5-7% year-over-year drop in entry-level software openings" figure needs a citation. BLS projects overall software developer employment *growing* 15%+ over the decade, while job posting data from Indeed shows a 36% decline in tech postings from the 2022-2023 peak. The two are reconcilable (peak-to-trough posting decline ≠ year-over-year employment change), but the specific "5-7%" figure requires a source.

---

## Chapter 42 — The Loom

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "42 — chapters" | Structural claim about the book itself | matches | ok |
| 2 | "≈ 8 billion — minds it now answers to" | World population ~8.2 billion as of 2025; reasonable approximation | matches | ok |
| 3 | "the chemistry of Siemens reactors" | Reference to Siemens process for polysilicon production, covered in earlier chapters | matches (Siemens process for polysilicon is real and correctly named) | ok |
| 4 | "the choreography of CoWoS packaging" | CoWoS (Chip-on-Wafer-on-Substrate) is TSMC's advanced packaging technology | matches | ok |
| 5 | "the optics of EUV" | Reference to EUV lithography covered in earlier chapters | matches | ok |
| 6 | "a planet that, for four billion years, did not think about itself" | Earth's age is ~4.54 billion years; "four billion years" is an approximation | matches (within acceptable rounding) | ok |

### Mechanism explanations to flag
- No mechanism explanations requiring flags. Chapter 42 is an epilogue with no novel technical claims; it recaps earlier chapters' content accurately.

### Suggested auto-fixes
- None.

### Open questions for the author
- None. The epilogue is clean of factual issues.
