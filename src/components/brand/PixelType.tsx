import type {CSSProperties} from 'react';
import manifest from '@/content/pixel-type.json';
import styles from './PixelType.module.css';

type MaskEntry = {
	src: string;
	width: number;
	height: number;
	cssWidth: number;
};

type TypeEntry = MaskEntry & {
	/** Optional narrow-screen mask generated for headings with a mobile variant. */
	mobile?: MaskEntry;
};

type Manifest = Record<string, Record<string, TypeEntry>>;

type PixelTypeProps = {
	locale: string;
	/** Manifest key, e.g. `section.services` or `hero.line1`. */
	name: string;
	/** Real, accessible text. Used by screen readers and as a fallback. */
	text: string;
	className?: string;
	/** Optional cap on the rendered width in CSS pixels. */
	maxWidth?: number;
};

/**
 * Renders a generated pixel-serif mask in the current colour. The asset is a
 * one-bit alpha PNG produced by scripts/generate-pixel-type.py: Cormorant
 * Garamond rendered small, thresholded and upscaled with nearest-neighbour,
 * so headings read like a bitmap serif rather than a smooth webfont.
 */
export default function PixelType({locale, name, text, className, maxWidth}: PixelTypeProps) {
	const entry = (manifest as Manifest)[locale]?.[name];

	if (!entry) {
		return <span className={`${styles.fallback} ${className ?? ''}`}>{text}</span>;
	}

	const maskStyle = (mask: MaskEntry): CSSProperties =>
		({
			'--type-src': `url(${mask.src})`,
			aspectRatio: `${mask.width} / ${mask.height}`,
			maxWidth: `${maxWidth ?? mask.cssWidth}px`,
		}) as CSSProperties;

	return (
		<>
			<span className="sr-only">{text}</span>
			<span
				className={`${styles.mask} ${entry.mobile ? styles.desktop : ''} ${className ?? ''}`}
				aria-hidden="true"
				style={maskStyle(entry)}
			/>
			{entry.mobile ? (
				<span
					className={`${styles.mask} ${styles.mobile} ${className ?? ''}`}
					aria-hidden="true"
					style={maskStyle(entry.mobile)}
				/>
			) : null}
		</>
	);
}
