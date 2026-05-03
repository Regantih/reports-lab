# Chapter 19 — From Switch to Logic
Subtitle: NAND, NOR, and the universality theorem
Blurb: How four transistors become a NAND gate, and why a NAND gate alone can compute every function in mathematics.

## Stat row
- 4 — transistors per NAND gate
- 1 — gate type sufficient to compute anything
- ~1011 — gates in a frontier GPU

## Sections
- From on/off to truth
- The NAND gate
- Universality
- A calculator in your pocket

## Prose
A single transistor is a hand on a faucet. To compute anything we need to ask: how do you build a thought out of faucets? The answer is one of the prettiest results in twentieth-century science, and it is the moment chemistry hands the keys to mathematics.

From on/off to truth

The leap is to read a transistor not as physics but as logic. "On" becomes the number 1, "off" becomes the number 0. A pair of voltages — a high one (typically 0.8–1.2 V in modern chips) and a low one (0 V) — represent the binary digits true and false.

This identification — voltage with logic value — was suggested most famously by Claude Shannon's 1937 master's thesis, which proved that boolean algebra (the algebra of and, or, not) was the natural mathematics for switching circuits. Once you have that identification, the question becomes: which arrangements of transistors compute which functions of true and false?

The NAND gate

The most important arrangement is called NAND — short for "not and." A NAND of two inputs is true unless both inputs are true. In modern CMOS technology, we build it from four transistors: two PMOS at the top (which conduct when their gate is low) and two NMOS at the bottom (which conduct when their gate is high). The PMOS pair sits in parallel between VDD and the output; the NMOS pair sits in series between the output and ground.

Walk through the four cases. If both inputs are low: both PMOS conduct, both NMOS are off, the output is pulled to VDD — output is high (true). If only one input is high: that input's NMOS is on but the other is off, so the series path to ground is broken; meanwhile the PMOS for the low input is on, pulling the output to VDD. Output stays high. Only when both inputs are high do both NMOS conduct, both PMOS turn off, and the output is finally pulled to ground. Output is low (false). That is exactly the truth table of NAND.

A subtlety here is worth noting: in steady state, no current flows through the gate. The PMOS or the NMOS path is always broken. Power is consumed only when the gate switches — when the transistor capacitances are charged or discharged. This is what made CMOS logic viable at the scale of billions of gates: a chip's power is determined not by how many gates it contains but by how many gates are switching per second. Idle transistors are essentially free.

Universality

Now the magic. Once you have NAND, you have everything. NAND is functionally complete: every possible boolean function — every truth table you could ever write down, of any number of inputs — can be built out of NAND gates alone. NOT? That's a NAND with both inputs tied together. AND? A NAND followed by a NOT (which is itself a NAND). OR? Use De Morgan's laws: A OR B = NOT (NOT A AND NOT B), and every NOT and every AND is just a NAND. XOR, multiplexer, comparator — all of them, built from NAND.

This is the universality theorem of digital logic. It is the reason a single physical structure — four transistors arranged in a particular pattern — is the lego brick of every computation we have ever performed. Your laptop is, mathematically, an enormous arrangement of NANDs. So is the GPU running a frontier model. So, in principle, would be a brain simulator.

A NAND gate can compute any function of its inputs. Therefore, a great many NAND gates, properly wired, can compute any function — including the function "predict the next word an intelligent being would say." Everything else is implementation.

A calculator in your pocket

You can prove this to yourself with a simple case. Consider the half-adder: a circuit that takes two binary digits and produces their sum. The "sum" output is true if exactly one of the inputs is true (this is XOR). The "carry" output is true only if both inputs are true (this is AND). Build XOR from NANDs (it takes four), build AND from NANDs (it takes two), wire them up — and you have an arithmetic unit. Two of them in series (with the carry of the first feeding the carry-in of the second) make a full adder. Sixty-four of those in a chain make a 64-bit adder, which is what your CPU uses to add the integers in x = y + z.

Pause on this for a moment. The integers added in y + z are ultimately voltages in roughly five thousand transistors, arranged into roughly twelve hundred logic gates, switching simultaneously, settling into the right state in a fraction of a nanosecond. That is one addition. A modern CPU does about ten billion such additions per second per core, and has dozens of cores.

  Why NAND, specifically?
  

NOR is also functionally complete. So is the combination AND+NOT, or OR+NOT. NAND just turned out to be cheapest in CMOS — fewer transistors than NOR for the same function, and friendlier to layout. A whole industry's standard cell libraries grew around it. There is nothing fundamentally special about NAND; it just won the implementation lottery.

One transistor became one bit of decision. A handful of transistors became one logical operation. We are climbing fast. In the next chapter we will use logic to build arithmetic, and arithmetic to build memory, and memory to build the first true unit of computation: the register.