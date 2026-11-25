#!/usr/bin/env python3
"""Generate the v2 1-bit dithered image set for public/pixel/.

The identity direction is a warm two-tone monochrome system: near-black ink
(#12100d) and warm cream (#ebe2d1), no other colours. Every photograph is
converted to a low-resolution grayscale grid, density-tuned, Floyd–Steinberg
dithered to 1 bit and then upscaled with nearest-neighbour so the pixels stay
square and crisp.

Pipeline per asset:
    open source -> grayscale -> autocontrast -> crop -> resize to pixel grid
    -> optional light blur -> gamma search to hit the target ink coverage
    -> Floyd–Steinberg 1-bit dither -> palette (ink / cream) -> nearest upscale

Sources: assets are cached in .cache/pixel-src/ and downloaded from the URLs in
SOURCES when absent. Licences and authors are recorded in
docs/design/image-credits.md — keep that file in sync when adding an asset.

Run: python3 scripts/generate-pixel-images.py
"""

from __future__ import annotations

import os
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "pixel"
CACHE = ROOT / ".cache" / "pixel-src"
FONT_CACHE = ROOT / ".cache" / "og-fonts"

# The two and only two colours of the v2 identity.
INK = (18, 16, 13)  # #12100d
CREAM = (235, 226, 209)  # #ebe2d1

WORLD = Path("/home/kuzminklk/computer-science/artificial-intelligence/web")

SOURCES = {
    # NASA Apollo 17 lunar surface panorama (public domain).
    # Source collection: https://www.lpi.usra.edu/resources/apollo/
    # A high-resolution NASA Apollo 17 Station 1 panorama is expected locally
    # (the crops below are tuned for the 21067 x 3575 file supplied for the
    # build). If it is absent, the public-domain Commons reference is fetched
    # instead, but crops then need retuning.
    "moon": {
        "path": "/tmp/noctra-src/moon-pano.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/7/7c/Apollo_17_Station_1_Panorama.jpg",
    },
    # Andreas Cellarius, Harmonia Macrocosmica (1660), public domain.
    "atlas": {
        "path": "/tmp/noctra-src/star-atlas.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/e/ed/Cellarius_Harmonia_Macrocosmica_-_Haemisphaerium_Stellatum_Australe_Antiquum.jpg",
    },
    # Studio founder portrait, own photograph.
    "portrait": {
        "path": str(ROOT / "public" / "images" / "daniel-kuzmin.jpg"),
        "url": None,
    },
    # Yasna case: forest photo story, own photograph.
    "yasna": {
        "path": str(WORLD / "fairy-tail" / "assets" / "photos" / "03-canopy-1800.jpg"),
        "url": None,
    },
    # Central Park case: CC0 café interior by Kavig624 (Wikimedia Commons).
    "cafe": {
        "path": "/tmp/noctra-src/Cafe_Interior_with_Coffee.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/3/38/Cafe_Interior_with_Coffee.jpg",
    },
    # Spadchyna case: CC BY-SA 4.0 ceramic wisents by Tatiana Markina.
    "pottery": {
        "path": "/tmp/noctra-src/2024.11.03_Ceramic_Wisents_from_Ivianiec_Valo%C5%BEyn_District_Minsk_Region_1970s_Museum_Belarusian_Folk_Art.jpg",
        "url": "https://upload.wikimedia.org/wikipedia/commons/6/65/2024.11.03_Ceramic_Wisents_from_Ivianiec_Valo%C5%BEyn_District_Minsk_Region_1970s_Museum_Belarusian_Folk_Art.jpg",
    },
}

# Pixel-art Telegram chat for the PraBot case, drawn from scratch (no photo).
HANJET_CANDIDATES = [
    FONT_CACHE / "handjet.ttf",
    Path("/tmp/pixelfonts/handjet.ttf"),
]
HANDJET_URL = (
    "https://raw.githubusercontent.com/google/fonts/main/ofl/handjet/Handjet%5BELGR%2CELSH%2Cwght%5D.ttf"
)

# The mark grid is duplicated from src/components/brand/PixelMark.tsx so the
# avatar can wear the same star without a Node toolchain.
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


