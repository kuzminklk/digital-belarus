import {getTranslations} from 'next-intl/server';
import SectionHeading from '@/components/ui/SectionHeading';
import Reveal from '@/components/ui/Reveal';
import styles from './Why.module.css';

type Reason = {
	num: string;
	title: string;
	text: string;
};

export default async function Why() {
	const t = await getTranslations('why');
	const items = t.raw('items') as Reason[];

	return (
		<section id="why" className={`section ${styles.why}`} aria-label={t('label')}>
			<div className="container">
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent={t('titleAccent')}
					align="start"
				/>

				<ul className={styles.list}>
					{items.map((item, index) => (
						<li className={styles.item} key={item.num}>
							<Reveal delay={index * 60}>
								<article className={styles.row}>
									<span className={`mono ${styles.num}`} aria-hidden="true">
										{item.num}
									</span>
									<div className={styles.body}>
										<h3 className={styles.title}>{item.title}</h3>
										<p className={styles.text}>{item.text}</p>
									</div>
									<span className={styles.mark} aria-hidden="true" />
								</article>
							</Reveal>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}
