import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import PageHero from '@/components/layout/PageHero';
import CtaBand from '@/components/layout/CtaBand';
import FAQ from '@/components/sections/FAQ';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'pages'});
	return pageMetadata({
		locale: locale as Locale,
		path: '/faq',
		title: t('faq.title'),
		description: t('faq.intro'),
		imageAlt: t('faq.title'),
	});
}

export default async function FaqPage({params}: PageProps) {
	const {locale} = await params;
	setRequestLocale(locale);
	const pages = await getTranslations('pages');

	return (
		<>
			<PageHero
				locale={locale}
				kicker="FAQ / 09"
				title={pages('faq.title')}
				typeName="page.faq"
				intro={pages('faq.intro')}
			/>
			<FAQ showHeading={false} />
			<CtaBand />
		</>
	);
}
