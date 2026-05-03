# Chapter 03 — The Nine-Nines Problem
Subtitle: Polysilicon and the Siemens process
Blurb: How chemists drag silicon from 99% pure to 99.9999999% — one part contamination per billion. The tightest purity humanity routinely achieves.

## Stat row
- 1 part — boron per billion silicon atoms — the limit
- 9N — purity (99.9999999%) for electronic grade
- ~1,100°C — Siemens rod temperature

## Sections
- The trichlorosilane trick
- Distillation, atom-style
- Inside the Siemens reactor
- Counting the nines
- An alternative path: FBR

## Prose
The next step is so absurd in conception that, told as a story, it sounds like alchemy. We will take crushed silicon metal, react it with hydrochloric acid to make a gas, distill that gas the way a vodka maker distills vodka, then bake the gas back into a solid by hovering it over hot rods until silicon precipitates onto them like frost. We will do this for a week. At the end, what we have is a crystal so pure that, if you scaled it up to the size of the Pacific Ocean, you could find perhaps one teaspoon of contamination in the entire body of water.

This is the Siemens process. It is the foundation of the entire electronic-grade silicon industry, and it is essentially unchanged since the 1950s.

The trichlorosilane trick

The opening move is chemistry. Powdered MG-Si is loaded into a fluidized-bed reactor and exposed to gaseous hydrogen chloride at around 300°C. The silicon and the chlorine flirt with each other and produce a clear, faintly fruity-smelling liquid called trichlorosilane:

Si + 3 HCl → SiHCl₃ + H₂

Trichlorosilane is the workhorse molecule of the entire industry. It is volatile (boiling point: 31.8°C — about as much as warm bathwater can produce), liquid at room temperature, and — crucially — distinct from the trichloride compounds of other elements you might find in your starting material. Boron, the most feared impurity, forms BCl₃, which boils at 12.5°C. Phosphorus's compound boils elsewhere. Iron's, elsewhere again.

You see where this is going.

Distillation, atom-style

The crude trichlorosilane is fed into a fractional distillation column, the same broad principle that separates whiskey from mash and gasoline from crude oil. Heated at the bottom, cooled at the top, the column allows different compounds to settle at different heights according to their boiling points. The result is something the chemistry student in you will appreciate: each pass through the column removes 90% or more of remaining boron, phosphorus, and metallic compounds.

Multiple passes — and several rounds of redistribution and re-distillation — drive impurities into the parts-per-trillion range. The trichlorosilane that emerges at the end of this column is, atom for atom, one of the cleanest substances on earth.

Inside the Siemens reactor

Now comes the deposition. The clean trichlorosilane is mixed with hydrogen gas and pumped into a tall, bell-shaped quartz reactor — the Siemens reactor. Inside, thin silicon "seed rods" are heated to about 1,100°C by passing electric current directly through them. They glow a deep cherry red.

The hot rods crack the trichlorosilane gas in their vicinity. Silicon atoms, freed by the heat, deposit onto the rods. Hydrogen and hydrogen chloride float away as gases. Over the course of several days, the rods grow thicker and thicker, accumulating layer after layer of pure silicon, until what started as pencil-thin filaments are now great polysilicon rods, perhaps 150 mm in diameter, two meters tall, gleaming with the texture of a frozen waterfall.

Counting the nines

The industry measures its triumphs in nines. 6N means 99.9999% — six nines after the decimal — and is sufficient for solar panels. 9N, sometimes called electronic grade, means 99.9999999% and is the floor for memory chips. Modern leading-edge logic, including the Vera Rubin GPU we are working toward, demands silicon in the 10N to 11N range.

For perspective: 11N silicon contains, at most, one foreign atom per hundred billion silicon atoms. The structures we will eventually pattern onto this material are themselves counted in atoms — a 2 nm fin is perhaps fifteen silicon atoms wide. A single misplaced boron atom in the wrong fin is, statistically, an event that the chip's designers had to plan for.

An alternative path: FBR

The Siemens process is energy-hungry. Each kilogram of polysilicon takes around 60 kWh of electricity to produce — most of it lost as heat from the radiant rods. An alternative method, the fluidized-bed reactor (FBR), uses silane gas (SiH₄) and produces polysilicon as small beads instead of rods, at roughly one-fifth the energy cost. FBR has captured a substantial fraction of the solar-grade market, but for the highest-purity electronic silicon, the conservatism of the industry — and the maturity of the Siemens process — has kept Siemens dominant.

Either way, the result is the same kind of object: a chunk of silicon so pure that it is, by any meaningful measure, one substance. Now we have to make it one crystal.