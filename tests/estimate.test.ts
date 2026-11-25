import {describe, expect, it} from 'vitest';
import {calculateEstimate, formatInteger, type EstimateCatalog} from '../src/lib/estimate';

const catalog: EstimateCatalog = {
	types: [
		{id: 'landing', label: 'Landing', price: 1500, days: 10},
		{id: 'bot', label: 'Bot', price: 2000, days: 7},
	],
	options: [
		{id: 'design', label: 'Design', price: 800, days: 5},
		{id: 'copy', label: 'Copy', price: 500, days: 3},
	],
	supportOptions: [
		{id: 'none', label: 'None', price: 0, days: 0},
		{id: '3m', label: 'Three months', price: 700, days: 0},
	],
};

describe('calculateEstimate', () => {
	it('returns the base price for a bare selection', () => {
		const result = calculateEstimate(
			{typeId: 'landing', optionIds: [], supportId: 'none'},
			catalog,
		);
		expect(result.price).toBe(1500);
		expect(result.days).toBe(10);
		expect(result.type.id).toBe('landing');
	});

	it('adds options and support', () => {
		const result = calculateEstimate(
			{typeId: 'bot', optionIds: ['design', 'copy'], supportId: '3m'},
			catalog,
		);
		expect(result.price).toBe(2000 + 800 + 500 + 700);
		expect(result.days).toBe(7 + 5 + 3);
	});

	it('falls back to the first support option', () => {
		const result = calculateEstimate(
			{typeId: 'landing', optionIds: [], supportId: 'unknown'},
			catalog,
		);
		expect(result.support.id).toBe('none');
	});

	it('fails loudly for unknown ids', () => {
		expect(() =>
			calculateEstimate({typeId: 'nope', optionIds: [], supportId: 'none'}, catalog),
		).toThrow(/Unknown estimate type/);
		expect(() =>
			calculateEstimate({typeId: 'landing', optionIds: ['nope'], supportId: 'none'}, catalog),
		).toThrow(/Unknown estimate option/);
	});
});

describe('formatInteger', () => {
	it('formats using the locale grouping', () => {
		expect(formatInteger(7900, 'ru')).toMatch(/7[.\s\u00a0]?900/);
		expect(formatInteger(1000, 'en')).toBe('1,000');
	});
});
