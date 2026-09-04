#!/usr/bin/env python3
"""Build the Private Equity and Venture Capital report:
- index.html (cover)
- chapters/*.html for all 38 chapters
- chapters/glossary.html, chapters/bibliography.html
- search-index.json

Run from the report directory:  python3 build/build.py
"""
import json
import os
import re
import sys
import html as _html
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(Path(__file__).resolve().parent))

from meta import REPORT, PARTS, CHAPTERS, CHAPTER_BY_NUM, GLOSSARY, BIBLIOGRAPHY  # noqa
from content import CHAPTER_CONTENT  # noqa


# --- helpers ---------------------------------------------------------------
def esc(s):
    return _html.escape(str(s), quote=True)


TONES = ["copper", "primary", "plasma", "euv"]


def tone_for(num):
    return TONES[(int(num) - 1) % len(TONES)]


def chapters_meta_json():
    return json.dumps([
        {"num": c[0], "slug": c[1], "title": c[2], "subtitle": c[3]}
        for c in CHAPTERS
    ], ensure_ascii=False)


# --- chapter-page render ---------------------------------------------------
SITE_HEADER = """<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="brand" href="{home}">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="3" fill="currentColor" /><path d="M12 3 L12 6 M12 18 L12 21 M3 12 L6 12 M18 12 L21 12" stroke-width="1" /></svg>
      <span>{report_title}<span class="brand__sub"> — {report_sub}</span></span>
    </a>
    <span class="nav-spacer"></span>
    <a class="nav-link{a_cover}" href="{home}">Cover</a>
    <a class="nav-link{a_chapters}" href="{home}#chapters">Chapters</a>
    <a class="nav-link" href="{lab}">Study Path</a>
    <a class="nav-link" href="{labhome}">Lab</a>
    <a class="nav-link{a_ref}" href="{glossary}">Reference</a>
    <button class="icon-btn" data-search-open aria-label="Search the report (⌘K)"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg></button>
    <button class="icon-btn" data-theme-toggle aria-label="Toggle dark mode"></button>
  </div>
</header>"""


SEARCH_TUTOR_FOOTER = """<button class="tutor-launcher" data-tutor-open type="button" aria-label="Open AI Tutor"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M21 11.5a8.4 8.4 0 0 1-12.1 7.5L3 20l1-4.6A8.4 8.4 0 1 1 21 11.5z"/></svg><span>Ask the tutor</span></button>
<div class="search-modal" data-search aria-hidden="true" data-base="{base}">
  <div class="search__panel" role="dialog" aria-label="Search">
    <div class="search__head">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" style="color:var(--color-text-muted)"><circle cx="11" cy="11" r="7"/><path d="M16.5 16.5L21 21"/></svg>
      <input class="search__input" data-search-input type="search" placeholder="Search the report…" aria-label="Search">
      <button class="search__close" data-search-close type="button">Esc</button>
    </div>
    <div class="search__results" data-search-results>
      <div class="search__hint">Type to search across all chapters and the reference. Try <em>waterfall</em>, <em>term sheet</em>, <em>IRR</em>, or <em>continuation vehicle</em>.</div>
    </div>
  </div>
</div>
<div class="tutor-modal" data-tutor aria-hidden="true" data-api="https://text.pollinations.ai/openai">
  <div class="tutor__panel" role="dialog" aria-label="AI Tutor">
    <div class="tutor__head">
      <div>
        <div class="tutor__head-title">Tutor</div>
        <div class="tutor__head-sub">Ask anything about the report</div>
      </div>
      <button class="tutor__close" data-tutor-close type="button">Close</button>
    </div>
    <div class="tutor__log" data-tutor-log></div>
    <form class="tutor__form" data-tutor-form>
      <input class="tutor__input" data-tutor-input type="text" placeholder="e.g. how does an American waterfall differ from a European one?" autocomplete="off">
      <button class="tutor__send" type="submit">Ask</button>
    </form>
  </div>
</div>
<footer class="site-footer">
  <div class="site-footer__inner">
    <div>
      <strong style="color:var(--color-text);font-family:var(--font-display);font-style:italic;font-weight:500;">{report_title}</strong><br>
      A complete professional guide to private equity and venture capital.
    </div>
    <div style="font-family:var(--font-mono);font-size:var(--text-xs);letter-spacing:0.08em;text-transform:uppercase;">
      <a href="{home}" style="color:var(--color-text-muted);text-decoration:none;">Return to cover →</a>
    </div>
  </div>
</footer>
<script src="{js}" defer></script>"""


