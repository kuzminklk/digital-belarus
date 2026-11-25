#!/usr/bin/env python3
"""Generate pixel-serif display masks for the site headings.

The NOCTRA-inspired display face is a custom treatment: Cormorant Garamond is
rendered at a tiny logical size, thresholded to hard pixels, then upscaled with
nearest-neighbour. The result is a pixel-serif PNG used as a CSS mask, so the
same asset can be painted in warm cream on ink or ink on warm cream.

Outputs:
  public/type/{locale}/{name}.png
  src/content/pixel-type.json

Run: python3 scripts/generate-pixel-type.py
"""

from __future__ import annotations

import json
import math
import os
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "type"
MANIFEST = ROOT / "src" / "content" / "pixel-type.json"
CACHE = ROOT / ".cache" / "pixel-type-fonts"

FONTS = {
    "roman": (
        "cormorant.ttf",
        "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
    ),
    "italic": (
        "cormorant-italic.ttf",
        "https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf",
    ),
}

# display_height is the rendered cap-height in CSS pixels; block is the pixel
# size of the pixel-art grid. max_width constrains the CSS width of the mask.
DISPLAY: dict[str, dict] = {
    "header.brand": {"height": 16, "block": 2, "max": 340, "wrap": False, "runs": [("common.brand", "roman")]},
    "hero.line1": {
        "height": 118,
        "block": 5,
        "max": 1280,
        "wrap": False,
        "runs": [("hero.titleLine1", "roman"), ("raw: ", "roman"), ("hero.titleAccent", "italic")],
    },
    "hero.line2": {
        "height": 104,
        "block": 5,
        "max": 1280,
        "wrap": False,
        "runs": [("hero.titleLine2", "italic")],
    },
    "section.approach": {"height": 40, "block": 3, "max": 760, "runs": [("approach.title", "roman"), ("raw: ", "roman"), ("approach.titleAccent", "italic")], "maxLines": 2},
    "section.services": {"height": 40, "block": 3, "max": 760, "runs": [("services.title", "roman"), ("raw: ", "roman"), ("services.titleAccent", "italic")], "maxLines": 2},
    "section.process": {"height": 40, "block": 3, "max": 760, "runs": [("process.title", "roman")], "maxLines": 2},
    "section.cases": {"height": 40, "block": 3, "max": 760, "runs": [("cases.title", "roman"), ("raw: ", "roman"), ("cases.titleAccent", "italic")], "maxLines": 2},
    "section.pricing": {"height": 40, "block": 3, "max": 760, "runs": [("pricing.title", "roman"), ("raw: ", "roman"), ("pricing.titleAccent", "italic")], "maxLines": 2},
    "section.calculator": {"height": 36, "block": 3, "max": 760, "runs": [("pricing.calculator.title", "roman"), ("raw: ", "roman"), ("pricing.calculator.titleAccent", "italic")], "maxLines": 2},
    "section.why": {"height": 40, "block": 3, "max": 760, "runs": [("why.title", "roman"), ("raw: ", "roman"), ("why.titleAccent", "italic")], "maxLines": 2},
    "section.studio": {"height": 40, "block": 3, "max": 760, "runs": [("studio.title", "roman"), ("raw: ", "roman"), ("studio.titleAccent", "italic")], "maxLines": 2},
    "section.faq": {"height": 40, "block": 3, "max": 760, "runs": [("faq.title", "roman"), ("raw: ", "roman"), ("faq.titleAccent", "italic")], "maxLines": 2},
    "section.contact": {"height": 40, "block": 3, "max": 760, "runs": [("contact.title", "roman"), ("raw: ", "roman"), ("contact.titleAccent", "italic")], "maxLines": 2},
    "footer.brand": {"height": 98, "block": 7, "max": 1600, "wrap": False, "runs": [("common.brand", "roman")]},
    "page.privacy": {"height": 48, "block": 3, "max": 900, "maxLines": 2, "runs": [("privacy.title", "roman")]},
    "page.notFound": {"height": 60, "block": 4, "max": 900, "maxLines": 1, "runs": [("notFound.title", "roman")]},
}

LOCALES = ["ru", "be", "en"]


def ensure_fonts() -> dict[str, Path]:
    CACHE.mkdir(parents=True, exist_ok=True)
    paths: dict[str, Path] = {}
    for key, (filename, url) in FONTS.items():
        path = CACHE / filename
        if not path.exists():
            print(f"downloading {key} display font…")
            with urllib.request.urlopen(url, timeout=90) as response:  # noqa: S310
                path.write_bytes(response.read())
        paths[key] = path
    return paths


def resolve(messages: dict, dotted: str) -> str:
    value: object = messages
    for part in dotted.split("."):
        if not isinstance(value, dict):
            raise KeyError(dotted)
        value = value[part]
    if not isinstance(value, str):
        raise KeyError(dotted)
    return value


def load_font(path: Path, size: int, italic: bool) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(path), size)
    try:
        font.set_variation_by_axes([500 if italic else 540])
    except Exception:
        pass
    return font


def cap_ratio(path: Path) -> float:
    font = load_font(path, 100, False)
    bbox = font.getbbox("H")
    return (bbox[3] - bbox[1]) / 100


