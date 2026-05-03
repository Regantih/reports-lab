# Chapter 12 — CoWoS and the 2.5D Revolution
Subtitle: How HBM4 sits a hair's breadth from the GPU
Blurb: TSMC's chip-on-wafer-on-substrate packaging is the unsung hero of modern AI — and the bottleneck holding it back.

## Stat row
- 288 GB — HBM4 per Rubin GPU
- 22.2 TB/s — memory bandwidth per chip
- 8 — DRAM dies per HBM4 stack
- 2,048-bit — HBM4 interface width

## Sections
- The memory wall
- HBM — stacking memory like books
- The silicon interposer
- TSMC's CoWoS
- The packaging bottleneck

## Prose
A modern AI workload is not bottlenecked by computation. It is bottlenecked by memory. Training or inferring a large language model means moving billions of parameter values back and forth between compute and storage, again and again, billions of times per second. The compute is fast. The arithmetic is fast. The bottleneck is whether the next batch of weights can arrive at the multiplier in time.

This is the memory wall, and it has existed in some form for thirty years. What has changed, in the last decade, is the willingness to break it.

The memory wall

For most of the history of computing, memory has been a separate chip in a separate package on a separate part of the motherboard, connected to the processor by traces on a printed circuit board. Those traces are inches long. They have parasitic capacitance and inductance. They cannot be made arbitrarily wide because the package only has so many pins. The combination — long, narrow paths between processor and memory — has held memory bandwidth orders of magnitude below what the processor could use.

For AI, this gap became unsupportable. By the late 2010s, GPU compute was outrunning memory bandwidth so badly that frontier models were being designed around memory access patterns rather than compute primitives. The fix had to be radical.

HBM — stacking memory like books

The fix was High-Bandwidth Memory: instead of putting memory on its own PCB-mounted chip, you stack DRAM dies vertically and place them, as a unit, immediately next to the processor. Eight DRAM dies stacked on a base logic die, all bonded together by tens of thousands of through-silicon vias (TSVs) that pierce each die from top to bottom. The whole stack is barely a millimeter thick, contains tens of gigabytes of memory, and exposes a 1,024-bit-wide interface in the original HBM. By HBM4, the interface has doubled to 2,048 bits.

For Rubin, each GPU is paired with multiple HBM4 stacks delivering a combined 288 GB of memory at 22.2 TB/s. That bandwidth — twenty-two terabytes per second, per chip — is roughly one hundred times what a desktop CPU can manage from its DDR5 DIMMs. It is the single most important enabler of frontier AI.

The silicon interposer

HBM solves the vertical wiring problem, but you still have to connect the HBM to the GPU. The connection cannot use ordinary package wiring — there are too many signals, and the signals are too fast. The solution is a separate silicon interposer: a piece of plain, passive silicon, perhaps 2,500 square millimeters, with thousands of fine wires patterned on its top surface and through-silicon vias piercing it from top to bottom.

The GPU die sits on the interposer. The HBM stacks sit on the interposer beside it. Each is connected to the interposer with thousands of micro-bumps — tiny copper-tin pillars that solder die to interposer at extraordinarily fine pitch. Signals between GPU and HBM travel through the interposer's wiring, which behaves electrically like a small piece of silicon chip: low capacitance, low inductance, very high density. The trip from GPU to memory and back is reduced from inches to a few millimeters of silicon.

TSMC's CoWoS

The packaging technology that integrates all of this is called CoWoS — Chip-on-Wafer-on-Substrate. The naming describes the assembly order:

  

Chip on Wafer: the GPU die and the HBM stacks are bonded to a silicon interposer wafer using micro-bumps. After bonding, the interposer wafer carries an array of small chip-stacks across its surface.

  

Wafer on Substrate: the interposer wafer is then bonded to a larger organic substrate — the part of the package that will eventually attach to a printed circuit board — using a coarser pitch of bumps. The interposer is then thinned (its TSVs are exposed by polishing the back) and the assembled module is cut from the wafer and packaged.

It is a 2.5D architecture: not quite stacked all the way (3D), not quite flat (2D), but a deliberate hybrid that gets most of the benefit of vertical integration without the thermal nightmare of stacking compute on compute.

The packaging bottleneck

For all its sophistication, CoWoS has a problem: it is hard to make. Each interposer is itself a piece of silicon manufacturing. Each HBM stack is its own miniature chip-on-chip assembly. The micro-bump bonding requires alignment to within microns. Yield matters here too — a single bad bond among thousands ruins an entire $30,000 package.

TSMC's CoWoS capacity has, since 2023, been the binding constraint on AI hardware shipments. Adding capacity is slow because every step is custom: new equipment, new process recipes, new training. NVIDIA's allocation of CoWoS capacity is one of the most carefully negotiated quantities in the industry. Roadmaps are paced by it. Frontier model training plans are paced by it.

The quiet truth of modern AI is that the rate-limiting step is not silicon. It is the silicon-on-silicon-on-substrate assembly that comes after silicon. It is, of all things, packaging.