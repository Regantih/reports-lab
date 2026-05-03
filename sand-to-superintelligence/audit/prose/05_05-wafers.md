# Chapter 05 — From Log to Mirror
Subtitle: Slicing, lapping, and chemical-mechanical polish
Blurb: How a 200 kg silicon log becomes hundreds of wafers flat to within an atom across 300 mm of surface.

## Stat row
- 300 mm — wafer diameter (12 inches)
- 775 µm — finished wafer thickness
- 1 nm — surface flatness after CMP
- ~3,000 — wafers from one ingot

## Sections
- Slicing the log
- Lapping and etching
- The mirror finish
- What inspectors look for

## Prose
If you have ever watched a deli slicer carve a salami into translucent rounds, you have already pictured the next step. The Cz ingot — recently still molten, currently a heavy and very expensive dark grey log — is loaded onto a wire saw, and a diamond-impregnated steel filament is dragged through it again and again until the entire ingot is in slices.

Every chip you have ever owned was once a single round on this slicer. The economics of the entire industry rests on how many of those rounds you can pull out of one ingot, and how flat each one is.

Slicing the log

The first step before slicing is cosmetic: the ingot is ground to a precise diameter, and a small flat — or in modern wafers, a notch — is ground along its length to mark the crystal's orientation. (Different orientations give different mechanical and electrical properties; logic chips typically want the [100] face up.)

The slicing happens on a multi-wire saw. A single steel wire, perhaps 100 micrometers thick and impregnated with diamond particles, is drawn between hundreds of tiny pulleys to form a parallel array. The ingot is pushed slowly into this array. The wires cut. After perhaps eight hours of patient sawing, the entire ingot has been transformed into roughly three thousand thin, perfectly parallel discs, each about 925 micrometers thick. Wafer slicing is a high-volume art — the wire path is computer-controlled to within microns, and the kerf loss (silicon turned to dust by the saw) is one of the fab industry's persistent annoyances.

Lapping and etching

A wafer fresh off the saw is unusable. Its surface is rough on the scale of the wire's grit. Worse, the act of cutting introduces subsurface damage — microscopic cracks that penetrate tens of microns into the wafer. Any transistor built atop subsurface damage will fail.

So the wafers go to lapping: a mechanical pressing between two large rotating plates with abrasive slurry between them, which removes a few microns of material and brings both faces parallel. Then to etching: a chemical bath, typically a mixture of hydrofluoric, nitric, and acetic acids, which dissolves another few microns and chemically removes the damaged surface layer. By this point the wafer is around 800 µm thick, smooth, and clean — but not yet flat enough.

The mirror finish

The last step is chemical-mechanical polishing, or CMP, and it is one of the great unsung technologies of the modern world.

The wafer rides face-down on a rotating platen covered with a soft polyurethane pad. Between the wafer and the pad, a continuous stream of slurry — colloidal silica suspended in alkaline solution — flows. The pad's gentle pressure and the slurry's mild chemical attack act in concert: high spots get worn down faster than low spots, because they take more pressure. Over many minutes, the wafer's surface becomes flat to within a single nanometer across its entire 300 mm face. Stand at one edge and look across, and you are looking across a mirror so perfect that the eye cannot find a flaw.

  A scale aside
  

A flatness of less than one nanometer across 300 millimeters is roughly equivalent to polishing a football field flat to within the diameter of a single hydrogen atom. CMP achieves this routinely, on hundreds of millions of wafers per year, in foundries you have never heard of, in cities you couldn't find on a map.

What inspectors look for

Before the wafer leaves the wafer-supplier and enters the foundry, it is inspected. Optical scanners scan the surface for particles down to perhaps 30 nm. Stress-induced defects are checked with X-ray topography. Thickness, flatness, and edge profile are measured at hundreds of points. Bow and warp — the macroscopic curvature — must be tens of microns or less.

The wafer that passes is now ready for the next leg of its journey: not as raw material anymore, but as the substrate on which billions of features will be patterned. It will leave the wafer fab clean, dry, untouched by human hands, in a sealed cassette, and travel — usually to Taiwan — where it will be attacked by light, by gas, and by ions, and eventually emerge as something altogether stranger.

But before any of that can happen, somebody has to design what goes on it.