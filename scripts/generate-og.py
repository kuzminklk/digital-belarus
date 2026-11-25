#!/usr/bin/env python3
"""Generate public/og/{ru,be,en}.png (1200x630) for social previews.

The script uses the same palette, type and pixel mark as the site. Variable
TTF fonts are downloaded from the Google Fonts repository into .cache/og-fonts
on first run. Run: python3 scripts/generate-og.py
"""

from __future__ import annotations

import math
import os
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og"
CACHE = ROOT / ".cache" / "og-fonts"

FONTS = {
    "cormorant": "CormorantGaramond%5Bwght%5D.ttf",
    "cormorant-italic": "CormorantGaramond-Italic%5Bwght%5D.ttf",
    "manrope": "Manrope%5Bwght%5D.ttf",
    "mono": "JetBrainsMono%5Bwght%5D.ttf",
}
BASE = "https://raw.githubusercontent.com/google/fonts/main/ofl/"

SOURCES = {
    "cormorant": BASE + "cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
    "cormorant-italic": BASE + "cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf",
    "manrope": BASE + "manrope/Manrope%5Bwght%5D.ttf",
    "mono": BASE + "jetbrainsmono/JetBrainsMono%5Bwght%5D.ttf",
}

INK = (5, 8, 11)
PAPER = (236, 233, 223)
PAPER_DIM = (199, 195, 183)
MUTED = (141, 154, 165)
RED = (226, 69, 58)
AURORA = (143, 227, 176)

MARK = [
    "................",
    ".......PP.......",
    "..A...PPPP...A..",
    ".....PP..PP.....",
    "....PP.PP.PP....",
    "...PP..PP..PP...",
    "..PP...RR...PP..",
    ".PP.PPRRRRPP.PP.",
    ".PP.PPRRRRPP.PP.",
    "..PP...RR...PP..",
    "...PP..PP..PP...",
    "....PP.PP.PP....",
    ".....PP..PP.....",
    "..A...PPPP...A..",
    ".......PP.......",
    "................",
]
MARK_COLORS = {"P": PAPER, "R": RED, "A": AURORA}

# Simplified Belarus outline, [lon, lat] — same data as src/content/belarus-outline.ts.
BELARUS = [
    [28.177, 56.169], [29.23, 55.918], [29.372, 55.67], [29.896, 55.789], [30.874, 55.551],
    [30.972, 55.082], [30.758, 54.812], [31.384, 54.157], [31.791, 53.975], [31.731, 53.794],
    [32.406, 53.618], [32.694, 53.351], [32.305, 53.133], [31.498, 53.167], [31.305, 53.074],
    [31.54, 52.742], [31.786, 52.102], [30.928, 52.042], [30.619, 51.823], [30.555, 51.32],
    [30.157, 51.416], [29.255, 51.368], [28.993, 51.602], [28.618, 51.428], [28.242, 51.572],
    [27.454, 51.592], [26.338, 51.832], [25.328, 51.911], [24.553, 51.888], [24.005, 51.617],
    [23.527, 51.578], [23.508, 52.024], [23.199, 52.487], [23.799, 52.691], [23.805, 53.09],
    [23.528, 53.47], [23.484, 53.912], [24.451, 53.906], [25.536, 54.282], [25.768, 54.847],
    [26.588, 55.167], [26.494, 55.615], [27.102, 55.783], [28.177, 56.169],
]

COPY = {
    "ru": {
        "title1": "Цифровой контур",
        "title2": "вашего бизнеса",
        "subtitle": "Сайты · Telegram-боты · ИИ для бизнеса в Беларуси",
        "brand": "Цифровая Беларусь",
        "code": "RU / ОБСЕРВАТОРИЯ 001",
    },
    "be": {
        "title1": "Лічбавы контур",
        "title2": "вашага бізнесу",
        "subtitle": "Сайты · Telegram-боты · ШІ для бізнесу ў Беларусі",
        "brand": "Цыфровая Беларусь",
        "code": "BE / АБСЕРВАТОРЫЯ 001",
    },
    "en": {
        "title1": "The digital outline",
        "title2": "of your business",
        "subtitle": "Websites · Telegram bots · AI for business in Belarus",
        "brand": "Digital Belarus",
        "code": "EN / OBSERVATORY 001",
    },
}


