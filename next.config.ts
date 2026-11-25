import createNextIntlPlugin from 'next-intl/plugin';
import type {NextConfig} from 'next';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
	reactStrictMode: true,
	poweredByHeader: false,
	typedRoutes: false,
	async headers() {
		return [
			{
				source: '/(.*)',
				headers: [
					{key: 'X-Content-Type-Options', value: 'nosniff'},
					{key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
					{key: 'X-Frame-Options', value: 'DENY'},
					{
						key: 'Permissions-Policy',
						value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
					},
				],
			},
			{
				source: '/fonts/(.*)',
				headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}],
			},
			{
				source: '/og/(.*)',
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=604800, stale-while-revalidate=86400',
					},
				],
			},
		];
	},
};

export default withNextIntl(nextConfig);
