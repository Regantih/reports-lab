# Fact-check findings — Chapters 26–30

## Chapter 26 — The OS as Conductor

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "~1,000+ — processes on a modern desktop at idle" | [Linux process count discussion (common observation)](https://man7.org/linux/man-pages/man2/syscalls.2.html) | matches — realistic idle count on a modern Linux/Windows desktop | ok |
| 2 | "4 KB — the standard memory page" | [Linux kernel memory management docs](https://www.kernel.org/doc/html/v5.8/x86/x86_64/mm.html) | matches — x86-64 standard page is 4 KB | ok |
| 3 | "~100 ns — cost of a system call on modern Linux" | [Oracle Linux blog on syscall latency (getpid ~191–217 ns on Skylake-X)](https://blogs.oracle.com/linux/syscall-latency) | disputed — overhead varies widely; simple fast-path syscalls (vDSO-backed clock_gettime) run under 10 ns; a true kernel-crossing syscall (getpid) costs ~200 ns on modern hardware with mitigations enabled; "~100 ns" is a reasonable textbook approximation but can be 2× too optimistic post-Spectre mitigations | judgment |
| 4 | "typically 256 TB of it on 64-bit systems" | [Linux kernel mm.html: user-space = 128 TB (4-level paging)](https://www.kernel.org/doc/html/v5.8/x86/x86_64/mm.html); [Red Hat limits: max per-process VAS = 128 TB](https://access.redhat.com/articles/rhel-limits) | wrong — with standard 4-level paging on x86-64 (48-bit addresses), user virtual address space is **128 TB**, not 256 TB. 256 TB is the total address space divided equally, but 128 TB is user-space and 128 TB is kernel-space. The 256 TB figure is only correct if you count both halves together or if you refer to the total canonical space. Most sources and kernel docs cite 128 TB for user space. | auto-fix |
| 5 | "Linux exposes about three hundred and fifty system calls" | [man7.org syscalls(2)](https://man7.org/linux/man-pages/man2/syscalls.2.html); [x86-64 syscall table showing 300+ entries in kernel 4.7](https://blog.rchapman.org/posts/Linux_System_Call_Table_for_x86_64/); [Marcin Juszkiewicz syscall count analysis](https://marcin.juszkiewicz.com.pl/2020/12/29/system-calls-by-kernel-version/) | disputed — current Linux 6.x has well over 400 syscall numbers defined for x86-64 (the table in kernel 6.x reaches into the 440s); "~350" was approximately correct for older kernels (~5.x era) but undershoots modern kernels. Acceptable as a round-number estimate for a lay audience, though conservative. | judgment |
| 6 | "Switching between processes — a context switch — costs a few microseconds" | [Linux context switch cost measurement: ~1–30 µs depending on methodology](https://blog.tsunanet.net/2010/11/how-long-does-it-take-to-make-context.html); [LinkedIn article: 1–2 µs direct switch cost](https://www.linkedin.com/pulse/real-cost-context-switching-linux-cache-tlb-cpu-warmup-santhosh-rghuc) | matches — "a few microseconds" is a defensible textbook figure | ok |
| 7 | "Modern Linux uses the Completely Fair Scheduler" | [Linux kernel CFS documentation](https://www.kernel.org/doc/html/latest/scheduler/sched-design-CFS.html) | matches | ok |
| 8 | "syscall on x86-64, svc on ARM" | [Linux syscall ABI references](https://man7.org/linux/man-pages/man2/syscalls.2.html) | matches — `syscall` on x86-64 and `svc` on AArch64 are correct | ok |

### Mechanism explanations to flag

- **Quote:** "typically 256 TB of it on 64-bit systems — even though physical RAM is a few dozen gigabytes shared by all"
  - **Status:** The 256 TB figure is incorrect for user-space on a 4-level paging x86-64 system. The [Linux kernel documentation](https://www.kernel.org/doc/html/v5.8/x86/x86_64/mm.html) shows user-space spans 0 to 0x00007fffffffffff = **128 TB**. The total canonical space (user + kernel) is 256 TB, but that includes kernel-space. With 5-level paging (57-bit), user space grows to 64 PB, not 256 TB.
  - **Severity:** auto-fix

### Suggested auto-fixes (clear errors only)

- Replace "typically 256 TB of it on 64-bit systems" with "typically 128 TB of it on 64-bit systems" — the Linux kernel memory map places user-space virtual memory from 0 to 0x00007fffffffffff, a range of 128 TB with standard 4-level paging. ([Linux kernel mm docs](https://www.kernel.org/doc/html/v5.8/x86/x86_64/mm.html))

### Open questions for the author

- "about three hundred and fifty system calls" — the current Linux 6.x x86-64 ABI table exceeds 440 entries; the ~350 figure reflects older kernel versions. Consider updating to "more than 400" or hedging with "several hundred."

---

## Chapter 27 — The Translation Stack

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "seven distinct languages and seven translations" | Internal chapter logic | matches — the chapter's own numbered list gives exactly seven layers | ok |
| 2 | "LLVM IR, a typed, register-based language that has become the lingua franca of modern compilers" | [InfoWorld LLVM explainer](https://www.infoworld.com/article/2261861/what-is-llvm-the-power-behind-swift-rust-clang-and-more.html) | matches | ok |
| 3 | "Clang, Rust, Swift, Kotlin Native, and many others all emit LLVM IR" | [LogRocket: Rust uses LLVM backend](https://blog.logrocket.com/exploring-rust-compiler-options-gcc-vs-llvm/); [InfoWorld: Swift, Rust, Clang use LLVM](https://www.infoworld.com/article/2261861/what-is-llvm-the-power-behind-swift-rust-clang-and-more.html); [Swift LLVM IR SO answer](https://stackoverflow.com/questions/72602198/swift-compiler-llvm-ir-optimization) | matches | ok |
| 4 | "ELF on Linux, Mach-O on macOS, PE on Windows" | [Wikipedia executable format comparison](https://en.wikipedia.org/wiki/Comparison_of_executable_file_formats); [YouTube cross-compile demo](https://www.youtube.com/watch?v=ehxt6rTc9iI) | matches | ok |
| 5 | "~3-5 µops — what one x86 instruction often becomes" | [Intel optimization guide; general CPU architecture knowledge] | matches — a memory-form ALU instruction can decode to 3+ µops; range is reasonable | ok |
| 6 | "A single ADD [memory], reg instruction might become three µops: a load, an add, and a store" | [Intel x86 optimization references; common decoder textbook knowledge] | matches — this is a standard example in CPU architecture literature | ok |
| 7 | "Python interpreter does this in CPython's ast module" | [CPython source](https://github.com/python/cpython) | matches — CPython's `ast` module handles the AST | ok |

### Mechanism explanations to flag

- **Quote:** "Intel's optimization guide documents the µop breakdown of every instruction."
  - **Status:** Correct in substance. Intel's *Optimization Reference Manual* and the associated instruction tables (Agner Fog's tables, uops.info) document µop counts per instruction. NVIDIA and ARM don't publish comparably detailed public µop tables; the statement that "ARM and Apple Silicon CPUs use similar internal pipelines" is oversimplified-but-fair — they do use out-of-order µop pipelines but the internal decomposition is less publicly documented.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes (clear errors only)

None.

### Open questions for the author

None.

---

## Chapter 28 — The GPU's Different Mind

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "32 — threads in a warp — the GPU's atom of work" | [NVIDIA Developer Forums: warp size is 32 for all CUDA architectures](https://forums.developer.nvidia.com/t/assuming-warpsize-to-be-32/36444); [NVIDIA Hopper architecture in-depth](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/) | matches | ok |
| 2 | "16×16×16 — matrix shape one tensor-core instruction multiplies" | [Modular blog: "originally Tensor cores were limited to small matmuls (on the order of 16×16×16)"](https://www.modular.com/blog/matrix-multiplication-on-nvidias-blackwell-part-1-introduction); [WMMA API for Volta/Ampere uses 16×16×16 FP16 tiles per warp] | matches for Volta/Ampere WMMA per-warp shape; correctly described as the historic baseline | ok |
| 3 | "~104 — active threads on a single Hopper SM" | [NVIDIA Hopper H100 architecture in-depth: max threads/SM = 2048 = 64 warps × 32](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/); [NVIDIA Developer Forums: max 2048 threads/SM](https://forums.developer.nvidia.com/t/maximum-number-of-warps-and-warp-size-per-sm/234378) | wrong — the stat row appears to intend 10^4 (ten thousand) but is either a superscript formatting artifact (should render as 10⁴) or a literal "104." Either way: a single Hopper SM holds at most **2,048 threads** (64 warps × 32 threads), not 10,000. The prose body is accurate ("sometimes 64 or more" warps), but the stat row figure is incorrect. | auto-fix |
| 4 | "Starting with the Volta architecture in 2017, NVIDIA added tensor cores" | [NVIDIA Volta press release: launched May 10, 2017](http://nvidianews.nvidia.com/news/nvidia-launches-revolutionary-volta-gpu-platform-fueling-next-era-of-ai-and-high-performance-computing) | matches — Volta V100 announced May 2017 | ok |
| 5 | "A modern Hopper or Blackwell tensor core can multiply two 4×8×16 matrix tiles" | [NVIDIA Hopper architecture in-depth](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/); [arXiv Blackwell microbenchmark: Hopper WGMMA minimum shape m64×N×k16](https://arxiv.org/html/2512.02189v3); [SemiAnalysis Tensor Core Evolution](https://newsletter.semianalysis.com/p/nvidia-tensor-core-evolution-from-volta-to-blackwell) | disputed — "4×8×16" is not a standard documented Hopper tile shape. Hopper uses WGMMA (warp-group matrix multiply-accumulate) with a minimum shape of m64×8×k16 operated by 128 threads (a warpgroup), not a simple "4×8×16" per core. The stat row's 16×16×16 (the Volta-era warp-level WMMA shape) is more widely cited. The prose description inaccurately characterizes Hopper's tile geometry. | judgment |
| 6 | "A single Rubin GPU pulls roughly 8 TB/s from its HBM stacks" | [NVIDIA Vera Rubin platform blog: 22 TB/s HBM4 bandwidth per Rubin R100 GPU](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/); [SLYD Rubin R100 spec: 22 TB/s per GPU](https://slyd.com/hardware/nvidia-rubin); [Hashrate Index NVL72 breakdown: 22 TB/s per GPU](https://hashrateindex.com/blog/nvidia-vera-rubin-nvl72-specs-breakdown/) | wrong — published Rubin R100 specifications cite **22 TB/s** HBM4 bandwidth per GPU, not 8 TB/s. The 8 TB/s figure more closely matches the Blackwell B200's ~8 TB/s (per GIGABYTE NVL72 spec sheet which shows Blackwell Ultra at 8 TB/s while Rubin is 22 TB/s). If the book means an earlier system's GPU (Hopper H100 = 3.35 TB/s, Blackwell B200 ≈ 8 TB/s), the phrasing should be clarified. | auto-fix |
| 7 | "NVIDIA calls its execution model SIMT — single instruction, multiple threads. It is a refinement of the older SIMD idea" | [NVIDIA CUDA C++ Programming Guide](https://docs.nvidia.com/cuda/cuda-c-programming-guide/) | matches — SIMT vs SIMD distinction is correct | ok |

### Mechanism explanations to flag

- **Quote:** "NVIDIA's Volta whitepaper introduced the design; the Hopper and Blackwell architectures have refined it through several generations."
  - **Status:** Correct and fair.
  - **Severity:** ok

- **Quote:** "A modern Hopper or Blackwell tensor core can multiply two 4×8×16 matrix tiles and accumulate the result in one operation."
  - **Status:** The tile shapes for Hopper and Blackwell are more complex. Hopper's WGMMA instruction for FP16/BF16 uses a minimum m64×N×k16 shape executed by a warpgroup (128 threads). Blackwell's 5th-gen tcgen05 scales to m256×256×16 across two SMs. The "4×8×16" tile is not a standard public description of either. The stat row's 16×16×16 (the Ampere/Volta warp-level WMMA shape) is better-documented for a lay audience.
  - **Severity:** oversimplified-misleading

### Suggested auto-fixes (clear errors only)

- Stat row: Replace "~104 — active threads on a single Hopper SM" with "~2,048 — maximum active threads on a single Hopper SM (64 warps × 32 threads)." ([NVIDIA Hopper Architecture In-Depth](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/))
- Replace "A single Rubin GPU pulls roughly 8 TB/s from its HBM stacks" with "roughly 22 TB/s" for the Rubin R100. ([NVIDIA Vera Rubin platform page](https://developer.nvidia.com/blog/inside-the-nvidia-rubin-platform-six-new-chips-one-ai-supercomputer/)) If the intended reference is a Blackwell GPU, 8 TB/s is approximately correct for B200; clarify which generation.

### Open questions for the author

- The "4×8×16" tile shape for a Hopper tensor core cannot be confirmed against NVIDIA's public documentation. Please verify the source for this specific shape. The Hopper whitepaper and CUDA PTX reference describe WGMMA shapes in terms of m×n×k with k=16, minimum m=64, not 4×8×16.

---

## Chapter 29 — A Neural Network Lives in Numbers

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "~200 B — parameters in a frontier model" | [EpochAI AI models database](https://epoch.ai/data/all_ai_models.csv); [SemiAnalysis GPT-4 architecture: ~1.8T total, 280B active per token](https://newsletter.semianalysis.com/p/gpt-4-architecture-infrastructure) | matches for a dense frontier model at time of writing; GPT-4 is MoE with ~1.8T total but ~280B active per token; Llama-3-70B, Llama-3-405B, and similar open models cluster around 70B–405B; "~200B" is a reasonable round figure for a generic "frontier dense model" | judgment |
| 2 | "the weights occupy 400 GB" (for 200B params in BF16) | Standard calculation: 200B × 2 bytes/param = 400 GB | matches — calculation is correct | ok |
| 3 | "self-attention, introduced by Vaswani et al. in Attention Is All You Need (2017)" | [NeurIPS 2017 paper](https://papers.nips.cc/paper/7181-attention-is-all-you-need); [Wikipedia](https://en.wikipedia.org/wiki/Attention_Is_All_You_Need) | matches — correct attribution and year | ok |
| 4 | "FlashAttention rearranges this computation to be memory-efficient" | [FlashAttention paper (Dao et al., 2022)](https://arxiv.org/abs/2205.14135) | matches | ok |
| 5 | "~80 transformer blocks…in a frontier model" | [Reddit thread on frontier model layer counts](https://www.reddit.com/r/LocalLLaMA/comments/1re5jnx/number_of_layersattention_blocks_in_your_favorite/); GPT-3 = 96 layers; Llama-3-405B = 126 layers; Llama-3-70B = 80 layers | matches as a representative figure; Llama-3-70B has exactly 80 layers; larger models have more (GPT-3 had 96, GPT-4 reportedly ~120); "~80" is accurate for a mid-range frontier model | ok |
| 6 | "A vocabulary of about 100,000 tokens, each mapped to a 16,000-dimensional embedding vector" | Llama 3 vocab = 128,256; GPT-4 tiktoken ~100,277; hidden dim of large models varies (GPT-3 = 12,288; Llama-3-405B = 16,384) | matches approximately — 100K tokens and 16K hidden dim are reasonable approximations for current frontier models | ok |
| 7 | "Training cost: 10^25 floating-point operations or more" | [EpochAI: GPT-4 estimated at 2×10^25 FLOP; Gemini Ultra ~5×10^25 FLOP](https://epoch.ai/blog/training-compute-of-frontier-ai-models-grows-by-4-5x-per-year); [Epoch AI models >10^25 FLOP page](https://epoch.ai/data-insights/models-over-1e25-flop) | matches — GPT-4 is estimated at ~2×10^25 FLOP, making 10^25 a correct lower bound | ok |
| 8 | "NVIDIA's mixed-precision training paper showed that 16-bit formats are sufficient" | [NVIDIA mixed-precision training blog (Micikevicius et al., 2017)](https://developer.nvidia.com/blog/mixed-precision-training-deep-neural-networks/) | matches | ok |
| 9 | "Hopper added native FP8 tensor cores; Blackwell adds FP6 and FP4" | [NVIDIA Hopper architecture: native FP8 E4M3 and E5M2](https://developer.nvidia.com/blog/nvidia-hopper-architecture-in-depth/); [NVIDIA Blackwell FP4 blog](https://developer.nvidia.com/blog/introducing-nvfp4-for-efficient-and-accurate-low-precision-inference/); [arXiv Blackwell microbenchmark: FP4, FP6, FP8 support confirmed](https://arxiv.org/html/2512.02189v1) | matches | ok |
| 10 | "The MLP…expanding the vector to 4× its dimension and contracting it back" | [Standard transformer architecture (Vaswani et al., 2017)](https://papers.nips.cc/paper/7181-attention-is-all-you-need); [FLOP counting references: FFN ratio = 4](https://www.adamcasson.com/posts/transformer-flops) | matches — standard transformer MLP uses 4× expansion ratio | ok |

### Mechanism explanations to flag

- **Quote:** "attention is computed as softmax(QK^T/√d)V: a matrix multiply of Q and K-transpose, a softmax over the result, and another matrix multiply with V"
  - **Status:** Technically correct.
  - **Severity:** ok

### Suggested auto-fixes (clear errors only)

None.

### Open questions for the author

- "Total parameters: 100B–1T, depending on the model" — current frontier models (GPT-4 at ~1.8T total MoE params; Llama-4 Behemoth at 2T) now exceed 1T. Consider updating the upper bound or clarifying that 1T is a dense-model ceiling.

---

## Chapter 30 — A Thought, Token by Token

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "~10^15 — multiplications per generated token" | [OpenAI scaling laws: forward pass ≈ 2N FLOPs per token](https://discuss.huggingface.co/t/understanding-flops-per-token-estimates-from-openais-scaling-laws/23133); [SemiAnalysis GPT-4: ~560 GFLOPs = 5.6×10^11 FLOP per token for GPT-4 active params](https://newsletter.semianalysis.com/p/gpt-4-architecture-infrastructure); [arXiv inference economics: 2N FLOPs per inference token](https://arxiv.org/html/2401.00448v3); [Benjamin Todd inference analysis: GPT-4 = 5.6×10^11 FLOP per token](https://benjamintodd.substack.com/p/how-much-ai-inference-can-we-do) | **wrong** — the standard estimate is **2N FLOPs** per token (multiply-accumulates), where N is the number of active parameters. For a dense 200B-parameter model: 2 × 2×10^11 = 4×10^11 FLOPs ≈ 400 GFLOPs per token, not 10^15. For GPT-4 with ~280B active parameters, SemiAnalysis estimates ~560 GFLOPs = 5.6×10^11 FLOPs per token. The claimed 10^15 would require ~500 trillion active parameters — about 2,500× more than a 200B model. 10^15 is also the total inference compute for an *entire multi-token response* using a smaller model (e.g., 10^11 FLOPs/token × 10^4 tokens ≈ 10^15), not per-token. | auto-fix |
| 2 | "~50 ms — wall time, on a frontier system" | [A100/H100 latency SLA discussion: H100 essential for <50ms per token](https://lyceum.technology/magazine/a100-vs-h100-for-llm-inference/); [Epoch AI inference economics: H100 theoretical bandwidth limit ~24 ms/token](https://epoch.ai/blog/inference-economics-of-language-models) | matches as an order-of-magnitude estimate for interactive decoding on a frontier cluster at low batch size; H100 bandwidth-limited decoding is theoretically ~24 ms/token; with system overheads and multi-GPU communication 50 ms is within range | ok |
| 3 | "~1 J — energy spent producing one token" | [FifthRow LLM energy analysis: Llama3-70B FP8 on H100 = 0.39 J/token; older V100 systems = 3–4 J/token](https://www.fifthrow.com/blog/beyond-the-joule-the-real-progress-problems-and-prospects-of-turning-electrons-into-llm-tokens); [John Snow Labs tokens/joule analysis](https://www.johnsnowlabs.com/tokens-per-joule-how-to-quantify-and-reduce-the-energy-footprint-of-clinical-llm-inference/) | matches as an order-of-magnitude figure; efficient modern deployments are below 1 J/token (~0.4 J), while older systems or larger models approach or exceed 1–4 J/token; ~1 J is a reasonable mid-range estimate | ok |
| 4 | "\"Write a haiku about the moon,\" the user types…becomes maybe 8 tokens" | Tokenizer behavior for tiktoken/BPE | matches — "Write a haiku about the moon" is 7–9 tokens in common tokenizers | ok |
| 5 | "each an integer in the range 0-99,999" | [Llama 3 vocab = 128,256; GPT-4o tiktoken vocab ≈ 200,000](https://github.com/openai/tiktoken) | disputed — Llama 3 uses a vocabulary of 128,256, so token integers go up to 128,255 not 99,999. GPT-4o's vocab is ~200,000. Only some older models (GPT-3 = 50,257) had vocabs below 100K. The chapter's own stat row and Ch 29 describe "about 100,000 tokens" — this is consistent but low for current frontier models. | judgment |
| 6 | "Through 80 blocks" (heading) and "block 80" | [Llama-3-70B has exactly 80 transformer layers](https://github.com/adalkiran/llama-nuts-and-bolts/blob/main/docs/09-IMPLEMENTING-LLAMA-MODEL-ARCHITECTURE.md); GPT-3 = 96; GPT-4 ~120 | matches as a representative figure consistent with Ch 29 | ok |
| 7 | "with key-value caching, it only has to run the new token through the network, reusing the K and V tensors computed earlier" | [Standard KV caching explanation in transformer inference literature] | matches — technically correct description of KV caching | ok |
| 8 | "At every step a quadrillion multiplications, fifty milliseconds, one joule of electricity" | see rows 1–3 above | **wrong** for the "quadrillion (10^15) multiplications" figure — see claim 1 above | auto-fix |
| 9 | "EUV chambers of TSMC Fab 18" | [TSMC Fab 18 is the EUV fab in Tainan, Taiwan](https://www.tsmc.com) | matches | ok |
| 10 | "CoWoS interposers and HBM stacks" | TSMC CoWoS packaging used for H100/B200/Rubin | matches | ok |

### Mechanism explanations to flag

- **Quote:** "with key-value caching, it only has to run the new token through the network, reusing the K and V tensors computed earlier"
  - **Status:** Correct in substance but slightly oversimplified. With KV caching, the new token's Q projection attends to cached K/V from all prior tokens (so attention cost still grows with context length), but the weight-matrix multiplies are only done for the new token. The dominant cost saving is avoiding re-computing all weight matmuls for the entire growing prefix.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes (clear errors only)

- **Critical:** Replace "~10^15 — multiplications per generated token" (stat row) with "~4×10^11 — FLOPs (multiply-accumulates) per generated token" for a 200B-parameter model, or "~10^12" for models approaching 500B active parameters. The standard formula is 2N FLOPs per token for a dense model with N non-embedding parameters. ([OpenAI scaling laws, Kaplan et al.](https://discuss.huggingface.co/t/understanding-flops-per-token-estimates-from-openais-scaling-laws/23133); [SemiAnalysis GPT-4 architecture analysis](https://newsletter.semianalysis.com/p/gpt-4-architecture-infrastructure))
- **Critical:** In the prose, replace both occurrences of "a quadrillion multiplications" / "a quadrillion multiplications, fifty milliseconds, one joule" accordingly. 10^15 is off by approximately 2,500× for a 200B dense model.
- Optionally update "each an integer in the range 0–99,999" to "0–127,999" (for Llama 3, which uses a 128K vocab) or "0–(vocab_size − 1)" generically.

### Open questions for the author

- What specific model and hardware combination was used to derive the ~10^15 figure? If the intended calculation is for the *entire inference request* (e.g., ~2,000 output tokens × ~5×10^11 FLOPs/token ≈ 10^15 total), that should be stated clearly, as the stat row and prose both say "per generated token."
- The ~50 ms and ~1 J figures: at what batch size and on what hardware? These are defensible as rough orders of magnitude but are sensitive to deployment conditions (batch size 1 vs. batch 64, H100 vs. older hardware).
