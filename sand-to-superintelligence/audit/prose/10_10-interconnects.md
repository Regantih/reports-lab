# Chapter 10 — The Wiring Sky
Subtitle: Fifteen layers of copper, dancing on a postage stamp
Blurb: Above the transistors, miles of copper wiring stack into a sky-city — the metal back-end-of-line.

## Stat row
- 15+ — metal layers in a Rubin GPU
- ~70 km — of copper wiring per chip
- Cu — the metal that replaced aluminum in 1997

## Sections
- After the transistors
- The dual-damascene process
- The stack, in detail
- Why interconnects became the bottleneck

## Prose
The transistors at the bottom of a finished chip are extraordinary, but they are also useless on their own. A transistor is just a switch. To make it compute, you have to wire its outputs into the inputs of other transistors, and those into others, until you have built up the structures we recognize as adders, registers, caches, multipliers, tensor cores. A modern GPU contains roughly half a trillion transistors. The wiring that connects them is its own miracle.

This wiring lives above the transistors, in a layer cake of copper and insulator that is, by volume, the majority of the chip. The whole stack is called the back-end-of-line, or BEOL.

After the transistors

The very first wiring layer — sometimes called the local interconnect — runs in the immediate vicinity of the transistors, with wires only a few tens of nanometers wide. The pitch is so fine that EUV is required again here. As we move up the stack, each successive layer's pitch grows. The middle layers carry the bulk of the chip's signal routing. The top layers carry power, clocks, and the final wiring that will eventually connect to the package.

Together, the BEOL accounts for fifteen or more distinct metal layers in a Rubin-class chip. If you straightened out all the copper in a single GPU and laid it end to end, it would stretch tens of kilometers.

The dual-damascene process

For most of the 20th century, chip wiring was made of aluminum: deposited as a blanket film, then etched into wires using plasma. This worked until features became so small that aluminum's electrical resistance and its tendency to migrate under high current density (electromigration) made it untenable. In the late 1990s, IBM pioneered the switch to copper, a metal that conducts about 40% better and resists electromigration better — but cannot be plasma-etched cleanly.

The solution was the dual-damascene process, named after the inlay metalwork of medieval Damascus. Instead of depositing copper and etching it, the chipmaker etches trenches and via holes into a dielectric first, then fills them with copper, and polishes back the excess until only the inlaid wires remain.

The sequence is:

  

Deposit a low-k dielectric layer on top of the previous metal layer

  

Pattern and etch trenches (for wires) and via holes (for vertical connections)

  

Deposit a thin barrier layer (typically tantalum nitride) to keep copper from diffusing into silicon

  

Deposit a thin copper seed layer with PVD

  

Electroplate copper to fill the trenches and vias completely

  

CMP back the copper, leaving only the inlay

This loop, with all its sub-steps, runs once per metal layer. Fifteen times for a Rubin GPU.

The stack, in detail

The geometry of the BEOL is intentional. The lowest metal layers (M1, M2) have the smallest wire pitch — perhaps 30 nm at the leading edge — and carry signals between adjacent transistors. As you ascend, layers double or more in pitch. Mid-stack layers (M5–M10) carry mid-range signals across larger distances. Top layers (M14, M15, and above) are wide and thick, carrying power from the bond pads down toward the transistors.

The dielectric between metal layers is itself an engineering object. Plain SiO₂ has a relative permittivity (the "k" in low-k) of about 3.9. To reduce capacitive coupling between wires, modern fabs use porous low-k materials with k below 2.5. This complicates everything — porous dielectrics are mechanically weak and hard to work with — but the alternative is signals that do not propagate fast enough to keep up with the transistors below.

Why interconnects became the bottleneck

For most of the history of CMOS, transistors were the limiting factor. Every two years they got smaller and faster, and the wires above them were a comparative afterthought. That has reversed. Modern transistors are so small and so fast that the wires connecting them — particularly at the lowest metal layers — now contribute more delay than the transistors themselves.

This is why much recent innovation in CMOS has been at the BEOL: new dielectrics, new barrier metals, attempts to replace copper with cobalt or ruthenium for the very lowest layers, and the growing use of backside power delivery, in which power wires are routed underneath the transistors instead of through the metal stack above. Rubin's N2 process implements early forms of these innovations.

By the time all this is done — months after the wafer first entered the fab — what was once a polished mirror is now a fully wired, fully patterned, hopefully fully functional set of dies, sitting in a circle on the wafer. There may be hundreds of dies. Some will work. Some will not. To find out which is which, we have to ask them.