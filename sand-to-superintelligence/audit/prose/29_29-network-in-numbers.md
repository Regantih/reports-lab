# Chapter 29 — A Neural Network Lives in Numbers
Subtitle: Weights as DRAM, thought as matrix multiply
Blurb: What a 'frontier model' actually is when you open the box: a few hundred billion floating-point numbers and one operation, repeated.

## Stat row
- ~200 B — parameters in a frontier model
- ~400 GB — weight memory in BF16
- FP8 — the new precision floor for inference

## Sections
- Opening the box
- A layer is a matrix multiply
- Attention is also a matmul
- FP16, BF16, FP8 — the precision frontier
- The shape of a frontier model

## Prose
A frontier AI model is, when you finally pry open the box, a strangely simple thing: a few hundred billion floating-point numbers, organized into stacks of matrices, evaluated by repeated matrix multiplication and a single squashing function. There is no symbol manipulation, no logic engine, no rule database. There is arithmetic, performed at speeds that would have terrified von Neumann.

Opening the box

If you download a Llama model or a Mistral model, what arrives on your disk is a directory of files containing two things: a small JSON config describing the architecture, and many gigabytes of weight tensors — multidimensional arrays of numbers. That is the model. The architecture is a rule for how the numbers are arranged and how to use them; the weights are the learned content. Training is the long, expensive act of choosing the weights.

For a model with 200 billion parameters in BF16 (16 bits each), the weights occupy 400 GB. Frontier inference systems shard them across many GPUs because they do not fit in any single device's HBM.

A layer is a matrix multiply

The fundamental unit of a transformer is a linear layer: a matrix multiply y = W x + b, followed by a nonlinearity (typically GELU, SiLU, or ReLU). The input x is a vector of activations from the previous layer, perhaps 16,000 numbers. The weight matrix W is, say, 16,000 × 64,000. The output y is a vector of 64,000 numbers. The nonlinearity is applied element-wise.

That is it. That is the operation a neural network performs, repeated thousands of times per token. It maps to tensor cores almost exactly: this is the workload GPUs are built for.

Attention is also a matmul

The transformer's signature trick — self-attention, introduced by Vaswani et al. in Attention Is All You Need (2017) — is, despite its mystique, also a matrix multiply. Three projections of the input (queries Q, keys K, values V) are computed by linear layers. Then attention is computed as softmax(QKT/√d)V: a matrix multiply of Q and K-transpose, a softmax over the result, and another matrix multiply with V. FlashAttention rearranges this computation to be memory-efficient on real hardware, but the underlying operation is the same.

A modern transformer block is attention + an MLP, both of which are linear layers (so, matrix multiplies) wrapped around nonlinearities. The whole network is a stack of these blocks — typically 80 of them in a frontier model — plus an embedding layer at the beginning and a projection to vocabulary at the end.

FP16, BF16, FP8 — the precision frontier

Each weight is a floating-point number, but not necessarily a 32-bit one. NVIDIA's mixed-precision training paper showed that 16-bit formats are sufficient for both training and inference if you are careful about loss scaling. BF16 (brain floating point) keeps FP32's exponent range with FP16's mantissa, which trades a little precision for a lot of dynamic range.

The frontier has now moved to 8-bit formats — FP8 (E4M3 and E5M2) for both training and inference, sometimes mixed with INT8 quantization. Going from 16 bits to 8 bits halves the memory and doubles the compute throughput; doing it without losing accuracy is a delicate art that has occupied much of the systems-ML community since 2022. Hopper added native FP8 tensor cores; Blackwell adds FP6 and FP4.

The shape of a frontier model

A modern frontier model is roughly:

  

A vocabulary of about 100,000 tokens, each mapped to a 16,000-dimensional embedding vector.

  

~80 transformer blocks, each containing self-attention and an MLP, with hidden dimensions of 16,000-25,000.

  

A final projection from the last hidden state back to vocabulary size, producing token logits.

  

Total parameters: 100B-1T, depending on the model.

  

Training cost: 1025 floating-point operations or more, sustained over months on tens of thousands of GPUs.

What is striking, when you take the box apart, is the absence of mystery in the parts. The mystery — the apparent reasoning, the apparent comprehension, the apparent planning — emerges only when you put 200 billion of those parts together and ask them, in concert, to predict the next token of a sentence. We do not yet understand why such a simple recipe produces such complex behaviour. We only know it does, and that the silicon we built for matrix multiplies turns out to be exactly the silicon needed to make it happen.

The last chapter of this book follows a single thought as it makes its way through that arrangement of numbers, end to end.