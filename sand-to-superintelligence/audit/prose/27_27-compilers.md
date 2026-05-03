# Chapter 27 — The Translation Stack
Subtitle: Python to bytecode to LLVM to silicon
Blurb: The seven layers of meaning between your `print("hello")` and the electrons that move because of it.

## Stat row
- 7 — stages of translation between Python and silicon
- LLVM IR — the universal middle language
- ~3-5 µops — what one x86 instruction often becomes

## Sections
- Seven layers of meaning
- Source to syntax tree
- Intermediate representation
- Assembly to machine code
- Down to micro-ops

## Prose
When you type print("hello") and hit enter, you are issuing an instruction in a language nothing in the silicon understands. The transistors do not know about strings, or about printing, or about Python. Between your sentence and the electrons that respond to it, there are seven distinct languages and seven translations. This chapter walks down them.

Seven layers of meaning

Each layer of the translation stack is a more constrained, more concrete version of the one above. Each is the input to the next:

  

Source code. What you wrote — Python, C++, Rust, Swift.

  

Abstract syntax tree. The same meaning, expressed as a tree of language constructs.

  

Bytecode or IR. A linear, machine-independent intermediate language.

  

Assembly. A human-readable form of the actual instruction set.

  

Machine code. The bytes of the instructions themselves.

  

Decoded operations (µops). What the CPU actually executes inside its pipeline.

  

Electrons. The physical phenomenon, finally.

Source to syntax tree

The first stage is parsing. The compiler — or interpreter — reads your source as a stream of characters and groups them into tokens (keywords, identifiers, literals, punctuation), then assembles those tokens into a tree that captures the program's structure. The Python interpreter does this in CPython's ast module; clang does it in its own AST. A function call becomes a node with a callee and a list of arguments. A loop becomes a node with a condition and a body.

The AST is where most type-checking, scoping, and semantic analysis happens. It is the last layer that still resembles what the programmer wrote.

Intermediate representation

From the AST, the compiler emits an intermediate representation (IR). For Python, this is bytecode — small, stack-machine instructions that the CPython virtual machine executes one by one. For compiled languages, it is something more powerful: LLVM IR, a typed, register-based language that has become the lingua franca of modern compilers. Clang, Rust, Swift, Kotlin Native, and many others all emit LLVM IR.

LLVM IR is where most optimization happens. The compiler can inline functions, eliminate dead code, hoist invariant expressions out of loops, vectorize, unroll, and rearrange — all without yet knowing whether it will run on x86, ARM, or RISC-V. LLVM's developer meetings are where the modern art of optimization is most visibly practiced.

Assembly to machine code

Once optimization is done, the back-end emits assembly — instructions in the target ISA, with named registers and labels. This is the human-readable form. It is then trivially translated into machine code: the actual bytes the CPU will fetch.

The output is an object file in a standard format — ELF on Linux, Mach-O on macOS, PE on Windows. The linker then stitches your object file together with libraries (libc, libm, libstdc++) into the final executable, resolving every reference to a function or variable into a real address.

Down to micro-ops

You might think the story ends with machine code. It does not. Inside a modern x86 CPU, each fetched instruction is decoded into one or more micro-operations (µops). A single ADD [memory], reg instruction might become three µops: a load, an add, and a store. The CPU then schedules these µops out-of-order, executes them in parallel on multiple ports, and retires their results in the original program order.

This is why modern CPUs can claim to execute more than one instruction per cycle. They do not, exactly. They execute many micro-ops per cycle, and present the illusion of an in-order machine to the programmer. Intel's optimization guide documents the µop breakdown of every instruction. ARM and Apple Silicon CPUs use similar internal pipelines.

So when you type print("hello"), your text is transformed seven times before it becomes electron motion. Six of those transformations happen in software, before the program ever runs. The seventh — machine code into µops — happens inside the CPU itself, every cycle, at runtime, billions of times a second.

This stack is what makes general-purpose CPUs possible. But it is also the stack that AI workloads outgrew. The next chapter is about a different kind of mind, optimized for a different shape of problem.