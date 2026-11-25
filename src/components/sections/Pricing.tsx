import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import ArrowIcon from '@/components/ui/ArrowIcon';
import styles from './Pricing.module.css';

type Tier = {
	id: string;
	name: string;
	price: string;
	pricePrefix: string;
	term: string;
	description: string;
	popular: boolean;
	features: string[];
	cta: string;
};

export default async function Pricing() {
	const t = await getTranslations('pricing');
	const tiers = t.raw('tiers') as Tier[];

	return (
		<section id="pricing" className={`section ${styles.pricing}`} aria-label={t('label')}>
			<div className="container">
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent={t('titleAccent')}
					intro={t('intro')}
				/>

				<ul className={styles.grid}>
					{tiers.map((tier, index) => (
						<li
							className={styles.cell}
							key={tier.id}
							data-popular={tier.popular ? 'true' : 'false'}
						>
							<Reveal className={styles.reveal} delay={index * 110}>
								<article
									className={styles.card}
									aria-labelledby={`tier-${tier.id}-name`}
								>
									<div className={styles.badgeRow}>
										{tier.popular ? (
											<span className={`mono ${styles.badge}`}>
												<span
													className={styles.badgeDot}
													aria-hidden="true"
												/>
												{t('popular')}
											</span>
										) : null}
									</div>

									<header className={styles.head}>
										<p className={`mono ${styles.index}`} aria-hidden="true">
											TH / 0{index + 1}
										</p>
										<h3 id={`tier-${tier.id}-name`} className={styles.name}>
											{tier.name}
										</h3>
										<p className={styles.description}>{tier.description}</p>
									</header>

									<div className={styles.priceRow}>
										<p className={styles.price}>
											{tier.pricePrefix ? (
												<span className={styles.prefix}>
													{tier.pricePrefix}
												</span>
											) : null}
											<span className={styles.amount}>{tier.price}</span>
											<span className={styles.currency}>{t('currency')}</span>
										</p>
										<p className={styles.term}>
											<span className={`mono ${styles.termLabel}`}>TERM</span>
											<span>{tier.term}</span>
										</p>
									</div>

									<ul className={styles.features}>
										{tier.features.map((feature) => (
											<li key={feature}>
												<span className={styles.tick} aria-hidden="true" />
												<span>{feature}</span>
											</li>
										))}
									</ul>

									<a
										href="#contact"
										className={`${
											tier.popular ? 'btn btn--primary' : 'btn btn--ghost'
										} ${styles.cta}`}
									>
										{tier.cta}
										<ArrowIcon size={13} />
									</a>
								</article>
							</Reveal>
						</li>
					))}
				</ul>

				<Reveal>
					<p className={styles.note}>
						<span className={styles.noteTick} aria-hidden="true" />
						{t('note')}
					</p>
				</Reveal>
			</div>
		</section>
	);
}
