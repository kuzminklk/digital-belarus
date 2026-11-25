import type {ReactNode} from 'react';
import Reveal from './Reveal';
import styles from './SectionHeading.module.css';

type SectionHeadingProps = {
	index: string;
	label: string;
	title: string;
	accent: string;
	intro?: string;
	children?: ReactNode;
	align?: 'start' | 'split';
};

/** Consistent section masthead: mono index, eyebrow, serif statement, intro. */
export default function SectionHeading({
	index,
	label,
	title,
	accent,
	intro,
	children,
	align = 'split',
}: SectionHeadingProps) {
	return (
		<Reveal>
			<header className={`${styles.head} ${align === 'start' ? styles.start : ''}`}>
				<p className={styles.meta}>
					<span className={styles.index}>{index}</span>
					<span className={styles.rule} aria-hidden="true" />
					<span className={styles.label}>{label}</span>
				</p>
				<div className={styles.main}>
					<h2 className={styles.title}>
						{title} <em className={styles.accent}>{accent}</em>
					</h2>
					{intro ? <p className={styles.intro}>{intro}</p> : null}
				</div>
				{children}
			</header>
		</Reveal>
	);
}