def page_head(title, description, base_css="css/", base_js="js/"):
    return f"""<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{esc(title)}</title>
<meta name="description" content="{esc(description)}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap">
<link rel="stylesheet" href="{base_css}base.css">
<link rel="stylesheet" href="{base_css}style.css">
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='9' fill='none' stroke='%231f4a6b' stroke-width='1.5'/%3E%3Ccircle cx='12' cy='12' r='3' fill='%23a04a1a'/%3E%3C/svg%3E">
</head>
<body{{body_attrs}}>
<script>window.__CHAPTERS_META__ = {chapters_meta_json()};</script>
<div class="progress-bar"><div class="progress-bar__fill" data-progress-fill></div></div>"""


def render_chapter(num, slug, title, subtitle, part_idx):
    body = CHAPTER_CONTENT.get(num)
    total = len(CHAPTERS)
    next_ch = CHAPTER_BY_NUM.get(f"{int(num)+1:02d}")
    prev_ch = CHAPTER_BY_NUM.get(f"{int(num)-1:02d}") if int(num) > 1 else None

    head = page_head(
        title=f"Chapter {num} · {title} — {REPORT['title']}",
        description=subtitle,
        base_css="../css/",
    ).replace(
        "{body_attrs}", f' data-chapter-slug="{esc(slug)}" data-chapter-title="{esc(title)}"'
    )

    header = SITE_HEADER.format(
        home="../index.html",
        report_title=esc(REPORT["title"]),
        report_sub="a complete professional guide",
        glossary="../chapters/glossary.html",
        lab="../chapters/24-the-study-path.html",
        labhome="../lab/index.html",
        a_cover="",
        a_chapters=" nav-link--active",
        a_ref="",
    )

    # stat row
    stats_html = ""
    if body and body.get("stats"):
        stats = "".join(
            f'<div class="stat"><div class="stat__num">{esc(num_v)}</div><div class="stat__label">{esc(label)}</div></div>'
            for num_v, label in body["stats"]
        )
        stats_html = f'<div class="stat-row">{stats}</div>'

    # toolbar
    toolbar = """<div class="toolbar reveal">
      <div class="toolbar__audio" data-audio-wrap>
        <button class="toolbar__btn" data-audio-toggle type="button" aria-haspopup="dialog" aria-expanded="false"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5v14l12-7z"/></svg> <span>Listen</span></button>
        <div class="audio-popover" data-audio-popover hidden role="dialog" aria-label="Choose narration voice">
          <div class="audio-popover__head">
            <div class="audio-popover__title">Pick a voice</div>
            <button class="audio-popover__close" data-audio-close type="button" aria-label="Close">×</button>
          </div>
          <div class="audio-popover__group" data-audio-voices role="radiogroup" aria-label="Voice"></div>
          <div class="audio-popover__row">
            <label class="audio-popover__label" for="audio-rate">Speed</label>
            <input class="audio-popover__rate" id="audio-rate" data-audio-rate type="range" min="0.7" max="1.3" step="0.05" value="1">
            <span class="audio-popover__rate-val" data-audio-rate-val>1.00×</span>
          </div>
          <div class="audio-popover__actions">
            <button class="audio-popover__sample" data-audio-sample type="button">Hear a sample</button>
            <button class="audio-popover__start" data-audio-start type="button">Start listening</button>
          </div>
          <div class="audio-popover__hint" data-audio-hint></div>
        </div>
      </div>
      <button class="toolbar__btn" data-bookmark type="button" aria-pressed="false"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h12v18l-6-4-6 4z"/></svg> <span>Bookmark</span></button>
      <button class="toolbar__btn" data-tutor-open type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 11.5a8.4 8.4 0 0 1-12.1 7.5L3 20l1-4.6A8.4 8.4 0 1 1 21 11.5z"/></svg> <span>Ask tutor</span></button>
      <button class="toolbar__btn" onclick="window.print()" type="button"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 3h12v6H6zM6 14h12v7H6zM4 9h16v6H4z"/></svg> <span>Save PDF</span></button>
    </div>"""

    # toc + body
    sections = (body or {}).get("sections", [])
    if not sections:
        # Fallback: render subtitle as a single section
        sections = [{"id": "overview", "heading": "Overview",
                     "paragraphs": [f"<em>{esc(subtitle)}</em>"]}]
    toc = '<aside class="ch-toc"><div class="ch-toc__title">In this chapter</div><ul>' + \
          "".join(f'<li><a href="#{esc(s["id"])}">{esc(s["heading"])}</a></li>' for s in sections) + \
          "</ul></aside>"

    lede_html = ""
    if body and body.get("lede"):
        lede_html = f'<p class="lede">{body["lede"]}</p>'

    body_html_parts = []
    for s in sections:
        body_html_parts.append(f'<h2 id="{esc(s["id"])}">{esc(s["heading"])}</h2>')
        for p in s["paragraphs"]:
            body_html_parts.append(f"<p>{p}</p>")
    article = lede_html + "\n".join(body_html_parts)

    # nav
    nav_links = []
    if prev_ch:
        nav_links.append(f'<a class="ch-nav__prev" href="{prev_ch[1]}.html"><span class="ch-nav__label">Previous</span><span class="ch-nav__title">{esc(prev_ch[2])}</span></a>')
    else:
        nav_links.append("<span></span>")
    if next_ch:
        nav_links.append(f'<a class="ch-nav__next" href="{next_ch[1]}.html"><span class="ch-nav__label">Next</span><span class="ch-nav__title">{esc(next_ch[2])}</span></a>')
    else:
        nav_links.append(f'<a class="ch-nav__next" href="glossary.html"><span class="ch-nav__label">Reference</span><span class="ch-nav__title">Glossary &amp; bibliography</span></a>')
    chapter_nav = f'<nav class="ch-nav">{"".join(nav_links)}</nav>'

    footer = SEARCH_TUTOR_FOOTER.format(
        base="../",
        report_title=esc(REPORT["title"]),
        home="../index.html",
        js="../js/app.js",
    )

    out = f"""{head}
{header}
<main class="page">
  <header class="ch-header reveal">
    <div class="ch-header__crumb"><a href="../index.html">{esc(REPORT['title'])}</a> &nbsp;·&nbsp; Chapter {num} of {total}</div>
    <div class="ch-header__num">Chapter {num}</div>
    <h1 class="ch-header__title">{esc(title)}</h1>
    <p class="ch-header__dek">{esc(subtitle)}</p>
    {stats_html}
    {toolbar}
  </header>

  <div class="ch-layout">
    {toc}
    <article class="prose">
      {article}
    </article>
  </div>

  {chapter_nav}
</main>
{footer}
</body></html>
"""
    return out


