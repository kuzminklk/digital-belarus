import {getTranslations} from 'next-intl/server';
import {site} from '@/lib/site';
import SectionHeading from '@/components/ui/SectionHeading';
import PixelIcon, {type PixelIconName} from '@/components/brand/PixelIcon';
import ArrowIcon from '@/components/ui/ArrowIcon';
import MinskClock from './MinskClock';
import ContactForm from './ContactForm';
import styles from './Contact.module.css';

type Channel = {
	key: string;
	icon: PixelIconName;
	label: string;
	value: string;
	href?: string;
};

type ContactProps = {showHeading?: boolean};

export default async function Contact({showHeading = true}: ContactProps = {}) {
	const t = await getTranslations('contact');

	const channels: Channel[] = [
		{
			key: 'telegram',
			icon: 'telegram',
			label: t('channels.telegramLabel'),
			value: site.telegramHandle,
			href: site.telegram,
		},
		{
			key: 'github',
			icon: 'github',
			label: t('channels.githubLabel'),
			value: t('channels.githubValue'),
			href: site.github,
		},
		{
			key: 'location',
			icon: 'pin',
			label: t('channels.locationLabel'),
			value: t('channels.locationValue'),
		},
		{
			key: 'hours',
			icon: 'clock',
			label: t('channels.hoursLabel'),
			value: t('channels.hoursValue'),
		},
	];

	return (
		<section id="contact" className={`section ${styles.contact}`}>
			<div className="container">
				{showHeading ? (
					<SectionHeading
						index={t('index')}
						label={t('label')}
						title={t('title')}
						accent={t('titleAccent')}
						typeName="section.contact"
						intro={t('intro')}
					/>
				) : null}

				<div className={styles.grid}>
					<div className={styles.side}>
						<ul className={styles.channels}>
							{channels.map((channel) => {
								const content = (
									<>
										<span className={styles.channelIcon} aria-hidden="true">
											<PixelIcon name={channel.icon} size={18} />
										</span>
										<span className={styles.channelBody}>
											<span className={`mono ${styles.channelLabel}`}>
												{channel.label}
											</span>
											<span className={styles.channelValue}>
												{channel.value}
											</span>
										</span>
										{channel.href ? (
											<ArrowIcon size={13} className={styles.channelArrow} />
										) : null}
									</>
								);

								return (
									<li key={channel.key}>
										{channel.href ? (
											<a
												href={channel.href}
												target="_blank"
												rel="noreferrer"
												className={styles.channel}
											>
												{content}
											</a>
										) : (
											<div className={styles.channel}>{content}</div>
										)}
									</li>
								);
							})}
						</ul>

						<div className={styles.statusCard}>
							<div className={styles.statusRow}>
								<span className="status-dot" aria-hidden="true" />
								<span className={styles.statusText}>{t('status')}</span>
							</div>
							<div className={styles.statusMeta}>
								<span className="mono">{t('channels.responseLabel')}</span>
								<span>{t('channels.responseValue')}</span>
							</div>
							<div className={styles.clockRow}>
								<span className={styles.clockLabel}>
									<span className="mono">MINSK</span>
									<span className={styles.clockCoordinates}>
										53.90°N · 27.56°E
									</span>
								</span>
								<MinskClock />
							</div>
						</div>

						<p className={styles.note}>{t('note')}</p>
					</div>

					<ContactForm />
				</div>
			</div>
		</section>
	);
}
