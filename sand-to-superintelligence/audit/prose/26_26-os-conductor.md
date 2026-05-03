# Chapter 26 — The OS as Conductor
Subtitle: Processes, virtual memory, and the illusion of plenty
Blurb: How the kernel makes one CPU look like a thousand, one gigabyte look like infinity, and a million programs feel alone on the machine.

## Stat row
- ~1,000+ — processes on a modern desktop at idle
- 4 KB — the standard memory page
- ~100 ns — cost of a system call on modern Linux

## Sections
- Three illusions
- Processes and threads
- Virtual memory
- The system call border
- The scheduler

## Prose
An operating system is, more than anything, a generator of useful illusions. The CPU has a few cores; the OS makes it look like there are thousands. Memory is finite and shared; the OS makes every program think it owns all of it. Files live on slow storage; the OS makes them feel near. Strip these illusions away and you would not have a usable computer — you would have a million programs fighting over one set of registers.

Three illusions

Every modern OS — Linux, Windows NT, Darwin, the kernel inside Android, the hypervisor inside a Rubin server — provides three illusions. Modern Operating Systems by Tanenbaum calls them the foundational abstractions, and the entire OS field is the engineering required to keep them honest:

  

The illusion of CPU plenty. Every process feels like it has a CPU to itself. In reality, a few cores are time-sliced across thousands of processes by the scheduler.

  

The illusion of memory plenty. Every process has its own clean, contiguous address space — typically 256 TB of it on 64-bit systems — even though physical RAM is a few dozen gigabytes shared by all.

  

The illusion of safety. Programs cannot read each other's memory, cannot stomp on each other's files, cannot crash the machine. Misbehaviour is contained.

Processes and threads

The OS's basic unit of work is the process: a running program with its own address space, file descriptors, and identity. A process can have multiple threads — independent flows of execution sharing the same memory. A modern desktop has, at idle, around a thousand processes; a busy server many more.

Switching between processes — a context switch — costs a few microseconds on modern hardware: the kernel saves the registers of the outgoing process, loads those of the incoming one, switches the page-table pointer, and flushes whatever needs flushing. Done a few thousand times per second per core, this is what produces the illusion of simultaneity.

Virtual memory

The most beautiful trick in the kernel is virtual memory. Each process sees its own private address space. When it accesses address 0x4000_0000, that address is translated, by hardware, into some physical address in DRAM — possibly different in every process, possibly not present at all (the page might be on disk, or might not exist yet).

The translation is done by the MMU (memory management unit), a piece of hardware on every modern CPU. It walks a tree of page tables set up by the kernel. Each page is typically 4 KB. Each entry in a page table either points to a physical page or says "not present" — in which case the MMU raises a page fault, and the kernel decides what to do (allocate a new page, page in from disk, or kill the offending process).

Virtual memory enables half the things we take for granted: fork() and copy-on-write, memory-mapped files, shared libraries used by many processes from one set of physical pages, swap, address-space layout randomization, and the safe execution of completely untrusted code in browser sandboxes. The Linux mmap man page is, in a sense, the user-facing documentation of this entire scheme.

The system call border

User programs cannot directly do dangerous things — they cannot talk to disks, open network sockets, fork new processes, or set up page tables. To do any of these things, a program must cross into the kernel via a system call: a special instruction (syscall on x86-64, svc on ARM) that traps into kernel mode, runs a privileged handler, and traps back.

System calls are the gates between user-space and kernel-space, and the contract negotiated at those gates is what an OS is, technically. Linux exposes about three hundred and fifty system calls; Windows NT a similar number through a different ABI. Modern hardware makes the trap fast — about 100 ns — but each crossing still flushes pipelines, switches privilege levels, and changes which page tables are in effect.

The scheduler

The scheduler is the OS code that decides, every time a process blocks or its time slice expires, which process should run next. Modern Linux uses the Completely Fair Scheduler, which models a virtual notion of "runtime owed" to each task and always picks the task most owed. Real-time kernels use stricter algorithms (rate-monotonic, earliest-deadline-first); macOS and Windows use related, sophisticated schemes.

The whole edifice — processes, virtual memory, the system-call border, the scheduler — exists for one reason: to keep many programs from interfering with each other while letting them all believe they are alone. It is the most complex single piece of software on most computers, and the reason your laptop does not crash every time a webpage misbehaves.

Now that we have a running OS, we can finally ask: how does a line of Python become electrons moving in a transistor?