def ensure_source(key: str) -> Path:
    """Return a local path for a source, downloading it into .cache if needed."""
    source = SOURCES[key]
    local = Path(source["path"]) if source["path"] else None
    if local and local.exists():
        return local
    cached = CACHE / f"{key}.jpg"
    if cached.exists():
        return cached
    if not source["url"]:
        raise SystemExit(
            f"missing local source for '{key}': {source['path']} (no download URL recorded)"
        )
    CACHE.mkdir(parents=True, exist_ok=True)
    print(f"downloading {key} -> {cached}")
    request = urllib.request.Request(
        source["url"], headers={"User-Agent": "digital-belarus-build/1.0 (design asset pipeline)"}
    )
    with urllib.request.urlopen(request, timeout=120) as response:  # noqa: S310
        cached.write_bytes(response.read())
    return cached


def dither(
    image: Image.Image,
    grid: tuple[int, int],
    *,
    target_dark: float,
    blur: float = 0.0,
    levels: tuple[int, int] | None = None,
) -> tuple[Image.Image, float]:
    """Grayscale, density-tune and Floyd–Steinberg dither to a 1-bit bitmap.

    ``levels`` is an optional (black, white) contrast stretch applied *before*
    downscaling. It is what keeps fine engraving linework readable at a low
    pixel grid: parchment is pushed to white and ink lines to black.
    """
    grey = ImageOps.grayscale(image)
    grey = ImageOps.autocontrast(grey, cutoff=1)
    if levels is not None:
        black, white = levels
        span = max(1, white - black)
        grey = grey.point(lambda value: max(0, min(255, round((value - black) / span * 255))))
    grey = grey.resize(grid, Image.LANCZOS)
    if blur:
        grey = grey.filter(ImageFilter.GaussianBlur(blur))

    target = max(0.02, min(0.98, target_dark))
    low, high = 0.2, 4.0
    best: tuple[float, Image.Image] | None = None
    for _ in range(16):
        gamma = (low + high) / 2
        lut = [min(255, max(0, round(255 * ((value / 255) ** gamma)))) for value in range(256)]
        bitmap = grey.point(lut).convert("1", dither=Image.Dither.FLOYDSTEINBERG)
        dark = bitmap.histogram()[0] / (grid[0] * grid[1])
        if best is None or abs(dark - target) < abs(best[0] - target):
            best = (dark, bitmap)
        if dark > target:
            high = gamma
        else:
            low = gamma
    assert best is not None
    dark, bitmap = best
    return bitmap, dark


def colourise(bitmap: Image.Image, *, invert: bool = False) -> Image.Image:
    """Map a 1-bit bitmap onto the ink/cream palette and bake the surface colour.

    Default mapping: black pixels are ink, white pixels are cream — bright
    areas become cream, dark areas become ink. ``invert`` swaps the two so the
    figures are cream on an ink field.
    """
    mask = bitmap.convert("L").point(lambda value: 0 if value < 128 else 1)
    if invert:
        mask = mask.point(lambda value: 1 - value)
    palette = Image.new("P", (1, 1))
    palette.putpalette(list(INK) + list(CREAM) + [0, 0, 0] * 254)
    output = Image.new("P", bitmap.size)
    output.putpalette(palette.getpalette())
    output.frombytes(mask.tobytes())
    return output


def save_asset(
    *,
    name: str,
    source_key: str,
    crop: tuple[int, int, int, int],
    grid: tuple[int, int],
    upscale: int,
    target_dark: float,
    blur: float = 0.0,
    invert: bool = False,
    levels: tuple[int, int] | None = None,
) -> None:
    source = Image.open(ensure_source(source_key)).convert("RGB")
    image = source.crop(crop)
    bitmap, dark = dither(image, grid, target_dark=target_dark, blur=blur, levels=levels)
    output = colourise(bitmap, invert=invert)
    output = output.resize((grid[0] * upscale, grid[1] * upscale), Image.NEAREST)
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / f"{name}.png"
    output.save(path, optimize=True, bits=1)
    size_kb = path.stat().st_size / 1024
    print(
        f"{name:22s} {grid[0] * upscale}x{grid[1] * upscale}  "
        f"grid {grid[0]}x{grid[1]} x{upscale}  ink {dark:.0%}  {size_kb:.0f} KB"
    )


# ---------------------------------------------------------------------------
# PraBot — pixel-art Telegram chat, drawn in 1:1 pixel blocks, no photograph.
# ---------------------------------------------------------------------------

