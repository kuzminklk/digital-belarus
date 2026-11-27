import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import ArrowIcon from '@/components/ui/ArrowIcon';
import {site} from '@/lib/site';
import styles from './CtaBand.module.css';

export default async function CtaBand() {
	const pages = await getTranslations('pages');
	const common = await getTranslations('common');

	return (
		<section className={`on-paper ${styles.band}`}>
			<div className={`container ${styles.inner}`}>
				<div className={styles.copy}>
					<p className="mono">NEXT OBSERVATION</p>
					<h2 className={styles.title}>{pages('startProject')}</h2>
					<p className={styles.intro}>{pages('ctaIntro')}</p>
				</div>
				<div className={styles.actions}>
					<Link href="/contact" className="btn btn--primary">
						{common('ctaDiscuss')}
						<ArrowIcon />
					</Link>
					<a
						href={site.telegram}
						target="_blank"
						rel="noreferrer"
						className="link-underline"
					>
						{common('ctaContact')}
						<ArrowIcon size={12} />
					</a>
				</div>
			</div>
		</section>
	);
}
