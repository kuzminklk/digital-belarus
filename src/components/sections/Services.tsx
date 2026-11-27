import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import ArrowIcon from '@/components/ui/ArrowIcon';
import PixelIcon, {type PixelIconName} from '@/components/brand/PixelIcon';
import styles from './Services.module.css';

export type ServiceItem = {
	id: string;
	icon: PixelIconName;
	title: string;
	description: string;
	price: string;
	term: string;
	tags: string[];
};

type ServicesProps = {showHeading?: boolean};

export default async function Services({showHeading = true}: ServicesProps = {}) {
	const t = await getTranslations('services');
	const items = t.raw('items') as ServiceItem[];

	return (
		<section id="services" className={`section ${styles.services}`} aria-label={t('label')}>
			<div className="container">
				{showHeading ? (
					<SectionHeading
						index={t('index')}
						label={t('label')}
						title={t('title')}
						accent={t('titleAccent')}
						typeName="section.services"
						intro={t('intro')}
					/>
				) : null}

				<ul className={styles.list}>
					{items.map((item, index) => (
						<li className={styles.cell} key={item.id}>
							<Reveal delay={(index % 2) * 70}>
								<Link href={`/services/${item.id}`} className={styles.itemLink}>
									<article
										id={item.id}
										className={styles.item}
										aria-labelledby={`service-${item.id}-title`}
									>
										<div className={styles.itemHead}>
											<span
												className={`mono ${styles.index}`}
												aria-hidden="true"
											>
												{String(index + 1).padStart(2, '0')}
											</span>
											<span className={styles.icon} aria-hidden="true">
												<PixelIcon name={item.icon} size={18} />
											</span>
											<h3
												id={`service-${item.id}-title`}
												className={styles.title}
											>
												{item.title}
											</h3>
											<span className={styles.price}>{item.price}</span>
										</div>

										<p className={styles.description}>{item.description}</p>

										<div className={styles.foot}>
											<span className={`mono ${styles.term}`}>
												{item.term}
											</span>
											<ul className={styles.tags}>
												{item.tags.map((tag) => (
													<li className="tag" key={tag}>
														{tag}
													</li>
												))}
											</ul>
											<span className={styles.arrow} aria-hidden="true">
												<ArrowIcon size={13} />
											</span>
										</div>
									</article>
								</Link>
							</Reveal>
						</li>
					))}
				</ul>

				<Reveal>
					<div className={styles.footer}>
						<p className={styles.note}>{t('note')}</p>
						<Link href="/pricing" className="link-underline">
							{t('allLink')}
							<span className={styles.bracket} aria-hidden="true">
								<ArrowIcon size={12} />
							</span>
						</Link>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
