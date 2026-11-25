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
		<section
			id="pricing"
			className={`section on-paper ${styles.pricing}`}
			aria-label={t('label')}
		>
			<div className="container">
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent={t('titleAccent')}
					typeName="section.pricing"
					intro={t('intro')}
				/>

				<ul className={styles.grid}>
					{tiers.map((tier, index) => (
						<li
							className={styles.tier}
							key={tier.id}
							data-featured={tier.popular ? 'true' : 'false'}
						>
							<Reveal className={styles.reveal} delay={index * 80}>
								<article
									className={styles.card}
									aria-labelledby={`tier-${tier.id}-name`}
								>
									<div className={styles.head}>
										<span className={`mono ${styles.index}`} aria-hidden="true">
											TH / 0{index + 1}
										</span>
										{tier.popular ? (
											<span className="tag">{t('popular')}</span>
										) : null}
									</div>

									<h3 id={`tier-${tier.id}-name`} className={styles.name}>
										{tier.name}
									</h3>
									<p className={styles.description}>{tier.description}</p>

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

									<ul className={styles.features}>
										{tier.features.map((feature) => (
											<li key={feature}>
												<span
													className={styles.featureMark}
													aria-hidden="true"
												/>
												<span>{feature}</span>
											</li>
										))}
									</ul>

									<a href="#contact" className={styles.cta}>
										{tier.cta}
										<ArrowIcon size={13} />
									</a>
								</article>
							</Reveal>
						</li>
					))}
				</ul>

				<Reveal>
					<p className={styles.note}>{t('note')}</p>
				</Reveal>
			</div>
		</section>
	);
}
