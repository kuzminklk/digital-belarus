import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import Rushnyk from '@/components/brand/Rushnyk';
import styles from './Approach.module.css';

type Principle = {
	title: string;
	text: string;
};

export default async function Approach() {
	const t = await getTranslations('approach');
	const principles = t.raw('principles') as Principle[];

	return (
		<section id="approach" className={`section ${styles.approach}`} aria-label={t('label')}>
			<span className={styles.ghost} aria-hidden="true">
				{t('index')}
			</span>

			<div className={`container ${styles.inner}`}>
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent={t('titleAccent')}
					intro={t('body')}
				/>

				<div className={styles.layout}>
					<Reveal className={styles.quoteCol}>
						<figure className={styles.quote}>
							<figcaption className={`mono ${styles.quoteLabel}`}>
								<span className={styles.quoteTick} aria-hidden="true" />
								MANIFESTO / 01
							</figcaption>
							<blockquote className={styles.quoteText}>
								<span className={styles.quoteMark} aria-hidden="true">
									&ldquo;
								</span>
								{t('quote')}
							</blockquote>
							<div className={styles.quoteFoot} aria-hidden="true">
								<span className={styles.quoteFootRule} />
								<span className={`mono ${styles.quoteFootLabel}`}>
									ORBITAL NOTE
								</span>
							</div>
						</figure>
					</Reveal>

					<ol className={styles.principles}>
						{principles.map((principle, index) => (
							<li key={principle.title}>
								<Reveal delay={index * 90}>
									<article className={styles.principle}>
										<span className={`mono ${styles.num}`} aria-hidden="true">
											0{index + 1}
										</span>
										<div className={styles.principleBody}>
											<h3 className={styles.principleTitle}>
												{principle.title}
											</h3>
											<p className={styles.principleText}>{principle.text}</p>
										</div>
										<span
											className={styles.corner}
											data-corner="br"
											aria-hidden="true"
										/>
									</article>
								</Reveal>
							</li>
						))}
					</ol>
				</div>

				<div className={styles.ornament} aria-hidden="true">
					<Rushnyk variant="divider" tone="muted" height={20} />
				</div>
			</div>
		</section>
	);
}
