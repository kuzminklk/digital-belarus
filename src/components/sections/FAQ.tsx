import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import ArrowIcon from '@/components/ui/ArrowIcon';
import styles from './FAQ.module.css';

type FaqItem = {
	question: string;
	answer: string;
};

export default async function FAQ() {
	const t = await getTranslations('faq');
	const items = t.raw('items') as FaqItem[];

	return (
		<section id="faq" className={`section ${styles.faq}`} aria-label={t('label')}>
			<div className={`container ${styles.layout}`}>
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent={t('titleAccent')}
					align="start"
				/>

				<ol className={styles.items}>
					{items.map((item, index) => (
						<li key={item.question}>
							<Reveal delay={Math.min(index * 50, 250)}>
								<details className={styles.item}>
									<summary className={styles.question}>
										<span className={`mono ${styles.num}`} aria-hidden="true">
											{String(index + 1).padStart(2, '0')}
										</span>
										<span className={styles.questionText}>{item.question}</span>
										<span className={styles.icon} aria-hidden="true" />
									</summary>
									<div className={styles.answer}>
										<p>{item.answer}</p>
									</div>
								</details>
							</Reveal>
						</li>
					))}
				</ol>

				<Reveal>
					<div className={styles.more}>
						<p className={styles.moreText}>{t('more')}</p>
						<a href="#contact" className="link-underline">
							{t('moreLink')}
							<ArrowIcon size={13} />
						</a>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
