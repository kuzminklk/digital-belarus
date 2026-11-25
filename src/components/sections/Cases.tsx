'use client';

import {useEffect, useRef, useState, type MouseEvent} from 'react';
import {useTranslations} from 'next-intl';
import SectionHeading from '@/components/ui/SectionHeading';
import ArrowIcon from '@/components/ui/ArrowIcon';
import PixelIcon from '@/components/brand/PixelIcon';
import CaseArt from './CaseArt';
import styles from './Cases.module.css';

type CaseKind = 'live' | 'concept';

type CaseItem = {
	name: string;
	category: string;
	year: string;
	kind: CaseKind;
	liveUrl: string;
	summary: string;
	challenge: string;
	solution: string;
	stack: string[];
	result: string;
	metric: string;
};

const DIALOG_TITLE_ID = 'case-dialog-title';
const DIALOG_SUMMARY_ID = 'case-dialog-summary';

export default function Cases() {
	const t = useTranslations('cases');
	const tCommon = useTranslations('common');
	const items = t.raw('items') as CaseItem[];
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
		<section id="cases" className={`section ${styles.cases}`} aria-label={t('label')}>
			<div className="container">
				<SectionHeading
					index={t('index')}
					label={t('label')}
					title={t('title')}
					accent={t('titleAccent')}
					intro={t('intro')}
				/>

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
									<span className={styles.artWrap}>
										<span className={styles.art} data-art={index % 4}>
											<CaseArt index={index} />
										</span>
										<span
											className={`tag ${styles.kind}`}
											data-kind={item.kind}
										>
											<span className={styles.kindDot} aria-hidden="true" />
											{kindLabel}
										</span>
										<span className={`mono ${styles.year}`} aria-hidden="true">
											{item.year}
										</span>
										<span className={styles.hoverLine} aria-hidden="true" />
									</span>

									<span className={styles.body}>
										<span className={styles.meta}>
											<span className={`mono ${styles.category}`}>
												{item.category}
											</span>
											<span className={`mono ${styles.metric}`}>
												{item.metric}
											</span>
										</span>
										<span className={styles.name}>{item.name}</span>
										<span className={styles.summary}>{item.summary}</span>
										<span className={styles.action}>
											<span>{t('viewCase')}</span>
											<ArrowIcon size={13} />
										</span>
									</span>
								</button>
							</li>
						);
					})}
				</ul>

				<p className={styles.note}>
					<span className={styles.noteTick} aria-hidden="true" />
					{t('note')}
				</p>
			</div>

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
								<span className={styles.dialogKind} data-kind={activeCase.kind}>
									<span className={styles.kindDot} aria-hidden="true" />
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
								<PixelIcon name="close" size={16} />
							</button>
						</header>

						<h3 id={DIALOG_TITLE_ID} className={styles.dialogTitle}>
							{activeCase.name}
						</h3>
						<p id={DIALOG_SUMMARY_ID} className={styles.dialogSummary}>
							{activeCase.summary}
						</p>

						<div className={styles.dialogArt} data-art={active % 4} aria-hidden="true">
							<CaseArt index={active} />
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
		</section>
	);
}
