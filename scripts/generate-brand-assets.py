#!/usr/bin/env python3
"""Generate favicon.svg, icon.png (512) and apple-icon.png (180) from the
16x16 pixel mark. The mark is duplicated here so the assets can be rebuilt
without a Node toolchain; keep it in sync with src/components/brand/PixelMark.tsx.

Run: python3 scripts/generate-brand-assets.py
"""

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

PAPER = (236, 233, 223, 255)
RED = (226, 69, 58, 255)
AURORA = (143, 227, 176, 255)
INK = (5, 8, 11, 255)

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

COLORS = {"P": PAPER, "R": RED, "A": AURORA}


def render(scale: float, padding: int = 0, background: tuple | None = None) -> Image.Image:
    side = int(round(16 * scale)) + padding * 2
    image = Image.new("RGBA", (side, side), background or (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    for y, row in enumerate(MARK):
        for x, cell in enumerate(row):
            if cell not in COLORS:
                continue
            x0 = padding + int(round(x * scale))
            y0 = padding + int(round(y * scale))
            x1 = padding + int(round((x + 1) * scale)) - 1
            y1 = padding + int(round((y + 1) * scale)) - 1
            draw.rectangle([x0, y0, x1, y1], fill=COLORS[cell])
    return image


def main() -> None:
    PUBLIC.mkdir(exist_ok=True)

    # PNG app icons: dark tile so the paper mark always has contrast.
    render(32, padding=0, background=INK).save(PUBLIC / "icon.png")
    render(11.25, padding=0, background=INK).resize((180, 180), Image.Resampling.NEAREST).save(
        PUBLIC / "apple-icon.png"
    )

    # Favicon SVG: transparent, crisp, works in dark and light browser chrome.
    rects: list[str] = []
    for y, row in enumerate(MARK):
        for x, cell in enumerate(row):
            if cell not in COLORS:
                continue
            hex_color = "#%02x%02x%02x" % COLORS[cell][:3]
            rects.append(f'\t\t<rect x="{x}" y="{y}" width="1" height="1" fill="{hex_color}"/>')

    svg = (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" '
        'shape-rendering="crispEdges">\n'
        "\t<title>Digital Belarus</title>\n"
        + "\n".join(rects)
        + "\n</svg>\n"
    )
    (PUBLIC / "favicon.svg").write_text(svg, encoding="utf-8")
    print("wrote public/favicon.svg, public/icon.png, public/apple-icon.png")


if __name__ == "__main__":
    main()