def ensure_fonts() -> dict[str, Path]:
    CACHE.mkdir(parents=True, exist_ok=True)
    paths: dict[str, Path] = {}
    override = os.environ.get("OG_FONT_DIR")
    for key, filename in FONTS.items():
        if override:
            candidate = Path(override) / filename.replace("%5B", "[").replace("%5D", "]")
            if candidate.exists():
                paths[key] = candidate
                continue
        target = CACHE / f"{key}.ttf"
        if not target.exists():
            print(f"downloading {key} font…")
            with urllib.request.urlopen(SOURCES[key], timeout=60) as response:  # noqa: S310
                target.write_bytes(response.read())
        paths[key] = target
    return paths


def load(path: Path, size: int, weight: int = 400) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(path), size)
    try:
        font.set_variation_by_axes([weight])
    except Exception:
        pass
    return font


def draw_mark(draw: ImageDraw.ImageDraw, x: int, y: int, scale: int) -> int:
    for row_index, row in enumerate(MARK):
        for column, cell in enumerate(row):
            if cell not in MARK_COLORS:
                continue
            draw.rectangle(
                [x + column * scale, y + row_index * scale,
                 x + (column + 1) * scale - 1, y + (row_index + 1) * scale - 1],
                fill=MARK_COLORS[cell],
            )
    return x + 16 * scale


def draw_ornament(draw: ImageDraw.ImageDraw, x: int, y: int, width: int, unit: int = 3) -> None:
    """A simplified border rushnyk tile: rails, eight-point stars and diamonds."""
    color = (61, 72, 82)
    height = 16
    tile_width = 48
    for tile in range(0, math.ceil(width / (tile_width * unit))):
        ox = x + tile * tile_width * unit
        # rails
        draw.rectangle([ox, y + unit, ox + tile_width * unit - 1, y + 2 * unit - 1], fill=color)
        draw.rectangle([ox, y + 14 * unit, ox + tile_width * unit - 1, y + 15 * unit - 1], fill=color)
        # eight-point star at 24
        cx, cy = 24, 8
        for i in range(5):
            draw.rectangle([ox + (cx - 1) * unit, y + (cy - i) * unit, ox + (cx + 1) * unit - 1, y + (cy - i + 1) * unit - 1], fill=color)
            draw.rectangle([ox + (cx - 1) * unit, y + (cy + i) * unit, ox + (cx + 1) * unit - 1, y + (cy + i + 1) * unit - 1], fill=color)
            draw.rectangle([ox + (cx - i) * unit, y + (cy - 1) * unit, ox + (cx - i + 1) * unit - 1, y + (cy + 1) * unit - 1], fill=color)
            draw.rectangle([ox + (cx + i) * unit, y + (cy - 1) * unit, ox + (cx + i + 1) * unit - 1, y + (cy + 1) * unit - 1], fill=color)
        for i in range(1, 3):
            for sx, sy in ((1, 1), (-1, 1), (1, -1), (-1, -1)):
                draw.rectangle([ox + (cx + sx * i) * unit, y + (cy + sy * i) * unit,
                                ox + (cx + sx * i + 1) * unit - 1, y + (cy + sy * i + 1) * unit - 1], fill=color)
        # diamonds at 8 and 40
        for dcx in (8, 40):
            for i in range(-3, 4):
                draw.rectangle([ox + (dcx + i) * unit, y + (8 - (3 - abs(i))) * unit,
                                ox + (dcx + i + 1) * unit - 1, y + (8 - (3 - abs(i)) + 1) * unit - 1], fill=color)
                draw.rectangle([ox + (dcx + i) * unit, y + (8 + (3 - abs(i))) * unit,
                                ox + (dcx + i + 1) * unit - 1, y + (8 + (3 - abs(i)) + 1) * unit - 1], fill=color)
        # small dots
        for dot_x in (16, 32):
            for dot_y in (5, 11):
                draw.rectangle([ox + dot_x * unit, y + dot_y * unit,
                                ox + (dot_x + 1) * unit - 1, y + (dot_y + 1) * unit - 1], fill=color)


def draw_constellation(draw: ImageDraw.ImageDraw, box: tuple[int, int, int, int]) -> None:
    x0, y0, x1, y1 = box
    lon_min, lon_max = 23.199, 32.694
    lat_min, lat_max = 51.32, 56.169
    width = x1 - x0
    height = y1 - y0
    points = []
    for lon, lat in BELARUS:
        px = x0 + (lon - lon_min) / (lon_max - lon_min) * width
        py = y0 + (lat_max - lat) / (lat_max - lat_min) * height
        points.append((px, py))
    draw.line(points, fill=(52, 66, 78), width=1)
    for px, py in points[::3]:
        draw.rectangle([px - 1, py - 1, px + 1, py + 1], fill=(120, 137, 150))
    # Minsk
    mx = x0 + (27.559 - lon_min) / (lon_max - lon_min) * width
    my = y0 + (lat_max - 53.9) / (lat_max - lat_min) * height
    draw.ellipse([mx - 7, my - 7, mx + 7, my + 7], outline=(143, 227, 176), width=1)
    draw.rectangle([mx - 2, my - 2, mx + 2, my + 2], fill=RED)


