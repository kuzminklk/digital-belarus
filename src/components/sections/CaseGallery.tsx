'use client';

import {useEffect, useRef, useState, type MouseEvent} from 'react';
import Image from 'next/image';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import ArrowIcon from '@/components/ui/ArrowIcon';
import PixelIcon from '@/components/brand/PixelIcon';
import type {CaseItem} from './Cases';
import {CASE_SLUGS} from '@/content/pages';
import styles from './Cases.module.css';

type CaseGalleryProps = {
	items: CaseItem[];
};

const CASE_IMAGES: string[] = [
	'/pixel/case-yasna.png',
	'/pixel/case-central-park.png',
	'/pixel/case-spadchyna.png',
	'/pixel/case-prabot.png',
];

const DIALOG_TITLE_ID = 'case-dialog-title';
const DIALOG_SUMMARY_ID = 'case-dialog-summary';

function caseImage(index: number): string {
	return CASE_IMAGES[index % CASE_IMAGES.length];
}

export default function CaseGallery({items}: CaseGalleryProps) {
	const t = useTranslations('cases');
	const tCommon = useTranslations('common');
	const [active, setActive] = useState<number | null>(null);
	const dialogRef = useRef<HTMLDialogElement>(null);
	const triggersRef = useRef<Array<HTMLButtonElement | null>>([]);
	const returnFocusRef = useRef<HTMLButtonElement | null>(null);

	const activeCase = active === null ? null : (items[active] ?? null);

	useEffect(() => {
		if (active === null) return;
		const dialog = dialogRef.current;
		if (!dialog) return;

		returnFocusRef.current = triggersRef.current[active] ?? null;
		if (!dialog.open) dialog.showModal();
		document.body.style.overflow = 'hidden';

		return () => {
			document.body.style.overflow = '';
		};
	}, [active]);

	const openCase = (index: number) => setActive(index);

	const closeDialog = () => {
		dialogRef.current?.close();
	};

	const handleClose = () => {
		const trigger = returnFocusRef.current;
		returnFocusRef.current = null;
		setActive(null);
		window.requestAnimationFrame(() => trigger?.focus());
	};

	const handleDialogClick = (event: MouseEvent<HTMLDialogElement>) => {
		if (event.target === dialogRef.current) closeDialog();
	};

	return (
		<>
			<ul className={styles.grid}>
				{items.map((item, index) => {
					const kindLabel = item.kind === 'live' ? t('live') : t('concept');

					return (
						<li className={styles.cell} key={item.name}>
							<button
								type="button"
								className={styles.card}
								onClick={() => openCase(index)}
								aria-haspopup="dialog"
								ref={(node) => {
									triggersRef.current[index] = node;
								}}
							>
								<span className={styles.imageFrame}>
									<Image
										src={caseImage(index)}
										alt=""
										fill
										unoptimized
										sizes="(max-width: 900px) 100vw, 50vw"
										className={styles.image}
									/>
									<span className={`mono ${styles.kind}`} data-kind={item.kind}>
										{kindLabel}
									</span>
								</span>

								<span className={styles.caption}>
									<span className={styles.metaRow}>
										<span className={`mono ${styles.meta}`}>
											{item.category}
										</span>
										<span className={`mono ${styles.meta}`}>{item.year}</span>
									</span>
									<span className={styles.name}>{item.name}</span>
									<span className={styles.summary}>{item.summary}</span>
									<span className={styles.metricRow}>
										<span className={`mono ${styles.metric}`}>
											{item.metric}
										</span>
										<span className={`mono ${styles.view}`}>
											{t('viewCase')}
											<span className={styles.bracket} aria-hidden="true">
												<ArrowIcon size={12} />
											</span>
										</span>
									</span>
								</span>
							</button>
						</li>
					);
				})}
			</ul>

			<dialog
				ref={dialogRef}
				className={styles.dialog}
				aria-labelledby={DIALOG_TITLE_ID}
				aria-describedby={DIALOG_SUMMARY_ID}
				onClose={handleClose}
				onClick={handleDialogClick}
			>
				{activeCase && active !== null ? (
					<div className={styles.dialogInner}>
						<header className={styles.dialogHead}>
							<div className={styles.dialogMeta}>
								<span
									className={`mono ${styles.dialogKind}`}
									data-kind={activeCase.kind}
								>
									{activeCase.kind === 'live' ? t('live') : t('concept')}
								</span>
								<span className={`mono ${styles.dialogContext}`}>
									{activeCase.category} · {activeCase.year}
								</span>
							</div>
							<button
								type="button"
								className={styles.close}
								onClick={closeDialog}
								aria-label={t('close')}
								title={t('close')}
							>
								<span className={styles.closeBracket} aria-hidden="true">
									[
								</span>
								<PixelIcon name="close" size={14} />
								<span className={styles.closeBracket} aria-hidden="true">
									]
								</span>
							</button>
						</header>

						<h3 id={DIALOG_TITLE_ID} className={styles.dialogName}>
							{activeCase.name}
						</h3>
						<p id={DIALOG_SUMMARY_ID} className={styles.dialogSummary}>
							{activeCase.summary}
						</p>

						<div className={styles.dialogCover}>
							<Image
								src={caseImage(active)}
								alt=""
								fill
								unoptimized
								sizes="(max-width: 1000px) 100vw, 62vw"
								className={styles.dialogImage}
							/>
						</div>

						<dl className={styles.details}>
							<div className={styles.detail}>
								<dt className="mono">{t('challenge')}</dt>
								<dd>{activeCase.challenge}</dd>
							</div>
							<div className={styles.detail}>
								<dt className="mono">{t('solution')}</dt>
								<dd>{activeCase.solution}</dd>
							</div>
						</dl>

						<div className={styles.stackRow}>
							<p className={`mono ${styles.stackLabel}`}>{t('stack')}</p>
							<ul className={styles.stack}>
								{activeCase.stack.map((tech) => (
									<li className="tag" key={tech}>
										{tech}
									</li>
								))}
							</ul>
						</div>

						<div className={styles.resultRow}>
							<p className={`mono ${styles.stackLabel}`}>{t('result')}</p>
							<p className={styles.resultText}>{activeCase.result}</p>
						</div>

						<footer className={styles.dialogFoot}>
							<Link
								href={`/cases/${CASE_SLUGS[active]}`}
								className="link-underline"
								onClick={closeDialog}
							>
								{t('openPage')}
								<ArrowIcon size={12} />
							</Link>
							{activeCase.kind === 'live' && activeCase.liveUrl ? (
								<a
									className="btn btn--primary btn--small"
									href={activeCase.liveUrl}
									target="_blank"
									rel="noreferrer"
								>
									{t('visit')}
									<ArrowIcon size={12} />
									<span className="sr-only">{tCommon('external')}</span>
								</a>
							) : (
								<p className={styles.conceptNote}>{t('note')}</p>
							)}
							<p className={`mono ${styles.dialogMetric}`} aria-hidden="true">
								{activeCase.metric}
							</p>
						</footer>
					</div>
				) : null}
			</dialog>
		</>
	);
}
