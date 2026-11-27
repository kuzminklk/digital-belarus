import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import PageHero from '@/components/layout/PageHero';
import CtaBand from '@/components/layout/CtaBand';
import Cases from '@/components/sections/Cases';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'pages'});
	return pageMetadata({
		locale: locale as Locale,
		path: '/cases',
		title: t('cases.title'),
		description: t('cases.intro'),
		imageAlt: t('cases.title'),
	});
}

export default async function CasesPage({params}: PageProps) {
	const {locale} = await params;
	setRequestLocale(locale);
	const pages = await getTranslations('pages');

	return (
		<>
			<PageHero
				locale={locale}
				kicker="CASES / 04"
				title={pages('cases.title')}
				typeName="page.cases"
				intro={pages('cases.intro')}
			/>
			<Cases showHeading={false} />
			<CtaBand />
		</>
	);
}