def wrap_runs(
    draw: ImageDraw.ImageDraw,
    runs: list[tuple[str, str]],
    fonts: dict[str, ImageFont.FreeTypeFont],
    max_width: float,
) -> list[list[tuple[str, str]]]:
    lines: list[list[tuple[str, str]]] = []
    current: list[tuple[str, str]] = []
    width = 0.0
    space = draw.textlength(" ", font=fonts["roman"])
    for text, style in runs:
        words = text.split(" ")
        for index, word in enumerate(words):
            if not word:
                continue
            word_width = draw.textlength(word, font=fonts[style])
            addition = word_width + (space if current else 0)
            if current and width + addition > max_width:
                lines.append(current)
                current = []
                width = 0.0
                addition = word_width
            if current:
                current.append((" ", style))
                width += space
            current.append((word, style))
            width += word_width
    if current:
        lines.append(current)
    return lines


def layout_lines(
    runs: list[tuple[str, str]],
    fonts: dict[str, ImageFont.FreeTypeFont],
    font_size: int,
    max_logical_width: float,
    wrap: bool,
) -> list[list[tuple[str, str]]]:
    if not wrap:
        return [[(text, style) for text, style in runs if text]]
    scratch = Image.new("L", (8, 8))
    draw = ImageDraw.Draw(scratch)
    lines: list[list[tuple[str, str]]] = []
    current: list[tuple[str, str]] = []
    width = 0.0
    space = draw.textlength(" ", font=fonts["roman"])
    for text, style in runs:
        for word in text.split(" "):
            if not word:
                continue
            word_width = draw.textlength(word, font=fonts[style])
            addition = word_width + (space if current else 0)
            if current and width + addition > max_logical_width:
                lines.append(current)
                current = []
                width = 0.0
                addition = word_width
            if current:
                current.append((" ", style))
                width += space
            current.append((word, style))
            width += word_width
    if current:
        lines.append(current)
    return lines


def measure_width(
    lines: list[list[tuple[str, str]]],
    fonts: dict[str, ImageFont.FreeTypeFont],
) -> float:
    scratch = Image.new("L", (8, 8))
    draw = ImageDraw.Draw(scratch)
    space = draw.textlength(" ", font=fonts["roman"])
    widest = 0.0
    for line in lines:
        width = 0.0
        for text, style in line:
            width += draw.textlength(text, font=fonts[style])
            if text == " ":
                width = width
        widest = max(widest, width)
    return widest


def render_mask(text_runs: list[tuple[str, str]], path: Path, spec: dict, font_paths: dict) -> dict:
    block = spec["block"]
    height = spec["height"]
    wrap = spec.get("wrap", True)
    max_lines = spec.get("maxLines", 2 if wrap else 1)
    ratio = cap_ratio(font_paths["roman"])
    logical_cap = height / block
    base_size = max(7, round(logical_cap / ratio))
    max_logical_width = spec["max"] / block

    font_size = base_size
    lines: list[list[tuple[str, str]]] = []
    for _ in range(40):
        roman = load_font(font_paths["roman"], font_size, False)
        italic = load_font(font_paths["italic"], font_size, True)
        line_fonts = {"roman": roman, "italic": italic}
        lines = layout_lines(text_runs, line_fonts, font_size, max_logical_width, wrap)
        width = measure_width(lines, line_fonts)
        if len(lines) <= max_lines and width <= max_logical_width:
            break
        font_size = max(6, int(font_size * 0.92))
    else:
        raise ValueError(f"could not fit {path.name}")

    roman = load_font(font_paths["roman"], font_size, False)
    italic = load_font(font_paths["italic"], font_size, True)
    line_fonts = {"roman": roman, "italic": italic}
    line_height = int(round(font_size * 1.02))
    canvas_width = int(max_logical_width) + 8
    canvas_height = line_height * len(lines) + 8
    image = Image.new("L", (canvas_width, canvas_height), 0)
    draw = ImageDraw.Draw(image)
    y = 2
    for line in lines:
        x = 2.0
        for text, style in line:
            draw.text((x, y), text, font=line_fonts[style], fill=255)
            x += draw.textlength(text, font=line_fonts[style])
        y += line_height
    bbox = image.getbbox()
    if bbox is None:
        raise ValueError("empty mask")
    image = image.crop(bbox)
    image = image.point(lambda value: 255 if value > 100 else 0)
    image = image.resize((image.width * block, image.height * block), Image.Resampling.NEAREST)

    rgba = Image.new("RGBA", image.size, (255, 255, 255, 0))
    rgba.putalpha(image)
    path.parent.mkdir(parents=True, exist_ok=True)
    rgba.save(path, optimize=True)
    return {
        "src": f"/type/{path.parent.name}/{path.name}",
        "width": rgba.width,
        "height": rgba.height,
        "cssWidth": rgba.width,
    }

def main() -> None:
    font_paths = ensure_fonts()
    manifest: dict[str, dict] = {locale: {} for locale in LOCALES}
    OUT.mkdir(parents=True, exist_ok=True)

    for locale in LOCALES:
        messages = json.loads((ROOT / "messages" / f"{locale}.json").read_text(encoding="utf-8"))
        for name, spec in DISPLAY.items():
            runs = [
                (key[4:] if key.startswith("raw:") else resolve(messages, key), style)
                for key, style in spec["runs"]
            ]
            meta = render_mask(runs, OUT / locale / f"{name.replace('.', '-')}.png", spec, font_paths)
            meta["cssWidth"] = meta["width"]
            manifest[locale][name] = meta
            print(f"{locale:2} {name:20} {meta['width']:5}x{meta['height']:4}px")
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent="\t") + "\n", encoding="utf-8")
    print(f"wrote {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
