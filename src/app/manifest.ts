import type {MetadataRoute} from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Digital Belarus',
		short_name: 'Digital BY',
		description:
			'Websites, Telegram bots and AI for business in Belarus — a digital studio from Minsk.',
		start_url: '/ru',
		display: 'standalone',
		background_color: '#05080b',
		theme_color: '#05080b',
		lang: 'ru',
		icons: [
			{src: '/icon.png', sizes: '512x512', type: 'image/png'},
			{src: '/apple-icon.png', sizes: '180x180', type: 'image/png'},
			{src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml'},
		],
	};
}
