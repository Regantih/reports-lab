# Chapter 15 — Burn-In and Reliability
Subtitle: Stress-testing chips into honesty
Blurb: Why chips are baked at 125°C for hundreds of hours before they're allowed to ship — the statistics of infant mortality.

## Stat row
- 125°C — burn-in temperature
- 100s hrs — burn-in duration
- <1 FIT — target failures per billion device-hours

## Sections
- Infant mortality
- Burn-in
- HTOL and the long term
- RAS, the always-on watcher

## Prose
If you build a million chips, a few thousand of them will fail in the first month. This is unavoidable. It is also unacceptable — when those chips are deployed in a $50 million AI cluster, an early failure is not a defect, it is a project disaster. The semiconductor industry has spent decades learning how to find these chips before they ship.

The discipline is called reliability engineering, and its central insight is the bathtub curve.

Infant mortality

If you plot the failure rate of a population of chips against time in service, you get a curve that is high at the start, low and flat through middle life, and rising again at the very end. The early-failure region is called infant mortality. The flat region is the chip's useful life. The late rise is wear-out, where mechanisms like electromigration and gate-oxide degradation finally accumulate enough damage to matter.

Infant-mortality failures are not random. They are caused by latent defects that escape probe test — a marginal solder joint, a microscopic void in a copper line, a particle that contaminated a critical interface but did not yet manifest. Under normal operation, these chips would last hours, days, or months — and then fail.

Burn-in

The trick is to make those hours, days, and months happen before the chip leaves the factory. Burn-in exposes chips to elevated temperature (typically 125°C) and elevated voltage for hundreds of hours, in chambers that hold thousands of devices simultaneously. Under these stresses, the failure mechanisms that cause infant mortality accelerate by orders of magnitude. A defect that would have failed at month three of normal operation now fails on day two of burn-in.

Failed devices are caught and discarded. Surviving devices are now past the infant-mortality phase. They are, statistically, the chips with the longest expected lifetimes — and they are the ones that ship.

HTOL and the long term

Burn-in screens individual chips. A separate process, HTOL (High Temperature Operating Life), validates the long-term behavior of the chip design. A small population of chips is operated continuously at elevated temperature and voltage for a thousand hours or more, and the failure rate is recorded and extrapolated using accepted acceleration models (most commonly the Arrhenius equation for thermal effects). The result is a quantitative claim: at use conditions, this chip family will exhibit fewer than X failures per billion device-hours.

For chips destined for hyperscale AI clusters, that target is exceptionally aggressive. A Rubin-based AI factory may contain tens of thousands of GPUs running continuously for years; even a one-failure-per-billion-hour rate translates to many failures per year across a deployed fleet, every one of which is a customer-facing event.

RAS, the always-on watcher

Burn-in cannot catch everything. Some failures only emerge after thousands of hours of real-world operation, with workloads no test chamber can fully reproduce. For these, NVIDIA equips Rubin with its second-generation RAS engine — Reliability, Availability, and Serviceability — a dedicated subsystem of monitors and counters built into every chip.

The RAS engine watches everything. ECC errors in HBM. Voltage droop on power rails. Junction temperatures across the die. Crossbar errors in NVLink. Bit-flip patterns suggestive of cosmic-ray-induced soft errors. Each anomaly is logged, correlated, and — if it crosses a threshold — escalated. The RAS engine can mark a single core as bad and exclude it from scheduling without bringing the rest of the chip down. It can predict that a particular HBM stack is degrading and trigger a maintenance migration before the stack actually fails.

For a hyperscaler running tens of thousands of GPUs, RAS is the difference between a fleet that requires a full-time team to babysit and a fleet that quietly heals itself. It is, in many ways, the unsung enabler of cluster-scale AI.

By the time a Rubin GPU has cleared probe test, burn-in, HTOL validation, and is shipped with its RAS engine armed, it has been characterized to a depth that few products in any industry attempt. It is, statistically, ready to spend the next four to six years running at the limit of its design — twenty-four hours a day, seven days a week, for whoever is paying for the privilege.