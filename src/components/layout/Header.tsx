'use client';

import {useEffect, useRef, useState, type CSSProperties} from 'react';
import {useLocale, useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/navigation';
import {localeNames, routing, type Locale} from '@/i18n/routing';
import {mainNav} from '@/lib/site';
import PixelMark from '@/components/brand/PixelMark';
import PixelType from '@/components/brand/PixelType';
import ArrowIcon from '@/components/ui/ArrowIcon';
import styles from './Header.module.css';

const MENU_ID = 'site-menu';

export default function Header() {
	const t = useTranslations();
	const locale = useLocale() as Locale;
	const pathname = usePathname();
	const [scrolled, setScrolled] = useState(false);
	const [open, setOpen] = useState(false);
	const [progress, setProgress] = useState(0);
	const toggleRef = useRef<HTMLButtonElement>(null);

	useEffect(() => {
		let frame = 0;

		const update = () => {
			frame = 0;
			const top = window.scrollY;
			const max = document.documentElement.scrollHeight - window.innerHeight;
			setScrolled(top > 16);
			setProgress(max > 0 ? Math.min(top / max, 1) : 0);
		};

		const onScroll = () => {
			if (!frame) frame = window.requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', onScroll, {passive: true});
		window.addEventListener('resize', onScroll);
		return () => {
			window.removeEventListener('scroll', onScroll);
			window.removeEventListener('resize', onScroll);
			if (frame) window.cancelAnimationFrame(frame);
		};
	}, []);

	useEffect(() => {
		if (!open) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setOpen(false);
				toggleRef.current?.focus();
			}
		};

		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', onKeyDown);
		const firstLink = document.querySelector<HTMLAnchorElement>(`#${MENU_ID} a`);
		firstLink?.focus();

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [open]);

	return (
		<header
			id="top"
			className={styles.header}
			data-scrolled={scrolled ? 'true' : 'false'}
			data-open={open ? 'true' : 'false'}
		>
			<div className={styles.inner}>
				<Link href="/" className={styles.brand}>
					<PixelMark size={36} tone="paper" className={styles.mark} />
					<PixelType
						locale={locale}
						name="header.brand"
						text={t('common.brand')}
						maxWidth={240}
						className={styles.brandType}
					/>
				</Link>

				<nav className={styles.nav} aria-label={t('a11y.mainNav')}>
					{mainNav.map((item) => (
						<Link key={item.id} href={`/#${item.id}`} className={styles.navLink}>
							{t(`nav.${item.key}`)}
						</Link>
					))}
				</nav>

				<div className={styles.actions}>
					<nav className={styles.locales} aria-label={t('a11y.languageSwitcher')}>
						{routing.locales.map((item) => (
							<Link
								key={item}
								href={pathname || '/'}
								locale={item}
								className={styles.locale}
								data-active={item === locale ? 'true' : 'false'}
								aria-current={item === locale ? 'true' : undefined}
								title={localeNames[item].native}
							>
								{localeNames[item].short}
							</Link>
						))}
					</nav>

					<Link href="/#contact" className={`${styles.cta} btn btn--primary btn--small`}>
						{t('common.ctaDiscuss')}
						<ArrowIcon size={12} />
					</Link>

					<button
						ref={toggleRef}
						type="button"
						className={styles.toggle}
						aria-expanded={open}
						aria-controls={MENU_ID}
						aria-label={open ? t('a11y.closeMenu') : t('a11y.openMenu')}
						onClick={() => setOpen((value) => !value)}
					>
						<span />
						<span />
					</button>
				</div>
			</div>

			<div className={styles.progress} style={{'--progress': progress} as CSSProperties} />

			<div id={MENU_ID} className={styles.panel} aria-hidden={!open} inert={!open}>
				<div className={styles.panelInner}>
					<nav className={styles.mobileNav} aria-label={t('a11y.mainNav')}>
						{mainNav.map((item, index) => (
							<Link
								key={item.id}
								href={`/#${item.id}`}
								className={styles.mobileLink}
								onClick={() => setOpen(false)}
							>
								<span className={styles.mobileIndex}>
									{String(index + 1).padStart(2, '0')}
								</span>
								{t(`nav.${item.key}`)}
							</Link>
						))}
					</nav>

					<div className={styles.panelFoot}>
						<Link
							href="/#contact"
							className="btn btn--primary"
							onClick={() => setOpen(false)}
						>
							{t('common.ctaDiscuss')}
							<ArrowIcon />
						</Link>
						<div className={styles.panelLocales}>
							<span className="mono muted">{t('a11y.languageSwitcher')}</span>
							<nav className={styles.locales} aria-label={t('a11y.languageSwitcher')}>
								{routing.locales.map((item) => (
									<Link
										key={item}
										href={pathname || '/'}
										locale={item}
										className={styles.locale}
										data-active={item === locale ? 'true' : 'false'}
										aria-current={item === locale ? 'true' : undefined}
										onClick={() => setOpen(false)}
									>
										{localeNames[item].native}
									</Link>
								))}
							</nav>
						</div>
						<p className={styles.panelContact}>
							<a href="https://t.me/kuzminklk">@kuzminklk</a>
							<span className="mono">{t('common.minsk')}</span>
						</p>
					</div>
				</div>
			</div>
		</header>
	);
}
