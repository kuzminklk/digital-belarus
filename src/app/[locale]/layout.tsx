import type {Metadata, Viewport} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {routing, type Locale} from '@/i18n/routing';
import {site} from '@/lib/site';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Grain from '@/components/layout/Grain';
import '../globals.css';

type LocaleLayoutProps = {
	children: React.ReactNode;
	params: Promise<{locale: string}>;
};

export function generateStaticParams() {
	return routing.locales.map((locale) => ({locale}));
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#05080b',
	colorScheme: 'dark',
};

export async function generateMetadata({
	params,
}: Omit<LocaleLayoutProps, 'children'>): Promise<Metadata> {
	const {locale: requested} = await params;
	if (!hasLocale(routing.locales, requested)) return {};
	const locale = requested as Locale;
	const t = await getTranslations({locale, namespace: 'meta'});

	return {
		metadataBase: new URL(site.url),
		title: {
			default: t('title'),
			template: `%s — ${t('siteName')}`,
		},
		description: t('description'),
		keywords: t('keywords'),
		applicationName: t('siteName'),
		authors: [{name: 'Daniel Kuzmin', url: site.personal}],
		creator: 'Digital Belarus',
		publisher: t('siteName'),
		formatDetection: {telephone: false, address: false, email: false},
		icons: {
			icon: [
				{url: '/favicon.svg', type: 'image/svg+xml'},
				{url: '/icon.png', sizes: '512x512', type: 'image/png'},
			],
			apple: [{url: '/apple-icon.png', sizes: '180x180', type: 'image/png'}],
		},
	};
}

export default async function LocaleLayout({children, params}: LocaleLayoutProps) {
	const {locale} = await params;
	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);
	const t = await getTranslations('a11y');

	return (
		<html lang={locale}>
			<head>
				<link
					rel="preload"
					href="/fonts/cormorant-garamond-normal-cyrillic-300-700.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/fonts/manrope-normal-cyrillic-400-800.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/fonts/cormorant-garamond-normal-latin-300-700.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
				<link
					rel="preload"
					href="/fonts/manrope-normal-latin-400-800.woff2"
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
			</head>
			<body>
				<NextIntlClientProvider>
					<Grain />
					<a className="skip-link" href="#main">
						{t('skipToContent')}
					</a>
					<Header />
					<main id="main">{children}</main>
					<Footer />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
