import type {Metadata} from 'next';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import {CASE_IMAGES, CASE_SLUGS, type CaseSlug} from '@/content/pages';
import PageHero from '@/components/layout/PageHero';
import CtaBand from '@/components/layout/CtaBand';
import ArrowIcon from '@/components/ui/ArrowIcon';
import type {CaseItem} from '@/components/sections/Cases';
import styles from '@/components/layout/Detail.module.css';

type PageProps = {params: Promise<{locale: string; slug: string}>};

export const dynamicParams = false;

export function generateStaticParams() {
	return CASE_SLUGS.map((slug) => ({slug}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
	const {locale, slug} = await params;
	if (!(CASE_SLUGS as readonly string[]).includes(slug)) return {};
	const t = await getTranslations({locale, namespace: 'cases'});
	const items = t.raw('items') as CaseItem[];
	const item = items[CASE_SLUGS.indexOf(slug as CaseSlug)];
	if (!item) return {};
	return pageMetadata({
		locale: locale as Locale,
		path: `/cases/${slug}`,
		title: item.name,
		description: item.summary,
		imageAlt: item.name,
	});
}

export default async function CaseDetailPage({params}: PageProps) {
	const {locale, slug} = await params;
	if (!(CASE_SLUGS as readonly string[]).includes(slug)) notFound();
	setRequestLocale(locale);

	const t = await getTranslations('cases');
	const pages = await getTranslations('pages');
	const items = t.raw('items') as CaseItem[];
	const index = CASE_SLUGS.indexOf(slug as CaseSlug);
	const item = items[index];
	if (!item) notFound();

	const kindLabel = item.kind === 'live' ? t('live') : t('concept');
	const related = items
		.map((entry, entryIndex) => ({entry, entryIndex}))
		.filter(({entryIndex}) => entryIndex !== index)
		.slice(0, 3);

	return (
		<>
			<PageHero
				locale={locale}
				kicker={`CASE / 0${index + 1}`}
				title={item.name}
				typeName={`case.${slug}`}
				intro={item.summary}
				breadcrumb={pages('cases.title')}
			>
				<div className={styles.heroMeta}>
					<div>
						<span className={styles.heroMetaSmall}>KIND</span>
						<strong>{kindLabel}</strong>
					</div>
					<div>
						<span className={styles.heroMetaSmall}>YEAR</span>
						<strong>{item.year}</strong>
					</div>
					<div>
						<span className={styles.heroMetaSmall}>CATEGORY</span>
						<strong>{item.category}</strong>
					</div>
					<div>
						<span className={styles.heroMetaSmall}>RESULT</span>
						<strong>{item.metric}</strong>
					</div>
				</div>
				<div className={styles.actions}>
					{item.kind === 'live' && item.liveUrl ? (
						<a
							href={item.liveUrl}
							target="_blank"
							rel="noreferrer"
							className="btn btn--primary"
						>
							{t('visit')}
							<ArrowIcon />
						</a>
					) : (
						<Link href="/contact" className="btn btn--primary">
							{pages('startProject')}
							<ArrowIcon />
						</Link>
					)}
				</div>
			</PageHero>

			<figure className={styles.cover}>
				<Image
					src={CASE_IMAGES[slug as CaseSlug]}
					alt=""
					fill
					priority
					unoptimized
					sizes="100vw"
					className={styles.coverImage}
				/>
			</figure>

			<section className={`section ${styles.block}`}>
				<div className={`container ${styles.caseStory}`}>
					<div className={styles.caseBlocks}>
						<div className={styles.caseBlock}>
							<p className={styles.caseLabel}>{t('challenge')}</p>
							<p className={styles.caseText}>{item.challenge}</p>
						</div>
						<div className={styles.caseBlock}>
							<p className={styles.caseLabel}>{t('solution')}</p>
							<p className={styles.caseText}>{item.solution}</p>
						</div>
						<div className={styles.caseBlock}>
							<p className={styles.caseLabel}>{t('result')}</p>
							<p className={styles.caseText}>{item.result}</p>
						</div>
					</div>

					<aside className={styles.caseAside}>
						<p className={styles.stackTitle}>{t('stack')}</p>
						<ul className={styles.tagList}>
							{item.stack.map((tech) => (
								<li className="tag" key={tech}>
									{tech}
								</li>
							))}
						</ul>
						<dl className={styles.metaList}>
							<div>
								<dt>YEAR</dt>
								<dd>{item.year}</dd>
							</div>
							<div>
								<dt>KIND</dt>
								<dd>{kindLabel}</dd>
							</div>
							<div>
								<dt>RESULT</dt>
								<dd>{item.metric}</dd>
							</div>
						</dl>
						{item.kind === 'concept' ? (
							<p className={styles.caseNote}>{t('note')}</p>
						) : null}
					</aside>
				</div>
			</section>

			<section className={`section ${styles.block}`}>
				<div className="container">
					<p className={styles.eyebrow}>NEXT / CASES</p>
					<h2 className={styles.h2}>{pages('otherCases')}</h2>
					<div className={styles.relatedGrid} style={{marginTop: '1.25rem'}}>
						{related.map(({entry, entryIndex}) => (
							<Link
								key={entry.name}
								href={`/cases/${CASE_SLUGS[entryIndex]}`}
								className={styles.relatedCard}
							>
								<span className={styles.relatedIndex}>0{entryIndex + 1}</span>
								<span className={styles.relatedTitle}>{entry.name}</span>
								<span className={styles.relatedMeta}>{entry.category}</span>
							</Link>
						))}
					</div>
				</div>
			</section>

			<CtaBand />
		</>
	);
}
