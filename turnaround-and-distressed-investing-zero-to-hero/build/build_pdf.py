#!/usr/bin/env python3
"""Build a print-friendly HTML containing the whole report and render to PDF."""
import sys
import re
import html as _html
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from meta import REPORT, PARTS, CHAPTERS, GLOSSARY, BIBLIOGRAPHY  # noqa
from content import CHAPTER_CONTENT  # noqa


def esc(s):
    return _html.escape(str(s), quote=True)


PRINT_CSS = """
@page {
  size: A4;
  margin: 22mm 18mm 22mm 18mm;
  @bottom-center { content: counter(page); font-family: 'Inter', sans-serif; font-size: 9pt; color: #888; }
}
@page :first { @bottom-center { content: ""; } }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  font-size: 10pt;
  line-height: 1.55;
  color: #1d1a13;
}
h1, h2, h3 { font-family: 'Fraunces', Georgia, serif; font-weight: 500; line-height: 1.15; }
h1 { font-size: 30pt; margin: 0 0 8pt; }
h2 { font-size: 16pt; margin: 18pt 0 6pt; }
h3 { font-size: 12pt; margin: 12pt 0 4pt; }
p { margin: 0 0 7pt; }
strong { font-weight: 600; }
em { font-style: italic; }
a { color: #1f4a6b; text-decoration: none; }
.cover { page-break-after: always; padding-top: 60mm; text-align: center; }
.cover .eyebrow { font-family: 'JetBrains Mono', monospace; font-size: 9pt; letter-spacing: 0.18em; text-transform: uppercase; color: #888; margin-bottom: 28pt; }
.cover h1 { font-size: 48pt; margin: 0 0 14pt; }
.cover h1 em { color: #b85a2e; font-style: italic; }
.cover .sub { font-family: 'Fraunces', serif; font-size: 18pt; font-style: italic; color: #4a4639; margin-bottom: 36pt; }
.cover .meta { font-family: 'JetBrains Mono', monospace; font-size: 9pt; letter-spacing: 0.06em; color: #888; }
.part-title { page-break-before: always; padding-top: 60mm; text-align: center; }
.part-title .roman { font-family: 'JetBrains Mono', monospace; font-size: 11pt; letter-spacing: 0.2em; color: #b85a2e; margin-bottom: 14pt; }
.part-title h2 { font-size: 28pt; margin: 0 0 10pt; }
.part-title .kicker { font-style: italic; color: #4a4639; max-width: 60ch; margin: 0 auto; }
.chapter { page-break-before: always; }
.chapter .ch-num { font-family: 'JetBrains Mono', monospace; font-size: 9pt; letter-spacing: 0.18em; text-transform: uppercase; color: #b85a2e; margin-bottom: 4pt; }
.chapter .dek { font-style: italic; color: #4a4639; margin: 0 0 14pt; }
.chapter .lede { font-size: 11pt; color: #2a2820; margin-bottom: 12pt; }
.stat-row { display: table; width: 100%; margin: 12pt 0 14pt; border-top: 0.4pt solid #d8cfb8; border-bottom: 0.4pt solid #d8cfb8; padding: 6pt 0; }
.stat { display: table-cell; padding: 0 8pt; }
.stat__num { font-family: 'JetBrains Mono', monospace; font-size: 14pt; font-weight: 500; }
.stat__label { font-size: 8pt; color: #888; }
.toc { page-break-after: always; }
.toc h2 { margin-bottom: 10pt; }
.toc ol { padding-left: 20pt; font-size: 10pt; }
.toc li { margin: 3pt 0; }
.gloss dt { font-weight: 600; margin-top: 6pt; }
.gloss dd { margin: 0 0 4pt 14pt; color: #4a4639; }
.biblio li { margin: 4pt 0; }
.ref-cluster h2 { font-size: 13pt; margin-top: 16pt; }
"""


def chapter_block(num, slug, title, subtitle, part_idx):
    body = CHAPTER_CONTENT.get(num, {})
    parts = []
    parts.append(f'<section class="chapter" id="ch-{num}">')
    parts.append(f'<div class="ch-num">Chapter {num}</div>')
    parts.append(f'<h1>{esc(title)}</h1>')
    parts.append(f'<p class="dek">{esc(subtitle)}</p>')
    if body.get("stats"):
        sr = "".join(
            f'<div class="stat"><div class="stat__num">{esc(n)}</div><div class="stat__label">{esc(l)}</div></div>'
            for n, l in body["stats"]
        )
        parts.append(f'<div class="stat-row">{sr}</div>')
    if body.get("lede"):
        parts.append(f'<p class="lede">{body["lede"]}</p>')
    for s in body.get("sections", []):
        parts.append(f'<h2>{esc(s["heading"])}</h2>')
        for p in s["paragraphs"]:
            parts.append(f'<p>{p}</p>')
    parts.append('</section>')
    return "\n".join(parts)


