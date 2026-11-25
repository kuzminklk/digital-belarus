/** Pure pricing-calculator logic. Labels live in the message catalogs. */

export type EstimateLine = {
	id: string;
	label: string;
	price: number;
	days: number;
};

export type EstimateCatalog = {
	types: EstimateLine[];
	options: EstimateLine[];
	supportOptions: EstimateLine[];
};

export type EstimateSelection = {
	typeId: string;
	optionIds: string[];
	supportId: string;
};

export type EstimateResult = {
	type: EstimateLine;
	options: EstimateLine[];
	support: EstimateLine;
	price: number;
	days: number;
};

/**
 * Calculates a transparent ballpark estimate: the base type plus selected
 * add-ons plus optional post-launch support. Throws when ids are unknown so
 * translation mistakes fail loudly in development instead of showing 0 BYN.
 */
export function calculateEstimate(
	selection: EstimateSelection,
	catalog: EstimateCatalog,
): EstimateResult {
	const type = catalog.types.find((item) => item.id === selection.typeId);
	if (!type) {
		throw new Error(`Unknown estimate type: ${selection.typeId}`);
	}

	const options = selection.optionIds.map((id) => {
		const option = catalog.options.find((item) => item.id === id);
		if (!option) throw new Error(`Unknown estimate option: ${id}`);
		return option;
	});

	const support =
		catalog.supportOptions.find((item) => item.id === selection.supportId) ??
		catalog.supportOptions[0];

	if (!support) {
		throw new Error('Estimate catalog has no support options');
	}

	const price =
		type.price + options.reduce((total, option) => total + option.price, 0) + support.price;
	const days = type.days + options.reduce((total, option) => total + option.days, 0);

	return {type, options, support, price, days};
}

/**
 * Deterministic integer grouping: a non-breaking space for Cyrillic locales and
 * a comma for English. We deliberately do not use Intl here because Node and
 * Chrome ship different Belarusian locale data, which caused hydration
 * mismatches for prices.
 */
export function formatInteger(value: number, locale: string): string {
	const digits = Math.round(value).toString();
	const separator = locale === 'en' ? ',' : '\u00A0';
	return digits.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}
