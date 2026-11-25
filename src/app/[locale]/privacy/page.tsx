import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import Rushnyk from '@/components/brand/Rushnyk';
import ArrowIcon from '@/components/ui/ArrowIcon';
import styles from './privacy.module.css';

type PrivacyPageProps = {
	params: Promise<{locale: string}>;
};

type PrivacySection = {title: string; body: string};

export async function generateMetadata({params}: PrivacyPageProps): Promise<Metadata> {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'privacy'});
	return pageMetadata({
		locale: locale as Locale,
		path: '/privacy',
		title: t('title'),
		description: t('metaDescription'),
	});
}

export default async function PrivacyPage({params}: PrivacyPageProps) {
	const {locale} = await params;
	setRequestLocale(locale);
	const t = await getTranslations('privacy');
	const common = await getTranslations('common');
	const sections = t.raw('sections') as PrivacySection[];

	return (
		<article className={styles.page}>
			<div className={styles.ornament} aria-hidden="true">
				<Rushnyk variant="wave" tone="muted" height={18} animated={false} />
			</div>

			<div className={`container-narrow ${styles.inner}`}>
				<Link href="/" className={styles.back}>
					<ArrowIcon size={12} className={styles.backIcon} />
					{t('back')}
				</Link>

				<header className={styles.header}>
					<p className="mono muted">{common('brandLatin')} / LEGAL</p>
					<h1 className={styles.title}>{t('title')}</h1>
					<p className={styles.updated}>{t('updated')}</p>
					<p className={styles.intro}>{t('intro')}</p>
				</header>

				<div className={styles.sections}>
					{sections.map((section, index) => (
						<section className={styles.section} key={section.title}>
							<span className={styles.index} aria-hidden="true">
								{String(index + 1).padStart(2, '0')}
							</span>
							<div>
								<h2 className={styles.sectionTitle}>{section.title}</h2>
								<p className={styles.sectionBody}>{section.body}</p>
							</div>
						</section>
					))}
				</div>

				<footer className={styles.footer}>
					<p className="mono muted">
						{common('brand')} · {common('minsk')}
					</p>
					<Link href="/" className="link-underline">
						{t('back')}
						<ArrowIcon size={12} />
					</Link>
				</footer>
			</div>
		</article>
	);
}
