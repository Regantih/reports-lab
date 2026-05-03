# Chapter 24 — Memory's Pyramid
Subtitle: Registers, caches, DRAM, and the tyranny of distance
Blurb: Why a 3 GHz chip spends most of its life waiting for memory — and how six layers of cache hide the disappointment.

## Stat row
- ~1 cycle — register access
- ~300 cycles — DRAM access — a 300× cliff
- 64 B — the cache line, the unit of memory motion

## Sections
- The disappointment of speed
- Why locality saves us
- The pyramid, layer by layer
- Cache lines and the TLB

## Prose
A 3 GHz CPU completes an instruction every third of a nanosecond. Main memory takes about a hundred nanoseconds to answer a question. If a CPU had to wait on DRAM for every value it needs, it would spend more than 99% of its life idle. The history of modern computer architecture is, more than anything, the history of hiding that wait.

The disappointment of speed

For decades, transistor speed grew faster than memory speed. The result is what computer architects call the memory wall: a cavernous gap between how fast a CPU could in principle compute and how fast memory could feed it. Hennessy and Patterson, in their canonical textbook Computer Architecture: A Quantitative Approach, document the gap doubling roughly every couple of years through the 1990s.

The gap is now staggering. A modern x86 register answers in roughly one cycle. L1 cache answers in three to four. L2 in twelve. L3 in forty. Main memory — the gigabytes of DRAM where your operating system, browser tabs, and AI model weights actually live — takes around three hundred. SSD storage takes hundreds of thousands of cycles. A network round-trip takes tens of millions.

If a register access were one second, a DRAM access would be five minutes, an SSD access would be a day and a half, and a coast-to-coast network round-trip would be more than a year. Computers do not look that slow only because we have spent six decades engineering away the appearance of waiting.

Why locality saves us

The trick that saves us is a deep empirical regularity in how programs use memory: locality of reference. Programs do not access memory at random. They tend to reuse recently used locations (temporal locality) and to access nearby locations soon after each other (spatial locality). A loop that processes an array touches addresses sequentially. A function that updates a variable will likely update it again on the next iteration.

If we keep a small fast memory close to the CPU and stuff it with whatever the CPU just used, we will be right far more often than chance. That is the entire idea of a cache.

A computer is mostly a giant correctness mechanism wrapped around a very fast guess about what you'll need next. The guess is right about 95% of the time, and that is enough.

The pyramid, layer by layer

Modern systems stack six levels of storage in a strict pyramid. At the top is the smallest, fastest, most expensive layer. At the bottom is the slowest, biggest, cheapest. The CPU first looks at the top, and only descends if it must.

  

Registers (~256 B, 1 cycle). Sixteen to thirty-two named slots inside the CPU itself, holding the values currently being operated on. They are not addressed; the compiler decides which value lives in which register.

  

L1 cache (~64 KB, 3-4 cycles). Split into instruction and data caches, sitting inside the core. Holds the inner loop and its most recent values.

  

L2 cache (~1 MB, ~12 cycles). Per-core, larger but slower. Catches what L1 evicts.

  

L3 cache (~64 MB, ~40 cycles). Shared across all cores. The last line of defense before main memory.

  

DRAM (~32 GB, ~300 cycles). Cheap, dense, off-chip. Where most of your program lives. Intel's optimization manual warns repeatedly that a single DRAM miss can stall a core for a hundred instruction-issue slots.

  

SSD/HDD (~1 TB+, ~150,000 cycles). Files, the OS image, model weights at rest. Persistent — survives a power cycle.

The numbers move around with each generation. The shape of the pyramid does not.

Cache lines and the TLB

Caches do not move data byte by byte. They move cache lines — typically 64 bytes on x86 and ARM. Asking for one byte pulls in its sixty-three neighbours, on the bet that you will want them too. This is the architectural bet on spatial locality.

Caches are also indexed by physical address, but programs use virtual addresses (we will meet virtual memory in Chapter 26). So every memory access requires translating virtual to physical, which itself would require a memory access — a vicious circle. The way out is the TLB (translation look-aside buffer), a tiny cache, often just sixty-four entries, that holds the most recent translations. A TLB miss is one of the most expensive routine events in modern computing; an entire subfield of OS performance work exists to keep the TLB happy.

Almost everything that distinguishes "fast code" from "slow code" on the same hardware is, in the end, a question of staying high in this pyramid. Profile any serious program and you will find: the inner loop fits in L1, the working set fits in L3, and the rare accesses to DRAM are prefetched long before they are needed. The CPU is a sprinter chained to a tortoise, and modern systems are the elaborate harness that keeps the sprinter from feeling the chain.

So far, our chip has logic, arithmetic, memory, and a clock. It is ready to run instructions. But the moment it powers on, the silicon is dark and ignorant — it does not know there is an operating system, a disk, a keyboard, a self. The next chapter is the strange ritual by which it learns.