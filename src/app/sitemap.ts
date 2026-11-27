import type {MetadataRoute} from 'next';
import {locales} from '@/i18n/routing';
import {site} from '@/lib/site';
import {CASE_SLUGS, HUB_PATHS, SERVICE_SLUGS} from '@/content/pages';

const paths = [
	'',
	'/privacy',
	...HUB_PATHS,
	...SERVICE_SLUGS.map((slug) => `/services/${slug}`),
	...CASE_SLUGS.map((slug) => `/cases/${slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
	const now = new Date();

	return locales.flatMap((locale) =>
		paths.map((path) => ({
			url: `${site.url}/${locale}${path}`,
			lastModified: now,
			changeFrequency:
				path === '' || HUB_PATHS.includes(path as (typeof HUB_PATHS)[number])
					? ('monthly' as const)
					: ('yearly' as const),
			priority:
				path === ''
					? 1
					: HUB_PATHS.includes(path as (typeof HUB_PATHS)[number])
						? 0.8
						: 0.6,
			alternates: {
				languages: Object.fromEntries(
					locales.map((item) => [item, `${site.url}/${item}${path}`]),
				),
			},
		})),
	);
}
