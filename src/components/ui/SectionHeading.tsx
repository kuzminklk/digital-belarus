'use client';

import type {ReactNode} from 'react';
import {useLocale} from 'next-intl';
import Reveal from './Reveal';
import PixelType from '@/components/brand/PixelType';
import styles from './SectionHeading.module.css';

type SectionHeadingProps = {
	index: string;
	label: string;
	title: string;
	accent: string;
	/** Manifest key for the pixel-serif heading, e.g. `section.services`. */
	typeName?: string;
	intro?: string;
	children?: ReactNode;
	align?: 'start' | 'split';
};

/** Consistent section masthead: pixel index, pixel-serif statement, intro. */
export default function SectionHeading({
	index,
	label,
	title,
	accent,
	typeName,
	intro,
	children,
	align = 'split',
}: SectionHeadingProps) {
	const locale = useLocale();
	const text = `${title} ${accent}`.trim();

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
						{typeName ? (
							<PixelType locale={locale} name={typeName} text={text} />
						) : (
							<span className={styles.fallback}>
								{title} <span className={styles.accent}>{accent}</span>
							</span>
						)}
					</h2>
					{intro ? <p className={styles.intro}>{intro}</p> : null}
				</div>
				{children}
			</header>
		</Reveal>
	);
}
