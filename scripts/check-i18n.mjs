#!/usr/bin/env node
/**
 * Content integrity check for the trilingual catalog.
 *
 * Verifies that ru, be and en expose the same message shape, the same array
 * lengths, the same numeric values, non-empty strings and identical ICU
 * placeholder names. Exits with code 1 and a readable report on divergence.
 */
import {existsSync, readFileSync} from 'node:fs';
import {join} from 'node:path';

const root = process.cwd();
const locales = ['ru', 'be', 'en'];
const reference = 'ru';
const ICU = /\{([a-zA-Z][\w]*)/g;

// Content fields where an empty value is meaningful (concept cases have no
// external URL; two tiers have no "from" prefix).
const ALLOWED_EMPTY = [/^cases\.items\[\d+\]\.liveUrl$/, /^pricing\.tiers\[\d+\]\.pricePrefix$/];

function readCatalog(locale) {
	const path = join(root, 'messages', `${locale}.json`);
	if (!existsSync(path)) throw new Error(`Missing catalog: messages/${locale}.json`);
	try {
		return JSON.parse(readFileSync(path, 'utf8'));
	} catch (error) {
		throw new Error(`Invalid JSON in messages/${locale}.json: ${error.message}`);
	}
}

function shape(value, path, out) {
	if (Array.isArray(value)) {
		out[path] = `array:${value.length}`;
		value.forEach((entry, index) => shape(entry, `${path}[${index}]`, out));
		return;
	}
	if (value && typeof value === 'object') {
		out[path] = 'object';
		for (const [key, entry] of Object.entries(value)) {
			shape(entry, path ? `${path}.${key}` : key, out);
		}
		return;
	}
	out[path] = typeof value;
}

function flattenStrings(value, path, out) {
	if (typeof value === 'string') {
		out[path] = value;
		return;
	}
	if (Array.isArray(value)) {
		value.forEach((entry, index) => flattenStrings(entry, `${path}[${index}]`, out));
		return;
	}
	if (value && typeof value === 'object') {
		for (const [key, entry] of Object.entries(value)) {
			flattenStrings(entry, path ? `${path}.${key}` : key, out);
		}
	}
}

function flattenLeaves(value, path, out) {
	if (value && typeof value === 'object' && !Array.isArray(value)) {
		for (const [key, entry] of Object.entries(value)) {
			flattenLeaves(entry, path ? `${path}.${key}` : key, out);
		}
		return;
	}
	if (Array.isArray(value)) {
		value.forEach((entry, index) => flattenLeaves(entry, `${path}[${index}]`, out));
		return;
	}
	out[path] = value;
}

function placeholders(text) {
	return [...text.matchAll(ICU)]
		.map((match) => match[1])
		.sort()
		.join(',');
}

const catalogs = Object.fromEntries(locales.map((locale) => [locale, readCatalog(locale)]));
const shapes = {};
const strings = {};
const leaves = {};

for (const locale of locales) {
	shapes[locale] = {};
	strings[locale] = {};
	leaves[locale] = {};
	shape(catalogs[locale], '', shapes[locale]);
	flattenStrings(catalogs[locale], '', strings[locale]);
	flattenLeaves(catalogs[locale], '', leaves[locale]);
}

let errors = 0;
const fail = (message) => {
	errors += 1;
	console.error(`✖ ${message}`);
};

for (const locale of locales) {
	if (locale === reference) continue;
	const expectedKeys = Object.keys(shapes[reference]).sort();
	const actualKeys = Object.keys(shapes[locale]).sort();

	for (const key of expectedKeys) {
		if (!(key in shapes[locale])) fail(`${locale}: missing structure at ${key}`);
		else if (shapes[locale][key] !== shapes[reference][key]) {
			fail(
				`${locale}: shape mismatch at ${key} (${shapes[reference][key]} !== ${shapes[locale][key]})`,
			);
		}
	}
	for (const key of actualKeys) {
		if (!(key in shapes[reference])) fail(`${locale}: extra structure at ${key}`);
	}

	for (const [key, value] of Object.entries(leaves[reference])) {
		if (typeof value !== 'number' && typeof value !== 'boolean') continue;
		if (leaves[locale]?.[key] !== value) {
			fail(`${locale}: literal mismatch at ${key} (${value} !== ${leaves[locale]?.[key]})`);
		}
	}

	for (const key of Object.keys(strings[reference])) {
		const expectedText = strings[reference][key];
		const actualText = strings[locale]?.[key];
		if (typeof actualText !== 'string') continue;
		if (placeholders(expectedText) !== placeholders(actualText)) {
			fail(
				`${locale}: ICU placeholder mismatch at ${key} (${placeholders(expectedText) || 'none'} !== ${placeholders(actualText) || 'none'})`,
			);
		}
	}
}

for (const locale of locales) {
	for (const [key, value] of Object.entries(strings[locale])) {
		if (value.trim() === '' && !ALLOWED_EMPTY.some((pattern) => pattern.test(key))) {
			fail(`${locale}: empty string at ${key}`);
		}
		if (/TODO|FIXME|lorem ipsum/i.test(value)) {
			fail(`${locale}: leftover placeholder copy at ${key}`);
		}
	}
}

if (errors > 0) {
	console.error(`\n${errors} i18n problem(s) found.`);
	process.exit(1);
}

console.log(
	`✔ i18n catalogs are in sync (${locales.join(', ')}; ${Object.keys(strings[reference]).length} strings).`,
);
