import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import PageHero from '@/components/layout/PageHero';
import CtaBand from '@/components/layout/CtaBand';
import Pricing from '@/components/sections/Pricing';
import PricingCalculator from '@/components/sections/PricingCalculator';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'pages'});
	return pageMetadata({
		locale: locale as Locale,
		path: '/pricing',
		title: t('pricing.title'),
		description: t('pricing.intro'),
		imageAlt: t('pricing.title'),
	});
}

export default async function PricingPage({params}: PageProps) {
	const {locale} = await params;
	setRequestLocale(locale);
	const pages = await getTranslations('pages');

	return (
		<>
			<PageHero
				locale={locale}
				kicker="PRICING / 03"
				title={pages('pricing.title')}
				typeName="page.pricing"
				intro={pages('pricing.intro')}
			/>
			<Pricing showHeading={false} />
			<PricingCalculator showHeading={false} />
			<CtaBand />
		</>
	);
}
