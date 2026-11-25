type ArrowIconProps = {
	size?: number;
	className?: string;
};

/** Thin diagonal arrow used by buttons and links. Decorative. */
export default function ArrowIcon({size = 14, className}: ArrowIconProps) {
	return (
		<svg
			className={className}
			width={size}
			height={size}
			viewBox="0 0 16 16"
			fill="none"
			aria-hidden="true"
			focusable="false"
		>
			<path d="M4 12L12 4M12 4H5.5M12 4v6.5" stroke="currentColor" strokeWidth="1.2" />
		</svg>
	);
}