# --- index page ------------------------------------------------------------
PART_ICONS = {
    1: '<circle cx="28" cy="28" r="20"/><path d="M14 28 a14 14 0 0 0 28 0" stroke-dasharray="2 3"/><circle cx="28" cy="28" r="3" fill="currentColor"/>',
    2: '<rect x="6" y="14" width="20" height="28" rx="2"/><rect x="30" y="20" width="20" height="22" rx="2"/><path d="M26 26 L30 26 M26 32 L30 32"/>',
    3: '<circle cx="14" cy="14" r="6"/><circle cx="42" cy="14" r="6"/><circle cx="14" cy="42" r="6"/><circle cx="42" cy="42" r="6"/><circle cx="28" cy="28" r="3" fill="currentColor"/>',
    4: '<rect x="8" y="14" width="40" height="28" rx="2"/><path d="M14 22 L24 22 M14 28 L26 28 M14 34 L20 34"/><circle cx="38" cy="28" r="6"/>',
    5: '<path d="M28 6 C 18 6 14 14 14 22 C 14 30 20 32 20 38 L36 38 C 36 32 42 30 42 22 C 42 14 38 6 28 6 Z"/>',
    6: '<path d="M6 46 L6 10"/><path d="M6 46 L50 46"/><rect x="12" y="32" width="6" height="14" fill="currentColor" fill-opacity="0.3"/><rect x="22" y="22" width="6" height="24" fill="currentColor" fill-opacity="0.5"/><rect x="32" y="14" width="6" height="32" fill="currentColor" fill-opacity="0.7"/>',
}


