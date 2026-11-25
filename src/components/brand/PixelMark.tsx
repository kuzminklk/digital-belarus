type PixelMarkProps = {
	size?: number;
	tone?: 'red' | 'paper' | 'mono';
	className?: string;
};

/*
 * The studio mark: a Belarusian rushnyk star rebuilt on a 16×16 pixel grid.
 *   P — paper weave (diamond ring and diagonal lattice)
 *   R — signal-red core
 *   A — aurora corner seeds
 * The shape stays legible down to 16 px and never uses curves or gradients.
 */
const MARK = [
	'................',
	'.......PP.......',
	'..A...PPPP...A..',
	'.....PP..PP.....',
	'....PP.PP.PP....',
	'...PP..PP..PP...',
	'..PP...RR...PP..',
	'.PP.PPRRRRPP.PP.',
	'.PP.PPRRRRPP.PP.',
	'..PP...RR...PP..',
	'...PP..PP..PP...',
	'....PP.PP.PP....',
	'.....PP..PP.....',
	'..A...PPPP...A..',
	'.......PP.......',
	'................',
] as const;

const TONES: Record<
	NonNullable<PixelMarkProps['tone']>,
	{paper: string; red: string; aurora: string}
> = {
	red: {
		paper: 'var(--paper)',
		red: 'var(--red)',
		aurora: 'var(--aurora)',
	},
	paper: {
		paper: 'var(--paper)',
		red: 'var(--red)',
		aurora: 'var(--paper-dim)',
	},
	mono: {
		paper: 'currentColor',
		red: 'currentColor',
		aurora: 'currentColor',
	},
};

export default function PixelMark({size = 32, tone = 'red', className}: PixelMarkProps) {
	const palette = TONES[tone];

	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 16 16"
			aria-hidden="true"
			focusable="false"
			shapeRendering="crispEdges"
		>
			{MARK.flatMap((row, y) =>
				[...row].map((cell, x) => {
					if (cell === '.') return null;
					const fill =
						cell === 'P' ? palette.paper : cell === 'R' ? palette.red : palette.aurora;
					return <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill={fill} />;
				}),
			)}
		</svg>
	);
}
