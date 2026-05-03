# Chapter 40 — The Compounding
Subtitle: Data, evals, and the flywheels that decide who wins
Blurb: Why the gap between leaders and followers widens, not narrows. Real-world deployment generates data and evals; data and evals make the next model better; better models attract more deployment.

## Stat row
- n² — the value of a network of n connected nodes, by Metcalfe's claim
- ~10× — growth in deployed agent population, 2024 to 2026
- ~3-5 — years of headstart that data flywheels appear to confer in current AI products

## Sections
- Metcalfe's Law for cognition
- Data flywheels
- The agent flywheel
- Compounding gone wrong
- The honest bound on compounding

## Prose
The economic concept of network effects is so familiar it has become flat. We say "X has network effects" the way we say "X has good product-market fit", as a label that excuses us from inspecting the actual mechanism. This chapter is about specifically how network effects work in the AI stack, where they are real, where they are overstated, and what they imply for which firms and which capabilities compound. The headline: there are at least two genuine compounding loops at work, they are uneven, and they are bounded.

Metcalfe's Law for cognition

Metcalfe's law, in its original form, claims that the value of a communications network grows as the square of the number of connected nodes, because every node can talk to every other. Empirically this is roughly right for early networks and overstates for mature ones (most node pairs never communicate). The intuition still holds: networks have superlinear value when adding a node creates new pairs of useful interactions.

The same intuition extended to AI: as more agents come online, capable of interacting with each other and with shared tools and data, the system's total useful interaction count grows superlinearly. There are real cases where this holds — internal tool ecosystems, MCP server registries, embedding-and-retrieval substrates that benefit from scale. There are also cases where it fails — there is no network effect from the existence of one company's customer-support agent on another company's customer-support agent, except via the common substrate of the model providers.

Data flywheels

The first and best-understood compounding loop in AI is the data flywheel. A model is deployed; users interact with it; their interactions produce signal (explicit feedback, implicit reward signals like which suggestion they accepted, error logs, edge-case reports); the signal is used to fine-tune or evaluate the model; the next version is better; users prefer it; usage grows; signal grows. Operating this loop well is one of the genuine moats in the model business.

The realistic state of data flywheels in 2026 is mixed. They produce real, measurable improvements at the margin — particularly on models tuned to specific products like coding assistants or customer-service agents. They do not, on their own, leapfrog quality tiers. A weaker model with a great flywheel does not catch a stronger model with a worse one; a stronger model with a great flywheel pulls steadily ahead. The flywheel amplifies; it does not invert.

The asymmetry matters competitively. The frontier-model providers have the largest deployed bases and the strongest flywheels. The open-weight providers do not. This is part of why the open vs. closed gap, while narrower than alarmists claim, has not actually closed at the very top — it persists because closed providers are accumulating reinforcement signal that open providers cannot easily replicate.

The agent flywheel

The second loop, and the structurally newer one, is the agent flywheel: an agent is given access to a tool; it accomplishes a task; the success is logged; the tool's interface is refined to better match how the agent actually used it; the next agent does better; new tools are exposed; capability grows. This loop runs not at the model level but at the tool-and-integration level, and the locus of compounding shifts accordingly.

The interesting consequence is that whoever owns the substrate of tools — MCP servers, agent frameworks, browser-control APIs, the workflow layer — is in a different network-effect position than the model providers. They benefit from every agent that uses their substrate, regardless of which model is underneath. This is why companies like Cursor and the agent platforms have managed to build defensible positions even though the models they run on are commodities by the chapter you read a moment ago.

Compounding gone wrong

It would be dishonest not to name the failure modes. Both flywheels have characteristic ways of breaking.

Synthetic-data poisoning. When models are increasingly trained on text that other models generated — and this is now most of the freshly produced text on the internet — the data flywheel risks recursively narrowing on the dominant model's biases and errors. Shumailov et al. (2023) labeled this "model collapse" in extreme cases. The realistic 2026 view is that synthetic data is fine when filtered and curated, dangerous when ingested raw, and that high-quality human-produced data is increasingly priced as a strategic asset.

Tool-bloat collapse. When the agent-tool ecosystem grows past a certain size, models lose track of which tool to use; the additional tools start hurting performance. Several agent frameworks have hit this wall and walked back to curated, smaller tool sets. The compounding loop is real but not unbounded.

Concentration-as-disguise. Some claims of network effect are really claims of contract lock-in or switching cost — real moats, but not network effects. Distinguishing the two matters because the durability is different. Lock-in erodes when contracts come up for renewal; genuine network effects do not.

The honest bound on compounding

The honest bound on AI network effects in 2026 is this: they are real, they confer multi-year advantages, and they are not as durable as the network effects of pre-AI internet platforms. The reasons are structural. AI capability is partly a function of underlying model architecture, which improves rapidly across the industry, partly through open releases. A late entrant with a better model at the right moment can catch up faster than they could in social networks or marketplaces, because the underlying technology keeps shifting under everyone.

The headstart that current incumbents enjoy is on the order of three to five years if they execute well, and considerably less if they do not. Long enough to matter for current investments; short enough that current dominance should not be confused with permanent dominance. Whoever is sitting on a compounding loop today is benefiting; whoever is not should not assume the door is closed.

What all of this implies for value — for whose work pays, whose disappears, and where the new rents accrue — is the next, and most consequential, chapter.