def part_intro(part):
    intros = {
        1: "Six chapters on what private markets actually are, who participates, why illiquid capital exists at all, and the history that produced today's landscape.",
        2: "Six chapters on the legal architecture of a fund, the LPA's negotiated terms, the carry waterfall, GP/LP alignment, and how a fund actually gets raised.",
        3: "Eight chapters on deal sourcing, screening, commercial and financial diligence (including QofE), valuation by every relevant method, and the discipline of the investment thesis.",
        4: "Seven chapters on term sheets, liquidation preferences, anti-dilution, cap-table mechanics, board governance, protective provisions, and employee equity.",
        5: "Six chapters on the operating playbook, 100-day plans, exit route selection, the IPO process, the secondary market, and continuation vehicles.",
        6: "Five chapters of advanced material: sector investing, market cycles, the regulatory framework, the IC memo's craft, and three integrated end-to-end cases.",
    }
    return intros.get(part, "")


def lens_card(num, slug, title, subtitle):
    tone = tone_for(num)
    return f'''<a class="lens-card reveal" data-tone="{tone}" href="chapters/{slug}.html">
        <div class="lens-card__index"><span class="ch-num">{num}</span></div>
        <div class="lens-card__icon"><svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round"><circle cx="28" cy="28" r="18"/><circle cx="28" cy="28" r="3" fill="currentColor"/><path d="M28 10 L28 16 M28 40 L28 46 M10 28 L16 28 M40 28 L46 28"/></svg></div>
        <h3 class="lens-card__title">{esc(title)}</h3>
        <p class="lens-card__desc">{esc(subtitle)}</p>
      </a>'''


