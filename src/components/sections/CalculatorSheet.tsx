'use client';

import {useId, useState, type FormEvent} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import ArrowIcon from '@/components/ui/ArrowIcon';
import {
	calculateEstimate,
	formatInteger,
	type EstimateCatalog,
	type EstimateLine,
} from '@/lib/estimate';
import styles from './PricingCalculator.module.css';

export default function CalculatorSheet() {
	const t = useTranslations('pricing.calculator');
	const locale = useLocale();
	const baseId = useId();

	const catalog: EstimateCatalog = {
		types: t.raw('types') as EstimateLine[],
		options: t.raw('options') as EstimateLine[],
		supportOptions: t.raw('supportOptions') as EstimateLine[],
	};

	const [typeId, setTypeId] = useState<string>(catalog.types[0]?.id ?? '');
	const [optionIds, setOptionIds] = useState<string[]>([]);
	const [supportId, setSupportId] = useState<string>(catalog.supportOptions[0]?.id ?? '');

	const estimate = calculateEstimate({typeId, optionIds, supportId}, catalog);
	const price = formatInteger(estimate.price, locale);
	const supportSelected = estimate.support.price > 0;

	const toggleOption = (id: string) => {
		setOptionIds((current) =>
			current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
		);
	};

	const reset = () => {
		setTypeId(catalog.types[0]?.id ?? '');
		setOptionIds([]);
		setSupportId(catalog.supportOptions[0]?.id ?? '');
	};

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
	};

	return (
		<div className={styles.layout}>
			<form
				className={styles.form}
				onSubmit={handleSubmit}
				aria-labelledby={`${baseId}-form-title`}
			>
				<h3 id={`${baseId}-form-title`} className="sr-only">
					{t('label')}
				</h3>

				<fieldset className={styles.group}>
					<legend className={styles.legend}>
						<span className={`mono ${styles.legendIndex}`} aria-hidden="true">
							01
						</span>
						<span className={styles.legendLabel}>{t('typesLabel')}</span>
					</legend>
					<div className={styles.typeList}>
						{catalog.types.map((type) => {
							const checked = type.id === typeId;
							const inputId = `${baseId}-type-${type.id}`;

							return (
								<label
									className={styles.typeRow}
									data-active={checked ? 'true' : 'false'}
									htmlFor={inputId}
									key={type.id}
								>
									<input
										className={styles.control}
										id={inputId}
										type="radio"
										name="estimate-type"
										value={type.id}
										checked={checked}
										onChange={() => setTypeId(type.id)}
									/>
									<span className={styles.mark} aria-hidden="true" />
									<span className={styles.typeLabel}>{type.label}</span>
									<span className={styles.typePrice}>
										{formatInteger(type.price, locale)}
										<span className={styles.unit}>{t('currency')}</span>
									</span>
								</label>
							);
						})}
					</div>
				</fieldset>

				<fieldset className={styles.group}>
					<legend className={styles.legend}>
						<span className={`mono ${styles.legendIndex}`} aria-hidden="true">
							02
						</span>
						<span className={styles.legendLabel}>{t('optionsLabel')}</span>
					</legend>
					<div className={styles.optionList}>
						{catalog.options.map((option) => {
							const checked = optionIds.includes(option.id);
							const inputId = `${baseId}-option-${option.id}`;

							return (
								<label
									className={styles.optionRow}
									data-active={checked ? 'true' : 'false'}
									htmlFor={inputId}
									key={option.id}
								>
									<input
										className={styles.control}
										id={inputId}
										type="checkbox"
										name="estimate-options"
										value={option.id}
										checked={checked}
										onChange={() => toggleOption(option.id)}
									/>
									<span className={styles.mark} aria-hidden="true" />
									<span className={styles.optionBody}>
										<span className={styles.optionLabel}>{option.label}</span>
										<span className={styles.optionPrice}>
											+ {formatInteger(option.price, locale)} {t('currency')}
										</span>
									</span>
								</label>
							);
						})}
					</div>
				</fieldset>

				<fieldset className={styles.group}>
					<legend className={styles.legend}>
						<span className={`mono ${styles.legendIndex}`} aria-hidden="true">
							03
						</span>
						<span className={styles.legendLabel}>{t('supportLabel')}</span>
					</legend>
					<div className={styles.supportList}>
						{catalog.supportOptions.map((support) => {
							const checked = support.id === supportId;
							const inputId = `${baseId}-support-${support.id}`;

							return (
								<label
									className={styles.supportRow}
									data-active={checked ? 'true' : 'false'}
									htmlFor={inputId}
									key={support.id}
								>
									<input
										className={styles.control}
										id={inputId}
										type="radio"
										name="estimate-support"
										value={support.id}
										checked={checked}
										onChange={() => setSupportId(support.id)}
									/>
									<span className={styles.mark} aria-hidden="true" />
									<span className={styles.supportBody}>
										<span className={styles.supportLabel}>{support.label}</span>
										<span className={styles.supportPrice}>
											{support.price > 0
												? `+ ${formatInteger(support.price, locale)} ${t(
														'currency',
													)}`
												: '—'}
										</span>
									</span>
								</label>
							);
						})}
					</div>
				</fieldset>
			</form>

			<aside
				className={`on-paper ${styles.result}`}
				aria-labelledby={`${baseId}-result-title`}
			>
				<div className={styles.resultHead}>
					<p className={`mono ${styles.kicker}`}>ESTIMATE / LIVE</p>
					<span className={styles.statusMark} aria-hidden="true" />
				</div>

				<h3 id={`${baseId}-result-title`} className={styles.resultTitle}>
					{t('resultTitle')}
				</h3>

				<div className={styles.live} aria-live="polite" aria-atomic="true">
					<div className={styles.totalRow}>
						<p className={`mono ${styles.totalLabel}`}>{t('totalLabel')}</p>
						<p className={styles.total}>
							<span className={styles.totalPrefix}>{t('fromLabel')}</span>
							<span className={styles.totalAmount}>{price}</span>
							<span className={styles.totalCurrency}>{t('currency')}</span>
						</p>
					</div>

					<div className={styles.termRow}>
						<p className={`mono ${styles.totalLabel}`}>{t('termLabel')}</p>
						<p className={styles.termValue}>{t('term', {days: estimate.days})}</p>
					</div>
				</div>

				<div className={styles.selection}>
					<p className={`mono ${styles.selectionLabel}`}>{t('selected')}</p>
					<ul className={styles.selectionList}>
						<li>{estimate.type.label}</li>
						{estimate.options.map((option) => (
							<li key={option.id}>{option.label}</li>
						))}
						{supportSelected ? <li>{estimate.support.label}</li> : null}
					</ul>
				</div>

				<p className={styles.disclaimer}>{t('disclaimer')}</p>

				<div className={styles.actions}>
					<a href="#contact" className={`btn btn--primary ${styles.resultCta}`}>
						{t('cta')}
						<ArrowIcon size={13} />
					</a>
					<button type="button" className={styles.reset} onClick={reset}>
						{t('reset')}
					</button>
				</div>
			</aside>
		</div>
	);
}
