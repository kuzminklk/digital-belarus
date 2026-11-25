import Image from 'next/image';
import {getLocale, getTranslations} from 'next-intl/server';
import PixelType from '@/components/brand/PixelType';
import ArrowIcon from '@/components/ui/ArrowIcon';
import styles from './Hero.module.css';

type Metric = {value: string; label: string};

export default async function Hero() {
	const t = await getTranslations('hero');
	const common = await getTranslations('common');
	const locale = await getLocale();
	const metrics = t.raw('metrics') as Metric[];

	return (
		<section className={styles.hero} aria-labelledby="hero-title">
			<div className={styles.intro}>
				<div className={`container ${styles.topline}`}>
					<p className={styles.eyebrow}>
						<span className={styles.cross} aria-hidden="true" />
						{t('eyebrow')}
					</p>
					<p className={styles.status}>
						<span className="status-dot" aria-hidden="true" />
						{t('status')}
					</p>
				</div>

				<div className={`container ${styles.titleBlock}`}>
					<h1
						id="hero-title"
						className={styles.title}
						aria-label={`${t('titleLine1')} ${t('titleAccent')} ${t('titleLine2')}`}
					>
						<PixelType
							locale={locale}
							name="hero.line1"
							text={`${t('titleLine1')} ${t('titleAccent')}`}
							className={styles.line1}
						/>
						<PixelType
							locale={locale}
							name="hero.line2"
							text={t('titleLine2')}
							className={styles.line2}
						/>
					</h1>

					<div className={styles.underTitle}>
						<p className={styles.description}>{t('description')}</p>
						<div className={styles.ctas}>
							<a href="#contact" className="btn btn--primary">
								{t('primaryCta')}
								<ArrowIcon />
							</a>
							<a href="#services" className="btn btn--ghost">
								{t('secondaryCta')}
							</a>
						</div>
					</div>
				</div>
			</div>

			<figure className={`container ${styles.mediaBlock}`}>
				<div className={styles.mediaFrame}>
					<Image
						src="/pixel/hero-lunar.png"
						alt=""
						fill
						priority
						unoptimized
						sizes="(max-width: 768px) 100vw, 90vw"
						className={styles.mediaImage}
					/>
					<div className={styles.hud} aria-hidden="true">
						<span className={styles.hudTopLeft}>BY · 2026</span>
						<span className={styles.hudTopRight}>OBSERVATION / 001</span>
						<span className={styles.hudBottomLeft}>MINSK · {t('coordinates')}</span>
						<span className={styles.hudBottomRight}>ONLINE</span>
						<span className={styles.corner} data-corner="tl" />
						<span className={styles.corner} data-corner="tr" />
						<span className={styles.corner} data-corner="bl" />
						<span className={styles.corner} data-corner="br" />
					</div>
				</div>
				<figcaption className={styles.caption}>
					<span>FIG. 01 — NASA / APOLLO 17 · PUBLIC DOMAIN</span>
					<span>{t('mapCaption')}</span>
					<span>{common('minsk')}</span>
				</figcaption>
			</figure>

			<div className={`container ${styles.bottom}`}>
				<dl className={styles.metrics}>
					{metrics.map((metric, index) => (
						<div className={styles.metric} key={metric.label}>
							<dt className="mono muted">0{index + 1}</dt>
							<dd>
								<span className={styles.metricValue}>{metric.value}</span>
								<span className={styles.metricLabel}>{metric.label}</span>
							</dd>
						</div>
					))}
				</dl>

				<div className={styles.bottomMeta}>
					<p className={styles.bottomNote}>
						<span className="mono">{common('workingHours')}</span>
						<span className={styles.bottomDot} aria-hidden="true" />
						<span className="mono">{common('responseTime')}</span>
					</p>
					<a href="#approach" className={styles.scroll}>
						<span>{t('scroll')}</span>
						<span className={styles.scrollLine} aria-hidden="true">
							<span />
						</span>
					</a>
				</div>
			</div>
		</section>
	);
}
