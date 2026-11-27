import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import CalculatorSheet from './CalculatorSheet';
import styles from './PricingCalculator.module.css';

type PricingCalculatorProps = {showHeading?: boolean};

export default async function PricingCalculator({showHeading = true}: PricingCalculatorProps = {}) {
	const t = await getTranslations('pricing.calculator');

	return (
		<section id="calculator" className={`section ${styles.calculator}`} aria-label={t('label')}>
			<div className="container">
				{showHeading ? (
					<SectionHeading
						index={t('index')}
						label={t('label')}
						title={t('title')}
						accent={t('titleAccent')}
						typeName="section.calculator"
						intro={t('intro')}
					/>
				) : null}
				<CalculatorSheet />
			</div>
		</section>
	);
}
