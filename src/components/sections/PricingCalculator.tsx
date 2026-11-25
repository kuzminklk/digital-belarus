import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import CalculatorSheet from './CalculatorSheet';
import styles from './PricingCalculator.module.css';

export default async function PricingCalculator() {
	const t = await getTranslations('pricing.calculator');

	return (
		<section id="calculator" className={`section ${styles.calculator}`} aria-label={t('label')}>
			<div className="container">
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent={t('titleAccent')}
					typeName="section.calculator"
					intro={t('intro')}
				/>
				<CalculatorSheet />
			</div>
		</section>
	);
}
