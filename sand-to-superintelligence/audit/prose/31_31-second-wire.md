# Chapter 31 — The Second Wire
Subtitle: When models start talking to each other
Blurb: The first wire connected machines so humans could share files. The second wire connects models so they can share thought. What changes when intelligence itself becomes the payload.

## Stat row
- 1844 — the first commercial telegraph line, Baltimore to Washington
- 1989 — Tim Berners-Lee proposes the World Wide Web at CERN
- 2024 — first year a majority of API calls were made by software, not browsers

## Sections
- The first wire was a stock ticker
- A pattern that keeps repeating
- Intelligence on a wire
- What is genuinely new

## Prose
For most of the last two centuries, the most valuable invention in any decade was usually a wire. Not the wire itself — copper is cheap, and there has been plenty — but the agreement about what would travel on it, and how. Each generation laid a new wire on top of the old one, carrying a more abstract cargo, and each generation watched the economy reorganize around the new traffic. Part III of this book is about the wire being laid right now: the one carrying intelligence between machines.

The first wire was a stock ticker

The Baltimore-to-Washington telegraph line opened in May 1844 with the famous message "What hath God wrought." Within five years it carried something more consequential: stock prices. By 1867, the stock ticker was decoupling the price of a share from the physical floor of the exchange. A merchant in Cincinnati could now, for the first time, transact at New York prices in close to real time. Capital began to flow across distances that had previously protected local markets.

The pattern that would repeat itself for the next 180 years was already visible: the wire did not create the underlying activity (prices, conversation, computation), but it removed distance as a constraint, and the activity restructured itself accordingly. Cities specialized. Middlemen who had survived on geographic friction were eliminated. New middlemen — the wire operators themselves — captured a portion of the surplus.

A pattern that keeps repeating

Each subsequent wire told a version of the same story, with a more abstract payload.

  

Telephone (1876). Alexander Graham Bell's patent moved the unit of value from the price quotation to the conversation. AT&T's monopoly, born of network effects in interconnection, became one of the most durable rents in industrial history.

  

TCP/IP (1983). The DARPA-sponsored switch to the Internet Protocol turned every wire into a single, packet-switched, addressable substrate. A file in Stanford and a file in Cambridge became neighbours. The economic structure that had been built around proprietary networks (Compuserve, AOL, Minitel) was hollowed out within a decade.

  

HTTP and the Web (1991). Tim Berners-Lee's "Information Management: A Proposal" at CERN laid down a hypertext protocol on top of TCP/IP. The unit of value rose from the file to the document, and from the document to the page-as-application. Newspapers, classifieds, encyclopedias, retailers, taxis, and hotels were each rebuilt — sometimes destroyed — in the years that followed.

  

Mobile data and the API (2007 onwards). The iPhone shipped with a cellular data radio and an embedded web browser, and within five years the dominant traffic on the internet was no longer documents requested by humans. It was structured data exchanged between programs through REST APIs. The unit of value rose again — from the page to the function call.

By 2024, more than half of all calls hitting public APIs at major cloud providers were originated by software, not by a browser with a person at the other end. Cloudflare's Radar tracked this crossing as a routine fact of internet weather, not a revolution. The web had quietly stopped being primarily a network for humans some time before anybody announced it.

Intelligence on a wire

The fifth wire — the one being laid right now, on top of HTTP and TLS and JSON, requiring no new physical layer — carries something different. The previous payloads were inert. A telegraph line did not interpret the price; a phone line did not understand the voice; a TCP packet did not summarize the file. Each wire moved a thing without changing it.

The fifth wire carries thought. Not a recording of thought, like a voice on a phone line, but the live act of thinking. One side of the connection sends a question; the other side, in milliseconds, runs the trillion-multiplication ritual described in Chapter 30 and sends back an answer that did not previously exist anywhere. The unit of traffic is a token, and the token is an inference — a small, original act of cognition performed on demand.

The other wires moved information. This wire moves operations on information, performed at the wire's far end, by something that resembles a mind enough that the distinction matters.

What is genuinely new

Three things make this wire structurally different from the four that came before.

The endpoint is not addressed; it is solicited. When you call an HTTP API, you address a specific server with a specific function. When you call a model, you describe what you want and the network finds a model that can do it. Routing layers like OpenRouter, model gateways at the major clouds, and the emerging spot markets for inference all work by treating the model as fungible substrate. Anthropic's Claude and OpenAI's GPT-5 are no longer destinations; they are providers competing on a price-and-latency curve.

The cargo is generative, not retrievable. A request for the population of France can be cached. A request to summarize a 200-page document the model has never seen cannot. Every call may produce a unique output, which means the wire has no equivalent of a content-delivery network; the only optimization is to bring the model and the data closer in space, or to make the model smaller, or to make the inference cheaper. The economic geography that emerges is therefore different.

The endpoints are themselves software, increasingly capable of orchestrating other endpoints. A telephone call is between two humans, or one human and one answering machine. A REST call is between two programs, but each program is rigid — it executes a fixed transaction and returns. A model call is between two programs, where one of them can decide, in light of the answer, to call ten more endpoints, in a sequence of its own devising. Chapters 34 and 35 will get to what this implies; for now it is enough to say that the wire's two ends are no longer symmetric in the way previous wires' ends were.

The economic consequences will be enormous, distributed unevenly, and partially predictable. A reasonable first approximation: whatever was previously expensive because it required a human to do something formulaic — read a document, draft a memo, answer a question, schedule a meeting — will get cheaper by an order of magnitude, possibly two. Whatever requires the kind of judgment that current models cannot fake will, for a time, get more valuable. Where the line falls is moving.

Part III of this book is the attempt to describe, layer by layer, what is being built on top of this fifth wire — the protocols, the agents, the markets, the new institutions of value. As before, none of the parts are individually strange. Their accumulation is.

We start with what travels on the wire: not bytes, exactly, but a stranger object — the token.