def render_index():
    head = page_head(
        title=f"{REPORT['title']}: {REPORT['subtitle']}",
        description="A 38-chapter complete professional guide to private equity and venture capital — from fund structure and sourcing to valuation, term sheets, value creation, exits, secondaries, and integrated casework.",
        base_css="css/",
    ).replace("{body_attrs}", "")

    header = SITE_HEADER.format(
        home="index.html",
        report_title=esc(REPORT["title"]),
        report_sub="a complete professional guide",
        glossary="chapters/glossary.html",
        lab="chapters/24-the-study-path.html",
        labhome="lab/index.html",
        a_cover=" nav-link--active",
        a_chapters="",
        a_ref="",
    )

    # arc
    def arc_node(num, slug, title):
        tone = tone_for(num)
        return f'<a class="arc__node" href="chapters/{slug}.html" data-tone="{tone}" aria-label="Chapter {num}: {esc(title)}"><span class="arc__node-dot"></span><span class="arc__node-num">{num}</span><span class="arc__node-tip"><span class="arc__node-tip-label">Ch {num}</span><span class="arc__node-tip-title">{esc(title)}</span></span></a>'

    arc_tracks = []
    for part in PARTS:
        nodes = "".join(arc_node(c[0], c[1], c[2]) for c in CHAPTERS if c[4] == PARTS.index(part))
        arc_tracks.append(f'''<div class="arc__track">
        <div class="arc__track-meta">
          <span class="arc__track-label">{esc(part["label"])}</span>
          <span class="arc__track-sub">{esc(part["kicker"])}</span>
        </div>
        <div class="arc__track-line">
          <div class="arc__track-rail"></div>
          <div class="arc__track-nodes">{nodes}</div>
        </div>
      </div>''')

    # part sections + lens grids
    part_sections = []
    for i, part in enumerate(PARTS):
        chapters_in_part = [c for c in CHAPTERS if c[4] == i]
        cards = "".join(lens_card(c[0], c[1], c[2], c[3]) for c in chapters_in_part)
        anchor = "chapters" if i == 0 else f"chapters-part-{i+1}"
        margin = "" if i == 0 else ' style="margin-top:var(--space-16);"'
        part_sections.append(f'''<section class="section-head reveal" id="{anchor}"{margin}>
    <div class="section-head__num">§ {esc(part["label"])}</div>
    <h2 class="section-head__title">{esc(part["title"])}</h2>
    <p>{esc(part_intro(i+1))}</p>
  </section>

  <div class="lens-grid">{cards}</div>''')

    footer = SEARCH_TUTOR_FOOTER.format(
        base="",
        report_title=esc(REPORT["title"]),
        home="index.html",
        js="js/app.js",
    )

    out = f"""{head}
{header}
<main class="page">
  <section class="hero reveal">
    <div class="hero__text">
      <div class="hero__eyebrow">A zero-to-hero professional path · 32 chapters · seven parts · ~6 hour read</div>
      <h1 class="hero__title">Turnaround <em>and</em> Distressed Investing</h1>
      <p class="hero__lede">A 32-chapter path from reading a capital structure to underwriting a restructuring — distress mechanics, credit analysis, distressed valuation, the machinery of Chapter&nbsp;11, the liability management transactions that reshaped the 2020s, and the operational work of an actual turnaround. Built around primary documents you can pull for free, a sequenced 12-week curriculum, and five real deals worked end to end from their public filings.</p>
      <div class="hero__meta">
        <span><strong>32</strong> chapters</span>
        <span><strong>7</strong> parts</span>
        <span><strong>12 wk</strong> curriculum</span>
        <span><strong>5</strong> real deals</span>
        <span><strong>4</strong> models</span>
      </div>
      <div class="hero__cta">
        <a class="hero__cta-link" href="#chapters">Begin reading</a>
        <a class="hero__cta-secondary" href="lab/index.html">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
          Open the restructuring lab
          <span class="hero__cta-meta">4 working models · real deal figures</span>
        </a>
      </div>
    </div>
    <div class="hero__visual"><svg class="diagram" viewBox="0 0 600 700" role="img" aria-hidden="true" preserveAspectRatio="xMaxYMid meet">
      <defs>
        <radialGradient id="rxGlow" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="var(--color-primary)" stop-opacity="0.28"/><stop offset="1" stop-color="var(--color-primary)" stop-opacity="0"/></radialGradient>
        <radialGradient id="rxBreak" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stop-color="var(--color-accent-copper)" stop-opacity="0.32"/><stop offset="1" stop-color="var(--color-accent-copper)" stop-opacity="0"/></radialGradient>
      </defs>

      <circle cx="415" cy="240" r="165" fill="url(#rxGlow)"/>
      <circle cx="415" cy="360" r="150" fill="url(#rxBreak)"/>

      <text x="415" y="150" text-anchor="middle" fill="var(--color-text-muted)" font-family="JetBrains Mono, monospace" font-size="11" opacity="0.75">enterprise value</text>
      <line x1="280" y1="166" x2="550" y2="166" stroke="var(--color-text-muted)" stroke-width="1" stroke-dasharray="3 3" opacity="0.55"/>

      <g opacity="0.9">
        <rect x="280" y="192" width="270" height="46" rx="3" fill="var(--color-primary)" fill-opacity="0.16" stroke="var(--color-text-muted)" stroke-width="1"/>
        <text x="296" y="220" fill="var(--color-text-muted)" font-family="JetBrains Mono, monospace" font-size="10">FIRST LIEN</text>
        <text x="534" y="220" text-anchor="end" fill="var(--color-text-muted)" font-family="JetBrains Mono, monospace" font-size="9" opacity="0.8">recovers 100</text>

        <rect x="280" y="248" width="270" height="46" rx="3" fill="var(--color-primary)" fill-opacity="0.09" stroke="var(--color-text-muted)" stroke-width="1"/>
        <text x="296" y="276" fill="var(--color-text-muted)" font-family="JetBrains Mono, monospace" font-size="10">SECOND LIEN</text>
        <text x="534" y="276" text-anchor="end" fill="var(--color-text-muted)" font-family="JetBrains Mono, monospace" font-size="9" opacity="0.8">impaired</text>
      </g>

      <line x1="272" y1="312" x2="558" y2="312" stroke="var(--color-accent-copper)" stroke-width="1.6" opacity="0.85"/>
      <text x="415" y="330" text-anchor="middle" fill="var(--color-accent-copper)" font-family="JetBrains Mono, monospace" font-size="10" opacity="0.9">FULCRUM &mdash; value breaks here</text>

      <g opacity="0.5">
        <rect x="280" y="346" width="270" height="40" rx="3" fill="none" stroke="var(--color-text-muted)" stroke-width="1" stroke-dasharray="3 3"/>
        <text x="296" y="371" fill="var(--color-text-muted)" font-family="JetBrains Mono, monospace" font-size="10">UNSECURED NOTES</text>
        <text x="534" y="371" text-anchor="end" fill="var(--color-text-muted)" font-family="JetBrains Mono, monospace" font-size="9">nil</text>

        <rect x="280" y="394" width="270" height="40" rx="3" fill="none" stroke="var(--color-text-muted)" stroke-width="1" stroke-dasharray="3 3"/>
        <text x="296" y="419" fill="var(--color-text-muted)" font-family="JetBrains Mono, monospace" font-size="10">EQUITY</text>
        <text x="534" y="419" text-anchor="end" fill="var(--color-text-muted)" font-family="JetBrains Mono, monospace" font-size="9">nil</text>
      </g>

      <text x="415" y="486" text-anchor="middle" fill="var(--color-text-muted)" font-family="JetBrains Mono, monospace" font-size="11" opacity="0.75">the 13-week runway</text>
      <g transform="translate(280 502)" opacity="0.85">
        <path d="M0 74 L22 70 L44 76 L66 61 L88 64 L110 50 L132 55 L154 37 L176 42 L198 26 L220 31 L242 15 L270 19"
              fill="none" stroke="var(--color-accent-copper)" stroke-width="1.8"/>
        <line x1="0" y1="92" x2="270" y2="92" stroke="var(--color-text-muted)" stroke-width="1" opacity="0.6"/>
        <line x1="0" y1="92" x2="0" y2="8" stroke="var(--color-text-muted)" stroke-width="1" opacity="0.6"/>
        <circle cx="242" cy="15" r="3.5" fill="var(--color-accent-copper)"/>
      </g>
      <text x="415" y="620" text-anchor="middle" fill="var(--color-text-muted)" font-family="JetBrains Mono, monospace" font-size="9" opacity="0.7">liquidity, week 1 &rarr; week 13</text>
    </svg></div>
  </section>

  <div data-continue></div>

  <section class="arc reveal" aria-label="Chapter map">
    <div class="arc__header">
      <div class="arc__title">The journey at a glance</div>
      <div class="arc__hint">Hover or tap any chapter — click to open</div>
    </div>
    <div class="arc__tracks">
      {''.join(arc_tracks)}
    </div>
  </section>

  {''.join(part_sections)}

  <section class="section-head reveal" style="margin-top:var(--space-16);">
    <div class="section-head__num">&para;</div>
    <h2 class="section-head__title">A note before you begin</h2>
    <div>
      <p style="max-width:62ch;">This is a long-form, primary-source-anchored path. Parts I and II build the vocabulary, the capital structure, and the analytical order of operations. Part III is the machinery of Chapter&nbsp;11. Part IV covers the liability management transactions that have defined the market since 2016 &mdash; the most time-sensitive material here, and the part most published guidance gets wrong. Part V is the operational work. Part VI is the 12-week curriculum, the verified source list, and three composite cases for orientation. Part VII works five real deals &mdash; JOANN, Hertz, Bed Bath &amp; Beyond, Serta and Best Buy &mdash; end to end, telling you exactly which filings to pull for each.</p>
      <p style="max-width:62ch;margin-top:var(--space-4);">If you want the curriculum rather than the theory, go straight to <a href="chapters/24-the-study-path.html">Chapter&nbsp;24</a>. If you want to know which sources are actually free and which commonly circulated recommendations are wrong, <a href="chapters/25-verified-sources.html">Chapter&nbsp;25</a> records what was verified and what was not. Definitions live in the <a href="chapters/glossary.html">glossary</a>, organised by theme.</p>
      <p style="margin-top:var(--space-6);"><a href="chapters/01-what-distress-actually-is.html" style="color:var(--color-primary);text-decoration:none;font-family:var(--font-mono);font-size:var(--text-sm);text-transform:uppercase;letter-spacing:0.1em;">Begin Chapter 01 &mdash; What Distress Actually Is &rarr;</a></p>
    </div>
  </section>
</main>
{footer}
</body></html>
"""
    return out


