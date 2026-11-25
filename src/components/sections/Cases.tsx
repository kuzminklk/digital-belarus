import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import CaseGallery from './CaseGallery';
import styles from './Cases.module.css';

export type CaseKind = 'live' | 'concept';

export type CaseItem = {
	name: string;
	category: string;
	year: string;
	kind: CaseKind;
	liveUrl: string;
	summary: string;
	challenge: string;
	solution: string;
	stack: string[];
	result: string;
	metric: string;
};

export default async function Cases() {
	const t = await getTranslations('cases');
	const items = t.raw('items') as CaseItem[];

	return (
		<section id="cases" className={`section ${styles.cases}`} aria-label={t('label')}>
			<div className="container">
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent={t('titleAccent')}
					typeName="section.cases"
					intro={t('intro')}
				/>

				<CaseGallery items={items} />

				<Reveal>
					<p className={styles.note}>{t('note')}</p>
				</Reveal>
			</div>
		</section>
	);
}
