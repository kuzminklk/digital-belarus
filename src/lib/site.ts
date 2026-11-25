/** Site-wide constants that are language-independent. */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;

export const site = {
	name: 'Digital Belarus',
	url:
		process.env.NEXT_PUBLIC_SITE_URL ??
		(vercelHost ? `https://${vercelHost}` : 'https://digital-belarus.vercel.app'),
	telegram: 'https://t.me/kuzminklk',
	telegramHandle: '@kuzminklk',
	github: 'https://github.com/kuzminklk',
	personal: 'https://kuzminklk.vercel.app',
	founderGithub: 'https://github.com/kuzminklk',
	coordinates: {lat: 53.9006, lon: 27.559, label: 'Minsk'},
	foundingYear: 2024,
} as const;

export const sectionIds = {
	approach: 'approach',
	services: 'services',
	process: 'process',
	cases: 'cases',
	pricing: 'pricing',
	calculator: 'calculator',
	why: 'why',
	studio: 'studio',
	faq: 'faq',
	contact: 'contact',
} as const;

export const mainNav = [
	{id: sectionIds.services, key: 'services'},
	{id: sectionIds.process, key: 'process'},
	{id: sectionIds.cases, key: 'cases'},
	{id: sectionIds.pricing, key: 'pricing'},
	{id: sectionIds.studio, key: 'studio'},
	{id: sectionIds.faq, key: 'faq'},
] as const;
