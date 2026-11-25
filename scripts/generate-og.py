#!/usr/bin/env python3
"""Generate public/og/{ru,be,en}.png (1200x630) for the v2 two-tone identity.

Warm near-black ink (#12100d) and warm cream (#ebe2d1), nothing else. The
headline is a pixel-serif mask: Cormorant Garamond is rasterised at a low pixel
size, thresholded, and upscaled with nearest-neighbour so the serif gets the
same blocky texture as the rest of the site. Labels use Handjet, a pixel mono.
A strip of the dithered lunar hero anchors the composition.

Fonts are cached in .cache/og-fonts (downloaded on first run, or copied from
/tmp/pixelfonts if the pixel font is already available there).
Run: python3 scripts/generate-pixel-images.py && python3 scripts/generate-og.py
"""

from __future__ import annotations

import os
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "og"
CACHE = ROOT / ".cache" / "og-fonts"
PIXEL_DIR = ROOT / "public" / "pixel"

INK = (18, 16, 13)  # #12100d
CREAM = (235, 226, 209)  # #ebe2d1

FONTS = {
    "cormorant": "CormorantGaramond%5Bwght%5D.ttf",
    "cormorant-italic": "CormorantGaramond-Italic%5Bwght%5D.ttf",
    "handjet": "handjet.ttf",
}
BASE = "https://raw.githubusercontent.com/google/fonts/main/ofl/"
SOURCES = {
    "cormorant": BASE + "cormorantgaramond/CormorantGaramond%5Bwght%5D.ttf",
    "cormorant-italic": BASE + "cormorantgaramond/CormorantGaramond-Italic%5Bwght%5D.ttf",
}
HANDJET_CANDIDATES = [
    CACHE / "handjet.ttf",
    Path("/tmp/pixelfonts/handjet.ttf"),
]
HANDJET_URL = (
    "https://raw.githubusercontent.com/google/fonts/main/ofl/handjet/Handjet%5BELGR%2CELSH%2Cwght%5D.ttf"
)

MARK_STAR = [
    "................",
    ".......##.......",
    "..##...##...##..",
    "..###..##..###..",
    "...###.##.###...",
    "....########....",
    ".....######.....",
    ".##############.",
    ".##############.",
    ".....######.....",
    "....########....",
    "...###.##.###...",
    "..###..##..###..",
    "..##...##...##..",
    ".......##.......",
    "................",
]

COPY = {
    "ru": {
        "title1": "Цифровой контур",
        "title2": "вашего бизнеса",
        "subtitle": "САЙТЫ · TELEGRAM-БОТЫ · ИИ ДЛЯ БИЗНЕСА В БЕЛАРУСИ",
        "brand": "ЦЫФРОВАЯ БЕЛАРУСЬ",
        "code": "RU / 001",
    },
    "be": {
        "title1": "Лічбавы контур",
        "title2": "вашага бізнесу",
        "subtitle": "САЙТЫ · TELEGRAM-БОТЫ · ШІ ДЛЯ БІЗНЕСУ Ў БЕЛАРУСІ",
        "brand": "ЦЫФРОВАЯ БЕЛАРУСЬ",
        "code": "BE / 001",
    },
    "en": {
        "title1": "The digital outline",
        "title2": "of your business",
        "subtitle": "WEBSITES · TELEGRAM BOTS · AI FOR BUSINESS IN BELARUS",
        "brand": "DIGITAL BELARUS",
        "code": "EN / 001",
    },
}


def ensure_fonts() -> dict[str, Path]:
    CACHE.mkdir(parents=True, exist_ok=True)
    paths: dict[str, Path] = {}
    override = os.environ.get("OG_FONT_DIR")
    for key, filename in FONTS.items():
        target = CACHE / f"{key}.ttf"
        if target.exists():
            paths[key] = target
            continue
        if key == "handjet":
            for candidate in HANDJET_CANDIDATES:
                if candidate.exists():
                    target.write_bytes(candidate.read_bytes())
                    break
            if not target.exists():
                print("downloading handjet…")
                request = urllib.request.Request(
                    HANDJET_URL,
                    headers={"User-Agent": "digital-belarus-build/1.0 (og generator)"},
                )
                with urllib.request.urlopen(request, timeout=120) as response:  # noqa: S310
                    target.write_bytes(response.read())
            paths[key] = target
            continue
        if override:
            candidate = Path(override) / filename.replace("%5B", "[").replace("%5D", "]")
            if candidate.exists():
                paths[key] = candidate
                continue
        print(f"downloading {key} font…")
        request = urllib.request.Request(
            SOURCES[key], headers={"User-Agent": "digital-belarus-build/1.0 (og generator)"}
        )
        with urllib.request.urlopen(request, timeout=120) as response:  # noqa: S310
            target.write_bytes(response.read())
        paths[key] = target
    return paths


def load(path: Path, size: int, weight: int = 400) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(path), size)
    try:
        font.set_variation_by_axes([weight])
    except Exception:  # noqa: BLE001 - non-variable fallback is fine
        pass
    return font


