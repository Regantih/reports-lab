# Chapter 09 — Carving and Doping
Subtitle: Plasma etch and ion implantation
Blurb: Sculpting transistor fins in plasma fire, then bombarding them with ions to give silicon its electrical personality.

## Stat row
- ~50 keV — ion implant energy
- ~10⁵:1 — etch selectivity ratio
- ~1,000°C — anneal temperature

## Sections
- Plasma, the universal solvent
- Reactive ion etching
- Ion implantation
- The healing burn

## Prose
After lithography, the wafer holds an invisible drawing of the chip's next layer in a patterned photoresist. Where the resist is gone, the underlying material is exposed; where the resist remains, the surface is protected. The wafer is now ready for two of the most violent steps in its life: etching away exposed material, and implanting ions into exposed silicon to give it electrical character.

This is where atoms move.

Plasma, the universal solvent

For the earliest decades of integrated circuits, etching was done with liquids — wet chemical baths that dissolved unwanted material and left protected regions intact. Wet etches are still used, but they are isotropic: they eat in all directions equally, which is acceptable when features are large and tolerances are loose. Modern features are neither.

The replacement is plasma etching. The wafer enters a chamber under low pressure. Reactive gases — fluorine compounds for silicon and silicon oxides, chlorine compounds for metals — are injected. A radio-frequency field is applied. The gas ionizes into a plasma: a soup of free electrons, positive ions, and reactive radicals.

The chemistry of the plasma reacts with the exposed surface, forming volatile compounds (silicon tetrafluoride, for instance) that pump away as gas. The unexposed surface, protected by photoresist, is untouched. With the right plasma chemistry, etch selectivities — the ratio of etch rate on the target material to the rate on the masking material — can exceed 100,000 to 1.

Reactive ion etching

The most powerful version is reactive ion etching (RIE). In addition to chemical reactivity, the plasma is biased so that positive ions are accelerated downward toward the wafer. They strike the surface essentially vertically, with kinetic energy. The combination of physical bombardment and chemical reactivity allows RIE to etch anisotropically: the etch proceeds straight down, into the wafer, with vertical sidewalls. This is what makes the FinFET fin and the GAA nanosheet stack possible. Without anisotropic etching, modern transistors as we know them simply do not exist.

Ion implantation

Now the chemistry shifts from removal to addition. Pure crystalline silicon is, electrically, almost useless — its conduction band is empty, and to do anything interesting you have to introduce a small population of charge carriers.

This is what dopants do. Atoms with one fewer valence electron than silicon (like boron) introduce holes — places where an electron could be but isn't, behaving as positive charge carriers. Atoms with one more (like phosphorus or arsenic) donate free electrons. Different regions of a transistor demand different doping types, which is what makes a transistor work at all.

To place dopants with atomic-scale precision, the industry uses ion implantation. The chosen element is ionized in a plasma source, accelerated through tens of thousands of volts, and steered through a magnetic field that filters by mass-to-charge ratio (so that contaminating ions are bent off-axis and never reach the wafer). The pure beam is then scanned across the wafer surface like an electron-microscope raster, with the dose, energy, and angle all controlled to within fractions of a percent.

Where photoresist or oxide masks the surface, the ions stop in the mask. Where the surface is exposed, the ions punch into the silicon to a depth that depends on their energy — typically a few tens of nanometers, sometimes less. They come to rest as substitutional dopants in the silicon lattice, often after disrupting it severely along the way.

The healing burn

That last detail matters. An implanted ion arrives in the lattice with kilo-electronvolts of kinetic energy and behaves rather like an asteroid. By the time it stops, it has knocked the silicon atoms around it out of place, leaving behind a damaged region that is amorphous rather than crystalline.

To heal this damage, the wafer is annealed: heated rapidly, often with a high-power lamp or laser, to around 1,000°C for seconds at a time. The heat lets the silicon atoms find their lattice sites again. The implanted dopants — now sitting near where they will function — become electrically active. Modern rapid thermal anneal recipes can heat a wafer to 1,200°C and back to room temperature in less than a minute, with sub-degree control.

After this, the etched and doped layer is finished. The photoresist is stripped, the wafer is cleaned, and the entire process — deposition, lithography, etch, implant, anneal — begins again for the next layer. A modern leading-edge GPU goes through this loop perhaps eighty times. Each loop adds one layer to the growing chip. Each loop must be perfect.