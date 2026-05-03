# Chapter 36 — Protocols of Trust
Subtitle: MCP, A2A, and the standards quietly being negotiated
Blurb: Anthropic's MCP and Google's A2A are doing for agents what HTTP did for documents — defining how strangers' systems are allowed to call each other. The fights are about who holds the keys.

## Stat row
- Nov 2024 — Anthropic open-sources Model Context Protocol
- ~3,000+ — MCP servers published in the first year
- 0 — widely-deployed protocols for cross-vendor agent identity, end of 2025

## Sections
- The trust problem
- Function calling as the baseline
- MCP: a protocol for tools
- A2A and its rivals
- What trust actually requires

## Prose
When two machines exchange documents, the question of trust is mostly answered by TLS — the document is from the server it claims to be from, and nobody read it in transit. When two AI systems exchange operations, that level of trust is not enough. The agent on the other end can fabricate, refuse, drift, or actively deceive. The protocols of the next decade are about answering, in the field, the same question that letters of credit answered for medieval trade routes: how do you act on a stranger's word?

The trust problem

The naive setup of an agent making API calls has at least four trust failures waiting to happen. The agent can hallucinate — invent an API response that did not happen. The tool can lie — return a result that misrepresents its underlying action. The user's permissions can be insufficient or excessive — the agent does something the user didn't intend, with credentials the user shouldn't have given. And the underlying transport can be tampered with — somebody intercepts and alters the call.

Each failure mode has a partial solution that has been around for decades — TLS for transport, OAuth for permissions, formal specs for behaviour — but they were designed for stable, deterministic clients. Agents are neither; they will improvise, and the protocol layer has to assume the agent itself is the most likely source of trouble. This is a category of trust problem the existing internet plumbing was not built for.

Function calling as the baseline

The first answer is the function-calling APIs introduced by every major model provider in 2023-24. OpenAI, Anthropic, Google, and the open-weight community converged on roughly the same shape: the developer declares tools as JSON schemas, the model emits structured calls conforming to those schemas, the runtime validates and executes them, and the result is fed back as a typed message.

This is a real protocol, in the sense that it is explicit about syntax and at least lightly explicit about semantics (the schema documents what each parameter means). It is not a real protocol, in the sense that there is no standard registry of tools, no portability between providers (each one's schema dialect differs slightly), and no built-in authentication or permission model. Each developer wires their own tools per provider, often three or four times over.

MCP: a protocol for tools

The most consequential agent protocol shipped to date is the Model Context Protocol, open-sourced by Anthropic in November 2024. MCP separates the model from the tool it is calling, so any MCP-compliant client (Claude Desktop, IDE plugins, custom agents) can talk to any MCP-compliant server (a database connector, a filesystem reader, a Slack integration). The protocol covers tool discovery, invocation, and structured responses; it is transport-agnostic, runs over standard JSON-RPC, and is genuinely portable.

By the end of 2025, the MCP server registry passed 3,000 published integrations: filesystems, databases, version-control hosts, communication tools, internal corporate APIs, vertical SaaS products. The pattern resembles ODBC in the 1990s — a standard adapter layer that decouples capability from vendor — and the network effects look comparable. Every model vendor, including those who would have preferred to keep their tool ecosystem captive, has now shipped MCP support.

What MCP is not, and does not pretend to be, is a solution to the cross-organizational trust problem. An MCP server still has to authenticate its caller, sign its responses, log its actions, and answer to its operator's policies. MCP standardizes the shape of the conversation; it does not standardize the social contract beneath it.

A2A and its rivals

The next-layer-up problem — agents from different organizations communicating with each other — is less settled. Google's Agent2Agent (A2A) protocol, announced in April 2025, proposes a JSON-over-HTTPS standard for agent-to-agent task delegation, with explicit fields for capabilities, identity, and conversational state. Several large vendors have signaled support; production deployments are still scarce.

Competing with and supplementing A2A are: bespoke agent-to-agent APIs at the major clouds, ad-hoc patterns in the open-source frameworks, and a handful of research proposals (Agent Communication Languages reflecting older multi-agent work). The honest state of affairs at end of 2025 is that there is no winner and the field is in the period that HTTP was in around 1992 — multiple proposals, real interest, no consensus, and most actual cross-agent traffic happening through whatever proprietary glue happens to be cheapest to wire up.

What trust actually requires

For machine-to-machine trust to scale beyond a single organization, four things must be solved at the protocol layer. None are fully solved today.

  

Identity. Each agent must have a verifiable, non-spoofable identity its operator can authenticate. Today this is mostly done with bearer tokens and API keys, which are leaky. Decentralized identifiers are a candidate; nothing is mainstream.

  

Capability description. What can this agent do, and what is its track record? The closest thing to a standard is the schema in the function-calling specs, but that does not say anything about reliability or behavior in edge cases.

  

Audit trail. Did the agent do what it said it did, and can its operator prove it later? Logging is mature inside organizations and absent across them.

  

Recourse. What happens when an agent damages a counterparty? In human commerce this is courts and reputation. In machine commerce it is, presently, a very long support ticket and possibly a chargeback.

The realistic forecast is that protocols will fill these gaps unevenly over the next three to five years, much as the web's authentication and payment layers grew in around the original HTTP. By the end of that window we will have, in some form, an agent-PKI, a capability registry, standardized audit hooks, and small but real cross-organizational machine-to-machine commerce. We will also have, in 2025-2027, the parallel growth industry of agent-fraud and agent-fraud-prevention, which always tracks the trust layer's gaps.

Whatever the protocols end up looking like, they will need a substrate to operate on: a place where agents store their shared facts and recover what one of them learned an hour ago. That substrate is the memory commons.