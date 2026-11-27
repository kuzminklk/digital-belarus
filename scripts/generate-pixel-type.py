#!/usr/bin/env python3
"""Generate pixel-serif display masks for the site headings.

The NOCTRA-inspired display face is a custom treatment: Cormorant Garamond is
rendered at a tiny logical size, thresholded to hard pixels, then upscaled with
nearest-neighbour. The result is a pixel-serif PNG used as a CSS mask, so the
same asset can be painted in warm cream on ink or ink on warm cream.

v2.1 legibility changes: denser pixel grids (2px blocks), slightly bolder
weights, a little letter-spacing, and a separate narrow variant for small
screens so Cyrillic headings stay readable on mobile.

Outputs:
  public/type/{locale}/{name}.png          desktop variant
  public/type/{locale}/{name}-mobile.png   mobile variant (where configured)
  src/content/pixel-type.json

Run: python3 scripts/generate-pixel-type.py
"""

from __future__ import annotations

import json
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

# Spec keys:
#   height    rendered cap-height in CSS px
#   block     size of the pixel-art grid cell in CSS px
#   max       max native/display width in CSS px
#   wrap      whether to wrap the heading (default true)
#   maxLines  maximum lines after fitting
#   tracking  letter-spacing as a fraction of the font size
#   weight    Cormorant variation weight for the roman run (italic one step lower)
#   mobile    optional overrides for a narrow-screen variant
DISPLAY: dict[str, dict] = {
	"header.brand": {
		"height": 24,
		"block": 2,
		"max": 330,
		"wrap": False,
		"tracking": 0.015,
		"weight": 600,
		"runs": [("common.brand", "roman")],
	},
	"hero.line1": {
		"height": 118,
		"block": 5,
		"max": 1280,
		"wrap": False,
		"tracking": 0.0,
		"weight": 580,
		"runs": [("hero.titleLine1", "roman"), ("raw: ", "roman"), ("hero.titleAccent", "italic")],
	},
	"hero.line2": {
		"height": 104,
		"block": 5,
		"max": 1280,
		"wrap": False,
		"tracking": 0.0,
		"weight": 520,
		"runs": [("hero.titleLine2", "italic")],
	},
	"section.approach": {"height": 46, "block": 2, "max": 760, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 42, "block": 2, "max": 390, "maxLines": 3}, "runs": [("approach.title", "roman"), ("raw: ", "roman"), ("approach.titleAccent", "italic")]},
	"section.services": {"height": 46, "block": 2, "max": 760, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 42, "block": 2, "max": 390, "maxLines": 3}, "runs": [("services.title", "roman"), ("raw: ", "roman"), ("services.titleAccent", "italic")]},
	"section.process": {"height": 46, "block": 2, "max": 760, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 42, "block": 2, "max": 390, "maxLines": 3}, "runs": [("process.title", "roman")]},
	"section.cases": {"height": 46, "block": 2, "max": 760, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 42, "block": 2, "max": 390, "maxLines": 3}, "runs": [("cases.title", "roman"), ("raw: ", "roman"), ("cases.titleAccent", "italic")]},
	"section.pricing": {"height": 46, "block": 2, "max": 760, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 42, "block": 2, "max": 390, "maxLines": 3}, "runs": [("pricing.title", "roman"), ("raw: ", "roman"), ("pricing.titleAccent", "italic")]},
	"section.calculator": {"height": 44, "block": 2, "max": 760, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 40, "block": 2, "max": 390, "maxLines": 3}, "runs": [("pricing.calculator.title", "roman"), ("raw: ", "roman"), ("pricing.calculator.titleAccent", "italic")]},
	"section.why": {"height": 46, "block": 2, "max": 760, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 42, "block": 2, "max": 390, "maxLines": 3}, "runs": [("why.title", "roman"), ("raw: ", "roman"), ("why.titleAccent", "italic")]},
	"section.studio": {"height": 46, "block": 2, "max": 760, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 42, "block": 2, "max": 390, "maxLines": 3}, "runs": [("studio.title", "roman"), ("raw: ", "roman"), ("studio.titleAccent", "italic")]},
	"section.faq": {"height": 46, "block": 2, "max": 760, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 42, "block": 2, "max": 390, "maxLines": 3}, "runs": [("faq.title", "roman"), ("raw: ", "roman"), ("faq.titleAccent", "italic")]},
	"section.contact": {"height": 46, "block": 2, "max": 760, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 42, "block": 2, "max": 390, "maxLines": 3}, "runs": [("contact.title", "roman"), ("raw: ", "roman"), ("contact.titleAccent", "italic")]},
	"page.services": {"height": 72, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 54, "block": 2, "max": 390, "maxLines": 2}, "runs": [("pages.services.title", "roman")]},
	"page.cases": {"height": 72, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 54, "block": 2, "max": 390, "maxLines": 2}, "runs": [("pages.cases.title", "roman")]},
	"page.pricing": {"height": 72, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 54, "block": 2, "max": 390, "maxLines": 2}, "runs": [("pages.pricing.title", "roman")]},
	"page.calculator": {"height": 72, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 54, "block": 2, "max": 390, "maxLines": 2}, "runs": [("pages.calculator.title", "roman")]},
	"page.about": {"height": 72, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 54, "block": 2, "max": 390, "maxLines": 2}, "runs": [("pages.about.title", "roman")]},
	"page.faq": {"height": 72, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 54, "block": 2, "max": 390, "maxLines": 2}, "runs": [("pages.faq.title", "roman")]},
	"page.contact": {"height": 72, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 54, "block": 2, "max": 390, "maxLines": 2}, "runs": [("pages.contact.title", "roman")]},
	"service.websites": {"height": 62, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 48, "block": 2, "max": 390, "maxLines": 2}, "runs": [("services.items[0].title", "roman")]},
	"service.bots": {"height": 62, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 48, "block": 2, "max": 390, "maxLines": 2}, "runs": [("services.items[1].title", "roman")]},
	"service.ai": {"height": 62, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 48, "block": 2, "max": 390, "maxLines": 2}, "runs": [("services.items[2].title", "roman")]},
	"service.automation": {"height": 62, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 48, "block": 2, "max": 390, "maxLines": 2}, "runs": [("services.items[3].title", "roman")]},
	"service.commerce": {"height": 62, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 48, "block": 2, "max": 390, "maxLines": 2}, "runs": [("services.items[4].title", "roman")]},
	"service.analytics": {"height": 62, "block": 2, "max": 1000, "maxLines": 2, "tracking": 0.008, "weight": 600, "mobile": {"height": 48, "block": 2, "max": 390, "maxLines": 2}, "runs": [("services.items[5].title", "roman")]},
	"case.yasna": {"height": 62, "block": 2, "max": 1000, "maxLines": 1, "tracking": 0.008, "weight": 600, "mobile": {"height": 48, "block": 2, "max": 390, "maxLines": 1}, "runs": [("cases.items[0].name", "roman")]},
	"case.central-park": {"height": 62, "block": 2, "max": 1000, "maxLines": 1, "tracking": 0.008, "weight": 600, "mobile": {"height": 48, "block": 2, "max": 390, "maxLines": 1}, "runs": [("cases.items[1].name", "roman")]},
	"case.spadchyna": {"height": 62, "block": 2, "max": 1000, "maxLines": 1, "tracking": 0.008, "weight": 600, "mobile": {"height": 48, "block": 2, "max": 390, "maxLines": 1}, "runs": [("cases.items[2].name", "roman")]},
	"case.prabot": {"height": 62, "block": 2, "max": 1000, "maxLines": 1, "tracking": 0.008, "weight": 600, "mobile": {"height": 48, "block": 2, "max": 390, "maxLines": 1}, "runs": [("cases.items[3].name", "roman")]},
	"footer.brand": {
		"height": 98,
		"block": 7,
		"max": 1600,
		"wrap": False,
		"tracking": 0.0,
		"weight": 580,
		"runs": [("common.brand", "roman")],
	},
	"page.privacy": {
		"height": 52,
		"block": 2,
		"max": 900,
		"maxLines": 2,
		"tracking": 0.008,
		"weight": 600,
		"mobile": {"height": 44, "block": 2, "max": 390, "maxLines": 3},
		"runs": [("privacy.title", "roman")],
	},
	"page.notFound": {
		"height": 58,
		"block": 3,
		"max": 900,
		"maxLines": 1,
		"tracking": 0.008,
		"weight": 600,
		"mobile": {"height": 46, "block": 2, "max": 390, "maxLines": 2},
		"runs": [("notFound.title", "roman")],
	},
}

