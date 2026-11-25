import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import Hero from '@/components/sections/Hero';
import Marquee from '@/components/ui/Marquee';
import Approach from '@/components/sections/Approach';
import Services from '@/components/sections/Services';
import Process from '@/components/sections/Process';
import Cases from '@/components/sections/Cases';
import Pricing from '@/components/sections/Pricing';
import PricingCalculator from '@/components/sections/PricingCalculator';
import Why from '@/components/sections/Why';
import Studio from '@/components/sections/Studio';
import FAQ from '@/components/sections/FAQ';
import Contact from '@/components/sections/Contact';

type HomePageProps = {
	params: Promise<{locale: string}>;
};

export async function generateMetadata({params}: HomePageProps): Promise<Metadata> {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'meta'});
	return pageMetadata({
		locale: locale as Locale,
		title: t('title'),
		description: t('description'),
		imageAlt: t('ogAlt'),
	});
}

export default async function HomePage({params}: HomePageProps) {
	const {locale} = await params;
	setRequestLocale(locale);
	const t = await getTranslations('marquee');
	const marqueeItems = t.raw('items') as string[];

	return (
		<>
			<Hero />
			<Marquee items={marqueeItems} />
			<Approach />
			<Services />
			<Process />
			<Cases />
			<Pricing />
			<PricingCalculator />
			<Why />
			<Studio />
			<FAQ />
			<Contact />
		</>
	);
}
