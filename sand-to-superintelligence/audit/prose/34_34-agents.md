# Chapter 34 — Agents
Subtitle: The loop that turns a model into a worker
Blurb: An agent is not a smarter model. It is a model in a loop with tools, memory, and a goal — and that loop is where the real engineering, and the real failures, live.

## Stat row
- 4 — minimum components of an agent: model, tools, memory, goal
- ~10-100 — tool calls per task in 2026 production agents
- ~20-40% — task completion rate of best agents on real-world benchmarks

## Sections
- From answer to action
- The anatomy of an agent
- The agent loop
- What actually works in production
- What doesn't, yet

## Prose
Until 2023, an interaction with a language model was a question-and-answer transaction. You typed; it replied. Whatever the reply implied — that you ought to schedule a meeting, refactor a function, draft an email — was your job to carry out. Then the function-calling APIs arrived, somebody hooked a model up to a web browser and a shell, and the loop closed: the model could now read its own previous output, decide on a next action, take it, and read the result. That loop, repeated, is what people now mean by an "agent". It is the most consequential architectural change of the decade.

From answer to action

The shift from answer to action is not a quantitative improvement. It is a category change in what the system can be evaluated on. A chatbot is judged on whether its answer is good. An agent is judged on whether the world is different — whether the meeting actually got scheduled, whether the bug was fixed, whether the customer was refunded. Goodhart's law applies less; the proof is in the state of the system, not in the prose.

The downside, of course, is that an agent that is wrong does damage instead of just generating a bad paragraph. This is the asymmetry that everyone building agents lives inside, and most of the engineering effort goes into reducing the blast radius of the inevitable mistakes. Anthropic's Claude with computer use, OpenAI's Operator, and the OpenHands open-source agent all spend more code on guardrails, logging, confirmation prompts, and rollback than on the model integration itself.

The anatomy of an agent

An agent has, at minimum, four components. Anything missing one of these is an agent in marketing terms only.

  

A model. The reasoning core, large enough to plan multi-step tasks. As of 2026 this is in practice Claude Sonnet 4.6, GPT-5.4, Gemini 3 Pro, or one of a small number of open-weight equivalents. Smaller models are used as routers and for narrow specialized agents, but for general-purpose agency the frontier is still the bar.

  

Tools. A set of functions exposed as JSON schemas the model can call: file system, shell, web browser, database, email, calendar, internal APIs. The taste in tool design is everything. Too few tools and the agent cannot do anything useful; too many and the model gets confused about which to use; tools with leaky semantics produce invisible bugs.

  

Memory. A way for the agent to retain state across turns and across runs. In the simplest case this is just the conversation history. In serious systems it is a vector database (Chapter 37), a structured scratchpad, a knowledge graph of facts learned about the user, or some combination.

  

A goal. What the agent is trying to do, and how it knows when it is done. Stated goals are noisy; effective agent systems usually augment them with a verifier — a check that runs after each action to catch divergence early.

The agent loop

Wired together, these components run a loop:

  

Perceive. Read the current state of the world the agent has access to: the user's last message, the contents of a file, the result of the last tool call.

  

Plan. Send the model a prompt containing the goal, the relevant memory, the available tools, and the recent observations. The model returns either a tool call, a sub-task decomposition, or a final answer.

  

Act. If the model called a tool, execute it. If it produced a final answer, return.

  

Observe. Capture the result of the tool call. Append it to the conversation. Update memory if appropriate.

  

Repeat. Loop back to step 1 until done, or until a budget — tokens, seconds, dollars — is exhausted.

The loop sounds simple. Making it work reliably on real tasks is, candidly, not. Agents drift off goal, get stuck retrying the same failing action, declare victory prematurely, and hallucinate that tools returned data they did not return. The benchmarks tell the story: on SWE-bench Verified, a curated set of real GitHub issues, the best published agents in late 2025 solve 60-70% of tasks; on harder, longer benchmarks like AgentBench the numbers are closer to 30%. Two years ago the same numbers were near zero, so the trajectory is real, but agents are not yet drop-in workers for arbitrary white-collar tasks.

What actually works in production

Where agents do work, in 2026, the pattern is consistent: the task is bounded, the tools are well-specified, the verifier is automated, and the human is in the loop on consequential actions. Specifically, agents that are working at scale are doing the following kinds of jobs:

  

Coding agents inside established codebases. Tasks like "implement this issue", "find the source of this bug", "write tests for this function", with a CI suite as the verifier. Cursor, GitHub Copilot Workspace, and the open Aider are doing measurable amounts of real engineering work in 2026.

  

Customer-support triage and resolution. The agent reads the ticket, looks up the customer in CRM, checks the order in the database, drafts a reply, escalates when uncertain. Intercom's Fin and similar systems are deflecting a meaningful share of L1 tickets.

  

Research and analysis loops. The agent reads documents, searches the web, synthesizes a report, and surfaces sources. The verifier here is usually still a human reviewer, and the task is bounded by the prompt's scope.

  

Routine browser tasks. Filling forms, scheduling, comparison shopping, downloading reports — the long tail of low-stakes web work. Reliability is improving but still well below human.

What doesn't, yet

What does not yet work, despite many companies claiming otherwise: long-horizon autonomous projects without supervision, complex strategic decisions, anything requiring judgment about novel situations the model has no training analogue for, and tasks where the cost of a wrong action is very high relative to the value of a right one. The gap between a demo-quality agent and a production-quality one is several engineering quarters of guardrail work, and there is no shortcut.

The structural fact, however, is that the gap closes year over year. The agent of 2026 outperforms the agent of 2024 on every benchmark by a wide margin, and that progression shows no signs of stalling. The economic question — which jobs, exactly, become an agent's work and on what timeline — is open. The architectural question is settling: the loop above, with a stronger model and better tools, is the shape that everything is converging on. The next chapter asks what happens when the loop nests.