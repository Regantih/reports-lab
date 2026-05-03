# Chapter 37 — The Memory Commons
Subtitle: Vector databases and the shared substrate of recall
Blurb: Models don't remember; vector stores do. Embeddings, retrieval, and RAG are how a stateless oracle pretends to know your company — and how the next generation of moats is being built.

## Stat row
- ~109 — vectors in a single mid-size production index
- ms — vector lookup latency at billion-scale
- ~$0.10/M — current cost of embedding a million tokens

## Sections
- Why a model needs an external memory
- Vector databases
- Retrieval-augmented generation
- Knowledge graphs and the structured complement
- The memory commons

## Prose
A frontier model's weights are frozen at training time. They know what was in their training corpus, badly, and nothing else. The world keeps moving, organizations keep producing new documents, and an agent that cannot read those documents is, however clever, useless on yesterday's spreadsheet. The infrastructure that has grown up to give models access to fresh memory is one of the largest hidden buildouts in the AI stack — vector databases, retrieval pipelines, knowledge graphs — and it has produced something genuinely new: a shared, queryable, machine-readable substrate that many models can read at once.

Why a model needs an external memory

A 200-billion-parameter model has, in some sense, a few hundred billion floating-point numbers' worth of memory baked into its weights. That memory is impressive in breadth — every Wikipedia article, all of public GitHub up to a cutoff date, vast tracts of the open web — but it is also lossy, undifferentiated, and stale. Asking a frozen model what is in your company's wiki, or what was decided in last week's planning meeting, gets a confidently wrong answer or a refusal.

The fix is to give the model a place to look up facts at inference time. Mechanically, this means: at the moment a question arrives, search a corpus of documents for material relevant to the question, and paste that material into the model's context window before asking it to answer. This is retrieval-augmented generation, or RAG, and it is the most widely deployed pattern for grounding model output in current data.

Vector databases

The retrieval primitive is nearest-neighbour search in embedding space. Given a query embedding, find the K document embeddings closest to it (typically by cosine similarity or inner product). At small scale this is a simple matrix multiply. At billion-document scale it is a serious systems problem — full pairwise comparison would take seconds per query, and production targets are under 10ms.

The answer is approximate nearest-neighbour (ANN) indexing. FAISS from Meta open-sourced the foundational algorithms — IVF, HNSW, product quantization — that turn billion-scale similarity search into a sub-10ms operation at modest accuracy loss. Pinecone, Weaviate, Qdrant, and pgvector (a PostgreSQL extension) packaged this as managed and self-hosted services. By 2026 every major data warehouse — Snowflake, BigQuery, Databricks — ships native vector search alongside SQL.

The vector database has become a recognized layer in modern data stacks, sitting alongside the relational database, the document store, and the message queue. Its workload is one operation: "find me the K most similar items to this." That single primitive, executed billions of times a day, is what makes RAG work at scale.

Retrieval-augmented generation

A production RAG system has more moving parts than the marketing suggests. The corpus is chunked into pieces small enough to embed cleanly; chunking strategy is its own subfield because too-large chunks lose specificity and too-small chunks lose context. Each chunk is embedded with a model whose tradeoffs (size, dimension, language coverage) determine the system's recall ceiling. The vectors are indexed; the query is embedded; the K nearest chunks are retrieved; reranking with a more expensive cross-encoder model improves precision; the surviving chunks are formatted into a prompt; the model answers, sometimes with explicit citations to the chunks it used.

What works well: factual question-answering grounded in a corpus, customer support over product documentation, internal knowledge search, code search at scale. What works poorly: anything requiring synthesis across many chunks (the model can read what it is given, but won't assemble it well past a certain size), anything where the question is ambiguous and the retriever picks the wrong neighbourhood, anything where the corpus has internal contradictions the retriever surfaces both sides of without resolving.

The realistic state in 2026 is that RAG is a mature pattern with a known limit: it makes a model accurate where it would otherwise hallucinate, and it surfaces sources where it would otherwise be unaccountable, but it does not make a model smart. The model's reasoning is still the binding constraint; retrieval just unblocks it.

Knowledge graphs and the structured complement

Vectors capture similarity but lose structure. "Apple acquired Beats" and "Beats was acquired by Apple" produce nearly identical embeddings, but a question like "list every Apple acquisition" wants something more like a SQL JOIN than a similarity search. Knowledge graphs — explicit (subject, predicate, object) triples organized into a queryable graph — have come back as a structured complement to vector retrieval.

The leading patterns in 2026 are hybrid: vector retrieval handles fuzzy semantic matching, while a structured graph holds the entities and relationships that the model can query precisely. Microsoft's GraphRAG and similar systems extract entities and relations from documents into a graph, then use both vector and graph queries during retrieval. The hybrid does materially better on multi-hop questions ("which products use components made in Taiwan?") than vector-only systems.

The memory commons

The interesting structural fact, beyond the technology, is that the same retrieval substrate now serves multiple agents and multiple models. A company's vector index is read by its customer-support agent, its sales-research agent, its legal-review agent, and its onboarding agent. Each agent contributes new chunks back: the support agent records resolved tickets, the sales agent records call notes, the legal agent records contract clauses. The index becomes a memory commons — a shared substrate that grows monotonically as the organization works.

What is genuinely new is that the commons is queryable in natural language by any model that can speak to its embedding. The institutional knowledge of a company, which used to live in inboxes and undocumented heads, is becoming a structured asset with a per-token retrieval cost. The implications for organizational memory, for diligence, for litigation discovery, for what an exiting employee can take with them — these are still being worked out, in courts and in company policies, mostly with a few years' lag behind the engineering.

The commons exists; the questions are who owns it, who can read it, and how it is kept clean. None of these are technical questions. The technical layer has done its part. The next layer — agents that act on the world — is where the protocols meet the messy world. Chapter 38 follows them out of the API and into the browser.