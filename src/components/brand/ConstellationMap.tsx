'use client';

/**
 * ConstellationMap — the hero instrument.
 *
 * A scientific star chart of Belarus drawn as a constellation: the national
 * outline becomes a chain of pixel stars, Minsk becomes a pulsing reticle, and
 * a graduated orbit ring, viewfinder corners, neighbour codes and a scale bar
 * turn the drawing into an observatory read-out. Everything is deterministic
 * (seeded starfield, no `Math.random`), pure inline SVG and decorative: the
 * component is hidden from assistive technology and cannot receive focus.
 *
 * Motion policy: slow orbit rotation, discrete twinkles and a subtle Lissajous
 * drift run by default; pointer parallax (max 6px) is attached only for fine
 * pointers; all of it stops for `prefers-reduced-motion: reduce`.
 */

import {useEffect, useId, useRef} from 'react';
import type {RefObject} from 'react';
import {BELARUS_BOUNDS, BELARUS_OUTLINE, MINSK, NEIGHBOURS} from '@/content/belarus-outline';
import styles from './ConstellationMap.module.css';

export type ConstellationMapProps = {
	className?: string;
	/** `vivid` adds the outer read-outs and a denser starfield. Default `subtle`. */
	intensity?: 'subtle' | 'vivid';
};

type Point = readonly [number, number];

/* -------------------------------------------------------------------------- */
/* Chart geometry                                                             */
/* -------------------------------------------------------------------------- */

const VIEW = 640;
const CENTER = VIEW / 2;
const PADDING = 56;
const ORBIT_RADIUS = 288;

const LON_SPAN = BELARUS_BOUNDS.maxLon - BELARUS_BOUNDS.minLon;
const LAT_SPAN = BELARUS_BOUNDS.maxLat - BELARUS_BOUNDS.minLat;

/** Equirectangular projection, uniformly fitted into the padded square. */
const MAP_SCALE = Math.min((VIEW - PADDING * 2) / LON_SPAN, (VIEW - PADDING * 2) / LAT_SPAN);
const MAP_WIDTH = LON_SPAN * MAP_SCALE;
const MAP_HEIGHT = LAT_SPAN * MAP_SCALE;
const MAP_X = CENTER - MAP_WIDTH / 2;
const MAP_Y = CENTER - MAP_HEIGHT / 2;

function project(longitude: number, latitude: number): Point {
	return [
		MAP_X + (longitude - BELARUS_BOUNDS.minLon) * MAP_SCALE,
		MAP_Y + (BELARUS_BOUNDS.maxLat - latitude) * MAP_SCALE,
	];
}

const CONSTELLATION: ReadonlyArray<Point> = BELARUS_OUTLINE.map(([lon, lat]) => project(lon, lat));

const MINSK_POINT = project(MINSK[0], MINSK[1]);

const CENTROID: Point = (() => {
	let x = 0;
	let y = 0;
	for (const point of CONSTELLATION) {
		x += point[0];
		y += point[1];
	}
	return [x / CONSTELLATION.length, y / CONSTELLATION.length];
})();

const CONSTELLATION_PATH = CONSTELLATION.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(
	' ',
);

const MINSK_COORDS = `${MINSK[1].toFixed(2)}°N ${MINSK[0].toFixed(2)}°E`;
/** 100 km in projected pixels (1° of latitude ≈ 111.32 km). */
const SCALE_BAR_PX = (100 / 111.32) * MAP_SCALE;

/* -------------------------------------------------------------------------- */
/* Seeded randomness (identical on server and client)                         */
/* -------------------------------------------------------------------------- */

