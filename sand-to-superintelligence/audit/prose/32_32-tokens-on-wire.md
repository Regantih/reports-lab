# Chapter 32 — Tokens on the Wire
Subtitle: What flows when intelligence is the payload
Blurb: HTTP carried documents. The new wire carries tokens, embeddings, and tool calls — a different shape of traffic with a different economics underneath.

## Stat row
- ~4 chars — average bytes per English token
- 3,072 dims — size of an OpenAI text-embedding-3 vector
- ~$0.30 — median price of one million input tokens, end of 2025

## Sections
- The token as the new packet
- Embeddings: meaning as geometry
- Function calls and structured output
- The anatomy of a single API call
- What this changes about networking

## Prose
If the fifth wire is real, what does its packet look like? When one model talks to another, or to a tool, or to a database, what is the literal payload? It is not bytes the way HTTP packets are bytes, and it is not records the way SQL rows are records. It is three closely related objects: tokens, embeddings, and structured calls. This chapter describes each of them, and then walks through the anatomy of a single inference request as it crosses the wire.

The token as the new packet

A token is the smallest unit a language model deals with. Tokens are produced by a tokenizer such as tiktoken (used by OpenAI) or SentencePiece (used widely elsewhere). The tokenizer learns, from a large corpus, a vocabulary of around 100,000 subword units — common words like "the" or "model" become single tokens, while rare words or names get broken into pieces. On English text, one token is roughly four characters, or three quarters of a word.

Once you have tokenized a prompt, the wire-level cost of an AI request is no longer measured in bytes. It is measured in tokens. Inference providers price tokens directly: Anthropic, OpenAI, Google, and the others all publish per-million-token rates for input and output, with output typically four to five times more expensive than input because output requires running the full forward pass token by token.

The token has become, quietly, a unit of economic accounting that did not exist five years ago. Every meaningful AI workload is now budgeted, billed, rate-limited, and compared in tokens. A long-running agent's invoice is a token bill. A model's "context window" — 200,000 tokens for Claude Sonnet 4.6, two million for some Gemini variants — is the maximum prompt the wire can carry in a single request.

Embeddings: meaning as geometry

Tokens are categorical. Two tokens are either the same or they are not; "cat" and "feline" are as far apart as "cat" and "spreadsheet". To build search and retrieval systems on top of language, the field needed a representation in which similar meanings sat close together in some space. That representation is the embedding.

An embedding model takes a piece of text — a sentence, a paragraph, a whole document — and emits a fixed-length vector of floating-point numbers, typically 768, 1,536, or 3,072 dimensions. Texts with similar meaning produce vectors with similar directions. OpenAI's embeddings guide describes the standard recipe; Sentence-Transformers and Cohere's offerings are the open and competing flavours.

Geometrically, embeddings turn the question "is this document relevant to that query?" into "is this vector close to that vector?" — and closeness in a 1,536-dimensional space turns out to capture a remarkable amount of semantic similarity, despite the simplicity of the operation. The dot product of two embeddings is a usable proxy for "do these two pieces of text mean the same thing?", and it can be computed in microseconds. Vector databases (Chapter 37) are built around this primitive.

Function calls and structured output

The third object travelling on the wire is the structured output: a model emitting not free text but a JSON document conforming to a schema you specified in the prompt. OpenAI's function-calling API, Anthropic's tool-use, and Google's equivalent all formalize the same pattern: you describe a set of tools as JSON schemas, the model decides which tool to call and with what arguments, and the runtime executes the call and feeds the result back as another message in the conversation.

This is what changes a chat box into something that can act. A pure chat model has no buttons; a function-calling model has every button you give it a schema for. In production systems, the same model that was answering questions a year ago is now reading documents from S3, posting messages to Slack, opening pull requests, scheduling meetings, and querying SQL warehouses, because somebody wrote a JSON schema for each of those actions and exposed it.

The anatomy of a single API call

It is worth tracing one full call, end to end, to ground the abstractions.

A backend server somewhere builds a JSON object: a messages array containing the system prompt and conversation history, a tools array of available functions with their JSON schemas, a model name, and various sampling parameters. The whole thing is perhaps 8 KB on the wire. It is sent over HTTPS to api.anthropic.com or api.openai.com, which terminates TLS at a load balancer, authenticates the API key, applies rate limits, and forwards the request to a regional inference cluster.

Inside the cluster, the request joins a queue. A scheduler picks a free GPU partition, copies the prompt into HBM, and begins generation. With key-value caching (Chapter 30) only the new tokens require a fresh forward pass; previously seen prefixes can be reused across requests in some configurations. As tokens are generated, they are streamed back to the client over a server-sent-events connection, four to thirty bytes at a time, with maybe 50ms of latency per token. The client may or may not display the stream; some agentic systems wait for the whole response before parsing the JSON.

Once generation completes — either because the model hit a stop sequence, exhausted the output budget, or chose to call a tool — the connection closes. The exchange is recorded for billing in tokens, not bytes; the stream is logged for safety review at the provider; and the client now has either text, a JSON object, or a tool-call request to execute.

What this changes about networking

None of this requires a new physical wire. The packets are TCP, the bytes are HTTPS, the frames are HTTP/2 or HTTP/3, the encoding is JSON. What is new is the semantic layer built on top: tokens, embeddings, function calls, schemas, streaming. These are not standardized by any single body the way HTTP is; they are conventions hardened through practice and (slowly) draft specs.

The economic implication is that anybody who can speak this dialect — emit valid prompts, parse streamed completions, dispatch tool calls — gains, essentially overnight, the ability to insert AI capability into any product they own. The cost of a basic capability that would have required a research team in 2018 is now the cost of an HTTP client and a credit card. That is what is actually meant by "AI as a service": not magic, but a new packet the existing internet already knows how to deliver.

The next chapter takes one of those packets seriously and asks: how long does the round trip take, and why does the answer matter for what kinds of applications are possible at all?