# --- glossary + bibliography ----------------------------------------------
def render_reference(kind):
    if kind == "glossary":
        page_title = "Glossary"
        intro = "Terms, organised by thematic cluster. Each entry links back to the chapter where it's first introduced or developed."
        clusters = []
        for cluster_name, entries in GLOSSARY.items():
            items = []
            for tup in entries:
                term, defn = tup[0], tup[1]
                ch = tup[2] if len(tup) > 2 else None
                ch_link = f' <a class="gloss-ch" href="../chapters/{CHAPTER_BY_NUM[ch][1]}.html">Ch {ch}</a>' if ch and ch in CHAPTER_BY_NUM else ""
                items.append(f'<dt>{esc(term)}{ch_link}</dt><dd>{defn}</dd>')
            clusters.append(f'<section class="ref-cluster"><h2>{esc(cluster_name)}</h2><dl class="gloss">{"".join(items)}</dl></section>')
        body = "".join(clusters)
        slug = "glossary"
    else:
        page_title = "Bibliography"
        intro = "Sources used in the report, organised by category. Where a public URL is stable, it is linked; where the source is print or paywalled, the citation alone is provided."
        clusters = []
        for cluster_name, entries in BIBLIOGRAPHY.items():
            items = []
            for citation, url in entries:
                # Render the markdown italic *X* into <em>
                cit_html = re.sub(r"\*([^*]+)\*", r"<em>\1</em>", esc(citation))
                if url:
                    items.append(f'<li>{cit_html} <a href="{esc(url)}" rel="noopener" target="_blank">Link ↗</a></li>')
                else:
                    items.append(f'<li>{cit_html}</li>')
            clusters.append(f'<section class="ref-cluster"><h2>{esc(cluster_name)}</h2><ul class="biblio">{"".join(items)}</ul></section>')
        body = "".join(clusters)
        slug = "bibliography"

    head = page_head(
        title=f"{page_title} — {REPORT['title']}",
        description=intro,
        base_css="../css/",
    ).replace("{body_attrs}", "")

    header = SITE_HEADER.format(
        home="../index.html",
        report_title=esc(REPORT["title"]),
        report_sub="a complete professional guide",
        glossary="../chapters/glossary.html",
        lab="../chapters/24-the-study-path.html",
        labhome="../lab/index.html",
        a_cover="",
        a_chapters="",
        a_ref=" nav-link--active",
    )
    footer = SEARCH_TUTOR_FOOTER.format(
        base="../",
        report_title=esc(REPORT["title"]),
        home="../index.html",
        js="../js/app.js",
    )

    cross = ""
    if kind == "glossary":
        cross = '<p class="ref-cross"><a href="bibliography.html">Bibliography →</a></p>'
    else:
        cross = '<p class="ref-cross"><a href="glossary.html">← Glossary</a></p>'

    return f"""{head}
{header}
<main class="page">
  <header class="ch-header reveal">
    <div class="ch-header__crumb"><a href="../index.html">{esc(REPORT['title'])}</a> &nbsp;·&nbsp; Reference</div>
    <div class="ch-header__num">Reference</div>
    <h1 class="ch-header__title">{esc(page_title)}</h1>
    <p class="ch-header__dek">{esc(intro)}</p>
  </header>
  <article class="prose">
    {body}
    {cross}
  </article>
</main>
{footer}
</body></html>
"""


