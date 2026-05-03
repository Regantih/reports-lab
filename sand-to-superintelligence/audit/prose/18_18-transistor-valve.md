# Chapter 18 — The Transistor as a Valve
Subtitle: How a gate voltage opens a channel
Blurb: Inside a single MOSFET: the moment a few hundred millivolts on the gate persuades a billion electrons to flow.

## Stat row
- ~0.7 V — threshold voltage
- ~10-12 s — switching time
- ~80 billion — transistors in one Rubin GPU

## Sections
- The modern transistor
- Opening the channel
- The numbers, made small
- A billion valves, choreographed

## Prose
A transistor is the smallest decision a piece of matter can make. It says flow or it says don't, and it can change its mind a billion times a second. Everything else in this volume — every algorithm, every operating system, every neural network — is what happens when you wire enough of these decisions together.

The species we care about is the MOSFET — the metal-oxide-semiconductor field-effect transistor. Almost every transistor in your laptop, in a Rubin GPU, in your phone, is a MOSFET. They number, in a single modern GPU, on the order of eighty billion.

The modern transistor

Forget the schematic symbol for a moment and look at the physical structure. A MOSFET is not a bag of components; it is a single sculpture cut into the silicon surface. Three regions of differently-doped silicon — source, channel, drain — sit side by side. Above them, separated by a sliver of silicon dioxide barely thicker than a single layer of atoms, sits the gate.

The source and drain are heavily n-doped: they are full of free electrons. The region between them is p-doped: it is full of holes, which means it is empty of free electrons. Without help, no current can flow from source to drain — the channel is, in effect, an insulator.

The gate is the help.

Opening the channel

Apply a positive voltage to the gate. The electric field punches down through the oxide and into the p-doped silicon below. Holes are repelled away from the surface; the few stray electrons in the substrate are attracted toward it. As the gate voltage rises past a critical value — the threshold voltage, around 0.4–0.7 V in modern devices — something striking happens. The surface layer of the p-region inverts. It becomes locally n-type. A continuous sheet of electrons appears, only a few nanometers thick, bridging source to drain.

The transistor is on. Push a small voltage between drain and source and a current of electrons flows through the new channel. Drop the gate back to zero and the channel collapses. The current vanishes.

This is the entire trick. A voltage on a gate, separated from the silicon by a sheet of glass thinner than a virus, decides whether a billion electrons next door are free to march. The gate does not pass current; it merely persuades. Power is gained because the persuasion is electrical and the response is also electrical, but vastly larger.

A transistor is a valve in which the handle is made of voltage and the water is made of electrons. Turn the handle, and the river starts.

The numbers, made small

The numbers around a single MOSFET are worth pausing on. In a leading-edge node:

  

The gate length — the channel a single electron must cross — is around 15 nanometers, even though the technology is called "3 nm" or "2 nm." (The naming convention is now marketing, not measurement.)

  

The gate oxide is roughly 1 nm thick — about three atoms of silicon dioxide stacked on top of each other.

  

Switching the transistor takes around 1 picosecond: 10⁻¹² seconds.

  

The energy to flip it once is around 10⁻¹⁷ joules — small enough that a transistor can be flipped a hundred trillion times on the energy of a single calorie.

These numbers explain the entire economic story of the digital age. Every shrink lets you put more transistors into the same square millimeter (more arithmetic per chip), and reduces the energy of each switch (more arithmetic per joule). For fifty years, both progressed in lockstep. We are now seeing the first decade in which they have begun to part — and that is much of the story of Dennard scaling's slow death, of why GPUs replaced CPUs as the engine of frontier intelligence, and of why this book exists.

  FinFET → GAA, briefly
  

Below 22 nm, the planar MOSFET stopped working: the gate could no longer maintain control of the channel and electrons leaked through even when the transistor was supposed to be off. The FinFET wraps the gate around three sides of a vertical silicon fin. The newer gate-all-around (GAA) transistor, used at 2 nm, wraps the gate around all four sides of a stack of silicon nanosheets. Same physics; better grip.

A billion valves, choreographed

One transistor is unimpressive. It is a switch. We have had switches for centuries. What changes when you fabricate a billion of them on the same crystal, all working at picosecond speed, all controllable by other transistors?

Two things change. First, we can build any boolean function we like — and we will spend the next chapter doing exactly that. Second, the latency, energy, and reliability scales become simply unlike any other engineered system in human history. A modern chip can be commanded to perform an operation, and a billion electrons in a billion locations will respond, within picoseconds, more reliably than the postal service can deliver a letter across town.

What we have, in a single MOSFET, is a tiny act of obedience. What we are about to build is everything that can be done with a great many tiny acts of obedience, exactly synchronized.