MESSAGES = [
    ("user", ["I NEED A WEBSITE", "FOR MY CAFÉ"]),
    ("bot", ["PRABOT · AI ADMIN", "LANDING + MENU", "TELEGRAM BOOKING"]),
    ("bot", ["ESTIMATE: 21 DAYS", "3 900 BYN · FIXED"]),
]
BUTTONS = ["CALCULATE", "BOOK A CALL"]


def ensure_handjet() -> Path:
    for candidate in HANJET_CANDIDATES:
        if candidate.exists():
            FONT_CACHE.mkdir(parents=True, exist_ok=True)
            target = FONT_CACHE / "handjet.ttf"
            if candidate != target:
                target.write_bytes(candidate.read_bytes())
            return target
    target = FONT_CACHE / "handjet.ttf"
    FONT_CACHE.mkdir(parents=True, exist_ok=True)
    print("downloading handjet font…")
    request = urllib.request.Request(
        HANDJET_URL, headers={"User-Agent": "digital-belarus-build/1.0 (design asset pipeline)"}
    )
    with urllib.request.urlopen(request, timeout=120) as response:  # noqa: S310
        target.write_bytes(response.read())
    return target


def load_font(path: Path, size: int, weight: int = 400) -> ImageFont.FreeTypeFont:
    font = ImageFont.truetype(str(path), size)
    try:
        font.set_variation_by_axes([weight])
    except Exception:  # noqa: BLE001 - non-variable fallback is fine
        pass
    return font


def mark_mask(size: int) -> Image.Image:
    mask = Image.new("L", (16, 16), 0)
    draw = ImageDraw.Draw(mask)
    for y, row in enumerate(MARK_STAR):
        for x, cell in enumerate(row):
            if cell == "#":
                draw.point((x, y), fill=255)
    return mask.resize((size, size), Image.NEAREST)


def draw_chat() -> None:
    """Hand-built Telegram chat UI: 600 x 450 modules at 2x = 1200 x 900."""
    grid = (600, 450)
    scale = 2
    image = Image.new("RGB", grid, INK)
    draw = ImageDraw.Draw(image)
    font_path = ensure_handjet()
    font_title = load_font(font_path, 18, 600)
    font_body = load_font(font_path, 12, 400)
    font_small = load_font(font_path, 10, 400)

    def outline(box: tuple[int, int, int, int]) -> None:
        x0, y0, x1, y1 = box
        draw.rectangle([x0, y0, x1, y0], fill=CREAM)
        draw.rectangle([x0, y1, x1, y1], fill=CREAM)
        draw.rectangle([x0, y0, x0, y1], fill=CREAM)
        draw.rectangle([x1, y0, x1, y1], fill=CREAM)

    def text(x: int, y: int, value: str, font: ImageFont.FreeTypeFont, colour=CREAM) -> None:
        draw.text((x, y), value, font=font, fill=colour)

    # Chat frame and header.
    outline((14, 14, 586, 436))
    draw.rectangle([15, 84, 585, 84], fill=CREAM)

    # Back arrow.
    for index in range(7):
        draw.point((40 + index, 44 - index), fill=CREAM)
        draw.point((40 + index, 44 + index), fill=CREAM)

    # Avatar: cream square with the ink star.
    draw.rectangle([66, 26, 110, 70], fill=CREAM)
    image.paste(INK, (74, 34, 104, 64), mark_mask(30))

    text(126, 32, "PRABOT", font_title)
    text(128, 58, "AI ADMINISTRATOR · ONLINE", font_small)

    # Menu dots.
    for y in (38, 46, 54):
        draw.rectangle([550, y, 553, y + 3], fill=CREAM)

    # User message (filled bubble, ink text).
    draw.rectangle([290, 102, 566, 164], fill=CREAM)
    text(308, 116, "I NEED A WEBSITE", font_body, INK)
    text(308, 136, "FOR MY CAFÉ", font_body, INK)
    text(510, 146, "10:42", font_small, INK)

    # Bot message (outline bubble, cream text).
    outline((40, 178, 432, 272))
    text(58, 188, "PRABOT · AI ADMINISTRATOR", font_small)
    text(58, 208, "LANDING PAGE + MENU", font_body)
    text(58, 228, "TELEGRAM BOOKING", font_body)
    text(58, 248, "READY TO START", font_body)

    # Bot estimate.
    outline((40, 286, 400, 346))
    text(58, 296, "ESTIMATE: 21 DAYS · 3 900 BYN", font_body)
    text(58, 320, "FIXED SCOPE · NO AGENCY MARKUP", font_small)

    # Quick actions.
    x = 40
    for label in BUTTONS:
        width = int(font_body.getlength(label)) + 26
        outline((x, 360, x + width, 394))
        text(x + 13, 368, label, font_body)
        x += width + 14

    # Composer.
    outline((40, 410, 512, 436))
    draw.rectangle([58, 417, 62, 429], fill=CREAM)
    text(74, 414, "MESSAGE", font_body)
    draw.rectangle([522, 410, 566, 436], fill=CREAM)
    # Send arrow (ink on the cream button).
    draw.rectangle([532, 422, 546, 425], fill=INK)
    for index in range(6):
        draw.point((546 + index, 423 - index), fill=INK)
        draw.point((546 + index, 423 + index), fill=INK)

    # Instrument caption inside the footer margin.
    text(40, 440, "TELEGRAM · CASE 04 · 1:1 PIXEL · 1200 × 900", font_small)

    output = image.resize((grid[0] * scale, grid[1] * scale), Image.NEAREST)
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / "case-prabot.png"
    output.save(path, optimize=True)
    print(
        f"{'case-prabot':22s} {grid[0] * scale}x{grid[1] * scale}  drawn  {path.stat().st_size / 1024:.0f} KB"
    )


