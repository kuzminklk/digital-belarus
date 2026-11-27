import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import PageHero from '@/components/layout/PageHero';
import CtaBand from '@/components/layout/CtaBand';
import PricingCalculator from '@/components/sections/PricingCalculator';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'pages'});
	return pageMetadata({
		locale: locale as Locale,
		path: '/calculator',
		title: t('calculator.title'),
		description: t('calculator.intro'),
		imageAlt: t('calculator.title'),
	});
}

export default async function CalculatorPage({params}: PageProps) {
	const {locale} = await params;
	setRequestLocale(locale);
	const pages = await getTranslations('pages');

	return (
		<>
			<PageHero
				locale={locale}
				kicker="CALCULATOR / 01"
				title={pages('calculator.title')}
				typeName="page.calculator"
				intro={pages('calculator.intro')}
			/>
			<PricingCalculator showHeading={false} />
			<CtaBand />
		</>
	);
}
