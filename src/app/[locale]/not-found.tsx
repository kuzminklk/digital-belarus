import {getLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import PixelType from '@/components/brand/PixelType';
import PixelMark from '@/components/brand/PixelMark';
import ArrowIcon from '@/components/ui/ArrowIcon';
import styles from './not-found.module.css';

export default async function NotFound() {
	const t = await getTranslations('notFound');
	const locale = await getLocale();

	return (
		<div className={styles.page}>
			<div className={`container ${styles.inner}`}>
				<PixelMark size={64} tone="paper" />
				<p className={`mono ${styles.code}`}>{t('code')} / SIGNAL LOST</p>
				<h1 className={styles.title}>
					<PixelType
						locale={locale}
						name="page.notFound"
						text={t('title')}
						maxWidth={900}
					/>
				</h1>
				<p className={styles.description}>{t('description')}</p>
				<Link href="/" className="btn btn--primary">
					{t('cta')}
					<ArrowIcon />
				</Link>
			</div>
		</div>
	);
}