def radial_glow(
    base: Image.Image, center: tuple[int, int], radius: int, color: tuple[int, int, int], strength: float
) -> None:
    layer = Image.new("RGB", base.size, (0, 0, 0))
    draw = ImageDraw.Draw(layer)
    draw.ellipse(
        [center[0] - radius, center[1] - radius, center[0] + radius, center[1] + radius],
        fill=tuple(int(channel * strength) for channel in color),
    )
    layer = layer.filter(ImageFilter.GaussianBlur(radius // 3))
    base.paste(Image.blend(base, Image.blend(base, layer, 0.0), 0.0), (0, 0))
    base.paste(Image.composite(layer, base, layer.convert("L")), (0, 0))


def render(locale: str, fonts: dict[str, Path]) -> None:
    image = Image.new("RGB", (1200, 630), INK)
    glow = Image.new("RGB", image.size, (0, 0, 0))
    overlay = Image.new("L", image.size, 0)
    glow_draw = ImageDraw.Draw(glow)
    overlay_draw = ImageDraw.Draw(overlay)
    glow_draw.ellipse([-220, 360, 460, 1040], fill=(60, 18, 16))
    glow_draw.ellipse([780, -260, 1420, 380], fill=(20, 46, 38))
    overlay_draw.ellipse([-220, 360, 460, 1040], fill=90)
    overlay_draw.ellipse([780, -260, 1420, 380], fill=70)
    glow = glow.filter(ImageFilter.GaussianBlur(120))
    image = Image.composite(glow, image, overlay.filter(ImageFilter.GaussianBlur(80)))
    draw = ImageDraw.Draw(image)

    # instrument grid
    for x in range(0, 1201, 60):
        draw.line([(x, 0), (x, 630)], fill=(13, 18, 24), width=1)
    for y in range(0, 631, 60):
        draw.line([(0, y), (1200, y)], fill=(13, 18, 24), width=1)

    # constellation in the upper right
    draw_constellation(draw, (690, 88, 1120, 330))

    # header
    mark_right = draw_mark(draw, 64, 52, 2)
    font_brand = load(fonts["cormorant"], 26, 500)
    font_mono = load(fonts["mono"], 14)
    font_mono_small = load(fonts["mono"], 11)
    draw.text((mark_right + 16, 54), COPY[locale]["brand"], font=font_brand, fill=PAPER)
    draw.text((mark_right + 18, 84), "DIGITAL BELARUS · OBSERVATORY", font=font_mono_small, fill=MUTED)
    draw.text((1090, 58), COPY[locale]["code"], font=font_mono_small, fill=MUTED, anchor="ra")
    draw.line([(64, 112), (1136, 112)], fill=(32, 42, 52), width=1)

    # headline
    font_title = load(fonts["cormorant"], 92, 500)
    font_title_italic = load(fonts["cormorant-italic"], 92, 400)
    draw.text((64, 170), COPY[locale]["title1"], font=font_title, fill=PAPER)
    draw.text((64, 268), COPY[locale]["title2"], font=font_title_italic, fill=PAPER_DIM)
    draw.rectangle([64, 392, 112, 396], fill=RED)

    font_subtitle = load(fonts["manrope"], 23, 400)
    draw.text((64, 424), COPY[locale]["subtitle"], font=font_subtitle, fill=PAPER_DIM)

    # footer
    draw_ornament(draw, 64, 516, 1072, unit=3)
    draw.line([(64, 566), (1136, 566)], fill=(32, 42, 52), width=1)
    draw.text((64, 584), "MINSK, BELARUS · 53.9006°N 27.5590°E", font=font_mono, fill=MUTED)
    draw.text((1090, 584), "STUDIO · MINSK · 2026", font=font_mono_small, fill=MUTED, anchor="ra")
    draw.rectangle([1136, 52, 1140, 96], fill=RED)

    OUT.mkdir(parents=True, exist_ok=True)
    image.save(OUT / f"{locale}.png", optimize=True)
    print(f"wrote public/og/{locale}.png")


if __name__ == "__main__":
    font_paths = ensure_fonts()
    for locale in COPY:
        render(locale, font_paths)
