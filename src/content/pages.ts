/** Route-level content shared across locales (slugs, images, path lists). */

export const SERVICE_SLUGS = [
	'websites',
	'bots',
	'ai',
	'automation',
	'commerce',
	'analytics',
] as const;

export type ServiceSlug = (typeof SERVICE_SLUGS)[number];

export const CASE_SLUGS = ['yasna', 'central-park', 'spadchyna', 'prabot'] as const;

export type CaseSlug = (typeof CASE_SLUGS)[number];

/** Case images follow the order of `cases.items` in the message catalogs. */
export const CASE_IMAGES: Record<CaseSlug, string> = {
	yasna: '/pixel/case-yasna.png',
	'central-park': '/pixel/case-central-park.png',
	spadchyna: '/pixel/case-spadchyna.png',
	prabot: '/pixel/case-prabot.png',
};

export const HUB_PATHS = [
	'/services',
	'/cases',
	'/pricing',
	'/calculator',
	'/about',
	'/faq',
	'/contact',
] as const;

export function isServiceSlug(value: string): value is ServiceSlug {
	return (SERVICE_SLUGS as readonly string[]).includes(value);
}

export function isCaseSlug(value: string): value is CaseSlug {
	return (CASE_SLUGS as readonly string[]).includes(value);
}
