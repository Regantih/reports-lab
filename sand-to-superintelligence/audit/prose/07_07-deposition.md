# Chapter 07 — Painting with Atoms
Subtitle: CVD, ALD, PVD and the art of thin films
Blurb: Coating the wafer one atomic layer at a time, in vacuum, at temperatures that would melt aluminum.

## Stat row
- ~80 — deposition steps per chip
- 0.1 nm — ALD thickness control
- 10⁻⁹ — torr — typical fab vacuum

## Sections
- Vacuum and violence
- PVD — sputter the metal on
- CVD — let the gas do the work
- ALD — one atomic layer at a time

## Prose
A wafer that has just arrived at a leading-edge fab is, for all its purity and flatness, a blank slate. Every transistor, every wire, every insulator that will eventually live on it must be added — and added with a precision that is not metaphoric. Films must be uniform to within a few atoms of thickness across 300 millimeters. They must adhere. They must have the right grain structure, the right stoichiometry, the right electrical properties.

The discipline of growing these films is called thin-film deposition, and it has three major dialects.

Vacuum and violence

All of this happens in vacuum. The cleanest air in the most sterile cleanroom on earth is a chemical riot compared to what a film deposition needs. Inside the chamber, pressures fall to 10⁻⁶ torr — about a billionth of atmospheric. At these pressures, an atom can travel meters before colliding with anything. This is what allows the engineer to control which atom lands where.

The wafer rides on a heated chuck (often called a "susceptor"), is exposed to whatever the chamber is doing, and emerges minutes later coated in a film whose thickness, composition, and crystallinity are exactly what the recipe demanded.

PVD — sputter the metal on

Physical vapor deposition is the brute-force option. A solid block of the material you want to deposit — copper, tungsten, titanium nitride — sits at the top of the chamber as a "target." A plasma of argon ions slams into the target, knocking atoms loose. Those atoms drift downward, collide with the wafer below, and stick.

PVD is fast and predictable, which is why it is used for blanket metal layers — the seed layers under copper interconnects, for instance. Its weakness is that it is line-of-sight: atoms travel in straight lines from target to wafer. If the wafer's surface has high-aspect-ratio features (deep narrow trenches), PVD struggles to coat the bottoms.

CVD — let the gas do the work

Chemical vapor deposition trades brute force for chemistry. Gaseous precursors — silane (SiH₄) for silicon, tetraethyl orthosilicate for SiO₂, various organometallic compounds for metals — are flowed into a heated chamber. The precursors crack apart on the hot wafer surface, leaving the desired material behind and venting volatile byproducts.

Because the deposition is mediated by gas-phase chemistry, CVD coats conformally: the films deposit equally well on horizontal and vertical surfaces, equally well on flat fields and inside deep holes. CVD is the workhorse for dielectric layers and many thin metal films. It is the dialect a fab speaks most often.

ALD — one atomic layer at a time

Then there is atomic layer deposition, which is a kind of obsessive cousin of CVD. In ALD, the chamber is exposed to one precursor at a time, in pulses. The first pulse — say, a precursor containing hafnium — fills the chamber. Hafnium atoms attach to the wafer surface, but only one layer thick: once the surface is saturated, no more can stick. The chamber is purged. Then a second precursor — say, water vapor — is pulsed in. It reacts with the hafnium-bearing surface, leaves behind a single layer of HfO₂, and exhausts.

One pulse of A. Purge. One pulse of B. Purge. The cycle repeats. Each cycle deposits exactly one atomic layer — no more, no less, regardless of geometry or surface variability. ALD is slow (a single high-quality film might take an hour to deposit) but it is the only way to coat 2 nm-scale features with sub-nanometer thickness control. It is how the high-k gate dielectrics around Rubin's nanosheet transistors are grown.

  A small thought experiment
  

Imagine painting a wall by spraying it with one molecule of paint at a time, allowing the wall to grab one molecule at every available site, then sweeping away the rest before adding the next color. ALD is exactly this — except your wall has trenches twenty stories deep, and you must coat them as evenly as the flat parts. It works because chemistry, not geometry, governs the result.

A modern Rubin GPU undergoes dozens of deposition steps in its life on the wafer, weaving together different films in a stack hundreds of nanometers thick. Each film must be patterned. Each pattern requires a step we have not yet introduced — the step that, more than any other, defines the modern chip industry.