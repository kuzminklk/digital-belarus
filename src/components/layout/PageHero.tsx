import type {ReactNode} from 'react';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import PixelType from '@/components/brand/PixelType';
import styles from './PageHero.module.css';

type PageHeroProps = {
	locale: string;
	/** Decorative instrument label, e.g. `SERVICES / 06`. */
	kicker: string;
	/** Real heading copy; also used by the generated mask. */
	title: string;
	/** Manifest key for the pixel-serif heading. */
	typeName: string;
	intro?: string;
	breadcrumb?: string;
	children?: ReactNode;
};

export default async function PageHero({
	locale,
	kicker,
	title,
	typeName,
	intro,
	breadcrumb,
	children,
}: PageHeroProps) {
	const pages = await getTranslations('pages');

	return (
		<section className={styles.hero} aria-labelledby="page-title">
			<div className="container">
				<nav className={styles.breadcrumb} aria-label={breadcrumb ?? title}>
					<Link href="/">{pages('home')}</Link>
					<span aria-hidden="true">/</span>
					<span>{breadcrumb ?? title}</span>
				</nav>

				<p className={styles.kicker}>{kicker}</p>

				<h1 id="page-title" className={styles.title}>
					<PixelType locale={locale} name={typeName} text={title} maxWidth={1000} />
				</h1>

				{intro || children ? (
					<div className={styles.bottom}>
						{intro ? <p className={styles.intro}>{intro}</p> : null}
						{children ? <div className={styles.aside}>{children}</div> : null}
					</div>
				) : null}
			</div>
		</section>
	);
}
