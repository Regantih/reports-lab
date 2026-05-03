# Audit findings — Chapters 11–15

Batch: `11-15`  
Auditor: AI fact-checker  
Date: 2026-05-03  
Source chapters: `11_11-test-and-dice.md`, `12_12-cowos-hbm.md`, `13_13-vera-rubin-superchip.md`, `14_14-nvl72.md`, `15_15-burn-in.md`

---

## Chapter 11 — Test and Dice

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "~600 — tests per die at probe" (stat row) | [SEMI test industry overview](https://www.semi.org/en/products-services/market-data), general semiconductor probe references | unverifiable — test counts vary widely by chip complexity; the stat-row number is not independently confirmable for Rubin specifically but is plausible for a large SoC | judgment |
| 2 | "60–80% — typical yield, leading-edge" (stat row) | [TSMC GTC references; SemiAnalysis Blackwell analysis](https://newsletter.semianalysis.com/p/nvidia-b100-b200-gb200-cogs-pricing) | matches — leading-edge GPU yields in early production are typically quoted in this range | ok |
| 3 | "~$10,000 — cost per known-good Rubin die" (stat row) | [TSMC N2 wafer price ~$30,000](https://technode.com/2025/10/09/tsmc-sets-2nm-wafer-price-at-30000-far-below-earlier-50-increase-speculation/); [Rubin on N3P, not N2](https://wccftech.com/nvidia-first-only-customer-for-tsmc-a16-process-node-for-next-gen-feynman-gpus/) | judgment — the $10,000 per-die estimate is internally plausible (~30 dies per wafer at 50% yield on a ~$25,000–$30,000 wafer), but Rubin is fabricated on TSMC N3P, not N2; no authoritative public per-die cost exists | judgment |
| 4 | "Rubin, on TSMC's brand-new N2 process at the reticle limit" | [NVIDIA Technical Blog](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/); [Tom's Hardware](https://www.tomshardware.com/pc-components/gpus/nvidias-vera-rubin-platform-in-depth-inside-nvidias-most-complex-ai-and-hpc-platform-to-date); [TweakTown](https://www.tweaktown.com/news/107266/nvidia-ceo-says-rubin-gpu-is-the-companys-most-advanced-ai-architecture-cooking-at-tsmc-now/index.html); [TrendForce](https://www.trendforce.com/news/2026/04/01/news-nvidias-rubin-ultra-seen-sticking-to-dual-die-design-on-packaging-constraints-tsmc-3nm-demand-intact/) | **wrong** — Rubin (R200) is fabricated on TSMC **N3P** (3nm-class process), not N2. N2 is a distinct 2nm-class node. Multiple NVIDIA official sources, Tom's Hardware, TrendForce, and Wccftech all confirm N3P. N2 is used for next-gen AMD and Apple, not Rubin GPUs. | auto-fix |
| 5 | "every wafer costs perhaps $30,000 to produce yields perhaps thirty saleable chips" | [TechNode: TSMC N2 wafer ~$30,000](https://technode.com/2025/10/09/tsmc-sets-2nm-wafer-price-at-30000-far-below-earlier-50-increase-speculation/); [Wccftech N2 pricing](https://wccftech.com/tsmcs-2nm-n2-ppa-improvements-to-be-limited/) | judgment — $30,000 is the publicly cited N2 price; N3P wafers cost ~$20,000–$22,000. If the wafer cost figure is meant to reflect N3P, ~$30,000 overstates it. The "thirty saleable chips" estimate depends on die size and yield; no public source confirms this exact figure for Rubin | judgment |
| 6 | "probe card — a fixture studded with hundreds of fine, gold-plated tungsten or MEMS needles" | [Standard semiconductor test references](https://anysilicon.com/introduction-htol/); general probe card literature | matches — probe cards use both tungsten cantilever needles (traditional) and MEMS-based vertical needles; gold plating is standard | ok |
| 7 | "A yield of 50% on Rubin would not be surprising for the first months of production" | [SemiAnalysis Blackwell ramp](https://newsletter.semianalysis.com/p/nvidias-blackwell-reworked-shipment); [Reddit/hardware N3P yield discussion](https://www.reddit.com/r/AMD_Stock/comments/1nfxvg4/nvidia_has_reportedly_requested_tsmc_to_move_up/) | matches — consistent with industry norms for early ramp of large, complex dies on a leading-edge node; N3P yields have historically outperformed N5 | ok |

### Mechanism explanations to flag

- **Quote:** "Channels in the silicon between dies — called scribe lines — are sliced through, and the wafer falls apart into hundreds of individual dies."
  - **Status:** Accurate. Scribe lines (also called saw lanes or dicing lanes) are the correct term. Mechanically correct description.
  - **Severity:** ok

### Suggested auto-fixes (clear errors only)
- Replace "TSMC's brand-new N2 process" with "TSMC's N3P (3nm-class) process" — all authoritative sources (NVIDIA's own technical blog, Tom's Hardware, TrendForce) confirm Rubin GPUs are manufactured on the N3P process node, not N2. N2 is a distinct 2nm-class node not used for Rubin.

### Open questions for the author
- The "$30,000 per wafer" figure in the yield section: if this is meant to represent the N3P wafer cost (which Rubin actually uses), reported N3P prices are closer to $18,000–$22,000. The $30,000 figure has circulated specifically for N2. The author should clarify whether the wafer cost figure is meant to be approximate (in which case a footnote clarifying the process node would be sufficient) or precise (in which case it should be revised downward for N3P).
- The stat row lists "~$10,000 — cost per known-good Rubin die" — no public source confirms this. It is arithmetically plausible if one assumes an N2 wafer price (~$30,000) with ~30 full dies and ~100% yield, but the combination of assumptions should be verified or hedged.

---

## Chapter 12 — CoWoS and the 2.5D Revolution

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "288 GB — HBM4 per Rubin GPU" (stat row) | [NVIDIA official NVL72 page](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/); [NVIDIA Technical Blog](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | matches | ok |
| 2 | "22.2 TB/s — memory bandwidth per chip" (stat row) | [RCRTech on bumped Rubin specs](https://rcrtech.com/semiconductor-news/nvidia-bumps-vera-rubin-specs/); [NVIDIA NVL72 page](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/) | matches — NVIDIA official page lists 22 TB/s; some sources round to 22.2 TB/s after spec bump | ok |
| 3 | "8 — DRAM dies per HBM4 stack" (stat row) | [Tom's Hardware HBM roadmaps](https://www.tomshardware.com/tech-industry/semiconductors/hbm-roadmaps-for-micron-samsung-and-sk-hynix-to-hbm4-and-beyond); [SK Hynix 12-layer HBM4 announcement](https://www.reddit.com/r/hardware/comments/1jh68f6/sk_hynix_sk_hynix_ships_worlds_first_12layer_hbm4/); [EE Times CES 2026 HBM4](https://www.eetimes.com/the-state-of-hbm4-chronicled-at-ces-2026/) | **wrong** — HBM4 ships commercially in 12-Hi (12-layer) and 16-Hi (16-layer) configurations, not 8-Hi. SK Hynix shipped 12-layer HBM4 samples in March 2025; SK Hynix unveiled 16-layer HBM4 at CES 2026. NVIDIA's own documentation describes Rubin using "eight stacks" (i.e., 8 stacks per GPU) but each stack is 12-high or 16-high. The chapter confuses stack count (8 stacks per GPU) with dies-per-stack (12 or 16). | auto-fix |
| 4 | "2,048-bit — HBM4 interface width" (stat row) | [JEDEC HBM4 spec April 2025](https://www.eetimes.com/the-state-of-hbm4-chronicled-at-ces-2026/); [Wikipedia HBM](https://en.wikipedia.org/wiki/High_Bandwidth_Memory); [Rambus HBM guide](https://www.rambus.com/blogs/hbm3-everything-you-need-to-know/) | matches | ok |
| 5 | "Eight DRAM dies stacked on a base logic die, all bonded together by tens of thousands of through-silicon vias (TSVs)" | [Tom's Hardware HBM4 roadmap](https://www.tomshardware.com/tech-industry/semiconductors/hbm-roadmaps-for-micron-samsung-and-sk-hynix-to-hbm4-and-beyond); [SK Hynix HBM4 12-layer](https://www.networkworld.com/article/4005086/micron-joins-hbm4-race-with-36gb-12-high-stack-eyes-ai-and-data-center-dominance.html) | **wrong** — for HBM4, the standard configurations are 12-Hi and 16-Hi, not 8-Hi. The description of TSVs is mechanically correct but the die count is outdated (8-Hi was the standard for HBM2/HBM3; HBM3E added 12-Hi; HBM4 ships in 12-Hi and 16-Hi). | auto-fix |
| 6 | "exposes a 1,024-bit-wide interface in the original HBM" | [Wikipedia HBM](https://en.wikipedia.org/wiki/High_Bandwidth_Memory); [Rambus HBM history](https://www.rambus.com/blogs/hbm3-everything-you-need-to-know/); [SK Hynix first-gen HBM confirmation](https://www.kitguru.net/components/graphic-cards/anton-shilov/sk-hynix-confirms-mass-production-of-first-gen-hbm-memory/) | matches — HBM1 used a 1,024-bit interface (8 channels × 128 bits per channel) | ok |
| 7 | "By HBM4, the interface has doubled to 2,048 bits" | [JEDEC HBM4 spec](https://en.wikipedia.org/wiki/High_Bandwidth_Memory); [Siemens EDA HBM guide](https://blogs.sw.siemens.com/semiconductor-packaging/2026/04/24/hbm3e-hbm4-ic-design-guide/); [Rambus](https://www.rambus.com/blogs/hbm3-everything-you-need-to-know/) | matches | ok |
| 8 | "each GPU is paired with multiple HBM4 stacks delivering a combined 288 GB of memory at 22.2 TB/s" | [NVIDIA NVL72 spec page](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/); [NVIDIA Technical Blog](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | matches | ok |
| 9 | "roughly one hundred times what a desktop CPU can manage from its DDR5 DIMMs" | [Desktop DDR5 max ~100 GB/s](https://www.rambus.com/blogs/hbm3-everything-you-need-to-know/) vs 22,000 GB/s | matches — DDR5 on desktop CPUs achieves ~75–100 GB/s, so 22 TB/s is approximately 200–300× more; the "roughly one hundred times" claim is conservative but defensible | judgment |
| 10 | "separate silicon interposer: a piece of plain, passive silicon, perhaps 2,500 square millimeters" | [NextPlatform CoWoS-S sizing](https://www.nextplatform.com/connect/2024/03/29/how-to-build-a-better-blackwell-gpu-than-nvidia-did/1655574); [3D InCites on Blackwell CoWoS-L](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/) | judgment — 2,500 mm² was accurate for CoWoS-S silicon interposers (used in H100). Rubin uses **CoWoS-L**, which is not "plain, passive silicon" but an organic RDL (redistribution layer) substrate with embedded silicon bridge dies. The Rubin package approaches ~4,700 mm² (5.5× reticle). The description conflates CoWoS-S (H100-era, full silicon) with CoWoS-L (Blackwell/Rubin, organic+bridges). | oversimplified-misleading |
| 11 | "CoWoS — Chip-on-Wafer-on-Substrate. The naming describes the assembly order" | [TSMC CoWoS SemiWiki](https://semiwiki.com/wikis/industry-wikis/cowos-chip-on-wafer-on-substrate-wiki/); [3D InCites](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/) | matches — naming and assembly order description is correct | ok |
| 12 | "the interposer wafer is then thinned (its TSVs are exposed by polishing the back)" | [NextPlatform CoWoS description](https://www.nextplatform.com/connect/2024/03/29/how-to-build-a-better-blackwell-gpu-than-nvidia-did/1655574); [3D InCites CoWoS-L vs CoWoS-S](https://www.3dincites.com/2024/10/iftle-607-why-nvidias-blackwell-is-having-issues-with-tsmc-cowos-l-technology/) | judgment — backside thinning to expose TSVs applies to **CoWoS-S** (silicon interposer with TSVs). For Rubin's **CoWoS-L**, the interposer is an organic RDL substrate with embedded silicon bridges; the TSV-thinning step is not the same process. This description is accurate for H100-era CoWoS-S but misleading when applied to Rubin. | oversimplified-misleading |
| 13 | "It is a 2.5D architecture: not quite stacked all the way (3D), not quite flat (2D)" | General semiconductor packaging literature | matches — 2.5D is the industry-standard term for side-by-side dies on an interposer | ok |

### Mechanism explanations to flag

- **Quote:** "a separate silicon interposer: a piece of plain, passive silicon, perhaps 2,500 square millimeters, with thousands of fine wires patterned on its top surface and through-silicon vias piercing it from top to bottom."
  - **Status:** This accurately describes CoWoS-S (used in NVIDIA H100). However, the chapter is discussing Rubin, which uses **CoWoS-L**: an organic RDL interposer with embedded local silicon interconnect (LSI) bridges — not a monolithic silicon slab. The Rubin interposer is substantially larger (~4,700 mm², 5.5× reticle vs the ~2,500 mm² CoWoS-S silicon) and its construction is fundamentally different. The chapter should distinguish CoWoS-S from CoWoS-L, or explicitly note that Rubin uses CoWoS-L.
  - **Severity:** oversimplified-misleading

- **Quote:** "the interposer wafer is then thinned (its TSVs are exposed by polishing the back)"
  - **Status:** Describes the CoWoS-S flow correctly. In CoWoS-L, the organic RDL layer does not undergo the same backside silicon thinning/polishing step, as TSVs are not the interconnect mechanism. This is a mechanism error for the Rubin context.
  - **Severity:** oversimplified-misleading

### Suggested auto-fixes (clear errors only)
- In stat row: Replace "8 — DRAM dies per HBM4 stack" with "12–16 — DRAM dies per HBM4 stack" — HBM4 ships in 12-Hi (SK Hynix, Micron initial samples) and 16-Hi configurations per JEDEC spec and vendor announcements. "8 — HBM stacks per Rubin GPU" would also be correct but is a different quantity.
- In prose: Replace "Eight DRAM dies stacked on a base logic die" with "Twelve (or sixteen) DRAM dies stacked on a base logic die" — for HBM4 specifically.

### Open questions for the author
- The chapter conflates two distinct CoWoS variants. CoWoS-S (used in H100) uses a monolithic silicon interposer with TSVs. CoWoS-L (used in Blackwell and Rubin) uses an organic RDL substrate with embedded silicon bridge chiplets; it does not use a single-piece silicon interposer in the same sense. The chapter's silicon interposer description and TSV-thinning description apply to CoWoS-S, not CoWoS-L. The author should clarify which variant is meant, or use H100 as the illustrative example before discussing Rubin's CoWoS-L.
- The interposer size "perhaps 2,500 square millimeters" may reflect the H100/CoWoS-S era. For Rubin's CoWoS-L interposer, TSMC's current production of 5.5-reticle SiPs puts the interposer area at ~4,700 mm² (5.5 × 858 mm²). This should be updated.

---

## Chapter 13 — The Vera Rubin Superchip

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "100 PFLOPS — FP4 compute per superchip" (stat row) | [NVIDIA NVL72 page](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/): 3,600 PFLOPS / 72 GPUs = 50 PFLOPS per GPU × 2 GPUs per superchip = 100 PFLOPS; [SiliconAngle CES 2026](https://siliconangle.com/2026/01/05/nvidia-debuts-rubin-chip-336b-transistors-50-petaflops-ai-performance/) | matches — 50 PFLOPS per GPU × 2 GPUs = 100 PFLOPS per superchip | ok |
| 2 | "576 GB — HBM4 per superchip" (stat row) | [NVIDIA NVL72 page](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/): 288 GB × 2 GPUs = 576 GB | matches | ok |
| 3 | "1.8 TB/s — NVLink-C2C bandwidth" (stat row) | [NVIDIA Vera CPU page](https://www.nvidia.com/en-us/data-center/vera-cpu/); [NVIDIA Technical Blog](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | matches | ok |
| 4 | "17,000 — components per superchip" (stat row) | [NVIDIA/YouTube Vera Rubin platform video](https://www.youtube.com/watch?v=ZkPU5GHDqkQ); NVIDIA's own descriptions | matches — NVIDIA has publicly stated ~17,000 components per superchip | ok |
| 5 | "each fabricated on TSMC N2 with around 500 billion transistors" | [SiliconAngle CES 2026](https://siliconangle.com/2026/01/05/nvidia-debuts-rubin-chip-336b-transistors-50-petaflops-ai-performance/); [Hashrate Index breakdown](https://hashrateindex.com/blog/nvidia-vera-rubin-nvl72-specs-breakdown/); [Awesome Agents R200 spec](https://awesomeagents.ai/hardware/nvidia-rubin-r200/); [NVIDIA Technical Blog](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | **wrong** — two errors: (1) process is **TSMC N3P**, not N2; (2) transistor count is **336 billion**, not ~500 billion. NVIDIA officially announced 336 billion transistors at CES 2026. The 500 billion figure appears in early pre-announcement speculation. | auto-fix |
| 6 | "Each delivers about 50 petaflops of FP4 inference compute on its own" | [NVIDIA NVL72 page](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/): 3,600 PFLOPS / 72 GPUs = 50 PFLOPS; [SiliconAngle](https://siliconangle.com/2026/01/05/nvidia-debuts-rubin-chip-336b-transistors-50-petaflops-ai-performance/) | matches | ok |
| 7 | "The Vera CPU is...built around 88 cores of NVIDIA's Olympus Arm v9 architecture" | [NVIDIA Vera CPU page](https://www.nvidia.com/en-us/data-center/vera-cpu/); [Tom's Hardware](https://www.tomshardware.com/pc-components/gpus/nvidia-unveils-details-of-new-88-core-vera-cpus-positioned-to-compete-with-amd-and-intel-new-vera-cpu-rack-features-256-liquid-cooled-chips-that-deliver-up-to-a-6x-gain-in-cpu-throughput) | matches — 88 Olympus cores, Arm v9.2 instruction set | ok |
| 8 | "NVLink-C2C (Chip-to-Chip)...runs at 1.8 TB/s bidirectional — roughly seven times the bandwidth of PCIe Gen6" | [NVIDIA Vera CPU page](https://www.nvidia.com/en-us/data-center/vera-cpu/); [PCI-SIG PCIe 6.0 spec](https://pcisig.com/pci-express-6.0-specification); [Rambus PCIe 6 guide](https://www.rambus.com/blogs/pcie-6/) | **disputed** — NVLink-C2C at 1.8 TB/s is correct. PCIe Gen6 x16 is 256 GB/s **total bidirectional** (128 GB/s per direction). 1,800 GB/s ÷ 256 GB/s = ~7×, so the "seven times" ratio is approximately right when comparing total bidirectional bandwidths. However, the chapter earlier says PCIe Gen6 "offers about 256 GB/s in each direction at x16" — that is incorrect; 256 GB/s is the *total* bidirectional figure, not the per-direction figure (which is 128 GB/s). The "seven times" comparison is numerically correct only if both figures are bidirectional total. Hashrate Index also describes NVLink-C2C as "7x PCIe Gen 6." | judgment |
| 9 | "PCIe Gen6 — the latest fully ratified standard at the time of Rubin's design — offers about 256 GB/s in each direction at x16" | [PCI-SIG PCIe 6.0 spec](https://pcisig.com/pci-express-6.0-specification); [Rambus PCIe 6.1 guide](https://www.rambus.com/blogs/pcie-6/); [Logic Fruit PCIe Gen6 explainer](https://www.logic-fruit.com/blog/pcie/pcie-gen6-the-strategic-backbone-for-next-generation-enterprises/) | **wrong** — PCIe Gen6 x16 provides **128 GB/s per direction** (256 GB/s total bidirectional). The PCI-SIG specification and Rambus both confirm: "128 GB/s...in both directions simultaneously for a total bandwidth capacity of 256 GB/s." The chapter's phrasing "256 GB/s in each direction" is off by 2×. | auto-fix |
| 10 | "hundreds of differential pairs running at multi-tens of gigabits per second each" | [NVIDIA Technical Blog on NVLink-C2C](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/); SemiAnalysis Vera Rubin analysis | matches — consistent with known NVLink SerDes architecture using 400G-class links | ok |

### Mechanism explanations to flag

- **Quote:** "the CPU's memory and the GPU's memory are coherent; the CPU can address the GPU's HBM directly without copying data over PCIe."
  - **Status:** Correct. NVLink-C2C enables cache-coherent unified memory between Vera CPU and Rubin GPU, eliminating explicit PCIe copies. This is one of NVLink-C2C's core value propositions.
  - **Severity:** ok

### Suggested auto-fixes (clear errors only)
- Replace "fabricated on TSMC N2 with around 500 billion transistors" with "fabricated on TSMC N3P with 336 billion transistors" — NVIDIA's official announcement at CES 2026 specifies N3P and 336 billion transistors.
- Replace "offers about 256 GB/s in each direction at x16" with "offers about 256 GB/s total bidirectional (128 GB/s per direction) at x16" — the PCI-SIG spec is unambiguous: 256 GB/s is the total bidirectional figure.

### Open questions for the author
- The "seven times" comparison between NVLink-C2C and PCIe Gen6 is numerically defensible (1,800 / 256 ≈ 7) only if both are measured as total bidirectional bandwidth. If the author intends a per-direction comparison (1,800 / 128 ≈ 14×), the multiplier should be ~14×. The chapter should clarify the basis of the comparison to avoid confusion with the immediately preceding per-direction PCIe figure.

---

## Chapter 14 — The NVL72 Rack

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "72 GPUs — per NVL72 rack" (stat row) | [NVIDIA NVL72 page](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/) | matches | ok |
| 2 | "3.6 EFLOPS — FP4 per rack" (stat row) | [NVIDIA NVL72 page](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/): 3,600 PFLOPS = 3.6 EFLOPS | matches | ok |
| 3 | "260 TB/s — all-to-all NVLink bandwidth" (stat row) | [NVIDIA NVL72 page](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/); [NVIDIA Technical Blog](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | matches | ok |
| 4 | "~600 kW — rack power" (stat row) | [Ming-Chi Kuo supply chain analysis](https://x.com/mingchikuo/status/2008439734536986852); [Hashrate Index NVL72 breakdown](https://hashrateindex.com/blog/nvidia-vera-rubin-nvl72-specs-breakdown/); [LinkedIn post Jan 2026](https://www.linkedin.com/posts/marklewis8_newest-warm-water-cooled-nvidia-vera-rubin-activity-7415004084619030529-AEeu); [The Register](https://www.theregister.com/2025/03/19/nvidia_charts_course_for_600kw/) | **wrong** — the VR200 NVL72 rack draws ~190 kW (Max Q) or ~230 kW (Max P). The 600 kW figure refers to **Rubin Ultra NVL576** in the future Kyber rack architecture (announced GTC 2025), not the NVL72. The NVL72 chapter incorrectly uses the 600 kW Kyber/NVL576 power figure throughout. | auto-fix |
| 5 | "18 compute trays, each holding 4 Rubin GPUs and 2 Vera CPUs" | [NVIDIA docs.nvidia.com NVL72 hardware](https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html); [Lenovo GB300 NVL72 product guide](https://lenovopress.lenovo.com/lp2357-lenovo-nvidia-gb300-nvl72-rack-scale-ai); [Supermicro GB300 NVL72 datasheet](https://www.supermicro.com/datasheet/datasheet_SuperCluster_GB300_NVL72.pdf) | matches — 18 compute trays, 4 GPUs + 2 CPUs per tray is confirmed across multiple OEM configurations | ok |
| 6 | "9 NVLink switch trays" | [NVIDIA docs](https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html); [Lenovo NVL72 guide](https://lenovopress.lenovo.com/lp2357-lenovo-nvidia-gb300-nvl72-rack-scale-ai); [Hashrate Index](https://hashrateindex.com/blog/nvidia-vera-rubin-nvl72-specs-breakdown/) | matches | ok |
| 7 | "72 Rubin GPUs and 36 Vera CPUs in a single 19-inch rack" | [NVIDIA NVL72 page](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/) | matches | ok |
| 8 | "approximately 3.6 exaflops of FP4 inference compute, with 18.7 TB of HBM4 memory in aggregate" | [NVIDIA NVL72 page: 20.7 TB](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/) | **wrong** — NVIDIA's official spec lists **20.7 TB** of HBM4 for the NVL72 rack. The chapter states "18.7 TB" which is off by 2 TB. (72 GPUs × 288 GB = 20,736 GB ≈ 20.7 TB) | auto-fix |
| 9 | "Six hundred kilowatts of electrical power — comparable to a small office building" | [Ming-Chi Kuo analysis: ~190–230 kW](https://x.com/mingchikuo/status/2008439734536986852); [LinkedIn NVL72 ~120–130 kW](https://www.linkedin.com/posts/marklewis8_newest-warm-water-cooled-nvidia-vera-rubin-activity-7415004084619030529-AEeu) | **wrong** — the VR200 NVL72 draws ~190–230 kW (Max Q/Max P profiles), not 600 kW. 600 kW applies to the Rubin Ultra Kyber rack (NVL576), a different system. Even NVIDIA's GTC 2025 roadmap slides showing 600 kW referred to Rubin Ultra's Kyber rack in 2027, not the NVL72 announced for 2026. | auto-fix |
| 10 | "260 terabytes per second of all-to-all bandwidth across the 72 GPUs" | [NVIDIA NVL72 page](https://www.nvidia.com/en-us/data-center/vera-rubin-nvl72/): 260 TB/s confirmed | matches — note that SiliconAngle's article erroneously describes this as "260 terabits" rather than "260 terabytes"; NVIDIA official sources confirm TB/s | ok |
| 11 | "the global internet's aggregate cross-sectional bandwidth is, by some estimates, in the same neighborhood" | General industry estimates for global internet backbone bandwidth | judgment — global internet aggregate bandwidth estimates range from hundreds of Tb/s to a few Pb/s depending on methodology; comparing to 260 TB/s (= 2,080 Tb/s) is in the right ballpark but the comparison is contextually contested | judgment |
| 12 | "Assembly time per tray drops from ~2 hours to about 5 minutes" | [Hashrate Index NVL72 breakdown](https://hashrateindex.com/blog/nvidia-vera-rubin-nvl72-specs-breakdown/); NVIDIA Vera Rubin platform presentations | matches — NVIDIA has cited tray swap time improvements in its platform presentations | ok |

### Mechanism explanations to flag

- **Quote:** "NVIDIA replaced the conventional cable harness with a copper midplane: a large printed circuit board running vertically through the center of the rack, into which compute trays plug from one side and switch trays plug from the other."
  - **Status:** Broadly accurate for the NVL72 architecture. The copper midplane/backplane design (used in GB200/GB300 NVL72 as a "rear cable cartridge backplane" or copper spine) allows tray-plug-in connectivity. The description of bidirectional plug-in from compute and switch sides is consistent with published rack diagrams.
  - **Severity:** oversimplified-fair

- **Quote:** "Six hundred kilowatts is too much for air. There is no fan large enough..."
  - **Status:** The figure is wrong (NVL72 is ~190–230 kW, not 600 kW), but the conclusion — that liquid cooling is required — is correct for both NVL72 and the future Kyber rack. The argument holds even at the correct ~200 kW level.
  - **Severity:** (flows from the auto-fix error in power figure)

### Suggested auto-fixes (clear errors only)
- Replace "~600 kW" (stat row and all references throughout chapter) with "~190–230 kW" (Max Q/Max P profiles) — the 600 kW figure belongs to the Rubin Ultra Kyber rack (2027 NVL576), not the NVL72.
- Replace "18.7 TB of HBM4 memory in aggregate" with "20.7 TB of HBM4 memory in aggregate" — 72 GPUs × 288 GB = 20,736 GB ≈ 20.7 TB, per NVIDIA's official NVL72 spec page.

### Open questions for the author
- The chapter may be inadvertently conflating the VR200 NVL72 (the Vera Rubin rack discussed throughout) with the Rubin Ultra NVL576/Kyber rack that Jensen Huang showed at GTC 2025 as the future 600 kW system. The Kyber rack is a 2027 product with 576 GPU dies and ~600 kW TDP, fundamentally different from the NVL72 discussed in this chapter. Recommend reviewing the chapter's origin for the 600 kW figure and confirming which rack system is being described.

---

## Chapter 15 — Burn-In and Reliability

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "125°C — burn-in temperature" (stat row) | [JEDEC JESD22-A108 standard](https://www.eesemi.com/reltests.htm); [AnySilicon HTOL guide](https://anysilicon.com/introduction-htol/); [EESemi HTOL](http://www.77rel.com/stress_tests/htol.php) | matches — 125°C is the standard JEDEC burn-in and HTOL temperature (Tj ≥ 125°C per JESD22-A108) | ok |
| 2 | "100s hrs — burn-in duration" (stat row) | [JEDEC JESD22-A108](https://www.eesemi.com/reltests.htm): "Early Life Burn-in: Biased bake at Tj=125°C for 48 to 168 hours"; [AnySilicon](https://anysilicon.com/introduction-htol/) | matches — standard burn-in is 48–168 hours, so "hundreds of hours" is within range (though more precisely 48–168 h for early-life burn-in vs 1,000 h for HTOL) | ok |
| 3 | "<1 FIT — target failures per billion device-hours" (stat row) | Industry reliability targets for hyperscale hardware | matches — sub-1 FIT is the aspirational hyperscale target; no public NVIDIA specification contradicts this | ok |
| 4 | "Burn-in exposes chips to elevated temperature (typically 125°C) and elevated voltage for hundreds of hours" | [JEDEC JESD22-A108](https://www.eesemi.com/reltests.htm); [EESemi burn-in table](https://www.eesemi.com/reltests.htm) | judgment — 125°C is correct. "Hundreds of hours" is borderline: standard early-life burn-in is 48–168 hours (not hundreds); HTOL is 1,000 hours. "Hundreds" is technically inaccurate for typical burn-in (which is more like tens to low hundreds of hours), though some high-reliability applications do extend to 200+ hours. The chapter seems to conflate burn-in with HTOL. | judgment |
| 5 | "HTOL...operated continuously at elevated temperature and voltage for a thousand hours or more" | [AnySilicon HTOL standard](https://anysilicon.com/introduction-htol/); [77rel HTOL reference](http://www.77rel.com/stress_tests/htol.php): "HTOL will be run at 125°C for 1000 hours" | matches — 1,000 hours is the JEDEC JESD22-A108 standard HTOL duration | ok |
| 6 | "the failure rate is recorded and extrapolated using accepted acceleration models (most commonly the Arrhenius equation for thermal effects)" | [JEDEC JEP122](https://www.ti.com/quality-reliability/reliability/testing.html); general reliability engineering literature | matches — Arrhenius equation is the standard thermal acceleration model used in semiconductor reliability | ok |
| 7 | "NVIDIA equips Rubin with its second-generation RAS engine — Reliability, Availability, and Serviceability" | NVIDIA Rubin platform documentation; prior NVIDIA RAS documentation | judgment — the claim that Rubin's RAS is "second-generation" is plausible: Blackwell introduced dedicated RAS infrastructure and Rubin would represent the next iteration. However, NVIDIA has not publicly numbered its RAS generations with a specific "first/second-generation" designation in publicly available materials. Cannot fully verify. | judgment |
| 8 | "ready to spend the next four to six years running at the limit of its design — twenty-four hours a day" | General GPU data center lifecycle expectations | judgment — 4–6 year GPU lifecycle is an industry norm for enterprise/hyperscale deployments, consistent with typical depreciation schedules. No specific NVIDIA claim is verifiable here. | judgment |

### Mechanism explanations to flag

- **Quote:** "The early-failure region is called infant mortality. The flat region is the chip's useful life. The late rise is wear-out, where mechanisms like electromigration and gate-oxide degradation finally accumulate enough damage to matter."
  - **Status:** Accurate description of the bathtub curve. Electromigration and TDDB (time-dependent dielectric breakdown, which encompasses gate-oxide degradation) are the canonical wear-out failure mechanisms.
  - **Severity:** ok

- **Quote:** "Burn-in exposes chips to elevated temperature (typically 125°C) and elevated voltage for hundreds of hours...Under these stresses, the failure mechanisms that cause infant mortality accelerate by orders of magnitude."
  - **Status:** Partially accurate. 125°C is correct. "Hundreds of hours" slightly overstates standard burn-in duration (48–168 h per JEDEC JESD22-A108 for early-life screen, vs 1,000 h for HTOL). The acceleration claim is correct: the Arrhenius equation predicts that a 10°C rise roughly doubles failure rate. The chapter conflates burn-in (shorter, screens individual chips) with HTOL (longer, validates designs). This is a mild oversimplification.
  - **Severity:** oversimplified-fair

- **Quote:** "The RAS engine can mark a single core as bad and exclude it from scheduling without bringing the rest of the chip down."
  - **Status:** Correct. This is standard partial-bad-die recovery, common in GPU architectures. NVIDIA has documented similar functionality in Hopper (H100) and Blackwell architectures.
  - **Severity:** ok

### Suggested auto-fixes (clear errors only)
- None. No clear numeric errors in this chapter. The "hundreds of hours" burn-in duration is a mild overstatement but not definitively wrong at the high end of some application-specific burn-in protocols.

### Open questions for the author
- The distinction between burn-in (48–168 hours per JEDEC, individual chip screening) and HTOL (1,000 hours, design-level qualification on a sample population) should be made clearer. The chapter describes burn-in running "hundreds of hours" which is more accurately the HTOL duration. Standard production burn-in runs 48–168 hours; the chapter's "hundreds of hours" is at the high end and may conflate the two processes.
- The claim that Rubin has a "second-generation RAS engine" could not be independently verified. If NVIDIA has publicly described it as such in a product brief, a citation should be added.
