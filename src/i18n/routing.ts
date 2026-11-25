import {defineRouting} from 'next-intl/routing';

export const locales = ['ru', 'be', 'en'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ru';

export const localeNames: Record<Locale, {native: string; short: string}> = {
	ru: {native: 'Русский', short: 'RU'},
	be: {native: 'Беларуская', short: 'BE'},
	en: {native: 'English', short: 'EN'},
};

export const routing = defineRouting({
	locales,
	defaultLocale,
	localePrefix: 'always',
	localeCookie: false,
	alternateLinks: true,
});
