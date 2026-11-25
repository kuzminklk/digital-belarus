import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import styles from './Approach.module.css';

type Principle = {
	title: string;
	text: string;
};

export default async function Approach() {
	const t = await getTranslations('approach');
	const principles = t.raw('principles') as Principle[];

	return (
		<section
			id="approach"
			className={`section on-paper ${styles.approach}`}
			aria-label={t('label')}
		>
			<div className="container">
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent={t('titleAccent')}
					typeName="section.approach"
					intro={t('body')}
				/>

				<div className={styles.layout}>
					<Reveal className={styles.quoteBlock}>
						<figure className={styles.figure}>
							<p className={`mono ${styles.quoteLabel}`}>MANIFESTO / 01</p>
							<blockquote className={styles.quote}>{t('quote')}</blockquote>
						</figure>
					</Reveal>

					<ol className={styles.principles}>
						{principles.map((principle, index) => (
							<li className={styles.principleRow} key={principle.title}>
								<Reveal delay={index * 80}>
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
									</article>
								</Reveal>
							</li>
						))}
					</ol>
				</div>
			</div>

			<Reveal>
				<figure className={styles.atlasFigure}>
					<div className={styles.atlasFrame}>
						<Image
							src="/pixel/atlas.png"
							alt=""
							fill
							unoptimized
							sizes="100vw"
							className={styles.atlas}
						/>
						<span className={`mono ${styles.atlasIndex}`} aria-hidden="true">
							FIG. 01 / ATLAS
						</span>
					</div>
					<figcaption className={`mono ${styles.atlasCaption}`}>
						<span>ARCHIVE / STAR CHART · 53.9006°N 27.5590°E</span>
						<span>BY · DIGITAL BELARUS</span>
					</figcaption>
				</figure>
			</Reveal>
		</section>
	);
}
