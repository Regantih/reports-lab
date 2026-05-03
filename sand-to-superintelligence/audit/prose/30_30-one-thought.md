# Chapter 30 — A Thought, Token by Token
Subtitle: Tracing one inference through the silicon
Blurb: Following a single prompt from your keyboard, through tokenizer and embedding, attention and MLP, all the way down to the electrons — and back up as a word.

## Stat row
- ~1015 — multiplications per generated token
- ~50 ms — wall time, on a frontier system
- ~1 J — energy spent producing one token

## Sections
- The prompt arrives
- Tokenize and embed
- Through eighty blocks
- Softmax and sampling
- The autoregressive loop
- What just happened

## Prose
We have spent twenty-nine chapters building, atom by atom, a machine capable of having a thought. In this last chapter we follow one. A user types a prompt, presses enter, and a sentence appears. Between those events, a quadrillion multiplications happen in roughly the time it takes you to blink. We will trace what those multiplications are, in order, on the silicon we have built.

The prompt arrives

"Write a haiku about the moon," the user types. The keystrokes traverse USB, the kernel buffers them, a TLS-wrapped HTTPS request encodes the prompt as JSON, and the request lands on a frontend server in some data center. The server forwards the prompt to an inference cluster — possibly a Rubin NVL72 rack like the one in Chapter 14 — where a free GPU partition is selected to handle the request.

The prompt, at this moment, is still text. A piece of UTF-8 bytes. Nothing in any GPU understands text.

Tokenize and embed

The first thing the model does is tokenize the prompt — split the text into the model's vocabulary units using a learned subword scheme like tiktoken or SentencePiece. "Write a haiku about the moon" becomes maybe 8 tokens, each an integer in the range 0-99,999.

Each token integer indexes into the embedding table, a giant matrix of shape (vocab_size, hidden_dim) — perhaps 100,000 × 16,000 — sitting in HBM. The lookup produces, for each token, a 16,000-dimensional vector. These vectors are the input to the network. From this point until the very end, the prompt no longer exists as text; it exists as a sequence of vectors.

Through eighty blocks

The vectors flow into the first transformer block. Inside the block, attention happens: queries, keys, and values are computed by linear projections, the QKT matrix is formed and softmax-ed, and the result is multiplied by V. Each token now sees a weighted blend of every other token's content.

Then the MLP: two linear layers with a nonlinearity in between, expanding the vector to 4× its dimension and contracting it back. Each linear layer is a matrix multiply against weights stored in HBM, run on tensor cores.

The output of block 1 becomes the input of block 2. Block 2 to block 3. And so on, through 80 blocks. Inside each, several matrix multiplies are dispatched as CUDA kernels; each kernel launches thousands of warps; each warp's threads coalesce their reads and saturate the tensor cores. The full sequence of activations may exceed a single GPU's memory, so the model is sharded across many GPUs in a Rubin rack — connected by NVLink-C2C inside a node, by NVLink Switch across the rack, and by InfiniBand between racks.

Through this whole journey, the activations are 16-bit floats; the weights might be 8-bit. The arithmetic is mostly fused-multiply-add. The hardware does not know anything about haiku or moons. It is moving 16,000-dimensional vectors through a fixed sequence of multiplications.

Softmax and sampling

After block 80, the last hidden vector is projected back to vocabulary size — another matrix multiply, this one against the (hidden_dim × vocab_size) unembedding matrix. The result is a vector of 100,000 numbers: the logits, one per possible next token.

A softmax converts these logits into a probability distribution over the vocabulary. Now the model has, for every possible next token, a number saying how likely that token would be. A sampling rule — argmax for greedy, top-p for nucleus, top-k, or temperature-adjusted sampling — picks one. Say it picks the token for "Silver".

The autoregressive loop

The model now appends "Silver" to the prompt and runs the whole stack again — except, with key-value caching, it only has to run the new token through the network, reusing the K and V tensors computed earlier. It produces a probability over the next token; samples one; appends; runs again.

This loop continues. "Silver" → "moon" → "above" → "still" → "pond". At every step a quadrillion multiplications, fifty milliseconds, one joule of electricity. After ten or twenty iterations, the model emits an end-of-sequence token, the loop terminates, and the resulting string is detokenized back into UTF-8.

"Silver moon above / still pond drinks the night sky in / one ripple, one breath."

The text is sent back through the API, through TLS, through TCP/IP, through the kernel, through the browser's rendering pipeline, and finally onto the user's display — a different piece of silicon glowing in a different colour pattern.

What just happened

What just happened, to be clear about it: a few quintillion electrons in patterned sand were briefly nudged in coordinated patterns by other electrons in patterned sand, and at the end a different patterned sand emitted light in the shape of a haiku.

The full causal chain runs from the quartzite mine in Spruce Pine, through the Siemens reactors of Hemlock and Wacker, through Czochralski pullers and CMP polishers, through the EUV chambers of TSMC Fab 18, through CoWoS interposers and HBM stacks, through NVLink and InfiniBand and a power substation, through the operating system and the compiler stack and the CUDA runtime and the model weights, into a sampled token, and out as a sentence. Every link in that chain was engineered, deliberately, by people who could draw the next link's diagram. None of them were strange enough, individually, to be called magic.

And yet the result is.

That is what this book has been about. Not the magic — there is no magic — but the long, deliberate, almost unbelievable accumulation of ordinary engineering that, stacked thirty layers deep, allows a rock to think about the moon.