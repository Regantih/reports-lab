# Fact-check findings — Chapters 21–25

## Chapter 21 — The Clock

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|------------------------------------|-------------------|---------|----------|
| 1 | "the Pentium 4 had a 31-stage pipeline" | [Tom's Hardware Prescott review](https://www.tomshardware.com/reviews/intel,751-5.html), [Hexus Prescott review](https://m.hexus.net/tech/reviews/cpu/696-intel-pentium-4-32ghz-prescott-34ghz-northwood-34ghz-northwood-extreme-edition/?page=2), [Pentium 4 Wikipedia](https://en.wikipedia.org/wiki/Pentium_4) | disputed — 31 stages is Prescott (Feb 2004); original Pentium 4 (Willamette/Northwood, 2000–2003) had 20 stages. The claim is unqualified. | judgment |
| 2 | "it consumes about 10% of the chip's total power, just keeping time" | [UCI paper on gated clock trees](https://www.cecs.uci.edu/~papers/compendium94-03/papers/1998/aspdac98/pdffiles/05c_4.pdf), [UC Davis paper noting Intel Xscale clock tree = 17% of total chip power](https://www.ece.ucdavis.edu/~hhomayou/files/science.pdf) | disputed — published figures range from ~10% to over 40% for high-performance designs; Xscale was 17%. "~10%" is on the low end and understates the range, but not wrong as a round figure for many chips. | judgment |
| 3 | "a slow, accurate reference (typically 100 MHz from a quartz crystal)" | [AnySilicon CTS guide](https://anysilicon.com/clock-tree-synthesis/) | matches — 100 MHz is a widely used reference clock frequency for PLLs on PC platforms | ok |
| 4 | "branch predictor, accurate >95% of the time" | [Reddit thread citing TAGE/perceptron achieving 99.5%+](https://news.ycombinator.com/item?id=34200564), [Stack Overflow branch prediction accuracy discussion](https://stackoverflow.com/questions/45651957/why-is-branch-prediction-quite-accurate), [Reddit r/Compilers 95% discussion](https://www.reddit.com/r/Compilers/comments/o9k92y/95_branch_prediction_accuracy/) | matches — ">95%" is a defensible lower bound for modern out-of-order CPUs on typical workloads; actual modern predictors typically exceed 99% on SPEC benchmarks | ok |
| 5 | "Modern CPUs are shallower (10-20 stages)" | [Reddit hardware thread citing Intel Core series at 14–19 stages, AMD Zen at 19](https://www.reddit.com/r/hardware/comments/nvoki6/faildozer_vs_netbust_two_biggest_cpu_architecture/) | matches | ok |

### Mechanism explanations to flag
- **Quote:** "the Pentium 4 had a 31-stage pipeline, and could clock above 3 GHz on a process where logic gates were still hundreds of nanometers"
  - **Status:** The 31-stage figure belongs to the Prescott revision (90 nm, launched February 2004). The original Pentium 4 (Willamette, 180 nm, 2000) and Northwood (130 nm, 2002) had 20-stage pipelines and topped out around 3.06 GHz and 3.4 GHz respectively. The Prescott at 90 nm clocked up to 3.8 GHz. The sentence conflates different P4 revisions and implies a single pipeline depth for the entire P4 lineage. "Hundreds of nanometers" is also inaccurate for Prescott (90 nm), though it was true of the original Willamette (180 nm). A reader would get the gist but the specific numbers are assigned to the wrong chip.
  - **Severity:** judgment

### Suggested auto-fixes
_(none — no unambiguous single-number errors)_

### Open questions for the author
- The chapter does not specify which Pentium 4 revision had 31 stages. Recommend adding "the Prescott revision of the Pentium 4 (2004) extended this to 31 stages" to avoid implying the entire Pentium 4 product line was 31 stages. The original P4 was 20 stages.

---

## Chapter 22 — Fetch, Decode, Execute

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|------------------------------------|-------------------|---------|----------|
| 1 | "an x86 instruction can be 1 to 15 bytes" | [OSDev x86-64 Instruction Encoding](https://wiki.osdev.org/X86-64_Instruction_Encoding), [GitHub Gist x86 notes](https://gist.github.com/mikesmullin/6259449) | matches — confirmed 1–15 bytes maximum | ok |
| 2 | "on ARM and most other modern ISAs, it's a clean 4 bytes" | [Emory CS fixed vs variable length ISA](https://www.cs.emory.edu/~cheung/Courses/255/Syllabus/6-CPU/risc-cisc.html), [RISC-V Wikipedia](https://en.wikipedia.org/wiki/RISC-V) | matches for base ARM AArch64 (always 4 bytes); note RISC-V standard ISA is also 32-bit (4 bytes) base, though RISC-V has an optional compressed 16-bit extension (RVC) | ok |
| 3 | "If the instruction is in the L1 instruction cache, fetch takes 4 cycles. If it has to come from L2, 12 cycles. From L3, 40. From DRAM, 300." | [Jyotiprakash blog with modern latency figures](https://blog.jyotiprakash.org/caching-and-performance-of-cpus), [HotHardware CPU cache explainer](https://hothardware.com/news/cpu-cache-explained), [DEV Community cache basics](https://dev.to/larapulse/cpu-cache-basics-57ej) | matches as approximate ballpark figures; L1 is typically 3–5 cycles, L2 7–14 cycles, L3 20–50 cycles, DRAM 200–350+ cycles depending on architecture. All four figures are within the accepted range. | ok |
| 4 | "the von Neumann architecture, named for the 1945 paper that codified it" | [Wikipedia First Draft of EDVAC](https://en.wikipedia.org/wiki/First_Draft_of_a_Report_on_the_EDVAC), [MIT PDF of First Draft](https://web.mit.edu/sts.035/www/PDFs/edvac.pdf) | matches — First Draft of a Report on the EDVAC distributed June 30, 1945; described stored-program concept | ok |
| 5 | "The Vera CPU in a Rubin superchip" | No authoritative public source confirms "Vera CPU" as the name for a Rubin-generation GPU node CPU at time of writing | unverifiable | judgment |

### Mechanism explanations to flag
- **Quote:** "multiple instructions per cycle, internal translation into simpler micro-operations called µops"
  - **Status:** Technically accurate for modern x86 (Intel/AMD both translate CISC instructions into µops in the front-end decoder). No issue.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes
_(none)_

### Open questions for the author
- "The Vera CPU in a Rubin superchip" — "Vera" is used as the CPU name for the NVIDIA Rubin platform. Public documentation of the CPU name "Vera" is limited at time of writing; worth confirming with NVIDIA documentation or press releases.

---

## Chapter 23 — From Transistors to ISA

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|------------------------------------|-------------------|---------|----------|
| 1 | "1978 — year x86 was first defined" | [Intel timeline 1978](https://timeline.intel.com/1978/the-beginning-of-a-legend:-the-8086), [The Chip Letter on Intel 8086](https://thechipletter.substack.com/p/trillion-dollar-stopgap-the-intel), [Ken Shirriff blog](http://www.righto.com/2020/06/a-look-at-die-of-8086-processor.html) | matches — Intel 8086 launched June 8, 1978 | ok |
| 2 | "Extended to 32 bits in 1985 with the 80386" | [Computing History entry](https://www.computinghistory.org.uk/det/6192/Intel-introduces-the-80386-microprocessor/), [Tom's Hardware 80386 40th anniversary](https://www.tomshardware.com/tech-industry/semiconductors/intel-386-at-40), [Intel timeline 1985](https://timeline.intel.com/1985/raising-the-bar-with-the-386), [Wikipedia i386](https://en.wikipedia.org/wiki/I386) | matches — Intel 80386 introduced October 17, 1985 | ok |
| 3 | "Extended to 64 bits in 2003 with AMD's Opteron" | [The Register AMD Opteron launch](https://www.theregister.com/2003/04/22/amd_launches_opteron/), [Reddit 20 years of AMD x86-64](https://www.reddit.com/r/Amd/comments/12s9tt7/20_years_ago_amd_x8664d_the_world/), [Linux Journal AMD64 Opteron](https://www.linuxjournal.com/article/6711) | matches — AMD Opteron launched April 22, 2003 as first x86-64 processor | ok |
| 4 | "~50 — instructions in baseline RISC-V" | [RISC-V Wikipedia](https://en.wikipedia.org/wiki/RISC-V) | matches — base RV32I has 47 instructions; "~50" is an accurate characterization | ok |
| 5 | "~1500 — instructions in modern x86-64" | No single authoritative count was found; the Intel SDM is ~5,000 pages but doesn't give a single instruction count | unverifiable | judgment |
| 6 | "Apple managed it twice (PowerPC → x86 in 2006, x86 → ARM in 2020)" | [Apple newsroom June 2005](https://www.apple.com/newsroom/2005/06/06Apple-to-Use-Intel-Microprocessors-Beginning-in-2006/), [Apple history of Intel transition](https://historyofapple.com/apple-history/apple-transition-to-intel/) | matches — transition to Intel completed by August 2006; ARM transition announced June 2020 | ok |
| 7 | "Through the 2010s, an open-source ISA called RISC-V emerged from UC Berkeley" | [EECS Berkeley RISC-V article](https://eecs.berkeley.edu/news/risc-v-five-alive/), [RISC-V International 10 years](https://riscv.org/10-years-of-risc-v/), [The Chip Letter RISC-V Part 1](https://thechipletter.substack.com/p/risc-v-part-1-origins-and-architecture) | matches — RISC-V started May 2010 at UC Berkeley by Krste Asanović, Yunsup Lee, Andrew Waterman, with David Patterson | ok |
| 8 | "The Intel x86-64 manual runs to roughly 5,000 pages" | [Referenced implicitly; Intel SDM is well-documented as multi-thousand-page document] | matches — Intel 64 and IA-32 Architectures Software Developer's Manual is publicly available and runs to ~5,000 pages across volumes | ok |

### Mechanism explanations to flag
- **Quote:** "modern x86 chips internally translate CISC instructions into a stream of RISC-like µops as part of decoding, then execute those µops in a deeply pipelined, out-of-order RISC core"
  - **Status:** Technically accurate and well-established. Textbook description of Intel and AMD microarchitecture.
  - **Severity:** oversimplified-fair

- **Quote:** "RISC won the technical argument decisively in the 1990s. ARM, MIPS, PowerPC, SPARC — all RISC, all faster per gate than the CISC architectures of the same era."
  - **Status:** "Faster per gate" is a reasonable summary of the RISC advantage in that era, but the framing is somewhat absolutist. The RISC advantage was mostly in simpler pipelining and compiler targeting; absolute performance depended on workload and implementation. Acceptable for a lay audience.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes
_(none)_

### Open questions for the author
- "~1500 instructions in modern x86-64" — an exact or sourced count would strengthen this claim. The Intel SDM does not publish a single official count; estimates vary widely (hundreds to several thousand depending on how you count variants, prefixes, and SIMD extensions). Flagging for author to verify with Intel documentation or a published instruction-count survey.

---

## Chapter 24 — Memory's Pyramid

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|------------------------------------|-------------------|---------|----------|
| 1 | "L1 cache answers in three to four" [cycles] | [Jyotiprakash blog latency figures](https://blog.jyotiprakash.org/caching-and-performance-of-cpus), [DEV Community cache basics](https://dev.to/larapulse/cpu-cache-basics-57ej), [HotHardware cache explainer](https://hothardware.com/news/cpu-cache-explained) | matches — L1 latency typically 1–5 cycles; 3–4 cycles is widely cited and consistent with modern CPUs | ok |
| 2 | "L2 in twelve" [cycles] | [Jyotiprakash blog](https://blog.jyotiprakash.org/caching-and-performance-of-cpus), [Stored Bits cache guide](https://storedbits.com/cpu-cache-l1-l2-l3/) | matches as a representative figure; actual range is 7–14 cycles across architectures | ok |
| 3 | "L3 in forty" [cycles] | [Jyotiprakash blog latency figures](https://blog.jyotiprakash.org/caching-and-performance-of-cpus), [DEV Community cache basics](https://dev.to/larapulse/cpu-cache-basics-57ej) | matches — L3 latency widely cited as 20–50 cycles; 40 is within range | ok |
| 4 | "Main memory...takes around three hundred" [cycles] | [HotHardware: "over 270 CPU cycles"](https://hothardware.com/news/cpu-cache-explained) | matches — 200–350+ cycles depending on DDR generation and clock speed; ~300 is a commonly cited round figure | ok |
| 5 | "L3 cache (~64 MB, ~40 cycles)" | [HotHardware: typical consumer CPUs have 8–32 MB L3; AMD Ryzen 3D V-Cache up to 128 MB](https://hothardware.com/news/cpu-cache-explained), [Stored Bits: L3 between 2 MB and 64 MB, server CPUs >64 MB](https://storedbits.com/cpu-cache-l1-l2-l3/) | disputed — 64 MB is a high-end server/HPC figure; typical consumer/desktop CPUs have 8–32 MB L3. This overstates what is "typical." | judgment |
| 6 | "the TLB (translation look-aside buffer), a tiny cache, often just sixty-four entries" | [Wikipedia TLB: typical size 12 bits – 4,096 entries](https://en.wikipedia.org/wiki/Translation_lookaside_buffer), [Bob's Bizarre: Intel i7/i9 have 64-entry L1 ITLB and DTLB](https://bobbaal.substack.com/p/the-translation-lookaside-buffer) | disputed — "often just sixty-four entries" is accurate for the L1 TLB (e.g., Intel Nehalem L1 DTLB has 64 entries for 4 KiB pages), but modern CPUs have multi-level TLBs with 512 or more entries in L2 TLB. The book implies all TLB state fits in 64 entries, which is an understatement for modern systems. | judgment |
| 7 | "typically 64 bytes on x86 and ARM" [cache line] | [Lemire blog: all Intel/AMD x64 use 64-byte cache lines](https://lemire.me/blog/2023/12/12/measuring-the-size-of-the-cache-line-empirically/), [Hacker News cache line thread: Apple M-series uses 128-byte cache lines](https://news.ycombinator.com/item?id=45529326) | disputed — 64 bytes is correct for x86 and most ARM Cortex-A implementations, but Apple Silicon (M1/M2/M3/M4, which are ARM) uses 128-byte cache lines. The claim is broadly accurate for standard ARM but incorrect for the increasingly prominent Apple ARM implementations. | judgment |
| 8 | "Registers (~256 B, 1 cycle)" | General architectural knowledge | matches — 16–32 general-purpose registers of 8 bytes each ≈ 128–256 B; 1-cycle access is correct | ok |
| 9 | "L1 cache (~64 KB, 3-4 cycles)" | [Stored Bits: most common L1 is 64 KB](https://storedbits.com/cpu-cache-l1-l2-l3/), [HotHardware cache explainer](https://hothardware.com/news/cpu-cache-explained) | matches — 64 KB is common for modern CPUs (combined I+D caches); 3–4 cycles is the standard cited latency | ok |
| 10 | "L2 cache (~1 MB, ~12 cycles)" | [Stored Bits: common L2 is 512 KB to 2 MB](https://storedbits.com/cpu-cache-l1-l2-l3/) | matches as a representative midpoint; actual consumer CPUs range from 256 KB to 4 MB per core | ok |
| 11 | "SSD/HDD (~1 TB+, ~150,000 cycles)" | General knowledge consistent with standard memory latency comparisons | matches — SSD latency is tens to hundreds of microseconds, which at 3 GHz = ~100,000–300,000 cycles; 150,000 is a reasonable midpoint | ok |
| 12 | "A 3 GHz CPU completes an instruction every third of a nanosecond. Main memory takes about a hundred nanoseconds to answer a question." | [HotHardware: L3 ~10–20 ns; DRAM ~50–100 ns](https://hothardware.com/news/cpu-cache-explained) | matches — 1/3 GHz ≈ 0.33 ns per cycle; 100 ns DRAM is consistent with DDR4/DDR5 latency figures | ok |

### Mechanism explanations to flag
- **Quote:** "The trick that saves us is a deep empirical regularity in how programs use memory: locality of reference. Programs do not access memory at random. They tend to reuse recently used locations (temporal locality) and to access nearby locations soon after each other (spatial locality)."
  - **Status:** Standard textbook description. Accurate.
  - **Severity:** oversimplified-fair

- **Quote:** "A computer is mostly a giant correctness mechanism wrapped around a very fast guess about what you'll need next. The guess is right about 95% of the time, and that is enough."
  - **Status:** The 95% figure applies to branch prediction (covered in Ch. 21); for cache hit rates, L1 hit rates in well-written code are typically 95–99%+. The sentence conflates cache hit rates and branch prediction without specifying which. Fine as a rhetorical device for a lay audience.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes
_(none — judgment calls, not clear errors)_

### Open questions for the author
- "L3 cache (~64 MB, ~40 cycles)": Consider replacing 64 MB with a range like "8–64 MB" to cover typical consumer CPUs through server/HPC chips. 64 MB alone implies this is a typical figure when most consumer CPUs have 16–32 MB.
- "TLB...often just sixty-four entries": This describes the L1 TLB accurately but ignores L2 TLBs that hold 512–4,096 entries. Consider adding "in the first-level TLB" to be precise.
- "typically 64 bytes on x86 and ARM": Apple Silicon uses 128-byte cache lines. Consider adding a note, e.g., "64 bytes on x86 and most ARM implementations (Apple Silicon uses 128 bytes)."

---

## Chapter 25 — Boot

### Numeric & named-entity claims
| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|------------------------------------|-------------------|---------|----------|
| 1 | "0xFFFFFFF0 — the address an x86 CPU jumps to on reset" | [OpenSecurityTraining BIOS/SMM Internals slide deck](https://opensecuritytraining.info/IntroBIOS_files/Day1_XX_Advanced%20x86%20-%20BIOS%20and%20SMM%20Internals%20-%20Reset%20Vector.pdf), [mjg59 blog on booting modern Intel CPUs](https://mjg59.dreamwidth.org/66109.html), [Stack Overflow on 0xFFFFFFF0](https://stackoverflow.com/questions/9210296/software-initialization-code-at-0xfffffff0h), [Reddit r/osdev 0xFFFFFFF0](https://www.reddit.com/r/osdev/comments/1mhwtax/0xfffffff0/) | matches — confirmed: CS.BASE is set to 0xFFFF0000 and EIP to 0xFFF0 on reset, giving physical address 0xFFFFFFF0 | ok |
| 2 | "On ARM, it is configurable but typically zero" | [ARM Developer documentation: execution starts from 0x00000000 or 0xFFFF0000 per SCTLR.V bit](https://developer.arm.com/documentation/ddi0406/b/System-Level-Architecture/The-System-Level-Programmers--Model/Exceptions/Reset), [DEV Community ARMv7 bare-metal article](https://dev.to/ripan030/reset-on-armv7-42p7) | matches — ARMv7 reset vector is 0x00000000 (normal) or 0xFFFF0000 (high vector), with 0x00000000 being the default; "typically zero" is accurate for application processors | ok |
| 3 | "On modern PCs this is UEFI (Unified Extensible Firmware Interface); the older standard was BIOS" | General industry knowledge; widely documented | matches | ok |
| 4 | "On Macs it is similar firmware called iBoot" | General knowledge | matches — Apple's iBoot is the firmware used on Macs and iOS devices | ok |
| 5 | "GRUB on most Linux installs, systemd-boot or rEFInd on others, the Windows Boot Manager on Windows, iBoot Stage 1 on Macs" | General knowledge | matches | ok |
| 6 | "Linux's vmlinuz is a self-extracting blob" | General knowledge; well-documented in Linux boot protocol | matches | ok |
| 7 | "PID 1 — historically /sbin/init, today usually systemd on Linux, launchd on macOS, the Service Control Manager on Windows" | General knowledge | matches | ok |
| 8 | "~3 seconds — modern UEFI boot to kernel hand-off" | [mjg59 UEFI boot discussion](https://mjg59.dreamwidth.org/66109.html) | matches as a rough representative figure; actual times vary widely (sub-1 second to many seconds depending on hardware) | ok |
| 9 | "Every flip-flop on the die — and there are billions — slams to a known state" | General knowledge | matches — modern CPUs have billions of flip-flops; all take a known state at reset | ok |

### Mechanism explanations to flag
- **Quote:** "A small circuit detects that the supply voltage has crossed a threshold and asserts the reset line."
  - **Status:** Accurate description of a power-on reset (POR) circuit. The POR monitors the supply rail and deasserts reset once voltage is stable; the flip-flops then assume a known state.
  - **Severity:** oversimplified-fair

- **Quote:** "The bootloader...must also pass the kernel a bundle of facts about the machine — where DRAM lives, which CPUs are present, what the firmware promised — via a structured boot protocol."
  - **Status:** Accurate description of the Linux x86 boot protocol / device-tree handoff mechanism.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes
_(none)_

### Open questions for the author
- None. Chapter 25 is clean; all verifiable claims check out.
