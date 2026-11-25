import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import styles from './Process.module.css';

type Step = {
	num: string;
	title: string;
	description: string;
	duration: string;
};

export default async function Process() {
	const t = await getTranslations('process');
	const steps = t.raw('steps') as Step[];

	return (
		<section id="process" className={`section ${styles.process}`} aria-label={t('label')}>
			<div className="container">
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent=""
					typeName="section.process"
					intro={t('intro')}
				/>

				<ol className={styles.steps}>
					{steps.map((step, index) => (
						<li className={styles.step} key={step.num}>
							<Reveal delay={index * 80}>
								<div className={styles.stepInner}>
									<div className={styles.stepTop}>
										<span className={styles.num} aria-hidden="true">
											{step.num}
										</span>
										<p className={styles.duration}>
											<span className={`mono ${styles.durationLabel}`}>
												DURATION
											</span>
											<span className={styles.durationValue}>
												{step.duration}
											</span>
										</p>
									</div>
									<h3 className={styles.title}>{step.title}</h3>
									<p className={styles.text}>{step.description}</p>
								</div>
							</Reveal>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
