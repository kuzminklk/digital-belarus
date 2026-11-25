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

function diamond(target: Set<number>, cx: number, cy: number, radius: number, width: number) {
	for (let dx = -radius; dx <= radius; dx += 1) {
		for (let dy = -radius; dy <= radius; dy += 1) {
			if (Math.abs(dx) + Math.abs(dy) === radius) {
				const x = cx + dx;
				const y = cy + dy;
				if (x >= 0 && y >= 0) target.add(y * width + x);
			}
		}
	}
}

function buildBorder(): Grid {
	const width = 48;
	const cells = new Set<number>();
	const put = (x: number, y: number) => {
		if (x >= 0 && x < width && y >= 0 && y < TILE_HEIGHT) cells.add(y * width + x);
	};

	for (let x = 0; x < width; x += 1) {
		put(x, 1);
		put(x, 14);
	}

	const star = (cx: number, cy: number, radius: number) => {
		for (let i = 0; i <= radius; i += 1) {
			put(cx, cy - i);
			put(cx, cy + i);
			put(cx - i, cy);
			put(cx + i, cy);
		}
		for (let i = 1; i < radius - 1; i += 1) {
			put(cx + i, cy + i);
			put(cx - i, cy + i);
			put(cx + i, cy - i);
			put(cx - i, cy - i);
		}
		for (let dx = -2; dx <= 2; dx += 1) {
			for (let dy = -2; dy <= 2; dy += 1) {
				if (Math.abs(dx) + Math.abs(dy) === 2) put(cx + dx, cy + dy);
			}
		}
	};

	star(24, 8, 4);
	diamond(cells, 8, 8, 3, width);
	diamond(cells, 8, 8, 1, width);
	diamond(cells, 40, 8, 3, width);
	diamond(cells, 40, 8, 1, width);

	for (const cx of [16, 32]) {
		put(cx, 5);
		put(cx, 11);
	}

	return {
		width,
		pixels: [...cells].map((value) => [value % width, Math.floor(value / width)]),
	};
}

function buildDivider(): Grid {
	const width = 64;
	const cells = new Set<number>();
	const put = (x: number, y: number) => {
		if (x >= 0 && x < width && y >= 0 && y < TILE_HEIGHT) cells.add(y * width + x);
	};

	for (let x = 0; x < 23; x += 1) put(x, 8);
	for (let x = 42; x < width; x += 1) put(x, 8);

	const cx = 32;
	const cy = 8;
	const radius = 5;
	for (let i = 0; i <= radius; i += 1) {
		put(cx, cy - i);
		put(cx, cy + i);
		put(cx - i, cy);
		put(cx + i, cy);
	}
	for (let i = 1; i < radius - 1; i += 1) {
		put(cx + i, cy + i);
		put(cx - i, cy + i);
		put(cx + i, cy - i);
		put(cx - i, cy - i);
	}
	for (let dx = -2; dx <= 2; dx += 1) {
		for (let dy = -2; dy <= 2; dy += 1) {
			if (Math.abs(dx) + Math.abs(dy) === 2) put(cx + dx, cy + dy);
		}
	}

	return {
		width,
		pixels: [...cells].map((value) => [value % width, Math.floor(value / width)]),
	};
}

function buildWave(): Grid {
	const width = 64;
	const cells = new Set<number>();
	const path: Array<[number, number]> = [];
	const segment = (x1: number, y1: number, x2: number, y2: number) => {
		if (x1 === x2) {
			for (let y = Math.min(y1, y2); y <= Math.max(y1, y2); y += 1) path.push([x1, y]);
		} else {
			for (let x = Math.min(x1, x2); x <= Math.max(x1, x2); x += 1) path.push([x, y1]);
		}
	};

	for (let k = 0; k < 4; k += 1) {
		const x = k * 16;
		segment(x, 12, x + 4, 12);
		segment(x + 4, 12, x + 4, 4);
		segment(x + 4, 4, x + 10, 4);
		segment(x + 10, 4, x + 10, 12);
		segment(x + 10, 12, x + 16, 12);
	}

	for (const [x, y] of path) {
		for (const dy of [0, 1]) {
			const py = y + dy;
			if (x >= 0 && x < width && py >= 0 && py < TILE_HEIGHT) cells.add(py * width + x);
		}
	}

	for (const cx of [4, 20, 36, 52]) {
		diamond(cells, cx, 8, 2, width);
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

const TONE_COLOR: Record<RushnykTone, string> = {
	paper: 'var(--paper)',
	red: 'var(--red)',
	muted: 'var(--muted)',
};

/**
 * A seamless pixel-rushnyk strip. Renders as an SVG <pattern> so it can stretch
 * across any container while staying on the pixel grid.
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
			className={`${styles.rushnyk} ${animated ? styles.animated : ''} ${className ?? ''}`}
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
							fill={TONE_COLOR[tone]}
						/>
					))}
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill={`url(#${patternId})`} />
		</svg>
	);
}
