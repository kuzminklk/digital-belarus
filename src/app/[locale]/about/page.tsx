import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import PageHero from '@/components/layout/PageHero';
import CtaBand from '@/components/layout/CtaBand';
import Approach from '@/components/sections/Approach';
import Studio from '@/components/sections/Studio';
import Why from '@/components/sections/Why';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'pages'});
	return pageMetadata({
		locale: locale as Locale,
		path: '/about',
		title: t('about.title'),
		description: t('about.intro'),
		imageAlt: t('about.title'),
	});
}

export default async function AboutPage({params}: PageProps) {
	const {locale} = await params;
	setRequestLocale(locale);
	const pages = await getTranslations('pages');

	return (
		<>
			<PageHero
				locale={locale}
				kicker="STUDIO / 07"
				title={pages('about.title')}
				typeName="page.about"
				intro={pages('about.intro')}
			/>
			<Approach />
			<Studio />
			<Why />
			<CtaBand />
		</>
	);
}
