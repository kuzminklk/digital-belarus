'use client';

import {useId} from 'react';
import styles from './Rushnyk.module.css';

export type RushnykVariant = 'border' | 'divider' | 'wave';
export type RushnykTone = 'paper' | 'red' | 'muted';

type RushnykProps = {
	variant?: RushnykVariant;
	tone?: RushnykTone;
	height?: number;
	animated?: boolean;
	className?: string;
};

const TILE_HEIGHT = 16;

type Grid = {width: number; pixels: Array<[number, number]>};

function diamond(cells: Set<number>, cx: number, cy: number, radius: number, width: number) {
	for (let dy = -radius; dy <= radius; dy += 1) {
		const dx = radius - Math.abs(dy);
		for (const x of [cx - dx, cx + dx]) {
			const y = cy + dy;
			if (x >= 0 && y >= 0) cells.add(y * width + x);
		}
	}
}

/**
 * v2 `border`: two hairline rails holding a chain of woven rhombi with single
 * stitch dots between them. Thin enough to read as an embroidered rule rather
 * than a decorative band.
 */
function buildBorder(): Grid {
	const width = 48;
	const cells = new Set<number>();
	const put = (x: number, y: number) => {
		if (x >= 0 && x < width && y >= 0 && y < TILE_HEIGHT) cells.add(y * width + x);
	};

	for (let x = 0; x < width; x += 1) {
		put(x, 2);
		put(x, 13);
	}
	for (const cx of [8, 24, 40]) diamond(cells, cx, 8, 2, width);
	for (const x of [16, 32]) put(x, 8);

	return {
		width,
		pixels: [...cells].map((value) => [value % width, Math.floor(value / width)]),
	};
}

/**
 * v2 `divider`: one central hairline interrupted by a single large woven
 * rhombus, with two small side diamonds marking the tile rhythm.
 */
function buildDivider(): Grid {
	const width = 64;
	const cells = new Set<number>();
	const put = (x: number, y: number) => {
		if (x >= 0 && x < width && y >= 0 && y < TILE_HEIGHT) cells.add(y * width + x);
	};

	for (let x = 0; x < width; x += 1) {
		if (x < 27 || x > 37) put(x, 7);
	}
	diamond(cells, 32, 7, 3, width);
	diamond(cells, 8, 7, 1, width);
	diamond(cells, 56, 7, 1, width);

	return {
		width,
		pixels: [...cells].map((value) => [value % width, Math.floor(value / width)]),
	};
}

/**
 * v2 `wave`: a single stepped thread, two modules of amplitude, repeating every
 * 16 modules. The endless line of rushnyk edges, reduced to one hairline.
 */
function buildWave(): Grid {
	const width = 64;
	const cells = new Set<number>();
	const sequence = [7, 7, 7, 8, 8, 8, 9, 9, 9, 8, 8, 8, 7, 7, 7, 6];

	for (let x = 0; x < width; x += 1) {
		const y = sequence[x % sequence.length];
		cells.add(y * width + x);
	}

	return {
		width,
		pixels: [...cells].map((value) => [value % width, Math.floor(value / width)]),
	};
}

const TILES: Record<RushnykVariant, Grid> = {
	border: buildBorder(),
	divider: buildDivider(),
	wave: buildWave(),
};

const TONE_CLASS: Record<RushnykTone, string> = {
	paper: styles.paper,
	red: styles.paper,
	muted: styles.muted,
};

/**
 * Thin two-tone embroidered rule. The pattern is painted in `currentColor`, so
 * it is cream on an ink surface and ink on a cream surface without any colour
 * prop; the tone only controls emphasis. Decorative and never focusable.
 */
export default function Rushnyk({
	variant = 'border',
	tone = 'muted',
	height = 24,
	animated = false,
	className,
}: RushnykProps) {
	const rawId = useId();
	const patternId = `rushnyk-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
	const tile = TILES[variant];
	const scale = height / TILE_HEIGHT;

	return (
		<svg
			className={`${styles.rushnyk} ${TONE_CLASS[tone]} ${animated ? styles.animated : ''} ${
				className ?? ''
			}`}
			width="100%"
			height={height}
			role="presentation"
			aria-hidden="true"
			focusable="false"
			shapeRendering="crispEdges"
		>
			<defs>
				<pattern
					id={patternId}
					width={tile.width * scale}
					height={TILE_HEIGHT * scale}
					patternUnits="userSpaceOnUse"
				>
					{tile.pixels.map(([x, y]) => (
						<rect
							key={`${x}-${y}`}
							x={x * scale}
							y={y * scale}
							width={scale}
							height={scale}
							fill="currentColor"
						/>
					))}
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${patternId})`} />
		</svg>
	);
}
