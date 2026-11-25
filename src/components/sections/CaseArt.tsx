import styles from './CaseArt.module.css';

type CaseArtProps = {
	index: number;
};

/** Deterministic starfield shared by all four generated illustrations. */
const STARS: ReadonlyArray<readonly [number, number, number]> = [
	[34, 38, 1.1],
	[62, 24, 0.8],
	[96, 44, 1.3],
	[128, 26, 0.7],
	[172, 34, 1],
	[206, 22, 0.8],
	[248, 40, 1.2],
	[286, 30, 0.7],
	[24, 74, 0.7],
	[76, 70, 0.9],
	[118, 66, 0.7],
	[198, 64, 0.8],
	[268, 68, 0.9],
	[44, 116, 0.8],
	[302, 88, 1],
	[290, 132, 0.8],
	[254, 158, 0.7],
	[210, 176, 0.9],
	[160, 168, 0.7],
	[110, 182, 0.8],
	[70, 166, 0.7],
	[28, 152, 0.9],
	[38, 108, 0.7],
	[300, 176, 1],
];

function JourneyArt() {
	return (
		<g>
			<g className={styles.faint}>
				<path d="M80 22v156M160 18v164M240 22v156" className={styles.stroke} />
				<path d="M80 22h4M160 18h4M240 22h4" className={styles.stroke} />
			</g>
			<circle cx="160" cy="102" r="58" className={styles.stroke} />
			<circle cx="160" cy="102" r="86" className={styles.strokeFaint} />
			<path d="M160 36v12M160 156v12M94 102h12M214 102h12" className={styles.stroke} />
			<path
				d="M96 44 128 26 172 34 206 22 248 40 268 68"
				className={styles.stroke}
				strokeDasharray="2 4"
			/>
			<rect x="157" y="99" width="6" height="6" className={styles.fillRed} />
			<path d="M120 140l16-20 14 12 18-26" className={styles.strokeRed} />
			<circle cx="120" cy="140" r="2" className={styles.fillPaper} />
			<circle cx="168" cy="106" r="2" className={styles.fillPaper} />
		</g>
	);
}

function CafeArt() {
	return (
		<g>
			<path d="M0 138h320" className={styles.stroke} />
			<g className={styles.strokeFaint}>
				<circle cx="78" cy="168" r="52" />
				<circle cx="78" cy="168" r="82" />
				<circle cx="78" cy="168" r="112" />
			</g>
			<circle cx="242" cy="58" r="24" className={styles.stroke} />
			<circle cx="242" cy="58" r="38" className={styles.strokeFaint} />
			<path d="M242 26v14M242 76v14M210 58h14M260 58h14" className={styles.stroke} />
			<path d="M242 58l10-10" className={styles.strokeRed} />
			<circle cx="242" cy="58" r="2.5" className={styles.fillRed} />
			<path
				d="M150 138c30 0 34 18 58 18s28-16 52-16"
				className={styles.stroke}
				strokeDasharray="3 5"
			/>
			<path
				d="M46 138v-16M64 138v-26M92 138v-12M112 138v-22"
				className={styles.strokeFaint}
			/>
		</g>
	);
}

function CeramicArt() {
	const pixels: Array<[number, number]> = [
		[196, 46],
		[204, 54],
		[212, 46],
		[188, 62],
		[196, 70],
		[220, 62],
		[204, 78],
		[212, 86],
		[196, 94],
		[220, 78],
		[212, 62],
	];
	const redPixels: Array<[number, number]> = [
		[204, 62],
		[212, 70],
		[196, 78],
		[220, 70],
	];
	return (
		<g>
			<g className={styles.fillPaperDim} shapeRendering="crispEdges">
				{pixels.map(([x, y]) => (
					<rect key={`${x}-${y}`} x={x} y={y} width="6" height="6" />
				))}
			</g>
			<g className={styles.fillRed} shapeRendering="crispEdges">
				{redPixels.map(([x, y]) => (
					<rect key={`r-${x}-${y}`} x={x} y={y} width="6" height="6" />
				))}
			</g>
			<g className={styles.faint} shapeRendering="crispEdges">
				<rect x="26" y="150" width="6" height="6" />
				<rect x="38" y="150" width="6" height="6" />
				<rect x="50" y="150" width="6" height="6" />
				<rect x="62" y="150" width="6" height="6" />
				<rect x="38" y="162" width="6" height="6" />
				<rect x="62" y="162" width="6" height="6" />
				<rect x="50" y="174" width="6" height="6" />
			</g>
			<path d="M164 60v92" className={styles.strokeFaint} />
			<circle cx="164" cy="106" r="3" className={styles.fillAurora} />
		</g>
	);
}

function BotArt() {
	return (
		<g>
			<rect x="46" y="42" width="186" height="116" className={styles.stroke} />
			<path d="M46 58h186" className={styles.strokeFaint} />
			<circle cx="56" cy="50" r="2" className={styles.fillRed} />
			<circle cx="64" cy="50" r="2" className={styles.fillRed} opacity="0.6" />
			<circle cx="72" cy="50" r="2" className={styles.fillRed} opacity="0.35" />
			<g className={styles.stroke}>
				<path d="M58 76h64M58 90h104M58 104h82M58 118h118M58 132h54" />
			</g>
			<rect x="120" y="132" width="8" height="10" className={styles.fillRed} />
			<path d="M252 76c12 10 12 38 0 48" className={styles.strokeFaint} />
			<path d="M264 64c20 18 20 54 0 72" className={styles.strokeFaint} />
			<circle cx="280" cy="100" r="2.5" className={styles.fillAurora} />
			<path d="M176 24v10M171 29h10" className={styles.strokeRed} />
		</g>
	);
}

/** Pure-SVG cover art for a case card: four deterministic instrument motifs. */
export default function CaseArt({index}: CaseArtProps) {
	const motif = ((index % 4) + 4) % 4;

	return (
		<svg
			className={styles.svg}
			viewBox="0 0 320 200"
			preserveAspectRatio="xMidYMid slice"
			fill="none"
			aria-hidden="true"
			focusable="false"
		>
			<g className={styles.stars}>
				{STARS.map(([cx, cy, r], starIndex) => (
					<circle
						key={`${cx}-${cy}`}
						cx={cx}
						cy={cy}
						r={r}
						className={starIndex % 7 === 0 ? styles.starBright : styles.star}
					/>
				))}
			</g>
			{motif === 0 ? <JourneyArt /> : null}
			{motif === 1 ? <CafeArt /> : null}
			{motif === 2 ? <CeramicArt /> : null}
			{motif === 3 ? <BotArt /> : null}
		</svg>
	);
}
