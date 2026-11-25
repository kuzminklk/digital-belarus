import styles from './PixelMark.module.css';

type PixelMarkProps = {
	size?: number;
	tone?: 'red' | 'paper' | 'mono';
	className?: string;
};

/*
 * The v2 studio mark: a cream stamp holding a black pixel eight-point rushnyk
 * star. One square, one star, two tones — no accent colours.
 *
 *   .  transparent (cream square behind, in `paper` / `red` tones)
 *   #  star weave
 *
 * The star fills 14 of the 16 grid modules so the mark still reads in a 16 px
 * browser tab and at 24 px in the navigation.
 */
const STAR = [
	'................',
	'.......##.......',
	'..##...##...##..',
	'..###..##..###..',
	'...###.##.###...',
	'....########....',
	'.....######.....',
	'.##############.',
	'.##############.',
	'.....######.....',
	'....########....',
	'...###.##.###...',
	'..###..##..###..',
	'..##...##...##..',
	'.......##.......',
	'................',
] as const;

function mergeClassNames(...values: Array<string | false | null | undefined>): string {
	return values.filter((value): value is string => Boolean(value)).join(' ');
}

/**
 * `paper` (default) and the legacy `red` tone both render the canonical cream
 * square with the ink star; `mono` drops the square and paints the star in
 * `currentColor` for single-tone contexts. The mark is decorative.
 */
export default function PixelMark({size = 32, tone = 'paper', className}: PixelMarkProps) {
	const mono = tone === 'mono';

	return (
		<svg
			className={mergeClassNames(styles.mark, mono && styles.mono, className)}
			width={size}
			height={size}
			viewBox="0 0 16 16"
			role="presentation"
			aria-hidden="true"
			focusable="false"
			shapeRendering="crispEdges"
		>
			{mono ? null : <rect className={styles.square} x={0} y={0} width={16} height={16} />}
			{STAR.flatMap((row, y) =>
				[...row].map((cell, x) =>
					cell === '#' ? (
						<rect
							key={`${x}-${y}`}
							className={styles.star}
							x={x}
							y={y}
							width={1}
							height={1}
						/>
					) : null,
				),
			)}
		</svg>
	);
}