def main() -> None:
    print(f"ink #12100d · cream #ebe2d1 · output {OUT}")

    # Hero: wide lunar band with the astronaut silhouette on the left and the
    # rover tracks on the right. Crop is in source pixels (21067 x 3575).
    save_asset(
        name="hero-lunar",
        source_key="moon",
        crop=(5700, 0, 18468, 3575),
        grid=(500, 140),
        upscale=4,
        target_dark=0.50,
        blur=0.6,
    )
    save_asset(
        name="hero-lunar-mobile",
        source_key="moon",
        crop=(5000, 400, 7600, 2740),
        grid=(250, 225),
        upscale=4,
        target_dark=0.50,
        blur=0.5,
    )

    # Archival star atlas rendered as ink-on-cream engraving (cream-dominant:
    # ~25-30% ink coverage so it can sit behind content).
    save_asset(
        name="atlas",
        source_key="atlas",
        crop=(0, 80, 1920, 1400),
        grid=(533, 367),
        upscale=3,
        target_dark=0.30,
        blur=0.0,
        levels=(60, 190),
    )
    save_asset(
        name="atlas-square",
        source_key="atlas",
        crop=(150, 60, 1600, 1510),
        grid=(333, 333),
        upscale=3,
        target_dark=0.28,
        blur=0.0,
        levels=(60, 190),
    )

    # Founder portrait, both readings of the same dither.
    save_asset(
        name="portrait",
        source_key="portrait",
        crop=(0, 0, 460, 460),
        grid=(300, 300),
        upscale=3,
        target_dark=0.42,
        blur=0.5,
        invert=False,
    )
    save_asset(
        name="portrait-inverted",
        source_key="portrait",
        crop=(0, 0, 460, 460),
        grid=(300, 300),
        upscale=3,
        target_dark=0.58,
        blur=0.5,
        invert=True,
    )

    # Case covers: cream highlights on ink, deep density so they read as
    # engravings rather than photographs.
    save_asset(
        name="case-yasna",
        source_key="yasna",
        crop=(0, 200, 1200, 1100),
        grid=(400, 300),
        upscale=3,
        target_dark=0.70,
        blur=0.5,
    )
    save_asset(
        name="case-central-park",
        source_key="cafe",
        crop=(0, 1400, 2268, 3101),
        grid=(400, 300),
        upscale=3,
        target_dark=0.62,
        blur=0.5,
    )
    save_asset(
        name="case-spadchyna",
        source_key="pottery",
        crop=(400, 700, 3000, 2650),
        grid=(400, 300),
        upscale=3,
        target_dark=0.70,
        blur=0.5,
    )

    draw_chat()


if __name__ == "__main__":
    main()
