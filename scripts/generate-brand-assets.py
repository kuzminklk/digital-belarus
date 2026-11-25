#!/usr/bin/env python3
"""Generate the v2 two-tone brand assets: favicon, app icons and the square mark.

The identity is a cream stamp (#ebe2d1) holding the black pixel eight-point
rushnyk star (#12100d). The mark grid is duplicated here so the raster assets
can be rebuilt without a Node toolchain; keep it in sync with
src/components/brand/PixelMark.tsx.

Run: python3 scripts/generate-brand-assets.py
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"

INK = (18, 16, 13)  # #12100d
CREAM = (235, 226, 209)  # #ebe2d1

# Mirror of STAR in src/components/brand/PixelMark.tsx. '#' = ink star module.
STAR = [
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


def render(scale: int) -> Image.Image:
    """Cream square with the ink star at an integer module scale."""
    side = 16 * scale
    image = Image.new("RGB", (side, side), CREAM)
    draw = ImageDraw.Draw(image)
    for y, row in enumerate(STAR):
        for x, cell in enumerate(row):
            if cell == "#":
                draw.rectangle(
                    [x * scale, y * scale, (x + 1) * scale - 1, (y + 1) * scale - 1],
                    fill=INK,
                )
    return image


def render_centred(side: int, scale: int) -> Image.Image:
    """Raster icon at an exact pixel side, centred on a cream field."""
    mark = render(scale)
    image = Image.new("RGB", (side, side), CREAM)
    offset = (side - mark.width) // 2
    image.paste(mark, (offset, offset))
    return image


def mark_svg(side: int = 512, scale: int = 32) -> str:
    offset = (side - 16 * scale) // 2
    rects = []
    for y, row in enumerate(STAR):
        for x, cell in enumerate(row):
            if cell == "#":
                rects.append(
                    f'\t\t<rect x="{offset + x * scale}" y="{offset + y * scale}" '
                    f'width="{scale}" height="{scale}"/>'
                )
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {side} {side}" '
        f'width="{side}" height="{side}" shape-rendering="crispEdges">\n'
        "\t<title>Digital Belarus — pixel mark</title>\n"
        f'\t<rect width="{side}" height="{side}" fill="#ebe2d1"/>\n'
        f'\t<g fill="#12100d">\n'
        + "\n".join(rects)
        + "\n\t</g>\n</svg>\n"
    )


def favicon_svg() -> str:
    rects = []
    for y, row in enumerate(STAR):
        for x, cell in enumerate(row):
            if cell == "#":
                rects.append(f'\t\t<rect x="{x}" y="{y}" width="1" height="1"/>')
    return (
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" '
        'shape-rendering="crispEdges">\n'
        "\t<title>Digital Belarus</title>\n"
        '\t<rect width="16" height="16" fill="#ebe2d1"/>\n'
        '\t<g fill="#12100d">\n' + "\n".join(rects) + "\n\t</g>\n</svg>\n"
    )


def main() -> None:
    (PUBLIC / "brand").mkdir(parents=True, exist_ok=True)

    # Raster app icons: cream square, ink star, no rounded corners.
    render(32).save(PUBLIC / "icon.png", optimize=True)  # 512 x 512
    render_centred(180, 11).save(PUBLIC / "apple-icon.png", optimize=True)  # 180 x 180

    # Crisp SVG favicon for browser chrome.
    (PUBLIC / "favicon.svg").write_text(favicon_svg(), encoding="utf-8")

    # Square SVG source for OG / social / print use.
    (PUBLIC / "brand" / "mark.svg").write_text(mark_svg(), encoding="utf-8")

    print("wrote public/favicon.svg, public/icon.png, public/apple-icon.png, public/brand/mark.svg")


if __name__ == "__main__":
    main()
