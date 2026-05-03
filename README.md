# Reports Lab

A workshop for long-form, image-first essays on the systems behind modern intelligence.

**Live:** [regantih.github.io/reports-lab](https://regantih.github.io/reports-lab/)

## Reports

| № | Title | Chapters | Status |
|---|---|---:|---|
| 01 | [From Sand to Superintelligence](./sand-to-superintelligence/) | 42 | Published · 2026 |
| 02 | [The Agentic Enterprise](./agentic-ai-readiness/) | 40 | Published · 2026 |
| 03 | [Building an Agentic Enterprise](./agentic-enterprise/) | 21 | Published · 2026 |
| 04 | [Private Equity and Venture Capital](./private-equity-venture-capital-complete-professional-guide/) | 38 | Published · 2026 |
| 05 | [The PE/VC Operator's Lab](./pe-vc-lab/) | 6 + 8 tools | Published · 2026 |

## Structure

```
reports-lab/
├── index.html                       # Reports Lab landing page
├── sand-to-superintelligence/       # Report No. 01
│   ├── index.html                   # cover + table of contents
│   ├── chapters/                    # all 42 chapters + glossary, bibliography, epilogue
│   ├── book.html                    # single-page printable view
│   ├── sand-to-superintelligence.pdf
│   ├── css/, js/, svg/              # assets
│   └── search-index.json
└── README.md
```

Each report is a self-contained static site. You can clone the repo and open any report locally:

```bash
git clone https://github.com/Regantih/reports-lab.git
cd reports-lab
python3 -m http.server 8000
# open http://localhost:8000/
```

## License

Content © 2026. Code released under MIT.
