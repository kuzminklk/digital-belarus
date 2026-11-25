'use client';

import {useEffect, useRef, type CSSProperties, type ReactNode} from 'react';

type RevealProps = {
	children: ReactNode;
	className?: string;
	/** Delay in milliseconds, used to stagger neighbouring cards. */
	delay?: number;
};

/**
 * Fades and lifts content when it enters the viewport. Falls back to visible
 * when the user prefers reduced motion or IntersectionObserver is unavailable.
 */
export default function Reveal({children, className, delay = 0}: RevealProps) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		if (
			typeof IntersectionObserver === 'undefined' ||
			window.matchMedia('(prefers-reduced-motion: reduce)').matches
		) {
			element.dataset.reveal = 'visible';
			return;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						(entry.target as HTMLElement).dataset.reveal = 'visible';
						observer.unobserve(entry.target);
					}
				}
			},
			{threshold: 0.12, rootMargin: '0px 0px -8% 0px'},
		);

		observer.observe(element);
		return () => observer.disconnect();
	}, []);

	return (
		<div
			ref={ref}
			className={className}
			data-reveal="hidden"
			style={{'--reveal-delay': `${delay}ms`} as CSSProperties}
		>
			{children}
		</div>
	);
}
