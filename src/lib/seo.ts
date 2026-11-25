import type {Metadata} from 'next';
import {locales, type Locale} from '@/i18n/routing';
import {site} from './site';

/** Absolute URL for a localized path (`''` is the home page). */
export function absoluteUrl(locale: Locale, path = ''): string {
	return `${site.url}/${locale}${path}`;
}

export function languageAlternates(path = ''): Record<string, string> {
	return Object.fromEntries(locales.map((locale) => [locale, absoluteUrl(locale, path)]));
}

type PageMetadataInput = {
	locale: Locale;
	path?: string;
	title?: string;
	description?: string;
	imageAlt?: string;
};

/** Builds canonical, hreflang, Open Graph and Twitter metadata for a page. */
export function pageMetadata({
	locale,
	path = '',
	title,
	description,
	imageAlt,
}: PageMetadataInput): Metadata {
	const canonical = absoluteUrl(locale, path);
	const ogImage = `${site.url}/og/${locale}.png`;

	return {
		title,
		description,
		alternates: {
			canonical,
			languages: languageAlternates(path),
		},
		openGraph: {
			type: 'website',
			url: canonical,
			siteName: 'Digital Belarus',
			locale,
			title,
			description,
			images: [{url: ogImage, width: 1200, height: 630, alt: imageAlt}],
		},
		twitter: {
			card: 'summary_large_image',
			title,
			description,
			images: [ogImage],
		},
	};
}
