import {getTranslations} from 'next-intl/server';
import ConstellationMap from '@/components/brand/ConstellationMap';
import ArrowIcon from '@/components/ui/ArrowIcon';
import styles from './Hero.module.css';

type Metric = {value: string; label: string};

export default async function Hero() {
	const t = await getTranslations('hero');
	const common = await getTranslations('common');
	const metrics = t.raw('metrics') as Metric[];

	return (
		<section className={styles.hero} aria-labelledby="hero-title">
			<div className={styles.atmosphere} aria-hidden="true">
				<div className={styles.grid} />
				<div className={styles.glowRed} />
				<div className={styles.glowAurora} />
				<span className={styles.verticalLabel}>OBSERVATORY · 53.9°N · 27.56°E</span>
			</div>

			<div className={`container ${styles.inner}`}>
				<div className={styles.topline}>
					<p className={styles.eyebrow}>
						<span className={styles.cross} aria-hidden="true" />
						{t('eyebrow')}
					</p>
					<p className={styles.status}>
						<span className="status-dot" aria-hidden="true" />
						{t('status')}
					</p>
				</div>

				<div className={styles.stage}>
					<div className={styles.copy}>
						<h1
							id="hero-title"
							className={styles.title}
							aria-label={`${t('titleLine1')} ${t('titleAccent')} ${t('titleLine2')}`}
						>
							<span className={styles.line}>{t('titleLine1')}</span>
							<span className={`${styles.line} ${styles.accentLine}`}>
								{t('titleAccent')}
								<svg
									className={styles.titleStar}
									viewBox="0 0 24 24"
									aria-hidden="true"
									focusable="false"
								>
									<path
										d="M10 0h4v7h7v4h-7v7h-4v-7H3V7h7V0Zm-6 18h4v4H4v-4Zm12 2h2v2h-2v-2Z"
										fill="currentColor"
									/>
								</svg>
							</span>
							<span className={styles.line}>{t('titleLine2')}</span>
						</h1>

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
					</div>

					<div className={styles.visual}>
						<div className={styles.mapWrap}>
							<div className={styles.mapGlow} aria-hidden="true" />
							<ConstellationMap intensity="vivid" className={styles.map} />
							<div className={styles.mapHud} aria-hidden="true">
								<span className={styles.hudTopLeft}>BY · 2026</span>
								<span className={styles.hudTopRight}>SIGNAL / 001</span>
								<span className={styles.hudBottomLeft}>{t('coordinates')}</span>
								<span className={styles.hudBottomRight}>ONLINE</span>
								<span className={styles.corner} data-corner="tl" />
								<span className={styles.corner} data-corner="tr" />
								<span className={styles.corner} data-corner="bl" />
								<span className={styles.corner} data-corner="br" />
							</div>
						</div>
						<p className={styles.mapCaption}>
							<span aria-hidden="true">◇</span>
							{t('mapCaption')}
						</p>
					</div>
				</div>

				<div className={styles.bottom}>
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
