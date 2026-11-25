import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import ArrowIcon from '@/components/ui/ArrowIcon';
import {site} from '@/lib/site';
import styles from './Studio.module.css';

type Fact = {label: string; value: string};

export default async function Studio() {
	const t = await getTranslations('studio');

	return (
		<section id="studio" className={`section on-paper ${styles.studio}`}>
			<div className="container">
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent={t('titleAccent')}
					typeName="section.studio"
					align="start"
				/>

				<div className={styles.grid}>
					<figure className={styles.portraitCard}>
						<div className={styles.portraitFrame}>
							<Image
								src="/pixel/portrait.png"
								alt={t('portraitAlt')}
								fill
								unoptimized
								sizes="(max-width: 900px) 100vw, 38vw"
								className={styles.portrait}
							/>
							<span
								className={styles.frameCorner}
								data-corner="tl"
								aria-hidden="true"
							/>
							<span
								className={styles.frameCorner}
								data-corner="tr"
								aria-hidden="true"
							/>
							<span
								className={styles.frameCorner}
								data-corner="bl"
								aria-hidden="true"
							/>
							<span
								className={styles.frameCorner}
								data-corner="br"
								aria-hidden="true"
							/>
						</div>
						<figcaption className={styles.portraitCaption}>
							<span>PORTRAIT / 001</span>
							<span>{t('wave')}</span>
						</figcaption>
					</figure>

					<div className={styles.content}>
						<p className={`mono ${styles.role}`}>{t('founderRole')}</p>
						<h3 className={styles.name}>{t('founderName')}</h3>
						<p className={styles.bio}>{t('founderBio')}</p>
						<p className={styles.body}>{t('body2')}</p>

						<dl className={styles.facts}>
							{(t.raw('facts') as Fact[]).map((fact) => (
								<div className={styles.fact} key={fact.label}>
									<dt className="mono">{fact.label}</dt>
									<dd>{fact.value}</dd>
								</div>
							))}
						</dl>

						<div className={styles.links}>
							<a href={site.telegram} target="_blank" rel="noreferrer">
								{t('links.telegram')}
								<ArrowIcon size={12} />
							</a>
							<a href={site.github} target="_blank" rel="noreferrer">
								{t('links.github')}
								<ArrowIcon size={12} />
							</a>
							<a href={site.personal} target="_blank" rel="noreferrer">
								{t('links.personal')}
								<ArrowIcon size={12} />
							</a>
						</div>

						<blockquote className={styles.quote}>
							<p>{t('body1')}</p>
							<cite>— {t('founderName')}</cite>
						</blockquote>
					</div>
				</div>
			</div>
		</section>
	);
}
