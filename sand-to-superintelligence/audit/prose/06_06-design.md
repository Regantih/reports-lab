# Chapter 06 — Designing the Impossible
Subtitle: EDA, transistors, and 15,000 engineer-years
Blurb: Before any atom moves on a wafer, half a trillion transistors are choreographed in software. This is where Rubin is born.

## Stat row
- ~500 billion — transistors per Rubin GPU die
- 15,000+ — engineer-years of design effort
- 4–5 years — from architecture to first silicon
- ~80 — lithography mask sets per chip

## Sections
- The blank canvas
- EDA — software that designs silicon
- The design pyramid
- Designing Rubin
- From design to photomask

## Prose
It is tempting to begin a chip's story with the wafer, the way we have. But the wafer is the easy part. By the time anyone reaches for a piece of silicon, the design they are about to print on it has already absorbed thousands of person-years of attention. The Vera Rubin platform alone took something on the order of fifteen thousand engineer-years to bring from architecture to manufacturable form.

You cannot photograph this work. It happens almost entirely in the abstract, inside servers, in cool rooms in Santa Clara and Hyderabad and Hsinchu. But it is the part of the silicon supply chain where the most human creativity lives.

The blank canvas

A modern GPU starts as a set of intentions. The architects ask: what do we want this chip to do? For Rubin, the answer is to train and infer the next generation of large language models — to multiply matrices billions of times per second on tensors of low-precision numbers, to move that data in and out of memory faster than any system before, and to coordinate dozens or hundreds of these chips into a single thinking machine.

This top-level intention cascades downward. Compute units. Memory hierarchy. Interconnect topology. Power delivery. Clock distribution. Each of these is itself a design problem with its own trade-offs, and each generates further sub-problems. The full design hierarchy of a Rubin-class GPU has perhaps a dozen levels and tens of thousands of sub-blocks.

EDA — software that designs silicon

None of this could be done by hand anymore. The tools that turn intentions into masks are called Electronic Design Automation — EDA — and they are themselves a five-billion-dollar industry, dominated globally by three companies: Synopsys, Cadence, and Siemens EDA.

An engineer writes RTL (register-transfer level) code in a language like SystemVerilog: not a description of the chip's atoms, but a description of what it should compute. EDA tools translate this RTL into a netlist of standard cells — pre-designed building blocks of, say, four-to-eight transistors that perform basic logic operations. These cells are then placed and routed onto a virtual chip floor: where each cell sits, how the wires between them run, what they do to power and clock distribution. Timing must close: every signal must reach every destination within a single clock period, with margin for manufacturing variation. Power must close: the chip must not exceed its thermal envelope. Reliability must close: the chip must not degrade unacceptably over its expected lifetime.

None of this is a single pass. The design loop runs hundreds of times, with each iteration improving timing, power, area, and signal integrity. Modern EDA tools use neural networks to suggest placement strategies; humans review, refine, and re-run.

The design pyramid

It is useful to picture the design as a stack:

  

Architecture — what does the chip do, and how does it organize compute?

  

Microarchitecture — how do pipelines, caches, registers actually work?

  

RTL — the explicit hardware description in code

  

Logic synthesis — RTL becomes a netlist of standard cells

  

Place & route — cells get coordinates, wires get paths

  

Physical verification — does this layout obey the foundry's design rules?

  

Mask generation — the layout is sliced into the dozens of layers that will be printed

Each layer of this stack is a discipline. Each requires specialists. The chips that can train tomorrow's frontier models are designed by teams whose composition would have been unimaginable to chip designers thirty years ago — half of the headcount works in machine learning to optimize the compiler that will eventually run on the silicon they are designing.

Designing Rubin

The Rubin GPU is built on TSMC's N2 process — the foundry's first commercial node to use gate-all-around nanosheet transistors. These transistors are a structural break from the FinFETs that have dominated the last decade.

In a FinFET, the transistor's "fin" — a thin vertical wall of silicon — acts as the channel for current. The gate wraps the fin on three sides, giving good electrostatic control but leaving the bottom of the fin to leak. In a gate-all-around (GAA) nanosheet device, the channel is broken into a stack of horizontal silicon sheets, each suspended in midair, with the gate wrapping each sheet on all four sides. The result: less leakage, lower threshold voltage, and the ability to keep shrinking when FinFETs cannot.

This is the substrate Rubin is designed for. Each GPU die is roughly 800 square millimeters — close to the reticle limit, the largest area a single EUV exposure can pattern at once. Within that area, perhaps half a trillion transistors are placed, wired, and verified. The verification alone consumes thousands of CPU-years. Software simulates the entire chip down to the transistor level, running representative workloads, finding bugs that — if missed — would not surface until silicon, which costs tens of millions of dollars per spin.

From design to photomask

When the design is finally signed off, the layout is sliced into perhaps eighty individual mask layers — one for each lithography step the wafer will undergo in the fab. These layouts are sent to a mask-making vendor, who patterns them in chrome on glass plates using electron-beam lithography. A modern mask set for a leading-edge chip costs hundreds of millions of dollars, and a single defect on a single mask can ruin every wafer it touches.

The masks ship, in armored cases, to the fab. The wafer is waiting. Now silicon and design — having been engineered separately for years — are about to meet for the first time.