LOCALES = [locale.strip() for locale in os.environ.get("PIXEL_TYPE_LOCALES", "ru,be,en").split(",") if locale.strip()]


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
		name, _, index = part.partition("[")
		if not isinstance(value, dict):
			raise KeyError(dotted)
		value = value[name]
		if index:
			if not isinstance(value, list):
				raise KeyError(dotted)
			value = value[int(index.rstrip("]"))]
	if not isinstance(value, str):
		raise KeyError(dotted)
	return value


def load_font(path: Path, size: int, italic: bool, weight: int) -> ImageFont.FreeTypeFont:
	font = ImageFont.truetype(str(path), size)
	variation = min(700, max(300, weight - (80 if italic else 0)))
	try:
		font.set_variation_by_axes([variation])
	except Exception:
		pass
	return font


def cap_ratio(path: Path) -> float:
	font = load_font(path, 100, False, 600)
	bbox = font.getbbox("H")
	return (bbox[3] - bbox[1]) / 100


def tracked_width(text: str, font: ImageFont.FreeTypeFont, tracking: float) -> float:
	if not text:
		return 0.0
	return sum(font.getlength(character) for character in text) + tracking * (len(text) - 1)


def draw_tracked(
	draw: ImageDraw.ImageDraw,
	x: float,
	y: float,
	text: str,
	font: ImageFont.FreeTypeFont,
	tracking: float,
	fill: int = 255,
) -> float:
	cursor = x
	for character in text:
		draw.text((cursor, y), character, font=font, fill=fill)
		cursor += font.getlength(character) + tracking
	return cursor - x


