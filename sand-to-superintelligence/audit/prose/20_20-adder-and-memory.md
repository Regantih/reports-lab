# Chapter 20 — Adders, Latches, Memory
Subtitle: From half-adder to ALU; the bit that remembers
Blurb: How wired-up gates do arithmetic, and how a clever loop of two NANDs becomes the world's smallest unit of memory.

## Stat row
- 64 — bits in a modern register
- ~6 — transistors per SRAM cell
- 0 — extra power to remember a bit (statically)

## Sections
- Adding, with gates
- The ALU — arithmetic at speed
- The bit that stays
- From latch to register

## Prose
We have logic. We have a way to make any boolean function we wish. The next two miracles are arithmetic and memory: adding, and remembering. Both are built from the same NAND gates we just learned. The fact that they emerge so naturally is part of why digital electronics took over the world so completely.

Adding, with gates

The smallest possible adder is the half-adder we sketched at the end of last chapter: two inputs (each one bit), two outputs (sum and carry). It can add 0+0, 0+1, 1+0, 1+1 — and in the last case it produces sum=0, carry=1, the two-bit answer "10" in binary, which is two in decimal.

To add real numbers we need a full adder: three inputs (two operand bits and a carry-in from the previous bit), two outputs (sum and carry-out). A full adder takes about five gates — two XORs, two ANDs, and an OR. We can build any of these from NANDs, so the full adder is, ultimately, a particular pattern of about twenty NAND gates.

Chain 64 full adders together — the carry-out of bit i feeding the carry-in of bit i+1 — and you have a 64-bit adder. Feed it two 64-bit numbers and the answer ripples through, bit by bit, in a few nanoseconds. This is called a ripple-carry adder, and it is the slow-but-honest version. Real CPUs use cleverer designs (carry-lookahead, carry-select, Kogge-Stone) that compute carries in parallel rather than serially, knocking the latency from O(n) down to O(log n) for an n-bit add.

The ALU — arithmetic at speed

The adder is not alone. Right next to it on the silicon sit the other arithmetic units: a subtractor (which is, beautifully, just an adder with one input inverted and a carry-in of 1, courtesy of two's-complement arithmetic), a shifter (for multiplying or dividing by powers of two), bitwise logic units (AND, OR, XOR, NOT applied 64 ways in parallel), and comparators. Together they form the ALU — Arithmetic Logic Unit — and they are, alongside the register file we'll meet shortly, the heart of any CPU.

The ALU is wired so that a small opcode on its control inputs (a few bits) selects which operation it performs this cycle. The operands feed in on two 64-bit buses; the result emerges on a third. The whole assembly is purely combinational: no memory, no clock — just gates, settling into the right answer like a tuning fork stilling itself. The hard part isn't the answer; it's the schedule.

For multiplication and division, dedicated units called multipliers and dividers do the work. Floating-point arithmetic — the kind used in scientific computing, graphics, and neural networks — is handled by a different set of units called the FPU, the floating-point unit, which is essentially a small constellation of adders, multipliers, and shifters dedicated to manipulating IEEE 754 numbers. In modern AI chips, the FPU has a much larger sibling: the tensor core, an entire matrix-multiply engine baked into the silicon. We'll meet it again in Part II's later chapters.

The bit that stays

Combinational logic — all-NAND, all-gates — can compute, but it cannot remember. The output of an adder depends only on its current inputs; if the inputs change, the output changes. To remember anything we need a circuit that breaks this rule: one whose output depends on its history.

The smallest such circuit is the SR latch. Take two NAND gates and cross-couple them: each gate's output feeds back into the other gate's input. Now the system has two stable states. If gate A's output is high and gate B's is low, that configuration sustains itself; the same is true for the opposite. Pulse the "set" input low and the latch flips to one state; pulse "reset" low and it flips to the other. Otherwise, the latch holds whichever state it last entered, indefinitely, with no continuing power input.

Two NAND gates, four transistors, cross-coupled. That is the world's smallest unit of memory. Everything you have ever stored on a computer — every photo, every paragraph, every weight in a neural network — is, ultimately, a bit in some descendant of this circuit.

The "no continuing power input" part is worth pausing on. SRAM (static RAM, used for CPU caches) consumes negligible power once a bit is stored: leakage currents only. DRAM (used for main memory) cheats by storing bits as tiny charges on capacitors, which leak and must be refreshed every few milliseconds — a small fee for the much higher density. Different memories make different bargains with physics, but the underlying capacity to remember traces back to that pair of cross-coupled gates.

From latch to register

A single bit isn't very useful. Group 64 latches together, share a "load" signal between them, and you have a register: a 64-bit unit of fast, on-chip storage. A modern CPU has perhaps 32 of these (architectural registers like rax, rbx, rcx on x86, or x0 through x30 on ARM) plus dozens or hundreds more "physical" registers used by the out-of-order engine to keep multiple in-flight instructions from stepping on each other's results.

Registers are the fastest memory in the universe of computing. They live next to the ALU, accessed in a single clock cycle (a third of a nanosecond at 3 GHz), built directly out of cross-coupled NANDs. They are also the smallest memory: a few kilobytes total, on the entire chip, vs. the tens of megabytes of cache and gigabytes of DRAM elsewhere in the system. The pyramid begins at this peak.

  A genealogical observation
  

An adder is gates wired into arithmetic. A latch is gates wired into memory. The CPU we are about to assemble is gates wired into a creature that does both, alternately, on a clock — and the GPU we'll meet later is gates wired into a creature that does almost only the first, ten thousand times in parallel. The same NAND, in different braids, becomes very different machines.

Now we have the pieces: arithmetic that can compute, registers that can remember. To make them do anything over time, we need a metronome. We need a clock.