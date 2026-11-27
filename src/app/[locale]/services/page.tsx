import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import PageHero from '@/components/layout/PageHero';
import CtaBand from '@/components/layout/CtaBand';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'pages'});
	return pageMetadata({
		locale: locale as Locale,
		path: '/services',
		title: t('services.title'),
		description: t('services.intro'),
		imageAlt: t('services.title'),
	});
}

export default async function ServicesPage({params}: PageProps) {
	const {locale} = await params;
	setRequestLocale(locale);
	const pages = await getTranslations('pages');

	return (
		<>
			<PageHero
				locale={locale}
				kicker="SERVICES / 06"
				title={pages('services.title')}
				typeName="page.services"
				intro={pages('services.intro')}
			/>
			<Services showHeading={false} />
			<Process />
			<CtaBand />
		</>
	);
}