def draw_mark(canvas: Image.Image, x: int, y: int, scale: int) -> int:
    """Cream square with the ink star; returns the right edge."""
    draw = ImageDraw.Draw(canvas)
    side = 16 * scale
    draw.rectangle([x, y, x + side - 1, y + side - 1], fill=CREAM)
    for row_index, row in enumerate(MARK_STAR):
        for column, cell in enumerate(row):
            if cell == "#":
                draw.rectangle(
                    [
                        x + column * scale,
                        y + row_index * scale,
                        x + (column + 1) * scale - 1,
                        y + (row_index + 1) * scale - 1,
                    ],
                    fill=INK,
                )
    return x + side


def pixel_text_mask(
    text: str,
    font: ImageFont.FreeTypeFont,
    *,
    pixel: int,
    threshold: int = 96,
) -> Image.Image:
    """Rasterise text at 1/pixel scale, threshold, then upscale as pixel blocks."""
    scratch = Image.new("L", (1, 1))
    scratch_draw = ImageDraw.Draw(scratch)
    left, top, right, bottom = scratch_draw.textbbox((0, 0), text, font=font)
    width = max(1, right - left + 2)
    height = max(1, bottom - top + 2)
    mask = Image.new("L", (width, height), 0)
    ImageDraw.Draw(mask).text((1 - left, 1 - top), text, font=font, fill=255)
    mask = mask.point(lambda value: 255 if value >= threshold else 0)
    return mask.resize((width * pixel, height * pixel), Image.NEAREST)


def paste_mask(canvas: Image.Image, mask: Image.Image, x: int, y: int) -> tuple[int, int]:
    cream = Image.new("RGB", mask.size, CREAM)
    canvas.paste(cream, (x, y), mask)
    return x + mask.width, y + mask.height


def draw_text(
    canvas: Image.Image,
    x: int,
    y: int,
    text: str,
    font: ImageFont.FreeTypeFont,
    colour=CREAM,
    anchor: str = "la",
) -> None:
    ImageDraw.Draw(canvas).text((x, y), text, font=font, fill=colour, anchor=anchor)


def lunar_strip(width: int, height: int) -> Image.Image | None:
    """Take a 1:1 slice of the already dithered hero image, if it exists."""
    path = PIXEL_DIR / "hero-lunar.png"
    if not path.exists():
        print("hero-lunar.png missing — OG will be texts only")
        return None
    hero = Image.open(path).convert("RGB")
    crop = hero.crop((40, 190, 40 + width, 190 + height))
    return crop


def render(locale: str, fonts: dict[str, Path]) -> None:
    canvas = Image.new("RGB", (1200, 630), INK)
    draw = ImageDraw.Draw(canvas)

    font_handjet = lambda size, weight=400: load(fonts["handjet"], size, weight)  # noqa: E731
    font_meta = font_handjet(15)
    font_small = font_handjet(13)
    font_brand = font_handjet(24, 600)
    font_subtitle = font_handjet(19, 400)

    # Header: cream stamp + wordmark, index code on the right.
    draw_mark(canvas, 48, 40, 4)
    draw_text(canvas, 128, 38, COPY[locale]["brand"], font_brand)
    draw_text(canvas, 130, 72, "MINSK · BELARUS · 53.9006°N 27.5590°E", font_small)
    draw_text(canvas, 1152, 40, COPY[locale]["code"], font_meta, anchor="ra")
    draw_text(canvas, 1152, 64, "DIGITAL BELARUS", font_small, anchor="ra")
    draw.line([(48, 108), (1152, 108)], fill=CREAM, width=1)

    # Pixel-serif headline: line 1 roman, line 2 italic.
    title_size = 90
    grid_size = title_size // 3
    line1 = pixel_text_mask(
        COPY[locale]["title1"], load(fonts["cormorant"], grid_size, 500), pixel=3
    )
    line2 = pixel_text_mask(
        COPY[locale]["title2"], load(fonts["cormorant-italic"], grid_size, 400), pixel=3
    )
    paste_mask(canvas, line1, 46, 138)
    paste_mask(canvas, line2, 46, 138 + line1.height - 1)

    # Subtitle + supporting read-out.
    draw_text(canvas, 48, 344, COPY[locale]["subtitle"], font_subtitle)
    draw_text(canvas, 1152, 344, "51.32–56.17° N", font_small, anchor="ra")
    draw_text(canvas, 1152, 364, "23.20–32.69° E", font_small, anchor="ra")

    # Dithered lunar strip.
    strip = lunar_strip(1200, 190)
    if strip is not None:
        canvas.paste(strip, (0, 398))
        draw.line([(0, 397), (1200, 397)], fill=CREAM, width=1)

    # Footer read-out.
    draw_text(canvas, 48, 602, "STUDIO · MINSK · BELARUS", font_small)
    draw_text(canvas, 600, 602, "SITES · BOTS · AI", font_small)
    draw_text(canvas, 1152, 602, "MINSK · 2026", font_small, anchor="ra")

    OUT.mkdir(parents=True, exist_ok=True)
    image = canvas
    image.save(OUT / f"{locale}.png", optimize=True)
    print(f"wrote public/og/{locale}.png")


def main() -> None:
    fonts = ensure_fonts()
    for locale in COPY:
        render(locale, fonts)


if __name__ == "__main__":
    main()
