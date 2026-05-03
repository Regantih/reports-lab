# Chapter 33 — Latency Is Cognition
Subtitle: Why milliseconds decide what a model can think about
Blurb: In agent systems, latency stops being a UX concern and becomes a budget for thought. The faster the loop, the more steps an agent can afford before the user gives up.

## Stat row
- ~80 ms — transcontinental TCP round trip on the public internet
- ~30-100 ms — first-token latency from a major frontier model
- ~50 ms — time per output token at typical batch sizes

## Sections
- Round-trip time as a cognitive budget
- How tight the budget is
- Speculative inference and parallelism
- Co-location and the geography of thought
- The real bottleneck is no longer FLOPS

## Prose
When two people are talking, one's response is the other's input. The same is true of two models. The instant we start chaining inferences — model A asks model B, which calls a search tool, which returns to model A, which produces an answer — the round-trip times stop being an engineering footnote and become the binding constraint on what the system can do at all. This chapter is about latency as a cognitive budget, and what happens when you blow it.

Round-trip time as a cognitive budget

Suppose your product target is a three-second response from the moment a user presses enter. That budget has to cover, at minimum: a network round-trip from the client to your backend (~10ms), your backend's own work (~10ms), a network round-trip from your backend to the model provider (~50-100ms across regions), the provider's queuing and pre-processing (~50ms at moderate load), the prompt-processing forward pass (~100-500ms depending on prompt length), and then per-token generation at perhaps 50ms per token. To produce 30 tokens of output, you need roughly 1.5 seconds of pure generation, on top of all the overhead. If you are running a chain of two model calls, you double everything except the client-side overhead.

Three seconds, which feels generous to a human, is often barely enough for a single round-trip, single-tool-call AI response. Five seconds is comfortable for one call; ten seconds for a small chain; thirty seconds is the realistic floor for an agent that wants to take more than a couple of actions. Beyond about a minute, users start abandoning. Nielsen's classic response-time work from 1993 still applies: ten seconds is the limit at which the user's attention starts wandering off.

How tight the budget is

The reason the budget is tight is not that any one component is slow; it is that all of them are running at, or near, fundamental limits. Speed-of-light gives you about 200,000 km/s in fibre, so a US-to-Europe round-trip cannot be much under 80ms regardless of how good the engineering is. Token generation is bounded by HBM bandwidth: even on a Rubin GPU at 8 TB/s, reading 200 GB of model weights once per token sets a hard floor under per-token latency, partially mitigated by batching. Speculative decoding, KV cache reuse, and continuous batching squeeze the constants but cannot break the floor.

What this means in practice is that compute and bandwidth are not the binding constraint for distributed AI. They are necessary but routinely available. The binding constraint is geometry: how far apart are the components, and how many round-trips does the workflow require. A team with a worse model that runs in the same data center as its data will, for many real workloads, beat a team with a better model that has to round-trip across continents.

Speculative inference and parallelism

The systems response is to do less waiting in series. Several techniques are now standard:

  

Speculative decoding. A small fast "draft" model proposes the next several tokens; the large model verifies them in a single forward pass. When the small model is right, you got several tokens for the cost of one. Leviathan et al. (2022) introduced the technique; it now ships in production at every major provider.

  

Parallel tool calls. Modern function-calling APIs let the model emit multiple tool-call requests in one response, executed concurrently rather than sequentially. A naive agent serializes; a competent one parallelizes whenever the calls are independent.

  

Streaming and incremental rendering. The user starts seeing tokens as they are generated, so the perceived latency is the time-to-first-token (often under 500ms) rather than the time-to-last-token. This buys some grace, but it does not help when the next step depends on the full output.

Co-location and the geography of thought

For workloads that chain many calls, the only durable answer is to put the model and the data on the same rack, or at least in the same data center. This has triggered a quiet repositioning across the cloud industry. AWS, Azure, and Google Cloud have spent the last two years standing up regional inference endpoints rather than centralizing inference in one or two locations, because their largest customers were paying serious latency tolls calling out to a model in Virginia from a database in Frankfurt.

The eventual shape is likely to mirror what happened with content delivery networks in the 2000s: a tiered system in which the heaviest models live in a few enormous training-and-flagship data centers, while smaller distilled models, embedding models, and routing logic live in regional points of presence close to the user and the data. Anthropic's Claude is now served from a number of geographic regions; OpenAI moved in the same direction; the open-source models are deployed wherever there is GPU capacity to spare.

The real bottleneck is no longer FLOPS

If you talk to engineers building production AI systems in 2026, the FLOPS conversations are no longer the loudest. The training-cluster people care about FLOPS; everybody else cares about tail latency. A median request that takes 1.2 seconds at p50 and 14 seconds at p99 has a user experience problem that no amount of model quality can fix; the seven-minute outage caused by a single slow tool call upstream is the failure mode that actually breaks products.

The latency budget is the real currency of agentic systems. You can spend it on more retrieval, on a smarter model, on more tool calls, on more sub-agents — but you cannot spend it twice, and any architecture that pretends otherwise will eventually meet a user with a stopwatch. Chapter 34, where agents start hiring other agents, is in many ways an exercise in latency-budget management dressed up as autonomy.

So far the wire has been carrying questions and answers between a person and a model. The next chapter is about what happens when the model itself starts answering with not text, but actions.