import styles from './OrnamentField.module.css';

export type OrnamentFieldProps = {
	/** `corners` places four woven corner brackets; `tile` fills the surface. */
	variant?: 'corners' | 'tile';
	className?: string;
};

/**
 * Extremely low-contrast ornament for section corners and edges.
 *
 * The field is not a picture: it is a background texture that should be felt
 * rather than read. It renders as a position:absolute, pointer-transparent
 * layer, so the parent section only needs `position: relative` and the content
 * needs to sit above it. Everything is inline SVG on a strict pixel grid, is
 * hidden from assistive technology and is never focusable.
 */

const CORNER_GRID = 32;
const CORNER_CELLS = buildCornerCells();
const TILE_GRID = 16;
const TILE_CELL = 4;
const TILE_CELLS = buildTileCells();

type Cell = readonly [number, number];

/** Woven right-angle bracket for the top-left corner (32×32 modules). */
function buildCornerCells(): ReadonlyArray<Cell> {
	const cells = new Set<string>();
	const put = (x: number, y: number): void => {
		if (x >= 0 && x < CORNER_GRID && y >= 0 && y < CORNER_GRID) {
			cells.add(`${x}:${y}`);
		}
	};

	// Anchor square in the very corner.
	for (let x = 0; x <= 1; x += 1) {
		for (let y = 0; y <= 1; y += 1) put(x, y);
	}

	// Dashed "stitch" edges, period 6: three woven modules, three empty.
	for (let i = 1; i < CORNER_GRID; i += 1) {
		if (i % 6 < 3) {
			put(i, 1);
			put(1, i);
		}
	}

	// Inner continuous bracket, inset by three modules.
	for (let i = 7; i <= 22; i += 1) {
		put(i, 4);
		put(4, i);
	}
	// Hooks: turn the bracket ends back towards the corner.
	put(22, 5);
	put(5, 22);

	// Two parallel woven diagonals (the "threads" of the corner motif).
	for (let i = 0; i <= 11; i += 1) {
		put(5 + i, 15 - i);
		put(6 + i, 15 - i);
	}
	for (let i = 0; i <= 7; i += 1) {
		put(10 + i, 21 - i);
		put(11 + i, 21 - i);
	}

	// Small rushnyk star on the diagonal.
	for (let dx = -3; dx <= 3; dx += 1) {
		const dy = 3 - Math.abs(dx);
		put(23 + dx, 23 + dy);
		put(23 + dx, 23 - dy);
	}
	for (const [dx, dy] of [
		[0, 0],
		[-1, 0],
		[1, 0],
		[0, -1],
		[0, 1],
	]) {
		put(23 + dx, 23 + dy);
	}

	// Loose stitch ticks.
	put(27, 5);
	put(5, 27);
	put(17, 3);
	put(3, 17);

	return [...cells].map((key) => {
		const [x, y] = key.split(':').map(Number);
		return [x, y] as const;
	});
}

/** Seamless diamond-lattice tile, 16×16 modules at a 4px module size. */
function buildTileCells(): ReadonlyArray<Cell> {
	const cells: Cell[] = [];
	for (let y = 0; y < TILE_GRID; y += 1) {
		for (let x = 0; x < TILE_GRID; x += 1) {
			const forward = (x + y) % 8 === 0;
			const backward = (x - y + TILE_GRID * 2) % 8 === 0;
			if (forward || backward) cells.push([x, y]);
		}
	}
	// A small woven rhombus in the middle of every tile.
	for (let dx = -2; dx <= 2; dx += 1) {
		const dy = 2 - Math.abs(dx);
		cells.push([8 + dx, 8 + dy], [8 + dx, 8 - dy]);
	}
	return cells;
}

function mergeClassNames(...values: Array<string | false | null | undefined>): string {
	return values.filter((value): value is string => Boolean(value)).join(' ');
}

function CornerMotif({mirrorX, mirrorY}: {mirrorX: boolean; mirrorY: boolean}) {
	return (
		<svg
			className={styles.cornerSvg}
			viewBox={`0 0 ${CORNER_GRID} ${CORNER_GRID}`}
			role="presentation"
			aria-hidden="true"
			focusable="false"
			shapeRendering="crispEdges"
		>
			{CORNER_CELLS.map(([x, y]) => (
				<rect
					key={`${x}-${y}`}
					x={mirrorX ? CORNER_GRID - 1 - x : x}
					y={mirrorY ? CORNER_GRID - 1 - y : y}
					width={1}
					height={1}
					fill="currentColor"
				/>
			))}
		</svg>
	);
}

function TileField() {
	return (
		<svg
			className={styles.tileSvg}
			role="presentation"
			aria-hidden="true"
			focusable="false"
			shapeRendering="crispEdges"
		>
			<defs>
				<pattern
					id="ornament-field-tile"
					width={TILE_GRID * TILE_CELL}
					height={TILE_GRID * TILE_CELL}
					patternUnits="userSpaceOnUse"
				>
					{TILE_CELLS.map(([x, y]) => (
						<rect
							key={`${x}-${y}`}
							x={x * TILE_CELL}
							y={y * TILE_CELL}
							width={TILE_CELL}
							height={TILE_CELL}
							fill="currentColor"
						/>
					))}
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#ornament-field-tile)" />
		</svg>
	);
}

export default function OrnamentField({variant = 'corners', className}: OrnamentFieldProps) {
	return (
		<div
			className={mergeClassNames(styles.root, styles[variant], className)}
			aria-hidden="true"
		>
			{variant === 'tile' ? (
				<TileField />
			) : (
				<>
					<div className={styles.slotTopLeft}>
						<CornerMotif mirrorX={false} mirrorY={false} />
					</div>
					<div className={styles.slotTopRight}>
						<CornerMotif mirrorX mirrorY={false} />
					</div>
					<div className={styles.slotBottomLeft}>
						<CornerMotif mirrorX={false} mirrorY />
					</div>
					<div className={styles.slotBottomRight}>
						<CornerMotif mirrorX mirrorY />
					</div>
				</>
			)}
		</div>
	);
}
