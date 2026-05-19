#!/usr/bin/env python3
"""Compila os markdowns do relatório VidaPlus em um único PDF."""

import os
import markdown
from weasyprint import HTML

REPORT_DIR = os.path.dirname(os.path.abspath(__file__))
REPORT_FILES = [
    "report/00-capa.md",
    "report/01-introducao.md",
    "report/02-requisitos.md",
    "report/03-modelagem.md",
    "report/04-implementacao.md",
    "report/05-testes.md",
    "report/06-conclusao.md",
]
OUTPUT = os.path.join(REPORT_DIR, "VidaPlus-Relatorio.pdf")

CSS = """
@page {
    size: A4;
    margin: 2.5cm 2cm 2cm 3cm;
    @bottom-center {
        content: counter(page);
        font-size: 10px;
        color: #666;
    }
}
@page :first {
    @bottom-center { content: none; }
}
body {
    font-family: 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
    font-size: 12px;
    line-height: 1.6;
    color: #1a1a1a;
}
h1 {
    font-size: 22px;
    color: #0f172a;
    border-bottom: 2px solid #10b981;
    padding-bottom: 6px;
    margin-top: 40px;
    page-break-before: always;
}
h1:first-of-type { page-break-before: avoid; }
h2 {
    font-size: 17px;
    color: #1e293b;
    margin-top: 28px;
}
h3 {
    font-size: 14px;
    color: #334155;
    margin-top: 20px;
}
table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 11px;
}
th, td {
    border: 1px solid #cbd5e1;
    padding: 6px 8px;
    text-align: left;
}
th {
    background: #f1f5f9;
    font-weight: 600;
    color: #1e293b;
}
tr:nth-child(even) { background: #f8fafc; }
code {
    background: #f1f5f9;
    padding: 1px 4px;
    border-radius: 3px;
    font-size: 11px;
    font-family: 'Cascadia Code', 'Fira Code', monospace;
}
pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 12px 16px;
    border-radius: 6px;
    font-size: 10px;
    line-height: 1.5;
    overflow-x: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
}
pre code {
    background: none;
    color: inherit;
    padding: 0;
}
img {
    max-width: 100%;
    height: auto;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    margin: 4px 0;
}
hr { border: none; border-top: 1px solid #e2e8f0; margin: 24px 0; }
a { color: #0ea5e9; text-decoration: none; }
em { color: #64748b; }
blockquote {
    border-left: 3px solid #10b981;
    margin: 12px 0;
    padding: 8px 16px;
    background: #f0fdf4;
    color: #334155;
}

/* Capa — ocupa a página A4 inteira */
.cover-page {
    page-break-after: always;
    text-align: center;
    position: relative;
    height: 247mm;
}
.cover-page h1 {
    border: none;
    font-size: 24px;
    color: #0f172a;
    page-break-before: avoid;
    margin: 8px 0;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.cover-page h2 {
    font-size: 18px;
    color: #334155;
    margin: 4px 0;
    font-weight: 400;
}
.cover-top {
    padding-top: 20mm;
    font-size: 15px;
    font-weight: 600;
    color: #0f172a;
    line-height: 2;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}
.cover-middle {
    padding-top: 55mm;
    font-size: 14px;
    color: #1e293b;
}
.cover-middle p:first-child {
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
    margin-bottom: 32px;
    text-transform: uppercase;
}
.cover-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    font-size: 13px;
    color: #334155;
    line-height: 2;
}
"""

EXTENSIONS = [
    "markdown.extensions.tables",
    "markdown.extensions.fenced_code",
    "markdown.extensions.codehilite",
    "markdown.extensions.toc",
    "markdown.extensions.attr_list",
]

EXT_CONFIGS = {
    "markdown.extensions.codehilite": {"css_class": "highlight", "guess_lang": False},
}


def build():
    parts = []
    for i, fname in enumerate(REPORT_FILES):
        path = os.path.join(REPORT_DIR, fname)
        with open(path, encoding="utf-8") as f:
            md_text = f.read()

        parts.append(md_text)

    full_md = "\n\n---\n\n".join(parts)

    html_body = markdown.markdown(
        full_md,
        extensions=EXTENSIONS,
        extension_configs=EXT_CONFIGS,
    )

    html_doc = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><style>{CSS}</style></head>
<body>{html_body}</body>
</html>"""

    HTML(
        string=html_doc,
        base_url=os.path.join(REPORT_DIR, "report"),
    ).write_pdf(OUTPUT)

    size_kb = os.path.getsize(OUTPUT) / 1024
    print(f"PDF gerado: {OUTPUT} ({size_kb:.0f} KB)")


if __name__ == "__main__":
    build()