# --- search index ----------------------------------------------------------
def text_from_html(s):
    s = re.sub(r"<[^>]+>", " ", s or "")
    s = re.sub(r"\s+", " ", s).strip()
    return s


def build_search_index():
    out = []
    for c in CHAPTERS:
        num, slug, title, subtitle, _ = c
        body = CHAPTER_CONTENT.get(num, {})
        text_parts = []
        if body.get("lede"):
            text_parts.append(text_from_html(body["lede"]))
        for s in body.get("sections", []):
            text_parts.append(s["heading"])
            for p in s["paragraphs"]:
                text_parts.append(text_from_html(p))
        out.append({
            "type": "chapter", "num": num, "slug": slug,
            "title": title, "subtitle": subtitle,
            "url": f"chapters/{slug}.html",
            "text": " ".join(text_parts),
        })
    # reference pages
    gloss_text = []
    for cluster, entries in GLOSSARY.items():
        gloss_text.append(cluster)
        for tup in entries:
            gloss_text.append(tup[0])
            gloss_text.append(text_from_html(tup[1]))
    out.append({
        "type": "reference", "num": "G", "slug": "glossary",
        "title": "Glossary", "subtitle": "Terms by thematic cluster",
        "url": "chapters/glossary.html",
        "text": " ".join(gloss_text),
    })
    bib_text = []
    for cluster, entries in BIBLIOGRAPHY.items():
        bib_text.append(cluster)
        for citation, _ in entries:
            bib_text.append(text_from_html(citation))
    out.append({
        "type": "reference", "num": "B", "slug": "bibliography",
        "title": "Bibliography", "subtitle": "Sources used in the report",
        "url": "chapters/bibliography.html",
        "text": " ".join(bib_text),
    })
    return out


# --- main ------------------------------------------------------------------
def main():
    out_chapters = ROOT / "chapters"
    out_chapters.mkdir(exist_ok=True)
    written = []

    # chapters
    for c in CHAPTERS:
        num, slug, title, subtitle, part_idx = c
        path = out_chapters / f"{slug}.html"
        path.write_text(render_chapter(num, slug, title, subtitle, part_idx), encoding="utf-8")
        written.append(str(path.relative_to(ROOT)))

    # glossary + bibliography
    (out_chapters / "glossary.html").write_text(render_reference("glossary"), encoding="utf-8")
    written.append("chapters/glossary.html")
    (out_chapters / "bibliography.html").write_text(render_reference("bibliography"), encoding="utf-8")
    written.append("chapters/bibliography.html")

    # index
    (ROOT / "index.html").write_text(render_index(), encoding="utf-8")
    written.append("index.html")

    # search index
    (ROOT / "search-index.json").write_text(
        json.dumps(build_search_index(), ensure_ascii=False), encoding="utf-8"
    )
    written.append("search-index.json")

    print(f"Built {len(written)} files:")
    for w in written:
        print(f"  {w}")


if __name__ == "__main__":
    main()
