# Fact-check audit findings — Chapters 16–20

---

## Chapter 16 — The AI Factory

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "14 NVL72 racks, totaling 1,008 Rubin GPUs and 504 Vera CPUs" | [NVIDIA DGX SuperPOD blog](https://blogs.nvidia.com/blog/dgx-superpod-rubin/), [NVIDIA DGX Vera Rubin NVL72 spec page](https://www.nvidia.com/en-us/data-center/dgx-vera-rubin-nvl72/) | matches — 14 × 72 GPUs = 1,008; 14 × 36 CPUs = 504 | ok |
| 2 | "50.4 exaflops of FP4 inference compute" | [NVIDIA DGX SuperPOD blog](https://blogs.nvidia.com/blog/dgx-superpod-rubin/) | matches — NVIDIA states exactly "50.4 exaflops of FP4 performance" for the 14-rack SuperPOD | ok |
| 3 | "1,046 TB of fast HBM4 memory in aggregate" | [NVIDIA DGX SuperPOD blog](https://blogs.nvidia.com/blog/dgx-superpod-rubin/) | matches — NVIDIA states "1,046TB of fast memory" | ok |
| 4 | "Rubin reduces inference token cost by roughly 10× compared to Blackwell" | [NVIDIA Newsroom — Rubin announcement](https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer), [NVIDIA blog](https://blogs.nvidia.com/blog/data-blackwell-ultra-performance-lower-cost-agentic-ai/) | matches — NVIDIA officially claims "up to 10x reduction in inference token cost … compared with the NVIDIA Blackwell platform" | ok |
| 5 | "reduces by 4× the number of GPUs needed to train a mixture-of-experts model" | [NVIDIA Newsroom](https://nvidianews.nvidia.com/news/rubin-platform-ai-supercomputer) | matches — NVIDIA states "trains MoE models with 4x fewer GPUs" vs Blackwell | ok |
| 6 | "NVLink 6 handles all GPU-to-GPU traffic" inside a rack | [NVIDIA developer blog](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | matches — NVIDIA NVLink 6 is the sixth-generation scale-up fabric; 3.6 TB/s per GPU confirmed | ok |
| 7 | "NVIDIA's Quantum-X800 InfiniBand and Spectrum-X Ethernet fabrics" | [NVIDIA DGX SuperPOD blog](https://blogs.nvidia.com/blog/dgx-superpod-rubin/), [Quantum-X800 product page](https://www.nvidia.com/en-us/networking/products/infiniband/quantum-x800/) | matches — both fabrics named exactly in NVIDIA SuperPOD announcement | ok |
| 8 | "BlueField-4 DPUs handle the protocol offload — encryption, congestion control, telemetry" | [NVIDIA DGX SuperPOD blog](https://blogs.nvidia.com/blog/dgx-superpod-rubin/), [NVIDIA developer blog](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/) | matches — BlueField-4 is confirmed in the SuperPOD BOM (18 per NVL72 rack); its role as protocol-offload DPU is accurate | ok |
| 9 | "patterned eighty times by light at 13.5 nanometers" | [ASML EUV documentation](https://www.asml.com/en/technology/euv-lithography/euv-lithography-background) | matches — EUV wavelength universally documented as 13.5 nm | ok |
| 10 | "nine nines of purity" | [Chapters 1–3 cross-reference; standard semiconductor industry specification] | matches — 99.9999999% (9N) ultra-pure silicon is industry standard for electronics-grade polysilicon | ok |

### Mechanism explanations to flag

- No mechanism descriptions in Chapter 16 require flagging. The high-level description of AI factory cooling (dry coolers, evaporative towers, district-heating loops) and networking (gradient sync, near-linear scaling) is accurate and not misleading.

### Suggested auto-fixes

None.

### Open questions for the author

- The chapter describes the SuperPOD stat-row as "1,046 TB — fast HBM4 memory." NVIDIA's official spec describes this figure as "fast memory," which includes both HBM4 GPU memory (20.7 TB × 14 = 289.8 TB) and the LPDDR5X CPU memory (54 TB × 14 = 756 TB), totalling ~1,046 TB. The figure is accurate, but the label "fast HBM4 memory" in the stat row is slightly misleading because the bulk of it is CPU LPDDR5X, not HBM4. Consider clarifying in the stat row.

---

## Chapter 17 — The Electron's Choice

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "1.12 eV — silicon's band gap at room temperature" | [UniversityWafer silicon band-gap reference](https://www.universitywafer.com/silicon-band-gap.html), [El-Cat silicon properties](https://www.el-cat.com/silicon-properties.htm) | matches — universally cited as 1.12 eV at 300 K | ok |
| 2 | "4 — valence electrons in a silicon atom" | [standard chemistry/physics reference; silicon in Group IV/14] | matches | ok |
| 3 | "about 9 eV in glass" (band gap of glass as insulator example) | [TU Wien SiO₂ material data](https://www.iue.tuwien.ac.at/phd/hollauer/node11.html): 8.9 eV; amorphous SiO₂ experimental band gap cited at 8.0–9.65 eV depending on measurement method | matches as approximate — "about 9 eV" is a reasonable round figure for amorphous SiO₂ | ok |
| 4 | "thermal energy available at room temperature (~0.026 eV)" | Standard kT at 300 K = 0.02585 eV, universally cited as ~0.026 eV | matches | ok |
| 5 | "one part in ten million, sometimes one part in ten billion" (dopant concentration) | [Wikipedia — Doping (semiconductor)](https://en.wikipedia.org/wiki/Doping_(semiconductor)): Si has ~5×10²² atoms/cm³; doping range 10¹³–10¹⁸ cm⁻³ | matches for the low end — at 10¹³ cm⁻³, ratio is ~2×10⁻¹⁰ (≈1 in 5 billion); "one in ten billion" (10⁻¹⁰) is consistent. "One in ten million" (10⁻⁷) corresponds to ~5×10¹⁵ cm⁻³, a standard moderate doping level. Range is accurate | ok |
| 6 | "Stat row: 1 in 10¹⁰ — ratio of dopant to host atoms" | [Wikipedia doping](https://en.wikipedia.org/wiki/Doping_(semiconductor)) | matches at low end — 10¹³ dopants / 5×10²² Si = 2×10⁻¹⁰; the stat row value of 1:10¹⁰ is consistent with light doping | ok |
| 7 | "one part contamination per billion" (purity claim in Ch16 lookback) | Standard polysilicon purity specification (9N = 1 ppb) | matches | ok |
| 8 | "The p-n junction was demonstrated by Russell Ohl at Bell Labs in 1939" | [Computer History Museum — Silicon Engine](https://www.computerhistory.org/siliconengine/discovery-of-the-p-n-junction/): key experiment Feb 23, **1940**; [Wikipedia Russell Ohl](https://en.wikipedia.org/wiki/Russell_Ohl): "Ohl, in 1939, discovered the PN barrier"; [PBS transistor history](https://www.pbs.org/transistor/science/events/pnjunc.html): experiment on "February 23" (1940); [AVS paper](https://nccavs-usergroups.avs.org/wp-content/uploads/JTG2010/2010_5current.pdf): "Discovery of photo-voltage in p-n junctions: 1939-40"; Bell Labs innovation list attributes the p-n junction to **1939** | disputed — primary sources disagree. The decisive demonstration (the famous cracked silicon crystal with the photovoltaic effect, shown to Bell colleagues) is consistently dated to **February 23, 1940** by the Computer History Museum and PBS. Wikipedia's article uses 1939, as does the AVS memorial. The discovery was a process across 1939–1940. Attributing it solely to "1939" is defensible but not the most accurate date; **1940** is more often cited for the demonstration itself | judgment |
| 9 | "Slip in a phosphorus atom (column V, five valence electrons)" | Standard chemistry | matches | ok |
| 10 | "Slip in a boron atom (column III, three valence electrons)" | Standard chemistry | matches | ok |

### Mechanism explanations to flag

- **Quote:** "Place a slab of n-type silicon next to a slab of p-type silicon — what physicists call a p-n junction — and remarkable things happen. Free electrons from the n-side rush into the p-side to fill holes; holes drift the other way. A region empty of mobile carriers forms at the boundary. An electric field builds up, opposing further migration."
  - **Status:** Accurate and well-stated. This is a textbook description of depletion-region formation. No issue.
  - **Severity:** ok

- **Quote:** "Pure silicon is a curiosity, not a technology. The masterstroke that turns it into a switch is doping: deliberately introducing a few foreign atoms — one part in ten million, sometimes one part in ten billion — to flood the conduction band with carriers."
  - **Status:** Technically the range should be stated the other way: doping concentrations of 1 in 10 million is *heavy* doping (high conductivity); 1 in 10 billion is *very light* doping (used for specific starting material). The text implies going from one extreme to the other is a feature of doping, but the ordering could mislead a reader into thinking lighter is more extreme. Minor.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes

- Consider changing "1939" to "1940" for the Ohl p-n junction demonstration date, or qualifying it as "in work culminating in February 1940" — most primary technical sources (Computer History Museum, PBS Transistor project) use 1940 for the key experiment.

### Open questions for the author

- Multiple credible sources split between 1939 and 1940 for Ohl's p-n junction. The most commonly cited demonstration date is February 23, 1940 (Computer History Museum). Bell Labs internal records may list 1939 as the start of the relevant work. Author should decide which framing best fits the narrative and cite accordingly.

---

## Chapter 18 — The Transistor as a Valve

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "threshold voltage, around 0.4–0.7 V in modern devices" | [FIRGELLI MOSFET threshold calculator](https://www.firgelliauto.com/blogs/engineering-calculators/mosfet-threshold-voltage-calculator); ROHM MOSFET application notes; AOSMD power MOSFET basics | matches — modern logic CMOS devices typically 0.3–0.7 V depending on process; 0.4–0.7 V is accurate for mainstream logic nodes | ok |
| 2 | "Switching the transistor takes around 1 picosecond: 10⁻¹² seconds." | Standard semiconductor physics; intrinsic gate delay in leading-edge nodes is typically sub-picosecond to a few picoseconds | matches — 1 ps is a reasonable representative figure for modern CMOS; gate delays at 3–5 nm are ~1–5 ps | ok |
| 3 | "The energy to flip it once is around 10⁻¹⁷ joules" | Standard CMOS switching energy: E = ½CV²; at 3 nm with C ~ 0.1 fF and V ~ 0.7 V → E ≈ 2.5×10⁻¹⁷ J; literature values for leading-edge nodes are 10⁻¹⁸–10⁻¹⁶ J | matches as order-of-magnitude estimate; 10⁻¹⁷ J is within the credible range | ok |
| 4 | "They number, in a single modern GPU, on the order of eighty billion." | [NVIDIA developer blog — Rubin platform](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/): Rubin GPU has **336 billion** transistors; [SiliconAngle](https://siliconangle.com/2026/01/05/nvidia-debuts-rubin-chip-336b-transistors-50-petaflops-ai-performance/): confirmed 336B. Blackwell B200 = 208B. Even H100/H200 Hopper = 80B | **wrong** — the chapter discusses the "Rubin GPU" in context (having described it in Ch16). The Rubin GPU contains 336 billion transistors, not ~80 billion. 80 billion was the Hopper H100 figure (two generations back). Blackwell = 208B, Rubin = 336B | **auto-fix** |
| 5 | "The gate length — the channel a single electron must cross — is around 15 nanometers, even though the technology is called '3 nm' or '2 nm.'" | [Chip Insights demystifying nodes](https://chipinsights.net/p/demystifying-the-semiconductor-process); [NextBigFuture Samsung/TSMC/Intel comparison](https://www.nextbigfuture.com/2025/07/samsung-versus-tsmc-versus-intel.html): "actual physical sizes are about 16 nanometers"; [3 nm process Wikipedia](https://en.wikipedia.org/wiki/3_nm_process): contacted gate pitch for N3 = 45 nm, but actual gate length (Lgate) is ~12–16 nm | matches — 15 nm is a reasonable figure for the physical gate length at 3 nm-class nodes; the parenthetical point about marketing vs measurement is correct | ok |
| 6 | "The gate oxide is roughly 1 nm thick — about three atoms of silicon dioxide stacked on top of each other." | [TU Wien SiO₂ data](https://www.iue.tuwien.ac.at/phd/hollauer/node11.html): SiO₂ unit cell ~0.4 nm. At 1 nm thick, ~2–3 unit cells. Note: modern devices use high-k dielectrics (HfO₂), not SiO₂, though the equivalent oxide thickness (EOT) is ~1 nm | matches as simplified description; "about three atoms" is roughly correct for SiO₂. The note that modern gates use high-k/metal-gate rather than pure SiO₂ is elided, which is fair for a lay audience | oversimplified-fair |
| 7 | "Below 22 nm, the planar MOSFET stopped working: the gate could no longer maintain control of the channel" | [SemiWiki FinFET Wiki](https://semiwiki.com/wikis/industry-wikis/finfet-wiki/): "Intel introduces 22nm FinFET ('Tri-Gate') in production" (2011); [Lam Research](https://newsroom.lamresearch.com/FinFETs-Give-Way-to-Gate-All-Around): "first commercialized at the 22 nm node"; [Patsnap FinFET review](https://eureka.patsnap.com/report-finfet-vs-planar-fet-assessment-in-processing-speed): "As transistor dimensions shrank below 28nm, leakage current and power consumption in planar FETs reached unacceptable levels" | matches with minor nuance — the FinFET transition happened **at** 22 nm (Intel Ivy Bridge, 2011), not strictly *below* it. Planar degradation was already a problem at 28 nm. The "below 22 nm" phrasing is defensible since the industry-wide abandonment of planar came at and below 22 nm | oversimplified-fair |
| 8 | "The newer gate-all-around (GAA) transistor, used at 2 nm, wraps the gate around all four sides of a stack of silicon nanosheets." | [PatSnap GAA explainer](https://www.patsnap.com/resources/blog/articles/gaa-transistors-at-2nm-nanosheet-architecture-explained/); [Samsung 3nm GAA, TSMC 2nm GAA](https://en.wikipedia.org/wiki/3_nm_process) | matches — Samsung first used GAA at its 3nm node (2022); TSMC introducing nanosheet GAA at 2nm (N2, 2025). "Used at 2 nm" is accurate for TSMC's roadmap, and the four-sided wrap description is correct | ok |
| 9 | "~80 billion — transistors in one Rubin GPU" (stat row) | Same as claim #4 above | **wrong** — should be ~336 billion | **auto-fix** |

### Mechanism explanations to flag

- **Quote:** "A transistor is on. Push a small voltage between drain and source and a current of electrons flows through the new channel."
  - **Status:** Accurate for an n-channel MOSFET in the enhancement-mode description.
  - **Severity:** ok

- **Quote:** "The gate does not pass current; it merely persuades. Power is gained because the persuasion is electrical and the response is also electrical, but vastly larger."
  - **Status:** The last sentence describes voltage gain, which is technically accurate (the gate controls a large current with negligible gate current). "Power is gained" could be misread as violating energy conservation; strictly, power is not created — the gate controls the flow of power from the supply. This is a common pedagogical shorthand.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes

- Replace "on the order of eighty billion" (prose) and "~80 billion" (stat row) with "~336 billion" — the Rubin GPU contains 336 billion transistors per NVIDIA's official announcement. The 80-billion figure matches the older Hopper H100/H200 generation, not Rubin.

### Open questions for the author

- The chapter was likely drafted with the Hopper (H100) GPU as the reference point (~80B transistors). With the Rubin GPU now central to the book's narrative (Chapter 16), the transistor count in Chapter 18 should be updated to match. If the author intends "Rubin GPU" throughout, 336B is correct. If the text is meant to refer generically to "a current frontier GPU," the number should be updated to at minimum Blackwell (208B) or Rubin (336B).

---

## Chapter 19 — From Switch to Logic

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "Claude Shannon's 1937 master's thesis, which proved that boolean algebra … was the natural mathematics for switching circuits" | [Wikipedia — A Symbolic Analysis of Relay and Switching Circuits](https://en.wikipedia.org/wiki/A_Symbolic_Analysis_of_Relay_and_Switching_Circuits): "written … while attending MIT in 1937, and then published in 1938" | matches — submitted August 10, 1937; published 1938 | ok |
| 2 | "4 — transistors per NAND gate" (stat row) | [KTH CMOS lecture notes](https://www.kth.se/social/files/55fc070df276547b6e63e5db/F3en.pdf.pdf): "NAND gate: Area = 4 Transistors"; [EEPower CMOS logic](https://eepower.com/technical-articles/basic-cmos-logic-gates/) | matches — standard CMOS NAND = 2 PMOS in parallel + 2 NMOS in series = 4 transistors | ok |
| 3 | "two PMOS at the top … and two NMOS at the bottom … The PMOS pair sits in parallel … the NMOS pair sits in series" | [EEPower CMOS NAND description](https://eepower.com/technical-articles/basic-cmos-logic-gates/); [TIIJ CMOS logic paper](https://tiij.org/issues/issues/spring97/electronics/cmos/cmostran.html) | matches — this is the correct description of a 2-input CMOS NAND | ok |
| 4 | "NOT? That's a NAND with both inputs tied together." | Standard CMOS; NAND(A,A) = NOT(A·A) = NOT(A) | matches | ok |
| 5 | "AND? A NAND followed by a NOT (which is itself a NAND)." | Standard — AND = NAND then NOT = 2 NANDs total | matches | ok |
| 6 | "Build XOR from NANDs (it takes four)" | [Wikipedia XOR gate](https://en.wikipedia.org/wiki/XOR_gate): "An XOR gate circuit can be made from four NAND gates"; [TutorialsPoint XOR from NAND](https://www.tutorialspoint.com/digital-electronics/implementation-of-xor-gate-from-nand-gate.htm): 4 NAND gates | matches — the canonical 4-NAND implementation of XOR is standard textbook | ok |
| 7 | "build AND from NANDs (it takes two)" | Standard: AND = NAND + NOT = 1 NAND gate + 1 single-input NAND = 2 NAND gates | matches | ok |
| 8 | "NOR is also functionally complete." | Standard digital logic | matches | ok |
| 9 | "NAND just turned out to be cheapest in CMOS — fewer transistors than NOR for the same function" | [KTH lecture notes](https://www.kth.se/social/files/55fc070df276547b6e63e5db/F3en.pdf.pdf): both NAND and NOR = 4 transistors for 2-input gate | **disputed** — a 2-input CMOS NAND and a 2-input CMOS NOR both use exactly 4 transistors; NAND is not cheaper in raw transistor count. The practical layout advantage of NAND is that its series NMOS stack has better drive strength (NMOS is ~2× faster than PMOS), making NAND faster per silicon area in standard CMOS. The "fewer transistors" claim is technically incorrect; the advantage is speed/density from NMOS mobility. | judgment |
| 10 | "~10¹¹ — gates in a frontier GPU" (stat row) | Rubin GPU: 336B transistors; at ~4 transistors/NAND gate, effective gate count ≈ 84 billion ≈ 8.4×10¹⁰, roughly 10¹¹. This is a logical-equivalent approximation | matches as order-of-magnitude | ok |

### Mechanism explanations to flag

- **Quote:** "A pair of voltages — a high one (typically 0.8–1.2 V in modern chips) and a low one (0 V) — represent the binary digits true and false."
  - **Status:** Accurate for modern CMOS logic levels; 0.8–1.2 V is a plausible range for supply voltages in leading-edge nodes.
  - **Severity:** ok

- **Quote:** "In steady state, no current flows through the gate. The PMOS or the NMOS path is always broken. Power is consumed only when the gate switches."
  - **Status:** Accurate description of static CMOS power dissipation model. In reality there is subthreshold leakage and gate oxide tunneling current in modern nodes, making "no current" an idealization. The statement is oversimplified but not misleading for the book's purposes.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes

- The claim "NAND just turned out to be cheapest in CMOS — fewer transistors than NOR for the same function" should be revised. A 2-input NAND and 2-input NOR both use 4 transistors. NAND's practical advantage is speed and drive strength (NMOS series stack is faster than PMOS series stack), not a lower transistor count. Suggested replacement: "NAND just turned out to be faster in CMOS — the series path uses NMOS transistors, which switch roughly twice as fast as PMOS, giving NAND better drive strength than NOR at equal transistor count."

### Open questions for the author

- None.

---

## Chapter 20 — Adders, Latches, Memory

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "A full adder takes about five gates — two XORs, two ANDs, and an OR." | [GeeksforGeeks full adder](https://www.geeksforgeeks.org/digital-logic/full-adder-in-digital-logic/); [Wevolver full adder](https://www.wevolver.com/article/full-adder-circuit-theory-design-and-practical-implementation); [Global Science Network](https://www.gsnetwork.com/full-adder/) | matches — the standard two-half-adder implementation uses exactly 2 XOR + 2 AND + 1 OR = 5 gates | ok |
| 2 | "the full adder is, ultimately, a particular pattern of about twenty NAND gates" | [GeeksforGeeks NAND implementation](https://www.geeksforgeeks.org/digital-logic/implementation-of-full-adder-using-nand-gates/): "Total 9 NAND gates are required"; [Wevolver](https://www.wevolver.com/article/full-adder-circuit-theory-design-and-practical-implementation): "A NAND‑only design utilises nine NAND gates"; [howcpuworks.com](https://howcpuworks.com/blogs/processor/adder): 9 NAND gates | **wrong** — an optimized full adder in NAND-only logic requires **9 NAND gates**, not ~20. The book's "about twenty" appears to come from naively converting each of the 5 standard gates to their NAND equivalents without applying De Morgan simplifications (XOR naive = ~9 NANDs × 2 = 18+ NANDs, but the shared subexpressions reduce this to 9). Even the naive per-gate conversion gives fewer than 20 for a proper CMOS implementation | **auto-fix** |
| 3 | "~6 — transistors per SRAM cell" (stat row) | [arXiv 6T SRAM paper](https://arxiv.org/html/2508.09419v1): "The standard 6T SRAM cell"; [IuE TU Wien](https://www.iue.tuwien.ac.at/phd/entner/node34.html): "6 transistor SRAM cell" | matches — standard CMOS SRAM cell = 6 transistors (two cross-coupled inverters + two access transistors) | ok |
| 4 | "Take two NAND gates and cross-couple them … Two NAND gates, four transistors, cross-coupled. That is the world's smallest unit of memory." | Standard digital logic — SR latch from two cross-coupled NAND gates, each 4 transistors total for both | matches — SR latch from 2 NAND gates is standard; 2 × 2 transistors/NAND is incorrect though (each CMOS NAND = 4 transistors, so 2 NAND gates = 8 transistors total). The "four transistors" phrasing appears to conflate total transistors in the latch | **wrong** — Two CMOS NAND gates contain 4 transistors *each*, totalling **8 transistors** for the full SR latch. The text says "two NAND gates, four transistors" which implies 2 transistors per NAND gate (incorrect). If the author means a minimal BJT/NMOS-only NAND (2 transistors per gate), that is an obsolete technology; standard CMOS NAND uses 4 transistors. See also stat row "~6 transistors per SRAM cell" — the 6T SRAM cell contains 2 cross-coupled inverters (4 transistors) plus 2 access transistors = 6T, which is more complex than the SR latch description implies | **auto-fix** |
| 5 | "SRAM (static RAM, used for CPU caches) consumes negligible power once a bit is stored: leakage currents only." | Standard CMOS SRAM operation | matches — static power in SRAM is dominated by subthreshold leakage; dynamic power only on access | ok |
| 6 | "DRAM … stores bits as tiny charges on capacitors, which leak and must be refreshed every few milliseconds" | [Wikipedia Memory refresh](https://en.wikipedia.org/wiki/Memory_refresh): "DDR SDRAM has a refresh time of **64 ms**"; [JEDEC standard per Georgia Tech paper](https://memlab.ece.gatech.edu/papers/HPCA_2013_1.pdf): "refreshed every 64 millisecond" | **wrong** — DRAM refresh interval is **64 ms** (the full retention window), not "a few milliseconds." The per-row refresh cycle occurs every ~7.8 µs, but the total retention time before data loss is 64 ms (at normal temperatures). "A few milliseconds" significantly understates the refresh interval. | **auto-fix** |
| 7 | "A modern CPU has perhaps 32 of these (architectural registers like rax, rbx, rcx on x86, or x0 through x30 on ARM)" | [x86-64 register reference, Brown CS](https://cs.brown.edu/courses/cs033/docs/guides/x64_cheatsheet.pdf): x86-64 has **16** general-purpose registers (rax, rbx, rcx, rdx, rdi, rsi, rbp, rsp, r8–r15); [AArch64 ABI spec](https://student.cs.uwaterloo.ca/~cs452/docs/rpi4b/aapcs64.pdf): 31 general-purpose registers x0–x30 | **wrong** — x86-64 has **16** architectural general-purpose registers (not 32), and ARM64 (AArch64) has **31** (x0–x30). The claim of "perhaps 32" is incorrect for x86-64 and off-by-one for ARM64. The register name examples (rax, rbx, rcx; x0 through x30) are correct, but the count is inaccurate | **auto-fix** |
| 8 | "accessed in a single clock cycle (a third of a nanosecond at 3 GHz)" | 1 cycle / 3 GHz = 0.333 ns ≈ 1/3 ns | matches | ok |
| 9 | "64 — bits in a modern register" (stat row) | Standard for x86-64 and AArch64 | matches | ok |

### Mechanism explanations to flag

- **Quote:** "Take two NAND gates and cross-couple them: each gate's output feeds back into the other gate's input. Now the system has two stable states."
  - **Status:** Accurate description of the SR latch's bistability. The "Set" input going low and "Reset" going low is correct for an active-low SR NAND latch.
  - **Severity:** ok (but see numeric error above regarding transistor count)

- **Quote:** "Real CPUs use cleverer designs (carry-lookahead, carry-select, Kogge-Stone) that compute carries in parallel rather than serially, knocking the latency from O(n) down to O(log n) for an n-bit add."
  - **Status:** Accurate — ripple-carry is O(n), carry-lookahead/Kogge-Stone achieves O(log n) carry propagation. Well stated.
  - **Severity:** ok

- **Quote:** "The subtractor … is just an adder with one input inverted and a carry-in of 1, courtesy of two's-complement arithmetic"
  - **Status:** Accurate — two's complement subtraction A − B = A + (~B + 1), implemented by inverting B bits and setting carry-in to 1. Correct.
  - **Severity:** ok

### Suggested auto-fixes

- Replace "about twenty NAND gates" with "nine NAND gates" — the standard optimized NAND-only full adder requires exactly 9 NAND gates, well documented in digital logic textbooks and confirmed by multiple sources.
- Replace "Two NAND gates, four transistors, cross-coupled" with "Two NAND gates, eight transistors, cross-coupled" — each CMOS NAND gate contains 4 transistors (2 PMOS + 2 NMOS), so two NAND gates = 8 transistors total.
- Replace "must be refreshed every few milliseconds" with "must be refreshed within 64 milliseconds" — the JEDEC standard for DDR SDRAM specifies a 64 ms retention window before data loss.
- Replace "A modern CPU has perhaps 32 of these" with "A modern CPU has 16 of these (on x86-64) or 31 (on ARM64)" — x86-64 has 16 architectural general-purpose registers and ARM64 has 31 (x0–x30).

### Open questions for the author

- The "world's smallest unit of memory" framing for the 2-NAND SR latch is evocative but technically the DRAM capacitor cell (1 transistor + 1 capacitor) stores a bit in less silicon. The 6T SRAM cell is also widely considered the production standard for static memory. The SR latch framing works well as a conceptual introduction but might benefit from a note acknowledging that production memory cells (DRAM, 6T SRAM) are different constructions.
- The stat row "0 — extra power to remember a bit (statically)" should perhaps read "negligible" rather than "0" — modern SRAM cells do have subthreshold leakage currents that consume static power, especially in advanced nodes, and this is a significant concern in cache design.
