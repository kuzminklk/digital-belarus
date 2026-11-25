'use client';

import {useEffect, useState} from 'react';
import {useLocale} from 'next-intl';

/** Live local time in Minsk. Server renders a placeholder to stay static. */
export default function MinskClock() {
	const locale = useLocale();
	const [time, setTime] = useState<string | null>(null);

	useEffect(() => {
		const formatter = new Intl.DateTimeFormat(locale, {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
			timeZone: 'Europe/Minsk',
		});

		const tick = () => setTime(formatter.format(new Date()));
		tick();
		const interval = window.setInterval(tick, 30_000);
		return () => window.clearInterval(interval);
	}, [locale]);

	return (
		<span className="mono" suppressHydrationWarning>
			{time ?? '--:--'}
		</span>
	);
}