function mulberry32(seed: number): () => number {
	let value = seed >>> 0;
	return () => {
		value = (value + 0x6d2b79f5) >>> 0;
		let t = value;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function isInsideOutline(point: Point, polygon: ReadonlyArray<Point>): boolean {
	const [px, py] = point;
	let inside = false;
	for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
		const [xi, yi] = polygon[i];
		const [xj, yj] = polygon[j];
		const crosses = yi > py !== yj > py;
		if (crosses && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
			inside = !inside;
		}
	}
	return inside;
}

function distanceToSegment(point: Point, a: Point, b: Point): number {
	const dx = b[0] - a[0];
	const dy = b[1] - a[1];
	const lengthSquared = dx * dx + dy * dy;
	let t =
		lengthSquared === 0 ? 0 : ((point[0] - a[0]) * dx + (point[1] - a[1]) * dy) / lengthSquared;
	t = Math.max(0, Math.min(1, t));
	const x = a[0] + t * dx - point[0];
	const y = a[1] + t * dy - point[1];
	return Math.hypot(x, y);
}

function distanceToOutline(point: Point, polygon: ReadonlyArray<Point>): number {
	let best = Number.POSITIVE_INFINITY;
	for (let i = 0; i < polygon.length - 1; i++) {
		const distance = distanceToSegment(point, polygon[i], polygon[i + 1]);
		if (distance < best) best = distance;
	}
	return best;
}

type Star = {
	readonly x: number;
	readonly y: number;
	readonly size: number;
	readonly opacity: number;
	readonly twinkles: boolean;
	readonly delay: number;
};

function createStarfield(count: number, seed: number): ReadonlyArray<Star> {
	const random = mulberry32(seed);
	const stars: Star[] = [];
	let attempts = 0;
	const limit = count * 40;
	while (stars.length < count && attempts < limit) {
		attempts++;
		const point: Point = [
			PADDING * 0.35 + random() * (VIEW - PADDING * 0.7),
			PADDING * 0.35 + random() * (VIEW - PADDING * 0.7),
		];
		if (isInsideOutline(point, CONSTELLATION)) continue;
		if (distanceToOutline(point, CONSTELLATION) < 10) continue;
		const orbitDistance = Math.hypot(point[0] - CENTER, point[1] - CENTER);
		if (Math.abs(orbitDistance - ORBIT_RADIUS) < 7) continue;
		if (Math.hypot(point[0] - MINSK_POINT[0], point[1] - MINSK_POINT[1]) < 34) continue;
		const sizeRoll = random();
		stars.push({
			x: Math.round(point[0]) + 0.5,
			y: Math.round(point[1]) + 0.5,
			size: sizeRoll > 0.86 ? 2 : 1,
			opacity: 0.16 + random() * 0.6,
			twinkles: stars.length % 3 === 0,
			delay: Number(((stars.length * 0.83) % 9.7).toFixed(2)),
		});
	}
	return stars;
}

const STARFIELD = createStarfield(140, 0x5eed1a);

/* -------------------------------------------------------------------------- */
/* Orbit ring ticks                                                           */
/* -------------------------------------------------------------------------- */

type OrbitTick = {
	readonly key: number;
	readonly x1: number;
	readonly y1: number;
	readonly x2: number;
	readonly y2: number;
	readonly major: boolean;
	readonly cardinal: boolean;
};

const ORBIT_TICKS: ReadonlyArray<OrbitTick> = Array.from({length: 72}, (_, index) => {
	const angle = (index / 72) * Math.PI * 2 - Math.PI / 2;
	const cardinal = index % 18 === 0;
	const major = index % 6 === 0;
	const outer = ORBIT_RADIUS + (cardinal ? 17 : major ? 11 : 4);
	const cos = Math.cos(angle);
	const sin = Math.sin(angle);
	return {
		key: index,
		x1: CENTER + cos * ORBIT_RADIUS,
		y1: CENTER + sin * ORBIT_RADIUS,
		x2: CENTER + cos * outer,
		y2: CENTER + sin * outer,
		major,
		cardinal,
	};
});

const DEGREE_LABELS: ReadonlyArray<{key: string; x: number; y: number}> = [
	{key: '000', x: CENTER, y: CENTER - ORBIT_RADIUS - 26},
	{key: '090', x: CENTER + ORBIT_RADIUS + 30, y: CENTER + 3},
	{key: '180', x: CENTER, y: CENTER + ORBIT_RADIUS + 32},
	{key: '270', x: CENTER - ORBIT_RADIUS - 30, y: CENTER + 3},
];

/* -------------------------------------------------------------------------- */
/* Neighbour labels                                                           */
/* -------------------------------------------------------------------------- */

type NeighbourLabel = {
	readonly code: string;
	readonly x: number;
	readonly y: number;
	readonly anchor: 'start' | 'middle' | 'end';
};

function clamp(value: number, min: number, max: number): number {
	return Math.max(min, Math.min(max, value));
}

const NEIGHBOUR_LABELS: ReadonlyArray<NeighbourLabel> = NEIGHBOURS.map((neighbour) => {
	const projected = project(neighbour.longitude, neighbour.latitude);
	const dx = projected[0] - CENTROID[0];
	const dy = projected[1] - CENTROID[1];
	const length = Math.hypot(dx, dy) || 1;
	const x = clamp(projected[0] + (dx / length) * 32, 20, VIEW - 20);
	const y = clamp(projected[1] + (dy / length) * 30, 34, VIEW - 24);
	const anchor: NeighbourLabel['anchor'] = x < 76 ? 'start' : x > VIEW - 76 ? 'end' : 'middle';
	return {code: neighbour.code, x, y, anchor};
});

/* -------------------------------------------------------------------------- */
/* Small helpers                                                              */
/* -------------------------------------------------------------------------- */

function mergeClassNames(...values: Array<string | false | null | undefined>): string {
	return values.filter((value): value is string => Boolean(value)).join(' ');
}

function snap(value: number): number {
	return Math.round(value) + 0.5;
}

const MINSK_VERTICES: ReadonlyArray<Point> = [2, 14, 30].map((index) => CONSTELLATION[index]);

/**
 * Pointer parallax: writes eased offsets into CSS custom properties on the SVG
 * so React never re-renders on pointer moves. Fine pointers only; bails out for
 * reduced motion. Offsets are capped at 6px on the root layer.
 */
function usePointerParallax(ref: RefObject<SVGSVGElement | null>): void {
	useEffect(() => {
		const svg = ref.current;
		if (!svg) return;
		if (!window.matchMedia('(pointer: fine)').matches) return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		let frame = 0;
		let targetX = 0;
		let targetY = 0;
		let currentX = 0;
		let currentY = 0;

		const tick = (): void => {
			currentX += (targetX - currentX) * 0.09;
			currentY += (targetY - currentY) * 0.09;
			svg.style.setProperty('--cm-px', `${currentX.toFixed(3)}px`);
			svg.style.setProperty('--cm-py', `${currentY.toFixed(3)}px`);
			const settled =
				Math.abs(targetX - currentX) < 0.02 && Math.abs(targetY - currentY) < 0.02;
			frame = settled ? 0 : window.requestAnimationFrame(tick);
		};

		const start = (): void => {
			if (!frame) frame = window.requestAnimationFrame(tick);
		};

		const handleMove = (event: PointerEvent): void => {
			const rect = svg.getBoundingClientRect();
			if (rect.width === 0 || rect.height === 0) return;
			const nx = clamp(((event.clientX - rect.left) / rect.width) * 2 - 1, -1, 1);
			const ny = clamp(((event.clientY - rect.top) / rect.height) * 2 - 1, -1, 1);
			targetX = nx * 6;
			targetY = ny * 6;
			start();
		};

		const handleLeave = (): void => {
			targetX = 0;
			targetY = 0;
			start();
		};

		svg.addEventListener('pointermove', handleMove);
		svg.addEventListener('pointerleave', handleLeave);
		return () => {
			svg.removeEventListener('pointermove', handleMove);
			svg.removeEventListener('pointerleave', handleLeave);
			if (frame) window.cancelAnimationFrame(frame);
			svg.style.removeProperty('--cm-px');
			svg.style.removeProperty('--cm-py');
		};
	}, [ref]);
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function ConstellationMap({className, intensity = 'subtle'}: ConstellationMapProps) {
	const svgRef = useRef<SVGSVGElement | null>(null);
	const rawId = useId();
	const gradientId = `cm-vignette-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
	usePointerParallax(svgRef);

	const vivid = intensity === 'vivid';
	const stars = vivid ? STARFIELD : STARFIELD.slice(0, 68);

	return (
		<div className={mergeClassNames(styles.root, className)} data-intensity={intensity}>
			<svg
				ref={svgRef}
				className={styles.svg}
				viewBox={`0 0 ${VIEW} ${VIEW}`}
				role="presentation"
				aria-hidden="true"
				focusable="false"
			>
				<defs>
					<radialGradient id={gradientId} cx="50%" cy="47%" r="66%">
						<stop offset="0%" className={styles.vignetteCenter} />
						<stop offset="72%" className={styles.vignetteMiddle} />
						<stop offset="100%" className={styles.vignetteEdge} />
					</radialGradient>
				</defs>

				{/* Sky wash: keeps the instrument grounded without hiding the chart. */}
				<rect x={0} y={0} width={VIEW} height={VIEW} fill={`url(#${gradientId})`} />

				{/* Drifting sky and instrument layers. */}
				<g className={styles.drift}>
					<g className={styles.parallaxFar}>
						<g className={styles.starfield} opacity={vivid ? 0.95 : 0.62}>
							{stars.map((star, index) => (
								<rect
									key={`star-${index}`}
									className={star.twinkles ? styles.starTwinkle : styles.star}
									x={star.x - star.size / 2}
									y={star.y - star.size / 2}
									width={star.size}
									height={star.size}
									opacity={star.opacity}
									style={
										star.twinkles
											? {animationDelay: `${star.delay}s`}
											: undefined
									}
								/>
							))}
						</g>
					</g>

					<g className={styles.parallaxNear}>
						{/* Graduated orbit ring. */}
						<circle
							cx={CENTER}
							cy={CENTER}
							r={ORBIT_RADIUS}
							className={styles.orbitHairline}
						/>
						<g>
							{ORBIT_TICKS.map((tick) => (
								<line
									key={`tick-${tick.key}`}
									className={
										tick.cardinal
											? styles.tickCardinal
											: tick.major
												? styles.tickMajor
												: styles.tick
									}
									x1={tick.x1}
									y1={tick.y1}
									x2={tick.x2}
									y2={tick.y2}
								/>
							))}
						</g>
						{vivid && (
							<g>
								{DEGREE_LABELS.map((label) => (
									<text
										key={`degree-${label.key}`}
										className={styles.degreeLabel}
										x={label.x}
										y={label.y}
										textAnchor="middle"
										dominantBaseline="middle"
									>
										{label.key}
									</text>
								))}
							</g>
						)}

						{/* Slow dashed orbit with a single red marker. */}
						<g transform={`translate(${CENTER} ${CENTER})`}>
							<g className={styles.orbitSpin}>
								<circle r={250} className={styles.orbitDash} />
								<rect
									x={-1}
									y={-251}
									width={2}
									height={2}
									className={styles.orbitMarker}
								/>
							</g>
						</g>
					</g>
				</g>

				{/* Belarus as a constellation. */}
				<g>
					<g className={styles.parallaxSubject}>
						<polyline
							className={styles.constellationLine}
							points={CONSTELLATION_PATH}
							fill="none"
						/>
						{MINSK_VERTICES.map((vertex, index) => (
							<line
								key={`sightline-${index}`}
								className={styles.sightline}
								x1={MINSK_POINT[0]}
								y1={MINSK_POINT[1]}
								x2={vertex[0]}
								y2={vertex[1]}
							/>
						))}
						{CONSTELLATION.map((vertex, index) => {
							const x = snap(vertex[0]);
							const y = snap(vertex[1]);
							const major = index % 6 === 0;
							if (!major) {
								return (
									<g key={`vertex-${index}`} className={styles.vertex}>
										<rect x={x - 0.5} y={y - 0.5} width={1} height={1} />
										<rect
											x={x - 1.5}
											y={y - 0.5}
											width={1}
											height={1}
											opacity={0.35}
										/>
										<rect
											x={x + 0.5}
											y={y - 0.5}
											width={1}
											height={1}
											opacity={0.35}
										/>
										<rect
											x={x - 0.5}
											y={y - 1.5}
											width={1}
											height={1}
											opacity={0.35}
										/>
										<rect
											x={x - 0.5}
											y={y + 0.5}
											width={1}
											height={1}
											opacity={0.35}
										/>
									</g>
								);
							}
							return (
								<g key={`vertex-${index}`} className={styles.vertexMajor}>
									<rect x={x - 0.5} y={y - 1.5} width={1} height={1} />
									<rect x={x - 1.5} y={y - 0.5} width={1} height={1} />
									<rect x={x - 0.5} y={y - 0.5} width={1} height={1} />
									<rect x={x + 0.5} y={y - 0.5} width={1} height={1} />
									<rect x={x - 0.5} y={y + 0.5} width={1} height={1} />
								</g>
							);
						})}
					</g>
				</g>

				{/* Minsk reticle. */}
				<g
					transform={`translate(${MINSK_POINT[0].toFixed(2)} ${MINSK_POINT[1].toFixed(2)})`}
				>
					<circle r={7} className={styles.pulseRing} />
					<circle r={7} className={styles.pulseRingLate} />
					<g className={styles.crosshair}>
						<line x1={-14} y1={0} x2={-7} y2={0} />
						<line x1={7} y1={0} x2={14} y2={0} />
						<line x1={0} y1={-14} x2={0} y2={-7} />
						<line x1={0} y1={7} x2={0} y2={14} />
					</g>
					<rect x={-1.5} y={-1.5} width={3} height={3} className={styles.minskCore} />
					<g>
						<path
							className={styles.minskLeader}
							d="M 11 11 L 27 27 L 38 27"
							fill="none"
						/>
						<text x={11} y={43} className={styles.labelTitle}>
							MINSK
						</text>
						<text x={11} y={56} className={styles.labelCoords}>
							{MINSK_COORDS}
						</text>
					</g>
				</g>

				{/* Neighbouring country codes. */}
				<g>
					{NEIGHBOUR_LABELS.map((neighbour) => (
						<text
							key={`neighbour-${neighbour.code}`}
							className={styles.neighbourLabel}
							x={neighbour.x}
							y={neighbour.y}
							textAnchor={neighbour.anchor}
						>
							{neighbour.code}
						</text>
					))}
				</g>

				{/* Viewfinder corners. */}
				<g className={styles.viewfinder}>
					<path d="M 16 42 V 16 H 42" />
					<path d={`M ${VIEW - 42} 16 H ${VIEW - 16} V 42`} />
					<path d={`M 16 ${VIEW - 42} V ${VIEW - 16} H 42`} />
					<path d={`M ${VIEW - 42} ${VIEW - 16} H ${VIEW - 16} V ${VIEW - 42}`} />
					<path d="M 26 36 V 26 H 36" className={styles.viewfinderInner} />
					<path
						d={`M ${VIEW - 36} 26 H ${VIEW - 26} V 36`}
						className={styles.viewfinderInner}
					/>
					<path
						d={`M 26 ${VIEW - 36} V ${VIEW - 26} H 36`}
						className={styles.viewfinderInner}
					/>
					<path
						d={`M ${VIEW - 36} ${VIEW - 26} H ${VIEW - 26} V ${VIEW - 36}`}
						className={styles.viewfinderInner}
					/>
				</g>

				{/* Bottom instrument read-outs (the page HUD owns the top corners). */}
				<g className={styles.readout}>
					{/* North indicator. */}
					<g className={styles.north}>
						<text
							x={VIEW - 46}
							y={VIEW - 66}
							className={styles.readoutMeta}
							textAnchor="end"
						>
							N
						</text>
						<path d={`M ${VIEW - 48} ${VIEW - 58} V ${VIEW - 36}`} />
						<path
							d={`M ${VIEW - 52} ${VIEW - 44} L ${VIEW - 48} ${VIEW - 36} L ${VIEW - 44} ${VIEW - 44}`}
						/>
					</g>

					{/* 100 km scale bar. */}
					<g className={styles.scaleBar}>
						<text x={40} y={VIEW - 66} className={styles.readoutMeta}>
							SCALE
						</text>
						<line x1={40} y1={VIEW - 52} x2={40 + SCALE_BAR_PX} y2={VIEW - 52} />
						<line x1={40} y1={VIEW - 56} x2={40} y2={VIEW - 48} />
						<line
							x1={40 + SCALE_BAR_PX}
							y1={VIEW - 56}
							x2={40 + SCALE_BAR_PX}
							y2={VIEW - 48}
						/>
						<text x={40} y={VIEW - 38} className={styles.readoutValue}>
							0
						</text>
						<text
							x={40 + SCALE_BAR_PX}
							y={VIEW - 38}
							className={styles.readoutValue}
							textAnchor="end"
						>
							100 KM
						</text>
					</g>
				</g>
			</svg>
		</div>
	);
}

export default ConstellationMap;
