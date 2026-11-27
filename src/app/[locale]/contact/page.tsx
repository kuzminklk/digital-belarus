import type {Metadata} from 'next';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import type {Locale} from '@/i18n/routing';
import {pageMetadata} from '@/lib/seo';
import PageHero from '@/components/layout/PageHero';
import Contact from '@/components/sections/Contact';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
	const {locale} = await params;
	const t = await getTranslations({locale, namespace: 'pages'});
	return pageMetadata({
		locale: locale as Locale,
		path: '/contact',
		title: t('contact.title'),
		description: t('contact.intro'),
		imageAlt: t('contact.title'),
	});
}

export default async function ContactPage({params}: PageProps) {
	const {locale} = await params;
	setRequestLocale(locale);
	const pages = await getTranslations('pages');

	return (
		<>
			<PageHero
				locale={locale}
				kicker="CONTACT / 09"
				title={pages('contact.title')}
				typeName="page.contact"
				intro={pages('contact.intro')}
			/>
			<Contact showHeading={false} />
		</>
	);
}