def part_title_block(part_idx, part):
    return f'''<section class="part-title">
        <div class="roman">{esc(part["label"])}</div>
        <h2>{esc(part["title"])}</h2>
        <p class="kicker">{esc(part["kicker"])}</p>
    </section>'''


def build_html():
    blocks = []
    blocks.append(f'''<!doctype html><html><head><meta charset="utf-8">
<title>{esc(REPORT["title"])}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<style>{PRINT_CSS}</style>
</head><body>''')

    # Cover
    blocks.append(f'''<section class="cover">
        <div class="eyebrow">Reports Lab · Report No. {REPORT["report_number"]} · 2026</div>
        <h1>Private Equity <em>and</em> Venture Capital</h1>
        <div class="sub">{esc(REPORT["subtitle"])}</div>
        <div class="meta">38 chapters · 6 parts · ~6 hour read</div>
    </section>''')

    # TOC
    toc_lines = []
    last_part = -1
    for c in CHAPTERS:
        num, slug, title, subtitle, pidx = c
        if pidx != last_part:
            toc_lines.append(f'<li style="list-style:none;margin-top:8pt;font-weight:600;">{esc(PARTS[pidx]["label"])} — {esc(PARTS[pidx]["title"])}</li>')
            last_part = pidx
        toc_lines.append(f'<li><a href="#ch-{num}">{num} · {esc(title)}</a></li>')
    blocks.append(f'<section class="toc"><h2>Contents</h2><ol>{"".join(toc_lines)}<li style="list-style:none;margin-top:8pt;font-weight:600;">Reference</li><li><a href="#glossary">Glossary</a></li><li><a href="#bibliography">Bibliography</a></li></ol></section>')

    # Parts + chapters
    for i, part in enumerate(PARTS):
        blocks.append(part_title_block(i, part))
        for c in CHAPTERS:
            if c[4] == i:
                blocks.append(chapter_block(c[0], c[1], c[2], c[3], c[4]))

    # Glossary
    gloss_html = ['<section class="chapter" id="glossary"><div class="ch-num">Reference</div><h1>Glossary</h1><p class="dek">Terms organised by thematic cluster.</p>']
    for cluster, entries in GLOSSARY.items():
        gloss_html.append(f'<h2>{esc(cluster)}</h2><dl class="gloss">')
        for tup in entries:
            term, defn = tup[0], tup[1]
            gloss_html.append(f'<dt>{esc(term)}</dt><dd>{defn}</dd>')
        gloss_html.append('</dl>')
    gloss_html.append('</section>')
    blocks.append("".join(gloss_html))

    # Bibliography
    bib_html = ['<section class="chapter" id="bibliography"><div class="ch-num">Reference</div><h1>Bibliography</h1><p class="dek">Sources, organised by category.</p>']
    for cluster, entries in BIBLIOGRAPHY.items():
        bib_html.append(f'<h2>{esc(cluster)}</h2><ul class="biblio">')
        for citation, url in entries:
            cit = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", esc(citation))
            link = f' <a href="{esc(url)}">{esc(url)}</a>' if url else ""
            bib_html.append(f'<li>{cit}{link}</li>')
        bib_html.append('</ul>')
    bib_html.append('</section>')
    blocks.append("".join(bib_html))

    blocks.append('</body></html>')
    return "\n".join(blocks)


def main():
    html = build_html()
    out_html = ROOT / "build" / "_pdf_source.html"
    out_html.write_text(html, encoding="utf-8")
    print(f"Wrote {out_html}")
    out_pdf = ROOT / REPORT["pdf_filename"]
    try:
        from weasyprint import HTML
        HTML(string=html, base_url=str(ROOT)).write_pdf(str(out_pdf))
        print(f"Wrote {out_pdf} ({out_pdf.stat().st_size // 1024} KB)")
    except Exception as e:
        print(f"WeasyPrint failed: {e}")


if __name__ == "__main__":
    main()
