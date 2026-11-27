import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import type {Locale} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import {SERVICE_SLUGS, type ServiceSlug} from '@/content/pages';
import PageHero from '@/components/layout/PageHero';
import CtaBand from '@/components/layout/CtaBand';
import ArrowIcon from '@/components/ui/ArrowIcon';
import Process from '@/components/sections/Process';
import type {ServiceItem} from '@/components/sections/Services';
import styles from '@/components/layout/Detail.module.css';

type PageProps = {params: Promise<{locale: string; slug: string}>};

type ServiceDetail = {intro: string; includes: string[]};

export const dynamicParams = false;

export function generateStaticParams() {
	return SERVICE_SLUGS.map((slug) => ({slug}));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
	const {locale, slug} = await params;
	if (!(SERVICE_SLUGS as readonly string[]).includes(slug)) return {};
	const t = await getTranslations({locale, namespace: 'services'});
	const items = t.raw('items') as ServiceItem[];
	const item = items[SERVICE_SLUGS.indexOf(slug as ServiceSlug)];
	if (!item) return {};
	return pageMetadata({
		locale: locale as Locale,
		path: `/services/${slug}`,
		title: item.title,
		description: item.description,
		imageAlt: item.title,
	});
}

export default async function ServiceDetailPage({params}: PageProps) {
	const {locale, slug} = await params;
	if (!(SERVICE_SLUGS as readonly string[]).includes(slug)) notFound();
	setRequestLocale(locale);

	const services = await getTranslations('services');
	const items = services.raw('items') as ServiceItem[];
	const index = SERVICE_SLUGS.indexOf(slug as ServiceSlug);
	const item = items[index];
	if (!item) notFound();

	const pages = await getTranslations('pages');
	const detailT = await getTranslations('servicePages');
	const detail = detailT.raw(slug) as ServiceDetail;
	const related = items.filter((entry) => entry.id !== item.id).slice(0, 4);

	return (
		<>
			<PageHero
				locale={locale}
				kicker={`SERVICE / 0${index + 1}`}
				title={item.title}
				typeName={`service.${slug}`}
				intro={detail.intro}
				breadcrumb={pages('services.title')}
			>
				<div className={styles.heroMeta}>
					<div>
						<span className={styles.heroMetaSmall}>{pages('priceFrom')}</span>
						<strong>{item.price}</strong>
					</div>
					<div>
						<span className={styles.heroMetaSmall}>{pages('termLabel')}</span>
						<strong>{item.term}</strong>
					</div>
				</div>
				<ul className={styles.tagList}>
					{item.tags.map((tag) => (
						<li className="tag" key={tag}>
							{tag}
						</li>
					))}
				</ul>
				<div className={styles.actions}>
					<Link href="/contact" className="btn btn--primary">
						{pages('startProject')}
						<ArrowIcon />
					</Link>
				</div>
			</PageHero>

			<section className={`section on-paper ${styles.block}`}>
				<div className={`container ${styles.twoCol}`}>
					<div>
						<p className={styles.eyebrow}>01 / {pages('included')}</p>
						<h2 className={styles.h2}>{pages('included')}</h2>
						<ol className={styles.includes}>
							{detail.includes.map((line, lineIndex) => (
								<li key={line}>
									<span className={styles.num} aria-hidden="true">
										{String(lineIndex + 1).padStart(2, '0')}
									</span>
									<span>{line}</span>
								</li>
							))}
						</ol>
					</div>

					<aside className={styles.sidebar}>
						<p className={styles.eyebrow}>SERVICE / 0{index + 1}</p>
						<h3 className={styles.sidebarTitle}>{item.title}</h3>
						<p className={styles.sidebarText}>{item.description}</p>
						<dl className={styles.metaList}>
							<div>
								<dt>{pages('priceFrom')}</dt>
								<dd>{item.price}</dd>
							</div>
							<div>
								<dt>{pages('termLabel')}</dt>
								<dd>{item.term}</dd>
							</div>
						</dl>
						<div className={styles.actions}>
							<Link href="/contact" className="btn btn--ghost btn--small">
								{pages('startProject')}
								<ArrowIcon size={12} />
							</Link>
						</div>
					</aside>
				</div>
			</section>

			<Process />

			<section className={`section ${styles.block}`}>
				<div className="container">
					<p className={styles.eyebrow}>NEXT / SERVICES</p>
					<h2 className={styles.h2}>{pages('otherServices')}</h2>
					<div className={styles.related}>
						<div className={styles.relatedGrid}>
							{related.map((entry, relatedIndex) => (
								<Link
									href={`/services/${entry.id}`}
									className={styles.relatedCard}
									key={entry.id}
								>
									<span className={styles.relatedIndex}>0{relatedIndex + 1}</span>
									<span className={styles.relatedTitle}>{entry.title}</span>
									<span className={styles.relatedMeta}>{entry.price}</span>
								</Link>
							))}
						</div>
					</div>
				</div>
			</section>

			<CtaBand />
		</>
	);
}
