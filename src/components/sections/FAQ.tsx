import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import ArrowIcon from '@/components/ui/ArrowIcon';
import styles from './FAQ.module.css';

type FaqItem = {
	question: string;
	answer: string;
};

type FaqProps = {showHeading?: boolean};

export default async function FAQ({showHeading = true}: FaqProps = {}) {
	const t = await getTranslations('faq');
	const items = t.raw('items') as FaqItem[];

	return (
		<section id="faq" className={`section ${styles.faq}`} aria-label={t('label')}>
			<div className={`container ${styles.layout}`}>
				{showHeading ? (
					<SectionHeading
						index={t('index')}
						label={t('label')}
						title={t('title')}
						accent={t('titleAccent')}
						typeName="section.faq"
						align="start"
					/>
				) : null}

				<ol className={styles.items}>
					{items.map((item, index) => (
						<li key={item.question}>
							<Reveal delay={Math.min(index * 40, 200)}>
								<details className={styles.item}>
									<summary className={styles.question}>
										<span className={`mono ${styles.num}`} aria-hidden="true">
											{String(index + 1).padStart(2, '0')}
										</span>
										<span className={styles.questionText}>{item.question}</span>
										<span className={styles.icon} aria-hidden="true">
											<span className={styles.iconPlus}>+</span>
											<span className={styles.iconMinus}>−</span>
										</span>
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
						<Link href="/contact" className="link-underline">
							{t('moreLink')}
							<ArrowIcon size={12} />
						</Link>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
