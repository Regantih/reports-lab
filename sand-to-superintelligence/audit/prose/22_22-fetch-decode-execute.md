# Chapter 22 — Fetch, Decode, Execute
Subtitle: The instruction cycle and a CPU's to-do list
Blurb: What a CPU actually does, billions of times a second: read an instruction, figure out what it means, do it, repeat.

## Stat row
- 3 billion — instructions per second per core
- 4 bytes — size of a typical instruction
- 1 — register that holds the world: the program counter

## Sections
- The loop at the bottom
- Fetch — read the next instruction
- Decode and execute
- Everything is this

## Prose
If you opened up a CPU and asked it what it does, the answer would fit on a postcard. Read an instruction. Figure out what it means. Do it. Move on. Repeat, three billion times a second, until power is removed.

This loop — fetch, decode, execute — is the entire mechanical heart of every general-purpose computer ever built. Babbage's Analytical Engine had it, on paper. The ENIAC had it. The 8088 in the original IBM PC had it. The AMD Zen 5 in your gaming desktop has it. So does the M4 in a new MacBook, and the Vera CPU in a Rubin superchip. The loop is older than electronics. It will outlive most things.

The loop at the bottom

Inside a CPU sits a special-purpose register called the program counter, or PC. (On x86 it's called rip; on ARM, pc; the idea is the same.) It holds a single 64-bit number: the memory address of the next instruction to run.

That is the entire state, at the highest level, of what a CPU is doing. Everything else — the contents of registers, the values in cache, the bits sitting in DRAM — is auxiliary. The PC says where the next instruction lives, and the loop is:

  

Fetch the instruction at the address held in PC.

  

Decode it: figure out what operation it is and what operands it uses.

  

Execute it: send the operands through the ALU (or the load/store unit, or the branch unit), produce a result, write the result back.

  

Update the PC. Usually that means PC = PC + 4 (the next instruction). Sometimes — for jumps and branches — it means PC = (some other address).

  

GOTO 1.

That's it. There is no plan, no consciousness, no lookahead at the top level — just an obedient creature that does what the bytes at PC tell it to, then asks for the next bytes.

Fetch — read the next instruction

The fetch stage sends the value of PC to the memory subsystem and gets back, ideally within a cycle or two, the bytes of the next instruction. On x86 this is a variable-length affair (an x86 instruction can be 1 to 15 bytes); on ARM and most other modern ISAs, it's a clean 4 bytes. Fetched instructions land in the instruction cache, a small, fast SRAM near the front of the CPU dedicated entirely to instruction bytes.

This is the first place memory hierarchy bites you. If the instruction is in the L1 instruction cache, fetch takes 4 cycles. If it has to come from L2, 12 cycles. From L3, 40. From DRAM, 300. From disk, ten million. A CPU spends an enormous amount of its design budget — and most of its die area — on hiding this latency, by speculatively fetching instructions ahead of where the PC currently points and tucking them into cache before the chip realizes it wants them.

Decode and execute

Decoding is taking the raw bytes of an instruction and figuring out what it means. The first few bits — the opcode — say what operation: ADD, LOAD, BRANCH, MULTIPLY. The remaining bits identify the operands: which registers to read from, which to write to, sometimes a constant value baked into the instruction itself. The decoder is a small piece of combinational logic that takes the instruction word and produces, in a single cycle, the dozens of control signals ("send register x3 to ALU input A", "select ADD operation", "write result to register x7") that the rest of the pipeline needs.

On a modern x86 chip, decoding is genuinely complicated — variable-length instructions, multiple instructions per cycle, internal translation into simpler micro-operations called µops. On ARM and RISC-V, where instructions are fixed-length and regular, it is simpler. Either way, the output is the same: control signals + register reads, ready for the execution stage.

Execution is where the actual work happens. For an arithmetic instruction, the operands flow through the ALU and produce a result. For a load, the address-arithmetic unit computes a memory address and the load/store unit launches a memory read. For a branch, the branch unit decides whether to take the branch and computes the new PC. For a multiply or divide, dedicated units do that. For a vector or matrix instruction, an entire wide datapath is fired up.

Everything is this

Pause and feel the strangeness of this. There is no "program" inside a CPU in any meaningful sense. There is no plan, no agenda, no comprehension of what it is doing. There is one register holding an address, and a loop that fetches, decodes, and executes whatever happens to be at that address, then moves on.

What we call a "program" is just a particular sequence of bytes laid out in memory, such that when the CPU follows the loop, the side effects — values written to registers, to memory, to the screen — accomplish something useful. A web browser is a sequence of bytes. A game is a sequence of bytes. A neural network's forward pass, ultimately, is a sequence of bytes. The CPU is profoundly, beautifully indifferent to which.

The CPU does not know it is running Photoshop. It is reading instructions at PC, doing them, advancing PC. Photoshop is what happens when those instructions are arranged just so.

This is the genius of the von Neumann architecture, named for the 1945 paper that codified it: code and data live in the same memory, both are bytes, and the CPU's job is to read and act on bytes. It is a simple architecture. Sixty years of optimization later, it is also the only one that has ever mattered at scale.

  A subtle inversion
  

One of the deepest ideas in computing follows from this: code is data. A compiler is a program whose input is bytes (source code) and whose output is bytes (machine code). A program can write another program; a program can write itself. Every JIT compiler, every dynamic linker, every interpreter, every neural network that generates code — all of these depend on the indifference of the CPU to whether the bytes at PC came from disk or from a million NAND gates flipping last microsecond.

The CPU is, then, a very simple animal. The interesting part is the contract that tells it which bytes mean what. That contract is called the instruction set architecture — the ISA — and it is the seam between hardware and software, the place where physics ends and meaning begins.