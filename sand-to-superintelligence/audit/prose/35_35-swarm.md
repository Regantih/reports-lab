# Chapter 35 — Swarm
Subtitle: Many agents, one outcome
Blurb: What happens when a planner agent dispatches a researcher, a writer, a critic, and a coder — and they all share state. A messy, expensive, occasionally brilliant new way to compute.

## Stat row
- 3-7 — agents in a typical production multi-agent system
- ~5× — token cost of debate vs. single-agent on same task
- ~10-25% — accuracy lift from debate over best single agent on hard tasks

## Sections
- Why one agent is not enough
- Patterns: hierarchy, debate, market
- How agents communicate
- The cost of coordination
- What it actually buys you

## Prose
If one agent is a knowledge worker, a swarm of agents is a small organization. The same logic that pushed companies past the single-craftsman model in the eighteenth century — division of labour, specialization, supervision — is now being re-derived in software. The gains are sometimes real and sometimes imaginary, the costs are always real, and a clear-eyed view requires acknowledging both. This chapter is about multi-agent systems: when they help, how they communicate, and what they cost.

Why one agent is not enough

Single-agent systems hit three walls in practice. The first is context length: even with two-million-token windows, dumping the full state of a complex project into one prompt produces worse reasoning than reading a focused subset would. The second is specialization: a single instruction-tuned model is jack-of-all-trades; a research agent prompted differently from a code agent will outperform a generalist on either narrow task. The third is error correction: a model evaluating its own work is systematically less critical than a sibling evaluating the same work from outside.

Each wall suggests a different multi-agent pattern. None of these are new ideas — distributed AI was a research field in the 1980s, and multi-agent systems have a long literature — but they have become economically meaningful only now, when each "agent" is cheap enough to spawn and capable enough to contribute.

Patterns: hierarchy, debate, market

Hierarchy. A planner agent breaks a high-level goal into sub-tasks and dispatches each to a worker agent. The pattern fits well when the work decomposes cleanly: research one company, then another, then another, then write the comparative summary. AutoGen and LangGraph formalize this pattern; Anthropic's Multi-Agent Research System describes a deployment of it at scale. The trap is that planners over-decompose: they spawn five workers when one would have been faster and cheaper.

Debate. Two or more agents are given the same problem, produce independent solutions, then are shown each other's reasoning and asked to converge or to defend. Du et al. (2023) showed measurable accuracy gains from this on math and reasoning benchmarks. The trap is collusion: two instances of the same model will often agree on the same wrong answer, especially when the model is overconfident. Debate works best when the agents are genuinely heterogeneous — different models, different temperatures, different prompts.

Market. A routing agent receives the task and offers it to a pool of specialist agents, choosing based on stated capability, historical accuracy, latency, or price. This is the pattern that OpenRouter, model-gateway products at the major clouds, and emerging routing-as-a-service platforms are pushing toward. It is the most cost-efficient when the workload is high-volume and heterogeneous; it is overkill when there are only a few tasks per day.

How agents communicate

In 2026 there is no single standard for agent-to-agent communication. The candidates are visible:

  

Plain text turns in a shared transcript. The simplest pattern. Each agent reads the full transcript and emits a turn. Works for small swarms, becomes wasteful past three or four agents.

  

Structured messages. Each turn is a JSON object with explicit sender, recipient, intent, and content fields. AutoGen and the proposed Agent2Agent (A2A) protocol from Google are in this camp.

  

Shared scratchpad. A document the agents collaboratively edit, with each agent reading the current state and proposing diffs. Works well for code and document tasks; awkward for negotiation.

  

Tool-mediated. Agents do not address each other at all — they invoke tools (queues, databases, APIs) that other agents observe. This is the pattern that scales operationally because it is just normal distributed-systems design.

The trajectory is clearly toward the structured-message and tool-mediated patterns, with shared scratchpad as a complement for collaborative artifacts. Plain text turns are a research convenience that rarely survives in production.

The cost of coordination

Multi-agent systems are not free. Every additional agent multiplies the token bill, and the coordination overhead — agents reading each other's output, the planner re-reading the transcript, the verifier checking everything — often dominates the productive work. A debate between three agents on a hard reasoning task can easily cost 5× the tokens of the best single agent answering it directly.

The accuracy lift, on the tasks where debate helps, is typically in the 10-25% range — meaningful, but not always worth 5× the cost. The honest accounting therefore depends on the domain. In high-stakes settings (legal review, medical synthesis, financial decision support) the lift is often worth it. In bulk-throughput settings (customer support, content moderation) the lift rarely justifies the cost, and a single well-prompted agent with a cheap verifier wins.

What it actually buys you

The realistic case for multi-agent systems, stripped of the marketing, is this: they buy you specialization, error correction, and context isolation, at the cost of tokens, latency, and complexity. They do not buy you general intelligence beyond the ceiling of the underlying model — a swarm of GPT-4-class agents will not collectively do GPT-6 work. They do not, in current implementations, develop genuinely emergent capability; what looks like emergence is usually the underlying model's capability finally being elicited by better scaffolding.

The most overstated claim in the multi-agent literature is that swarms unlock qualitatively new behaviour. They mostly unlock quantitative reliability gains — turning a 60% solve rate into 80%, which is a real and valuable thing to do, but not a different kind of mind. The most under-discussed cost is debugging: a five-agent system has eight pairwise interfaces, each of which can fail, and tracing a failure across them is harder by an order of magnitude than debugging a single agent.

Once you have multiple agents talking, the question that immediately follows is: how do they decide whether to believe each other? That is the next chapter — protocols of trust.