import styles from './Marquee.module.css';

type MarqueeProps = {
	items: string[];
	reverse?: boolean;
	className?: string;
};

/**
 * Endless keyword ticker. Content is duplicated for a seamless loop and hidden
 * from assistive technology because it repeats the section headings below.
 */
export default function Marquee({items, reverse = false, className}: MarqueeProps) {
	const row = [...items, ...items];

	return (
		<div className={`${styles.marquee} ${className ?? ''}`} aria-hidden="true">
			<div className={styles.track} data-reverse={reverse ? 'true' : undefined}>
				{row.map((item, index) => (
					<span className={styles.item} key={`${item}-${index}`}>
						<span className={styles.text}>{item}</span>
						<svg className={styles.star} viewBox="0 0 12 12" aria-hidden="true">
							<path d="M5 0h2v3h3v2H9v3H7V7H4V5h1V0Z" fill="currentColor" />
						</svg>
					</span>
				))}
			</div>
		</div>
	);
}
