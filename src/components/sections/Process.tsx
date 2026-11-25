import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import PixelIcon from '@/components/brand/PixelIcon';
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
					intro={t('intro')}
					align="start"
				/>

				<ol className={styles.steps}>
					{steps.map((step, index) => (
						<li className={styles.step} key={step.num}>
							<Reveal className={styles.reveal} delay={index * 110}>
								<div className={styles.body}>
									<p className={`mono ${styles.phaseLabel}`} aria-hidden="true">
										PHASE / {step.num}
									</p>
									<span className={styles.num} aria-hidden="true">
										{step.num}
									</span>
									<h3 className={styles.title}>{step.title}</h3>
									<p className={styles.description}>{step.description}</p>
									<p className={styles.duration}>
										<span className={styles.clock} aria-hidden="true">
											<PixelIcon name="clock" size={14} />
										</span>
										<span className={`mono ${styles.durationLabel}`}>
											DURATION
										</span>
										<span className={styles.durationValue}>
											{step.duration}
										</span>
									</p>
								</div>
							</Reveal>
						</li>
					))}
				</ol>
			</div>
		</section>
	);
}