def layout_lines(
	runs: list[tuple[str, str]],
	fonts: dict[str, ImageFont.FreeTypeFont],
	max_logical_width: float,
	wrap: bool,
	tracking: float,
) -> list[list[tuple[str, str]]]:
	if not wrap:
		return [[(text, style) for text, style in runs if text]]
	lines: list[list[tuple[str, str]]] = []
	current: list[tuple[str, str]] = []
	width = 0.0
	space = tracked_width(" ", fonts["roman"], tracking)
	for text, style in runs:
		for word in text.split(" "):
			if not word:
				continue
			word_width = tracked_width(word, fonts[style], tracking)
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
	tracking: float,
) -> float:
	widest = 0.0
	for line in lines:
		width = sum(tracked_width(text, fonts[style], tracking) for text, style in line)
		widest = max(widest, width)
	return widest


def render_variant(
	text_runs: list[tuple[str, str]],
	path: Path,
	spec: dict,
	font_paths: dict,
	ratio: float,
	label: str = "",
) -> dict:
	block = spec["block"]
	height = spec["height"]
	wrap = spec.get("wrap", True)
	max_lines = spec.get("maxLines", 2 if wrap else 1)
	tracking_em = spec.get("tracking", 0.0)
	weight = spec.get("weight", 600)
	logical_cap = height / block
	base_size = max(7, round(logical_cap / ratio))
	max_logical_width = spec["max"] / block

	font_size = base_size
	lines: list[list[tuple[str, str]]] = []
	tracking = 0.0
	for _ in range(50):
		roman = load_font(font_paths["roman"], font_size, False, weight)
		italic = load_font(font_paths["italic"], font_size, True, weight)
		line_fonts = {"roman": roman, "italic": italic}
		tracking = tracking_em * font_size
		lines = layout_lines(text_runs, line_fonts, max_logical_width, wrap, tracking)
		width = measure_width(lines, line_fonts, tracking)
		if len(lines) <= max_lines and width <= max_logical_width:
			break
		font_size = max(6, int(font_size * 0.92))
	else:
		raise ValueError(f"could not fit {path.name}")

	roman = load_font(font_paths["roman"], font_size, False, weight)
	italic = load_font(font_paths["italic"], font_size, True, weight)
	line_fonts = {"roman": roman, "italic": italic}
	line_height = int(round(font_size * 1.02))
	canvas_width = int(max_logical_width) + 10
	canvas_height = line_height * len(lines) + 10
	image = Image.new("L", (canvas_width, canvas_height), 0)
	draw = ImageDraw.Draw(image)
	y = 3
	for line in lines:
		x = 3.0
		for text, style in line:
			x += draw_tracked(draw, x, y, text, line_fonts[style], tracking)
		y += line_height
	bbox = image.getbbox()
	if bbox is None:
		raise ValueError("empty mask")
	image = image.crop(bbox)
	image = image.point(lambda value: 255 if value > 88 else 0)
	image = image.resize((image.width * block, image.height * block), Image.Resampling.NEAREST)

	rgba = Image.new("RGBA", image.size, (255, 255, 255, 0))
	rgba.putalpha(image)
	path.parent.mkdir(parents=True, exist_ok=True)
	rgba.save(path, optimize=True)
	print(f"{label:26} {rgba.width:4}x{rgba.height:3}  {path.stat().st_size / 1024:5.1f} KB")
	return {
		"src": f"/type/{path.parent.name}/{path.name}",
		"width": rgba.width,
		"height": rgba.height,
		"cssWidth": rgba.width,
	}


def main() -> None:
	font_paths = ensure_fonts()
	ratio = cap_ratio(font_paths["roman"])
	manifest: dict[str, dict] = {locale: {} for locale in LOCALES}
	OUT.mkdir(parents=True, exist_ok=True)

	for locale in LOCALES:
		messages = json.loads((ROOT / "messages" / f"{locale}.json").read_text(encoding="utf-8"))
		for name, spec in DISPLAY.items():
			runs = [
				(key[4:] if key.startswith("raw:") else resolve(messages, key), style)
				for key, style in spec["runs"]
			]
			slug = name.replace(".", "-")
			desktop = render_variant(runs, OUT / locale / f"{slug}.png", spec, font_paths, ratio, f"{locale} {name}")
			entry = dict(desktop)
			mobile_spec = spec.get("mobile")
			if mobile_spec:
				mobile = {
					**spec,
					**mobile_spec,
					"runs": spec["runs"],
					"wrap": spec.get("wrap", True),
					"tracking": spec.get("tracking", 0.0),
					"weight": spec.get("weight", 600),
				}
				entry["mobile"] = render_variant(
					runs,
					OUT / locale / f"{slug}-mobile.png",
					mobile,
					font_paths,
					ratio,
					f"{locale} {name} · mobile",
				)
			manifest[locale][name] = entry
	MANIFEST.parent.mkdir(parents=True, exist_ok=True)
	MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent="\t") + "\n", encoding="utf-8")
	print(f"wrote {MANIFEST.relative_to(ROOT)}")


if __name__ == "__main__":
	main()
