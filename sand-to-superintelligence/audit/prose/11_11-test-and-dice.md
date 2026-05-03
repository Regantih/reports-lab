# Chapter 11 — Test and Dice
Subtitle: Yield, the industry's most guarded secret
Blurb: Why some wafers produce 90% working chips and others produce 30% — and why nobody will tell you which.

## Stat row
- ~600 — tests per die at probe
- 60–80% — typical yield, leading-edge
- ~$10,000 — cost per known-good Rubin die

## Sections
- The question every wafer asks
- Wafer probe
- What yield really means
- The dice

## Prose
A wafer that has just emerged from the BEOL is — in principle — finished silicon. In practice, no one yet knows whether any of its hundreds of dies actually work. Every wafer carries some number of fatal defects: a particle that fell on a critical layer at the wrong moment, a misalignment between two masks, a contamination from a chemical bath. The defects are random in time and place; the chips on the wafer are correlated only by their unfortunate proximity to whichever defect found them.

The job of wafer test is to find out, die by die, which ones work.

The question every wafer asks

Probe test happens on a machine called a wafer prober. The wafer is held flat on a vacuum chuck. A probe card — a fixture studded with hundreds of fine, gold-plated tungsten or MEMS needles — descends until each needle touches one of the bond pads on a die. Currents and voltages flow. Test patterns run.

For a complex chip like Rubin, the probe sequence runs hundreds or thousands of distinct tests. DC tests measure leakage currents and power-supply impedance. Functional tests stream patterns through the chip's pipelines and check the outputs. Critical paths are clocked at multiple frequencies to find the fastest the die can reliably run. Memory tests scrub the on-die SRAM. Embedded test infrastructure — circuits added by the designers specifically for testing — exercises the chip's internals.

If everything passes, the die is binned and noted as good. If any test fails, the die is marked as defective. Some failures are recoverable — a die may pass at a slower clock or with one core disabled, and can be sold as a lower-tier product. Others are fatal.

Wafer probe

The whole process, for a 300 mm wafer of large dies like Rubin, takes hours. The prober steps from die to die, probe card lifting and lowering hundreds of times. The result is a wafer map: a record of every die's location, every test result, and (for survivors) which performance bin they fell into. The map travels with the wafer to the next stage.

What yield really means

The fraction of working dies — yield — is the most jealously guarded number in semiconductors. Foundries publish yield in the loosest possible terms; designers and customers learn it through hard contractual negotiation; analysts estimate it through indirect signals like reticle costs and product pricing.

For mature, high-volume products, yields can exceed 90%. For leading-edge logic at the bleeding edge — and Rubin, on TSMC's brand-new N2 process at the reticle limit, is decisively at the bleeding edge — early yields are far lower. A yield of 50% on Rubin would not be surprising for the first months of production. Every wafer that costs perhaps $30,000 to produce yields perhaps thirty saleable chips. The cost-per-die is the inverse of yield, and it dominates the chip's economics.

The yield curve is the silicon industry's central drama. Every node begins with low yields and unhappy customers; over months and years of process improvement, yield climbs, costs fall, and the chip becomes profitable. By the time it does, the next node is already starting the same struggle.

The dice

Once the map is recorded, the wafer is sent to a dicing saw or laser. Channels in the silicon between dies — called scribe lines — are sliced through, and the wafer falls apart into hundreds of individual dies. Bad dies are discarded. Good dies are loaded into trays.

For most chips in the world, this is the moment of maturity. The dies are packaged, sold, and shipped. For the dies destined to become Rubin GPUs, however, this is barely the halfway mark. The most complex packaging the industry has ever attempted — the integration of a GPU die with stacks of high-bandwidth memory on a silicon interposer — is what comes next.