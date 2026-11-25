'use client';

import {useState, type FormEvent} from 'react';
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
import {site} from '@/lib/site';
import ArrowIcon from '@/components/ui/ArrowIcon';
import styles from './ContactForm.module.css';

type Values = {
	name: string;
	contact: string;
	service: string;
	budget: string;
	message: string;
	consent: boolean;
};

type ErrorKey = 'name' | 'contact' | 'consent' | 'form';

const INITIAL: Values = {
	name: '',
	contact: '',
	service: '',
	budget: '',
	message: '',
	consent: false,
};

async function copyText(text: string): Promise<boolean> {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch {
		// Fall through to the legacy path.
	}

	try {
		const textarea = document.createElement('textarea');
		textarea.value = text;
		textarea.setAttribute('readonly', '');
		textarea.style.position = 'fixed';
		textarea.style.opacity = '0';
		document.body.appendChild(textarea);
		textarea.select();
		const copied = document.execCommand('copy');
		document.body.removeChild(textarea);
		return copied;
	} catch {
		return false;
	}
}

export default function ContactForm() {
	const t = useTranslations('contact');
	const tRoot = useTranslations();
	const [values, setValues] = useState<Values>(INITIAL);
	const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
	const [state, setState] = useState<'idle' | 'sending' | 'success'>('idle');
	const [copied, setCopied] = useState(false);

	const serviceOptions = t.raw('form.serviceOptions') as string[];
	const budgetOptions = t.raw('form.budgetOptions') as string[];

	const update = <K extends keyof Values>(key: K, value: Values[K]) => {
		setValues((current) => ({...current, [key]: value}));
		setErrors((current) => {
			if (!(key in current)) return current;
			const next = {...current};
			delete next[key as ErrorKey];
			return next;
		});
	};

	const validate = (): boolean => {
		const next: Partial<Record<ErrorKey, string>> = {};
		if (!values.name.trim()) next.name = t('form.errorName');
		if (!values.contact.trim()) next.contact = t('form.errorContact');
		if (!values.consent) next.consent = t('form.errorConsent');
		setErrors(next);
		return Object.keys(next).length === 0;
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!validate()) return;

		const lines = [
			t('form.requestTitle'),
			`${t('form.nameLabel')}: ${values.name.trim()}`,
			`${t('form.contactLabel')}: ${values.contact.trim()}`,
			values.service ? `${t('form.serviceLabel')}: ${values.service}` : null,
			values.budget ? `${t('form.budgetLabel')}: ${values.budget}` : null,
			values.message.trim() ? `${t('form.messageLabel')}: ${values.message.trim()}` : null,
		].filter((line): line is string => Boolean(line));

		setState('sending');

		// Open Telegram synchronously so pop-up blockers keep the user gesture.
		// `noopener` makes the browser return null even on success, so we cannot
		// use the return value to detect blocking; the success screen always
		// includes a direct link as a fallback.
		window.open(site.telegram, '_blank', 'noopener,noreferrer');

		const didCopy = await copyText(lines.join('\n'));
		setCopied(didCopy);
		setState('success');
	};

	if (state === 'success') {
		return (
			<div className={`panel ${styles.panel} ${styles.success}`} role="status">
				<p className="mono muted">BRIEF / SENT</p>
				<div className={styles.successMark} aria-hidden="true">
					<span />
					<span />
					<span />
					<span />
				</div>
				<h3 className={styles.successTitle}>{t('form.successTitle')}</h3>
				<p className={styles.successNote}>
					{copied ? t('form.successNote') : t('form.successNoteFallback')}
				</p>
				<a
					href={site.telegram}
					target="_blank"
					rel="noreferrer"
					className="btn btn--primary"
				>
					{t('form.fallback')}
					<ArrowIcon />
				</a>
				<button
					type="button"
					className={styles.again}
					onClick={() => {
						setValues(INITIAL);
						setErrors({});
						setState('idle');
					}}
				>
					{t('form.sendAnother')}
				</button>
			</div>
		);
	}

	return (
		<form className={`panel ${styles.panel}`} onSubmit={handleSubmit} noValidate>
			<div className={styles.panelHead}>
				<p className="mono muted">BRIEF / 01</p>
				<p className="mono muted">
					{t('channels.responseLabel')} — {t('channels.responseValue')}
				</p>
			</div>

			<div className={styles.fields}>
				<div className={styles.row}>
					<div className="field">
						<label htmlFor="contact-name">{t('form.nameLabel')}</label>
						<input
							id="contact-name"
							className="input"
							name="name"
							autoComplete="name"
							placeholder={t('form.namePlaceholder')}
							value={values.name}
							onChange={(event) => update('name', event.target.value)}
							aria-invalid={Boolean(errors.name)}
							aria-describedby={errors.name ? 'error-name' : undefined}
						/>
						{errors.name ? (
							<p className="error" id="error-name">
								{errors.name}
							</p>
						) : null}
					</div>

					<div className="field">
						<label htmlFor="contact-channel">{t('form.contactLabel')}</label>
						<input
							id="contact-channel"
							className="input"
							name="contact"
							autoComplete="off"
							placeholder={t('form.contactPlaceholder')}
							value={values.contact}
							onChange={(event) => update('contact', event.target.value)}
							aria-invalid={Boolean(errors.contact)}
							aria-describedby={errors.contact ? 'error-contact' : undefined}
						/>
						{errors.contact ? (
							<p className="error" id="error-contact">
								{errors.contact}
							</p>
						) : null}
					</div>
				</div>

				<div className={styles.row}>
					<div className="field">
						<label htmlFor="contact-service">{t('form.serviceLabel')}</label>
						<select
							id="contact-service"
							className="select"
							name="service"
							value={values.service}
							onChange={(event) => update('service', event.target.value)}
						>
							<option value="">{t('form.servicePlaceholder')}</option>
							{serviceOptions.map((option) => (
								<option value={option} key={option}>
									{option}
								</option>
							))}
						</select>
					</div>

					<div className="field">
						<label htmlFor="contact-budget">{t('form.budgetLabel')}</label>
						<select
							id="contact-budget"
							className="select"
							name="budget"
							value={values.budget}
							onChange={(event) => update('budget', event.target.value)}
						>
							<option value="">{t('form.budgetPlaceholder')}</option>
							{budgetOptions.map((option) => (
								<option value={option} key={option}>
									{option}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className="field">
					<label htmlFor="contact-task">{t('form.messageLabel')}</label>
					<textarea
						id="contact-task"
						className="textarea"
						name="message"
						placeholder={t('form.messagePlaceholder')}
						value={values.message}
						onChange={(event) => update('message', event.target.value)}
					/>
				</div>

				<div className={styles.consentRow}>
					<label className="checkbox">
						<input
							type="checkbox"
							checked={values.consent}
							onChange={(event) => update('consent', event.target.checked)}
							aria-invalid={Boolean(errors.consent)}
							aria-describedby={errors.consent ? 'error-consent' : undefined}
						/>
						<span>{t('form.consent')}</span>
					</label>
					<Link href="/privacy" className={styles.privacyLink}>
						{tRoot('footer.privacyLink')}
					</Link>
					{errors.consent ? (
						<p className="error" id="error-consent">
							{errors.consent}
						</p>
					) : null}
				</div>

				{errors.form ? (
					<p className="error" role="alert">
						{errors.form}
					</p>
				) : null}

				<div className={styles.submitRow}>
					<button
						type="submit"
						className="btn btn--primary"
						disabled={state === 'sending'}
					>
						{t('form.submit')}
						<ArrowIcon />
					</button>
					<p className={styles.privacyHint}>{t('form.copyHint')}</p>
				</div>
			</div>
		</form>
	);
}
