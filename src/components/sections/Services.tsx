import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import ArrowIcon from '@/components/ui/ArrowIcon';
import PixelIcon, {type PixelIconName} from '@/components/brand/PixelIcon';
import styles from './Services.module.css';

type ServiceItem = {
	id: string;
	icon: PixelIconName;
	title: string;
	description: string;
	price: string;
	term: string;
	tags: string[];
};

export default async function Services() {
	const t = await getTranslations('services');
	const items = t.raw('items') as ServiceItem[];

	return (
		<section id="services" className={`section ${styles.services}`} aria-label={t('label')}>
			<div className="container">
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent={t('titleAccent')}
					intro={t('intro')}
				/>

				<ul className={styles.grid}>
					{items.map((item, index) => (
						<li className={styles.cell} key={item.id}>
							<Reveal className={styles.reveal} delay={(index % 3) * 90}>
								<article
									id={item.id}
									className={styles.card}
									aria-labelledby={`service-${item.id}-title`}
								>
									<span className={styles.hoverLine} aria-hidden="true" />
									<span className={styles.hoverArrow} aria-hidden="true">
										<ArrowIcon size={16} />
									</span>

									<header className={styles.cardHead}>
										<span className={styles.icon} aria-hidden="true">
											<PixelIcon name={item.icon} size={22} />
										</span>
										<span className={`mono ${styles.index}`} aria-hidden="true">
											{String(index + 1).padStart(2, '0')}
										</span>
									</header>

									<h3 id={`service-${item.id}-title`} className={styles.title}>
										{item.title}
									</h3>
									<p className={styles.description}>{item.description}</p>

									<ul className={styles.tags}>
										{item.tags.map((tag) => (
											<li className="tag" key={tag}>
												{tag}
											</li>
										))}
									</ul>

									<dl className={styles.facts}>
										<div className={styles.fact}>
											<dt className="mono">PRICE</dt>
											<dd className={styles.price}>{item.price}</dd>
										</div>
										<div className={`${styles.fact} ${styles.factTerm}`}>
											<dt className="mono">TERM</dt>
											<dd className={styles.term}>{item.term}</dd>
										</div>
									</dl>
								</article>
							</Reveal>
						</li>
					))}
				</ul>

				<Reveal>
					<div className={styles.footer}>
						<p className={styles.note}>
							<span className={styles.noteTick} aria-hidden="true" />
							{t('note')}
						</p>
						<a className={`link-underline ${styles.allLink}`} href="#pricing">
							{t('allLink')}
							<ArrowIcon size={13} />
						</a>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
