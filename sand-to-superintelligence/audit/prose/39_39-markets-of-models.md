# Chapter 39 — Markets of Models
Subtitle: Routing, price-per-token, and the commoditization layer
Blurb: OpenRouter, model gateways, and price-aware routers are turning frontier models into a commodity sold by the million-tokens — and the margin is migrating to whoever owns the routing.

## Stat row
- ~95% — drop in inference cost per token, frontier-class quality, 2023-2026
- ~12-20 — models a typical production routing layer chooses between
- ~30% — share of API traffic at major aggregators that goes through routers

## Sections
- Intelligence as a commodity
- The routing layer
- Price discovery and the cost curve
- Model arbitrage in practice
- The shape of the market

## Prose
Five years ago there was, effectively, one frontier model you could call, and the conversation about which to use was short. Now there are dozens of plausible options at any given quality tier, prices are visible per-token, latencies are measured, and reasonable buyers route work to whichever model fits a particular task best. Intelligence has acquired the texture of a commodity market, with all the consequences that follow — bid-ask spreads, margin compression, switching frictions, and a routing layer that captures real economic value by sitting between buyer and seller. This chapter is about that market.

Intelligence as a commodity

The transition was fast. In 2022 GPT-3.5 stood alone in its quality tier; by 2024 GPT-4, Claude 3.5 Sonnet, Gemini 1.5 Pro, and a handful of open-weight Llama and Mistral models offered different tradeoffs at comparable quality; by 2026 the frontier tier has six to eight credible providers, the mid-tier has dozens, and the cost-per-million-input-tokens at frontier quality has dropped roughly 95% over three years. The same quality of output that cost $30/M tokens in 2023 costs under $2/M tokens in 2026 if you pick the right provider.

What this looks like to a buyer is no longer "which model do I integrate" but "which model do I route this specific request to". Different requests have different cost-quality tradeoffs: a customer-support response benefits from quality over cost, a bulk classification job benefits from cost over quality, a real-time autocomplete benefits from latency over either. The routing layer that decides per-request is now a recognized component in serious AI stacks.

The routing layer

A routing layer is, mechanically, a thin service that receives an incoming model request, classifies it (by task type, expected complexity, latency budget, regulatory zone, content sensitivity), and forwards it to one of N upstream providers. The routing decision is informed by a published price sheet, observed historical accuracy, observed latency distributions, capacity, and any policy constraints (some workloads must stay in EU regions; some must avoid certain providers; some must run on open-weight models for compliance reasons).

The leading commercial routing layers in 2026 are OpenRouter, gateway products at the major clouds (Bedrock, Vertex, Azure AI), and a growing tier of specialist routers (cheaper-for-bulk, faster-for-real-time, regulated-for-finance). Internally, every large AI-using company runs its own routing layer too, often built on top of a commercial one for the actual model calls. The aggregated traffic going through routers — visible to nobody from the outside but spoken about openly by practitioners — is now meaningful enough that pricing pressure on the underlying model providers comes substantially through the routing layer rather than direct.

What the router does, that no individual provider does, is make the prices comparable. Each provider would prefer to lock customers into their proprietary tooling, billing units, and quality-of-service guarantees. The router commoditizes by exposing a standard interface across all of them. This is the same dynamic that played out in airline GDS systems in the 1980s, in payment-card networks, and in stock exchanges — a layer that aggregates and standardizes the supply side captures real surplus.

Price discovery and the cost curve

Per-token prices are now public, frequently updated, and converged enough that a clear cost curve exists. Frontier-tier models from Anthropic, OpenAI, and Google sit at the top, charging premiums for verified quality and reliability. Mid-tier models from the same providers and from a half-dozen specialists sit a tier below, at maybe 30% of the price for 80-90% of the quality on most tasks. Open-weight models served by inference specialists (Together, Fireworks, Replicate, Groq) sit below that, at maybe 10% of the frontier price for 60-80% of the quality on tasks the open models have been tuned for.

Prices have moved together. When Anthropic dropped Claude Haiku's price by 40% in mid-2025, OpenAI matched within weeks. When Google undercut both with Gemini Flash, the others responded within a month. The competitive intensity is high, the costs are still falling fast, and any integrator that locked in a price last year is paying too much this year. This is normal commodity-market behaviour and the people who claim AI is exempt from market dynamics are not paying attention.

Model arbitrage in practice

For sophisticated buyers — usually internal AI platforms at large companies — the work is not just choosing one model but arbitraging across many. A typical production flow in 2026 might use a small fast model to classify the incoming request, route it to the cheapest model that can handle that class, fall back to a larger model on retry if quality is insufficient, and audit a sample of responses with a separate evaluator model. The aggregate effect is a 3-10× cost reduction over naive single-model deployment for the same task quality.

The losers in this arbitrage are the providers whose pricing is detectably above their quality contribution. The winners are the providers who consistently deliver more capability per dollar than their nominal tier would suggest. Both Anthropic and the open-weight specialists have benefited from being underpriced relative to their quality at various times in this period; both have raised prices when they could and lowered when they had to. The market discipline is real.

The shape of the market

What the structure of the model market actually rewards, calling spades spades:

  

The frontier-model owners. A small number of companies that can train models nobody else can match. Their margins are squeezed by competition with each other but defended by capability. The list is short and gets shorter as training costs rise: Anthropic, OpenAI, Google DeepMind, perhaps two or three others.

  

The hyperscaler clouds. Owning the GPUs, the data center capacity, the networking, and the customer relationships, the major clouds capture margin even when the model on top is somebody else's. AWS, Azure, and Google Cloud are net beneficiaries of the AI boom regardless of which model wins.

  

The chip and packaging suppliers. NVIDIA, TSMC, ASML, the HBM suppliers (SK Hynix, Samsung, Micron). The picks-and-shovels position they have already enjoyed for three years continues, with the binding constraint shifting between compute, packaging, and HBM in roughly two-year cycles.

  

The routing and integration layer. Smaller in absolute size, but capturing a meaningful margin per dollar of model spend by being the layer that makes the underlying market efficient.

The losers are the incumbent buyers of human cognition whose business assumed white-collar wage rates were a stable input. Some industries adjust; some shrink; some are reshaped beyond recognition. The next chapter is about the network effects that determine which is which. The chapter after that is about where the value actually reroutes.