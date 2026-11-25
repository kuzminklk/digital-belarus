import Image from 'next/image';
import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import ArrowIcon from '@/components/ui/ArrowIcon';
import PixelMark from '@/components/brand/PixelMark';
import OrnamentField from '@/components/brand/OrnamentField';
import {site} from '@/lib/site';
import styles from './Studio.module.css';

type Fact = {label: string; value: string};

export default async function Studio() {
	const t = await getTranslations('studio');

	return (
		<section id="studio" className={`section ${styles.studio}`}>
			<OrnamentField variant="corners" />
			<div className="container">
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent={t('titleAccent')}
					align="start"
				/>

				<div className={styles.grid}>
					<article className={styles.portraitCard}>
						<div className={styles.portraitFrame}>
							<Image
								src="/images/daniel-kuzmin.jpg"
								alt={t('portraitAlt')}
								width={460}
								height={460}
								className={styles.portrait}
								sizes="(max-width: 900px) 100vw, 34vw"
							/>
							<div className={styles.duotone} aria-hidden="true" />
							<div className={styles.scanline} aria-hidden="true" />
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
							<span className={styles.portraitLabel} aria-hidden="true">
								PORTRAIT / 001
							</span>
						</div>

						<div className={styles.identity}>
							<p className={`mono ${styles.role}`}>{t('founderRole')}</p>
							<h3 className={styles.name}>{t('founderName')}</h3>
							<p className={styles.bio}>{t('founderBio')}</p>
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
						</div>
					</article>

					<div className={styles.details}>
						<PixelMark size={56} tone="paper" className={styles.watermark} />
						<p className={styles.body2}>{t('body2')}</p>
						<dl className={styles.facts}>
							{(t.raw('facts') as Fact[]).map((fact) => (
								<div className={styles.fact} key={fact.label}>
									<dt className="mono">{fact.label}</dt>
									<dd>{fact.value}</dd>
								</div>
							))}
						</dl>

						<div className={styles.manifesto}>
							<span className={styles.manifestoIndex} aria-hidden="true">
								00
							</span>
							<p className={styles.manifestoText}>
								<span className={styles.manifestoQuote}>&ldquo;</span>
								{t('body1')}
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
