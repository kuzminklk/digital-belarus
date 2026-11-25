import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import PixelMark from '@/components/brand/PixelMark';
import ArrowIcon from '@/components/ui/ArrowIcon';
import styles from './not-found.module.css';

export default async function NotFound() {
	const t = await getTranslations('notFound');

	return (
		<div className={styles.page}>
			<div className={`container ${styles.inner}`}>
				<PixelMark size={64} tone="red" />
				<p className={`mono ${styles.code}`}>{t('code')}</p>
				<h1 className={styles.title}>{t('title')}</h1>
				<p className={styles.description}>{t('description')}</p>
				<Link href="/" className="btn btn--primary">
					{t('cta')}
					<ArrowIcon />
				</Link>
				<div className={styles.orbit} aria-hidden="true">
					<span />
					<span />
					<span />
				</div>
			</div>
		</div>
	);
}
