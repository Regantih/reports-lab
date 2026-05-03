# Chapter 13 — The Vera Rubin Superchip
Subtitle: Two GPUs, one CPU, 1.8 TB/s between them
Blurb: Inside the module that will train the next decade of frontier models — silicon, packaging, and NVLink-C2C in one tile.

## Stat row
- 100 PFLOPS — FP4 compute per superchip
- 576 GB — HBM4 per superchip
- 1.8 TB/s — NVLink-C2C bandwidth
- 17,000 — components per superchip

## Sections
- The module
- Two GPUs and a CPU
- NVLink-C2C, the chip-to-chip bus
- Seventeen thousand parts

## Prose
Up to this point, every chapter has discussed a single chip. From here onward, we discuss systems. The transition is not sentimental: by the time a Rubin GPU is paired with a Vera CPU and packaged together, the unit of design has shifted from the die to the module. The economics shift, the physics shift, the failure modes shift. We are leaving silicon and entering systems integration.

The first artifact of that transition is the Vera Rubin Superchip: a single module containing two Rubin GPUs, one Vera CPU, and the high-speed interconnects that bind them.

The module

Physically, a Vera Rubin Superchip is a flat ceramic-and-organic substrate roughly the size of a paperback book. Embedded within it: three CoWoS-packaged silicon assemblies (two GPU + HBM tiles and one CPU tile), high-speed signal traces between them, dozens of voltage regulators, hundreds of decoupling capacitors, and a perimeter of contacts that will eventually mate the module to a system board.

The module is built up from individual packaged die assemblies that are themselves the products of the steps in the previous twelve chapters. Each tile arrives with its yield certified, its electrical signature verified, and its identity tracked. Robots lay them into the substrate to within microns of position. The whole module contains roughly seventeen thousand individual components, perhaps five times the part count of a smartphone.

Two GPUs and a CPU

The two Rubin GPUs are essentially identical, each fabricated on TSMC N2 with around 500 billion transistors and 288 GB of HBM4 attached. Each delivers about 50 petaflops of FP4 inference compute on its own. Together, they double that.

The Vera CPU is the system's host. It is a custom NVIDIA design — built around 88 cores of NVIDIA's Olympus Arm v9 architecture — and its job is not raw arithmetic but coordination: managing the GPU's memory, dispatching kernels, handling I/O, running the operating system, talking to other Superchips through the rack's network.

The combination of GPU + CPU on a single module is what makes this a superchip rather than just a packaged GPU. The CPU's memory and the GPU's memory are coherent; the CPU can address the GPU's HBM directly without copying data over PCIe. This eliminates one of the oldest tax penalties in heterogeneous computing.

NVLink-C2C, the chip-to-chip bus

The connections that hold this together are not PCIe. PCIe Gen6 — the latest fully ratified standard at the time of Rubin's design — offers about 256 GB/s in each direction at x16. That is too slow.

The bus that links the GPUs and the CPU within a Superchip is called NVLink-C2C (Chip-to-Chip), and it runs at 1.8 TB/s bidirectional — roughly seven times the bandwidth of PCIe Gen6, and at much lower latency. It is implemented as a die-to-die signaling protocol, with serializer/deserializer circuits on both ends, hundreds of differential pairs running at multi-tens of gigabits per second each.

NVLink-C2C is also what allows the Vera CPU and the Rubin GPUs to share a unified memory space. Inside the module, the GPUs can pull data from CPU-attached memory as if it were their own, and vice versa, without explicit copies. To a programmer, the entire 576 GB of HBM and the CPU's DDR5 memory appears as a single coherent address space.

Seventeen thousand parts

The superchip's seventeen thousand components are not all silicon. The vast majority are passive: capacitors and resistors and voltage-regulator modules and impedance-matching networks. Power delivery to a 100-petaflop module is itself an engineering problem of extraordinary scope. Each Rubin GPU draws perhaps 1.4 kW under full load. The voltage regulators must deliver this current at sub-millivolt accuracy, with tens of nanoseconds of response time, while the GPU's load swings from idle to full and back many times per second.

  A scale comparison
  

A finished Vera Rubin Superchip contains more components than a Boeing 737 cockpit. It is assembled by robots in cleanrooms, tested for hours before it leaves the factory floor, and shipped — with its identity tracked individually — to whichever data center has it next.

The superchip is the smallest unit a customer can buy. It is also, by itself, useless. To be turned into an AI factory, it must be combined with seventy-one other GPUs and connected to them in a way the industry has only just learned to do.