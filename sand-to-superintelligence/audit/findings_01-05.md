# Fact-check findings — Chapters 01–05

Auditor: AI fact-check subagent  
Sources: USGS Mineral Commodity Summaries, peer-reviewed literature, vendor documentation (Bernreuter Research, Wacker/Fraunhofer ISE, SEMI specifications), Wikipedia for non-controversial items.

---

## Chapter 01 — The Mineral

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "99.9999999% — purity required for chips" | [PNAS (2015)](https://www.pnas.org/doi/10.1073/pnas.1513012112), [SIA polysilicon filing (2025)](https://www.semiconductors.org/wp-content/uploads/2025/08/Semiconductor-Industry-Association-SIA-Comments-Polysilicon-Section-232-Investigation.pdf) | matches — 9N is widely cited as the floor for memory/logic; leading-edge is 11N but 9N is the standard reference for "chips" in popular writing | ok |
| 2 | "99.86% — purity straight from the mine" | No primary USGS or peer-reviewed figure found for this specific mine-grade SiO₂ purity; high-grade quartzite is quoted variously as 99.5–99.99% depending on deposit | unverifiable | judgment |
| 3 | "4th — most-mined commodity on earth" | [USGS MCS 2024 Sand & Gravel](https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-sand-industrial.pdf), [USGS MCS 2024 Silicon](https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-silicon.pdf) | disputed — USGS does not publish a ranked list placing silica fourth. Sand and gravel (construction) and crushed stone dwarf industrial silica by volume; no standard source ranks silica/quartzite specifically 4th among all mined commodities | judgment |
| 4 | "Quartz is silicon dioxide. Two oxygens, one silicon…" | [RSC Periodic Table](https://periodic-table.rsc.org/element/14/silicon) | matches | ok |
| 5 | "It is hard (Mohs 7)" | [Quartz – Wikipedia](https://en.wikipedia.org/wiki/Quartz) | matches | ok |
| 6 | "the world produces and consumes vast quantities of silica — it is among the most-extracted commodities on earth" | [USGS MCS 2024](https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-sand-industrial.pdf) | matches as a general claim | ok |
| 7 | "Spruce Pine, North Carolina…two mines produce the world's purest natural quartz" | [Z2Data (2024)](https://www.z2data.com/insights/quartz-mine-disruption-in-spruce-pine-nc-threatens-semiconductor-manufacturing), [Sibelco Spruce Pine page](https://www.sibelco.com/en/150-years/spruce-pine) | matches — Sibelco and The Quartz Corp operate two mines supplying 70–90% of world high-purity quartz for semiconductors | ok |
| 8 | "A 2024 wildfire and Hurricane Helene briefly threatened the town" | [Z2Data (2024)](https://www.z2data.com/insights/quartz-mine-disruption-in-spruce-pine-nc-threatens-semiconductor-manufacturing) | matches | ok |
| 9 | "used for the crucibles in which polysilicon is later melted" | Consistent with industry descriptions of fused-silica crucibles in CZ pullers | matches | ok |

### Mechanism explanations to flag

- **Quote:** "quartzite: a metamorphic rock formed when sandstone is cooked under pressure for hundreds of millions of years until its quartz grains fuse and recrystallize into a near-pure mass of SiO₂"
  - **Status:** Accurate description of quartzite formation. Technically quartzite can also form from sandstone under contact metamorphism (heat without extreme pressure), but the description is within normal lay-audience range.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes (clear errors only)

None identified.

### Open questions for the author

- The "4th most-mined commodity" claim appears in the stat row but not in the prose body. It is not attributed to any source and does not match any USGS or industry ranking found. The USGS ranks commodities by value, not volume, and construction aggregates (sand/gravel and crushed stone) vastly outrank silica by tonnage. The specific rank of "4th" should be sourced or replaced with a less precise claim ("among the most-extracted minerals").
- The "99.86% SiO₂ before any human touches it" figure is plausible for high-grade quartzite but no primary source confirms this specific number for Spruce Pine or equivalent deposits. Flag for sourcing.

---

## Chapter 02 — Fire and Carbon

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "1,700°C — minimum operating temperature" | [Journal of the Southern African IMM (2018)](https://scielo.org.za/scielo.php?script=sci_arttext&pid=S2225-62532018000200011): "temperature at the top of the furnace can vary between 1000 and 1700°C"; [Market Reports World](https://www.marketreportsworld.com/market-reports/metallurgical-grade-silicon-metal-market-14721867): "typically above 1,700°C"; [PMC/Heliyon article](https://pmc.ncbi.nlm.nih.gov/articles/PMC9984837/) confirms hot zone temperatures | matches — 1,700°C is the approximate minimum operating temperature in the arc zone, consistent with multiple sources | ok |
| 2 | "13–14 megawatt-hours of electricity" per ton of MG-Si | [Mordor Intelligence](https://www.mordorintelligence.com/industry-reports/silicon-metal-market): "near 12 MWh"; [Xi'an Sanrui](https://www.srfurnace.com/industrial-silicon-submerged-arc-furnace-what-is-this.html): "more than 13,000 kWh/t"; [HPQ Silicon deck](https://hpqsilicon.com/wp-content/uploads/2019/06/HPQ_NEW_DECK_JUNE_2019_AGM_V2.pdf): "12,000 kWh/t" | matches — literature range is approximately 11–14 MWh/t; 13–14 MWh/t is within range, somewhat on the higher end of typical | ok |
| 3 | "99% — purity after smelting" | [PYROMETALLURGY / InfaconIV](https://www.pyrometallurgy.co.za/InfaconIV/389-Schei.pdf): "98–99 per cent"; [Chemistry LibreTexts](https://chem.libretexts.org/Bookshelves/Inorganic_Chemistry/Chemistry_of_the_Main_Group_Elements_(Barron)/07:_Group_14/7.10:_Semiconductor_Grade_Silicon): "approximately 98–99% pure"; Silicon-powders.com: "98–99%" | disputed — MG-Si is typically 98–99%, not a clean "99%". The chapter's stat row "99%" overstates the lower bound slightly; prose says "At 99% purity…roughly 10,000 parts per million of impurities" which is internally consistent but the stat should read "98–99%" | judgment |
| 4 | "SiO₂ + 2C → Si + 2CO" (simplified reaction) | Standard carbothermic reduction equation | matches — this is the simplified net equation; actual process involves SiC intermediates but the simplified form is standard in educational literature | ok |
| 5 | "About 80% of all silicon ever produced ends its career here" (metallurgical uses) | [USGS MCS 2024](https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-silicon.pdf) confirms semiconductor/solar is a small fraction; [SIA filing 2025](https://www.semiconductors.org/wp-content/uploads/2025/08/Semiconductor-Industry-Association-SIA-Comments-Polysilicon-Section-232-Investigation.pdf): semiconductor accounts for 2.4% of polysilicon consumption | matches in spirit — semiconductor+solar is a small fraction. The "80%" claim is plausible but unverifiable from USGS data directly; USGS shows most silicon consumption is ferrosilicon for steel plus aluminum alloys | judgment |
| 6 | "submerged-arc electric furnaces have been making silicon since the 1900s" | Consistent with historical record of electric arc furnace development | matches | ok |
| 7 | "furnace is a refractory-lined pit, perhaps three meters deep and ten across" | General industrial descriptions of large Si SAF units confirm multi-meter dimensions; 30 MW rated units are indeed ~10 m in diameter | matches (approximate; specific dimensions vary by furnace rating) | ok |

### Mechanism explanations to flag

- **Quote:** "carbon monoxide gas vents up through the charge and burns at the surface — a furnace in normal operation has flames licking out of the top continuously, blue and orange"
  - **Status:** Accurate for open (non-sealed) submerged arc furnaces used for silicon. Some modern sealed furnaces capture CO for energy recovery, making the flame description technology-specific.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes (clear errors only)

- Consider changing stat row "99%" to "98–99%" for MG-Si purity, as multiple authoritative sources give a range rather than a single number.

### Open questions for the author

- The 13–14 MWh/ton figure is in the upper part of the documented range (11–14 MWh/t). The lower figure of ~11–12 MWh/t appears in USGS-adjacent sources for advanced foreign operations. The 13–14 range may reflect older or Chinese practice. Consider citing the specific source.

---

## Chapter 03 — The Nine-Nines Problem

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "Si + 3 HCl → SiHCl₃ + H₂" | Standard trichlorosilane synthesis equation | matches | ok |
| 2 | "trichlorosilane…boiling point: 31.8°C" | [Bernreuter Research](https://www.bernreuter.com/polysilicon/production-processes/): "low boiling point of 31.8°C"; [NJ Health Dept. fact sheet](https://nj.gov/health/eoh/rtkweb/documents/fs/1903.pdf): "90°F (32°C)"; [ChemicalBook](https://www.chemicalbook.com/ChemicalProductProperty_US_CB4852559.aspx): "32–34°C" | matches — 31.8°C is the value used in industry literature (Bernreuter); other sources round to 32°C. No error. | ok |
| 3 | "Boron, the most feared impurity, forms BCl₃, which boils at 12.5°C" | [Messer Group](https://specialtygases.messergroup.com/boron-trichloride): "12.6°C"; [Sciencemadness](https://www.sciencemadness.org/smwiki/index.php/Boron_trichloride): "12.6°C"; [GasTech](https://gastech.co.il/en/boron-trichloride): "–12.5°C" | wrong — BCl₃ boiling point is **12.6°C**, not 12.5°C. More critically: the GasTech source lists **–12.5°C** (negative), suggesting a possible confusion; however the near-universal consensus is **+12.6°C** at 1 atm. The book's 12.5°C is off by 0.1°C. | auto-fix |
| 4 | "Inside, thin silicon 'seed rods' are heated to about 1,100°C" | [Patents.google US9446957B2](https://patents.google.com/patent/US9446957B2/en): "rod temperatures between 900 and 1100°C"; [ScienceDirect 2024](https://www.sciencedirect.com/science/article/abs/pii/S0022024824001283): "1100–1175°C"; Bernreuter: "TCS only does so at 1,000°C" | matches — ~1,100°C is the typical lower end of deposition temperature; some sources cite 1,100–1,175°C for normal operation | ok |
| 5 | "Each kilogram of polysilicon takes around 60 kWh of electricity to produce" | [Fraunhofer ISE Report (2025)](https://www.ise.fraunhofer.de/content/dam/ise/en/documents/publications/studies/25_en_ISE_Report_Analysis-of-the-Electricity-Consumption-for-the-Production-of-Electronic-Grade-Polysilicon.pdf): SoG polysilicon ~60 kWh/kg (2022–23); EG polysilicon ~92–166 kWh/kg | disputed — **60 kWh/kg is the solar-grade (SoG) figure, not the electronic-grade (EG) figure.** EG polysilicon used in chips requires 92–166 kWh/kg according to the Fraunhofer ISE study commissioned by Wacker Chemie. The chapter is discussing EG silicon, so 60 kWh/kg significantly underestimates the energy required. | oversimplified-misleading |
| 6 | "An alternative method, the fluidized-bed reactor (FBR)…at roughly one-fifth the energy cost" | [Sustainability Directory](https://energy.sustainability-directory.com/learn/how-does-the-siemens-process-for-silicon-purification-compare-in-cost-and-efficiency-to-alternative-methods-like-fluidized-bed-reactor-fbr-technology/): "potentially using only 10–20% of the energy of the Siemens process"; [Bernreuter FBR PDF](https://www.bernreuter.com/files/data/newsroom/pdf-articles/magazine-reports/2015-09-pv-magazine-Slow-grind-of-FBR-polysilicon.pdf): "37% lower electricity use compared to hydraulic FBR, 70% lower energy use compared to TCS and Siemens CVD" | disputed — "one-fifth" (20%) falls within the stated 10–20% range for ideal cases, but FBR's actual advantage over Siemens is more nuanced; the comparison is valid for SoG-grade FBR vs. SoG Siemens. For EG-grade, FBR does not yet reliably substitute. Calling it "one-fifth" is plausible but optimistic. | judgment |
| 7 | "6N means 99.9999%…and is sufficient for solar panels" | [ICIS Polysilicon Methodology](https://www.icis.com/compliance/documents/polysilicon-solar-grade-methodology-september-2013/): "Solar-grade: 6N to 8N" | matches | ok |
| 8 | "9N, sometimes called electronic grade, means 99.9999999% and is the floor for memory chips" | [SIA (2025)](https://www.semiconductors.org/wp-content/uploads/2025/08/Semiconductor-Industry-Association-SIA-Comments-Polysilicon-Section-232-Investigation.pdf): "Polysilicon used for semiconductors requires…at least 11N (99.999999999%)"; [Bernreuter Research](https://www.bernreuter.com/polysilicon/production-processes/): electronic grade is 10N–11N; [ICIS](https://www.icis.com/compliance/documents/polysilicon-solar-grade-methodology-september-2013/): "Electronic-grade: 9N to 11N" | disputed — **9N is widely cited as the lower bound of electronic grade**, but the SIA formally states the semiconductor floor is **11N** (not 9N). Calling 9N "the floor for memory chips" overstates 9N's adequacy for modern logic/memory. The chapter's subsequent reference to "10N to 11N" for leading-edge logic is accurate, which makes the 9N = memory floor claim internally inconsistent and potentially misleading to readers. | judgment |
| 9 | "Modern leading-edge logic…demands silicon in the 10N to 11N range" | [Bernreuter Research](https://www.bernreuter.com/polysilicon/production-processes/): "Electronic grade for semiconductors: 10N to 11N"; [SIA (2025)](https://www.semiconductors.org/wp-content/uploads/2025/08/Semiconductor-Industry-Association-SIA-Comments-Polysilicon-Section-232-Investigation.pdf): "≥11N for semiconductors" | matches | ok |
| 10 | "The tightest purity humanity routinely achieves" (chapter blurb) | No single authoritative source ranks polysilicon EG as #1 purity achieved by humanity; isotopically enriched materials (e.g., Si-28 for quantum computing) reach higher purities | judgment — the claim is broadly defensible for *industrial-scale, commodity* production, but is contestable | judgment |

### Mechanism explanations to flag

- **Quote:** "each pass through the column removes 90% or more of remaining boron, phosphorus, and metallic compounds"
  - **Status:** The 90% per pass removal efficiency for boron in TCS distillation is difficult to verify precisely; actual efficiency depends on column design and the specific boron compound (BCl₃ vs. boron hydrides). The qualitative description of fractional distillation is accurate.
  - **Severity:** oversimplified-fair

- **Quote:** "The hot rods crack the trichlorosilane gas in their vicinity. Silicon atoms, freed by the heat, deposit onto the rods."
  - **Status:** Technically, deposition is via chemical vapor deposition (CVD): SiHCl₃ + H₂ → Si + 3HCl. The description "crack" is a colloquialism for pyrolysis/CVD decomposition; it is accurate in lay terms.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes (clear errors only)

- Replace "12.5°C" with "12.6°C" for BCl₃ boiling point — multiple primary sources confirm 12.6°C.

### Open questions for the author

- The 60 kWh/kg figure needs clarification: this is the modern solar-grade Siemens benchmark. Electronic-grade polysilicon (the kind relevant to logic chips) consumes 92–166 kWh/kg per Fraunhofer ISE (2025 Wacker-commissioned study). If the chapter intends to describe the EG process, the figure should be updated.
- The claim that "9N…is the floor for memory chips" conflicts with the SIA's formal statement that the semiconductor floor is 11N. Consider revising to: "9N to 11N, depending on application" or describing the grade hierarchy more carefully.

---

## Chapter 04 — Growing a Perfect Crystal

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "1,421°C — melting point of silicon" | [RSC Periodic Table](https://periodic-table.rsc.org/element/14/silicon): **1414°C**; [periodictable.com](https://periodictable.com/Elements/014/data.html): **1414°C**; [WaferPro](https://waferpro.com/understanding-silicon-wafer-melting-point/): "1414°C industry standard"; [Alfa Chemistry](https://www.alfa-chemistry.com/resources/melting-points-of-common-materials.html): **1414°C** | **wrong — silicon melting point is 1,414°C, not 1,421°C.** This is a consistent, well-documented physical constant. The error is 7°C. | auto-fix |
| 2 | "the technique that bears his name underlies essentially every silicon wafer on earth" | [Jan Czochralski Wikipedia](https://en.wikipedia.org/wiki/Jan_Czochralski): "used in over 90 percent of all electronics" | matches | ok |
| 3 | "Jan Czochralski was studying metallization rates and absent-mindedly dipped his pen into a crucible of molten tin instead of his inkwell" | [ETHW Milestones: Czochralski Process, 1916](https://ethw.org/Milestones:Czochralski_Process,_1916); [IUCr Newsletter (2020)](https://www.iucr.org/news/newsletter/volume-28/number-3/who-was-jan-czochralski); [ScienceDirect Czochralski history](https://www.sciencedirect.com/science/article/abs/pii/S0022024801021959): "Czochralski was working on the **rate of crystallization** of metals"; paper title translates as "A New Method for Measuring the **Crystallization Rate** of Metals" | **wrong — Czochralski was studying *crystallization rates* (Kristallisationsgeschwindigkeit), not "metallization rates."** The German paper published in 1918 is titled "Ein neues Verfahren zur Messung der Kristallisationsgeschwindigkeit der Metalle." "Metallization rates" is not a recognized description of his work in any primary or secondary source. | auto-fix |
| 4 | "a bored Polish chemist who invented it in 1916 by accident" | [ETHW](https://ethw.org/Milestones:Czochralski_Process,_1916); [Jan Czochralski Wikipedia](https://en.wikipedia.org/wiki/Jan_Czochralski) | matches — Polish nationality confirmed; 1916 confirmed; accidental discovery confirmed; chemist confirmed | ok |
| 5 | "~1 mm/min — ingot pull rate" | [Czochralski Creative Mistake (Uni Kiel)](https://www.tf.uni-kiel.de/matwis/amat/iss/kap_6/articles/growing_si_crystals.pdf): "drawing is then carried out at a rate of a few millimeters per minute" | matches — pull rates for 300mm ingots are typically 0.5–2 mm/min; ~1 mm/min is representative | ok |
| 6 | "200 kg — mass of a modern 300mm ingot" | [Google Patents US20030047130A1](https://patents.google.com/patent/US20030047130A1/en): "silicon ingots weighing up to 300 kg or more"; [ScienceDirect 400mm study](https://www.sciencedirect.com/science/article/abs/pii/S0022024801010429): 300mm ingots used as reference; [ScienceDirect 350 kg puller (2023)](https://www.sciencedirect.com/article/abs/pii/S0022024823001045): "first 300mm/350 kg silicon mono-crystal grower" | disputed — modern 300mm semiconductor ingots typically weigh **250–400 kg** depending on length. 200 kg is plausible for a shorter ingot body but is on the low end; the leading industry figure for commercial 300mm ingots is closer to **250–350 kg**. "Weighing as much as a small motorcycle" in the prose text maps approximately to 150–250 kg, which is also somewhat low. | judgment |
| 7 | "Over the course of about a day" for ingot growth | Consistent with pull rate (~1 mm/min × 1,000 mm body ≈ ~17 hours of body growth, plus shoulder/tail) | matches | ok |
| 8 | "the chamber is sealed and pumped down to vacuum, then back-filled with argon" | Standard CZ puller operating procedure | matches | ok |
| 9 | "Float-zone growth…a radio-frequency coil melts a narrow zone of it" | [Float-zone silicon Wikipedia](https://en.wikipedia.org/wiki/Float-zone_silicon): "RF heating coil" | matches | ok |
| 10 | "impurities are dragged along with it (impurities prefer to stay in the liquid phase)" | [Zone melting Wikipedia](https://en.wikipedia.org/wiki/Zone_melting): "segregation coefficient k…is usually less than one…impurity atoms will diffuse to the liquid region" | matches — the mechanism is correctly stated | ok |
| 11 | "Float-zone silicon, however, is harder to grow at large diameters" | [Float-zone silicon Wikipedia](https://en.wikipedia.org/wiki/Float-zone_silicon): "diameters of float-zone wafers are generally not greater than 200 mm due to surface tension limitations" | matches | ok |

### Mechanism explanations to flag

- **Quote:** "Because the seed is a perfect crystal, the silicon atoms freezing onto it have no choice — the path of least energy is to extend the seed's lattice."
  - **Status:** Technically accurate at a lay level; the thermodynamic/kinetic explanation of epitaxial solidification is correctly captured.
  - **Severity:** oversimplified-fair

- **Quote:** "The completed Cz ingot is one of the most ordered objects industry produces. From end to end — across roughly 10²⁵ atoms — there is exactly one crystal lattice. No grain boundaries. No twins. No interruptions."
  - **Status:** The ideal description is accurate. In practice, real CZ ingots contain oxygen precipitates and point defects (vacancies, interstitials) from crucible dissolution and thermal gradients, and "no twins" requires careful seeding. The claim as a lay idealization is fair.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes (clear errors only)

- Replace "1,421°C" with "1,414°C" — the melting point of silicon is universally documented at 1,414°C (1,687 K).
- Replace "studying metallization rates" with "studying the crystallization rates of metals" — this is the precise, documented description from Czochralski's own paper title.

### Open questions for the author

- The 200 kg ingot mass is toward the low end for modern 300mm semiconductor ingots; commercial pullers often produce 250–350 kg ingots. The phrasing "weighing as much as a small motorcycle" (~150–250 kg) appears inconsistent with the stat row "200 kg." Confirm with a supplier (e.g., Sumco, GlobalWafers) what a standard commercial 300mm ingot weighs.

---

## Chapter 05 — From Log to Mirror

### Numeric & named-entity claims

| # | Claim (verbatim quote, ≤20 words) | Source(s) checked | Verdict | Severity |
|---|-----------------------------------|-------------------|---------|----------|
| 1 | "300 mm — wafer diameter (12 inches)" | [Wafer (electronics) Wikipedia](https://en.wikipedia.org/wiki/Wafer_(electronics)) | matches | ok |
| 2 | "775 µm — finished wafer thickness" | [Wafer Wikipedia](https://en.wikipedia.org/wiki/Wafer_(electronics)): "775 µm" for 300mm; [SVMI spec sheet](https://svmi.com/wp-content/uploads/2020/09/SV027.pdf): "775±25 µm"; [PAM-XIAMEN](https://www.powerwaywafer.com/silicon-wafer/300mm-bare-silicon-wafers-prime-grade.html): "775±15 µm" | matches | ok |
| 3 | "1 nm — surface flatness after CMP" | [MicroChemicals](https://www.microchemicals.com/PRODUCTS/Wafer/Technical-Information/Wafer-Specification/): "RMS usually specified at <1 nm"; [UniversityWafer roughness page](https://www.universitywafer.com/silicon-wafer-roughness.html): "normal roughness value is <0.5 nm"; [Grish CMP](https://grish.com/cmp-for-semiconductor-equipment/): "roughness level of less than 0.5 nm" | disputed — CMP surface **roughness** (Ra/RMS) achieves ~0.1–0.5 nm, which is indeed sub-nanometer. However, **flatness** (TTV) across a full 300mm wafer is typically ≤3 µm (3,000 nm), not 1 nm. The stat conflates two different metrics: surface roughness (sub-nm) vs. wafer-scale flatness (µm). The prose states "flat to within a single nanometer across its entire 300 mm face," which is technically inaccurate — this applies to roughness, not global flatness. | oversimplified-misleading |
| 4 | "~3,000 — wafers from one ingot" | [WaferPro](https://waferpro.com/silicon-wafer-material-from-sand-to-semiconductors/): "a typical ingot can produce several hundred to over a thousand 150-300mm diameter wafers"; math check: at 775 µm wafer + ~150 µm kerf = ~925 µm per slice; a 1m-long usable ingot body yields ~1,082 wafers; at 1.5m ≈ 1,600 wafers | disputed — **~3,000 wafers from one 300mm ingot appears too high.** At 775 µm finished thickness plus realistic kerf loss (~150 µm), each slice consumes ~925 µm of ingot. A 1-meter usable crystal body yields ~1,080 wafers; a 1.5-meter body ~1,600 wafers. Reaching 3,000 would require a ~2.7m usable body, which exceeds typical commercial 300mm ingot body lengths. The figure may be more appropriate for thinner solar wafers or smaller-diameter ingots. | judgment |
| 5 | "A single steel wire, perhaps 100 micrometers thick and impregnated with diamond particles" | [Zelatec](https://www.zelatec.com/how-to-reduce-kerf-loss-in-wafer-slicing/): "Zelatec's data reports ~120–150 µm kerf…typical kerf widths on the order of 100–200 µm"; [Donghe wire saw](https://wiresawcutter.com/high-tech-precision/silicon-wafer-cutting-wire-saw/): "Wire Diameter: 60–120 µm"; [Fraunhofer Publica](https://publica.fraunhofer.de/entities/publication/87c930a4-beb1-485a-a611-3b3c94d74966): "100 µm diameter" wires tested | disputed — 100 µm is toward the thin end of modern semiconductor-grade wire diameters (range: 60–200+ µm). Wire diameter and kerf are related but not identical. 100 µm is not wrong but may give a misleadingly precise impression. | judgment |
| 6 | "after perhaps eight hours of patient sawing, the entire ingot has been transformed into roughly three thousand thin, perfectly parallel discs, each about 925 micrometers thick" | [Wafer (electronics) Wikipedia](https://en.wikipedia.org/wiki/Wafer_(electronics)): 925 µm is listed as the proposed thickness for **450mm** wafers (not 300mm); finished 300mm wafers are 775 µm; as-sawn 300mm wafers are approximately 775–850 µm (most sources peg as-sawn at roughly the finished thickness plus lapping stock of ~50–75 µm) | **wrong — 925 µm is the SEMI-proposed thickness for the future 450mm wafer standard, not for 300mm wafers.** For 300mm ingots, the as-sawn thickness is approximately 800–850 µm (not 925 µm), and the finished thickness is 775 µm. The 925 µm figure appears to have been taken from a wafer specification table without noting it belongs to the 450mm row. | auto-fix |
| 7 | "logic chips typically want the [100] face up" | [SVMI 300mm spec](https://svmi.com/wp-content/uploads/2020/09/SV027.pdf): "<100> ±1° orientation"; [Wafer Wikipedia](https://en.wikipedia.org/wiki/Wafer_(electronics)): "(100) or (111) faces being the most common for silicon…(100) most common for logic" | matches | ok |
| 8 | "a continuous stream of slurry — colloidal silica suspended in alkaline solution" | [Applied Materials CMP](https://www.appliedmaterials.com/us/en/semiconductor/products/shape/cmp.html); standard CMP slurry description | matches | ok |
| 9 | "wafer's surface becomes flat to within a single nanometer across its entire 300 mm face" | As noted for claim #3 above — this describes **roughness**, not global flatness (TTV) | oversimplified-misleading (same as #3) | oversimplified-misleading |
| 10 | "flatness of less than one nanometer across 300 millimeters is roughly equivalent to polishing a football field flat to within the diameter of a single hydrogen atom" | Scale calculation: 300mm → football field ≈ 100m scale-up factor = ~333×; 1 nm × 333 ≈ 333 nm ≈ 0.33 µm; hydrogen atom diameter ≈ 0.1 nm. Scale-up of 1nm by 333× = 333 nm. Hydrogen atom ~0.1 nm. Doesn't quite match — football-field analogy gives ~333 nm, not ~0.1 nm. However, this type of analogy is conventionally accepted as illustrative rather than precise. | disputed — the analogy is imprecise but is within typical pop-science license; more importantly, the underlying 1 nm flatness claim misidentifies roughness vs. flatness | judgment |
| 11 | "Optical scanners scan the surface for particles down to perhaps 30 nm" | SEMI M1 standard and major suppliers (Sumco, GlobalWafers) inspect for particles ≥30–65 nm for prime-grade; leading-edge processes detect ≥20 nm | matches | ok |

### Mechanism explanations to flag

- **Quote:** "high spots get worn down faster than low spots, because they take more pressure"
  - **Status:** This is the correct qualitative description of the planarization mechanism in CMP — the Preston equation governs material removal, and asperities experience higher local pressure, leading to preferential removal.
  - **Severity:** oversimplified-fair (accurate)

- **Quote:** "a chemical bath, typically a mixture of hydrofluoric, nitric, and acetic acids, which dissolves another few microns"
  - **Status:** Accurate — HF/HNO₃/acetic acid (or HF/HNO₃/H₂O) is a standard silicon etch mixture. Some fabs use KOH-based etches; the HF/HNO₃/acetic description is correct for conventional acidic etching.
  - **Severity:** oversimplified-fair

### Suggested auto-fixes (clear errors only)

- Replace "each about 925 micrometers thick" with "each about 800–850 micrometers thick" for as-sawn 300mm wafers. 925 µm is the SEMI-specified thickness for the not-yet-in-production 450mm wafer standard, not for 300mm. [Source: [Wafer (electronics) – Wikipedia](https://en.wikipedia.org/wiki/Wafer_(electronics)), SEMI standards table]

### Open questions for the author

- The "1 nm flatness" claim in the stat row and accompanying prose conflates surface **roughness** (Ra/RMS ≈ 0.1–0.5 nm, measured over small areas) with wafer-scale **flatness** (TTV ≈ 1–3 µm across the full 300mm surface). The two are different metrics. The football-field analogy is internally consistent with the 1 nm figure but the 1 nm flatness claim itself is not accurate for full-wafer TTV. Consider revising to: "surface roughness below 0.5 nm" and explaining the distinction.
- The "~3,000 wafers from one ingot" figure is significantly above typical numbers for 300mm semiconductor ingots (~1,000–1,700 wafers). Verify with Sumco or GlobalWafers. The figure may be an overestimate, or it may apply to a specific, very long ingot body.
