# Chapter 28 — The GPU's Different Mind
Subtitle: SIMT, warps, and tensor cores
Blurb: Why a GPU isn't a fast CPU — it's a different shape of intelligence, optimized for thousands of identical thoughts at once.

## Stat row
- 32 — threads in a warp — the GPU's atom of work
- 16×16×16 — matrix shape one tensor-core instruction multiplies
- ~104 — active threads on a single Hopper SM

## Sections
- Two different minds
- SIMT and warps
- Tensor cores
- Memory coalescing
- Occupancy and the art of filling

## Prose
A CPU is a clever generalist. It runs branchy code, it juggles dozens of unrelated tasks, it copes elegantly with surprises. A GPU is a different organism altogether. It cares nothing for cleverness on a single thread — it would rather have ten thousand threads doing the same dumb thing in lockstep. For most of computing's history, this looked like a niche taste. Then deep learning happened, and it turned out the universe of useful problems was actually shaped like a giant matrix multiply. The GPU was waiting for it.

Two different minds

A modern CPU core has a few wide pipelines, deep out-of-order execution, big caches, and elaborate branch prediction — all in service of running a single thread as fast as possible. A modern GPU streaming multiprocessor (SM) has many simple ALUs, shallow pipelines, and a thread-scheduler designed to hide latency by oversubscription: when one group of threads stalls, another runs.

NVIDIA calls its execution model SIMT — single instruction, multiple threads. It is a refinement of the older SIMD idea (single instruction, multiple data). Threads are programmed independently in CUDA; the hardware groups them into warps of thirty-two and issues one instruction at a time to the whole warp. The CUDA C++ Programming Guide describes this in chapter and verse.

SIMT and warps

A warp is the GPU's atomic unit of work. All thirty-two threads in a warp execute the same instruction in the same cycle, on different data. If one thread takes a different branch, the warp diverges: the hardware executes both paths serially, masking off the threads that should not participate. This is why GPU code prefers data-parallel, branch-free inner loops.

An SM holds many warps in flight at once — sometimes 64 or more. When one warp stalls on memory, another instantly takes its place. There is no out-of-order execution; latency is hidden by sheer breadth of work.

Tensor cores

Starting with the Volta architecture in 2017, NVIDIA added tensor cores: specialized units that perform a small matrix multiply-and-accumulate as a single instruction. A modern Hopper or Blackwell tensor core can multiply two 4×8×16 matrix tiles and accumulate the result in one operation. NVIDIA's Volta whitepaper introduced the design; the Hopper and Blackwell architectures have refined it through several generations.

This matters because everything in a transformer — the matmul in attention, the matmul in the MLP, the projection layers — is exactly this shape of operation. Tensor cores are why modern frontier models train in months instead of years; on raw FP32 ALUs the same training would be a hundred times slower.

Memory coalescing

GPUs are bandwidth machines. A single Rubin GPU pulls roughly 8 TB/s from its HBM stacks. To use that bandwidth, the threads in a warp must access memory in a pattern the hardware can fold into a single transaction — adjacent threads reading adjacent words. This is called coalescing. Random or strided access patterns waste bandwidth dramatically.

The deepest art of GPU programming is laying out data so that the natural access pattern is coalesced. Frameworks like Triton and the inner kernels of FlashAttention exist largely to engineer this layout for the most common neural-network operations.

Occupancy and the art of filling

A GPU performs at peak only when its SMs are saturated — when there are enough warps in flight to hide every latency. Occupancy is the ratio of active warps to maximum possible warps on an SM. Hitting high occupancy requires balancing register usage, shared-memory usage, and thread-block size; CUDA exposes occupancy calculators as a routine optimization tool.

The experience of writing fast GPU code is unlike writing fast CPU code. On a CPU, you cherish each thread; on a GPU, you spend them like sand. The chip wants ten thousand threads, all doing the same arithmetic, all reading neighbouring bytes, all blocking and unblocking interchangeably. The chip is a swarm.

Now we have the right kind of swarm — and the right kind of swarming workload — to ask the question this whole book has been pointing at: what is a neural network, when you finally open the box?