import type {CSSProperties} from 'react';
import manifest from '@/content/pixel-type.json';
import styles from './PixelType.module.css';

type TypeEntry = {
	src: string;
	width: number;
	height: number;
	cssWidth: number;
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

	return (
		<>
			<span className="sr-only">{text}</span>
			<span
				className={`${styles.mask} ${className ?? ''}`}
				aria-hidden="true"
				style={
					{
						'--type-src': `url(${entry.src})`,
						aspectRatio: `${entry.width} / ${entry.height}`,
						maxWidth: `${maxWidth ?? entry.cssWidth}px`,
					} as CSSProperties
				}
			/>
		</>
	);
}
