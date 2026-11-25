import {getLocale, getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/navigation';
import {localeNames, routing, type Locale} from '@/i18n/routing';
import {mainNav, site} from '@/lib/site';
import PixelMark from '@/components/brand/PixelMark';
import Rushnyk from '@/components/brand/Rushnyk';
import ArrowIcon from '@/components/ui/ArrowIcon';
import styles from './Footer.module.css';

type ServiceItem = {id: string; title: string};

export default async function Footer() {
	const t = await getTranslations();
	const services = await getTranslations('services');
	const locale = (await getLocale()) as Locale;
	const serviceItems = services.raw('items') as ServiceItem[];
	const year = new Date().getFullYear();

	return (
		<footer className={styles.footer}>
			<div className={styles.ornament}>
				<Rushnyk variant="border" tone="muted" height={22} animated={false} />
			</div>

			<div className={`container ${styles.container}`}>
				<div className={styles.top}>
					<div className={styles.brandBlock}>
						<Link href="/" className={styles.brand}>
							<PixelMark size={40} tone="red" />
							<span className={styles.brandText}>
								<span className={styles.brandName}>{t('common.brand')}</span>
								<span className={styles.brandMeta}>
									{t('common.brandLatin')} · {t('common.minsk')}
								</span>
							</span>
						</Link>
						<p className={styles.tagline}>{t('footer.tagline')}</p>
						<p className={styles.description}>{t('footer.description')}</p>
						<p className={styles.status}>
							<span className="status-dot" aria-hidden="true" />
							{t('footer.status')}
						</p>
					</div>

					<nav className={styles.column} aria-label={t('a11y.footerNav')}>
						<p className={`mono ${styles.columnTitle}`}>{t('footer.navLabel')}</p>
						<ul>
							{mainNav.map((item) => (
								<li key={item.id}>
									<Link href={`/#${item.id}`}>{t(`nav.${item.key}`)}</Link>
								</li>
							))}
						</ul>
					</nav>

					<nav className={styles.column} aria-label={t('footer.servicesLabel')}>
						<p className={`mono ${styles.columnTitle}`}>{t('footer.servicesLabel')}</p>
						<ul>
							{serviceItems.slice(0, 5).map((item) => (
								<li key={item.id}>
									<Link href={`/#${item.id}`}>{item.title}</Link>
								</li>
							))}
						</ul>
					</nav>

					<div className={styles.column}>
						<p className={`mono ${styles.columnTitle}`}>{t('footer.contactsLabel')}</p>
						<ul>
							<li>
								<a href={site.telegram} target="_blank" rel="noreferrer">
									{t('contact.channels.telegramLabel')} · {site.telegramHandle}
								</a>
							</li>
							<li>
								<a href={site.github} target="_blank" rel="noreferrer">
									{t('contact.channels.githubLabel')}
								</a>
							</li>
							<li>
								<a href={site.personal} target="_blank" rel="noreferrer">
									{t('studio.links.personal')}
								</a>
							</li>
							<li className={styles.mutedItem}>{t('footer.location')}</li>
						</ul>

						<ul className={styles.legalList}>
							<li>
								<Link href="/privacy">{t('footer.privacyLink')}</Link>
							</li>
							<li className={styles.mutedItem}>{t('footer.contract')}</li>
						</ul>

						<nav className={styles.locales} aria-label={t('a11y.languageSwitcher')}>
							{routing.locales.map((item) => (
								<Link
									key={item}
									href="/"
									locale={item}
									data-active={item === locale ? 'true' : undefined}
									aria-current={item === locale ? 'true' : undefined}
								>
									{localeNames[item].short}
								</Link>
							))}
						</nav>
					</div>
				</div>

				<div className={styles.wordmarkWrap} aria-hidden="true">
					<span className={styles.wordmark}>{t('common.brandLatin')}</span>
					<span className={styles.wordmarkStar}>
						<span />
						<span />
					</span>
				</div>

				<div className={styles.bottom}>
					<p>{t('footer.rights', {year})}</p>
					<p className={styles.credit}>{t('footer.credit')}</p>
					<div className={styles.bottomActions}>
						<a href="#top" className={styles.toTop}>
							{t('footer.backToTop')}
							<ArrowIcon size={12} className={styles.toTopIcon} />
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
}
