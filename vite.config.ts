import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'

const config: UserConfig = {
	plugins: [
		sveltekit(),
		SvelteKitPWA({   
			srcDir: './src',
			mode: 'development',   
			
			manifest: { 
				short_name: 'Music',
					name: 'PWA Music App',
					start_url: '/',
					scope: '/',
					display: 'standalone',
					theme_color: "#4162db",
					background_color: "#1e1e1e",
			  icons: [
				{
				  "src": "/icons/manifest-icon-192.maskable.png",
				  "sizes": "192x192",
				  "type": "image/png",
				  "purpose": "any"
				},
				{
				  "src": "/icons/manifest-icon-192.maskable.png",
				  "sizes": "192x192",
				  "type": "image/png",
				  "purpose": "maskable"
				},
				{
				  "src": "/icons/manifest-icon-512.maskable.png",
				  "sizes": "512x512",
				  "type": "image/png",
				  "purpose": "any"
				},
				{
				  "src": "/icons/manifest-icon-512.maskable.png",
				  "sizes": "512x512",
				  "type": "image/png",
				  "purpose": "maskable"
				}
			  ]
			},
			workbox:{
				runtimeCaching: [{
					urlPattern: ({url}) => {
						return url.pathname.startsWith("/src/lib");
					},
					handler: "CacheFirst" as const,
					options: {
						cacheName: "icons-cache",
						cacheableResponse: {
							statuses: [0, 200]
						}
					}
				},{
					urlPattern: ({url}) => {
						return url.pathname.startsWith("/v0/b/pwa-music-fced1.appspot.com/");
					},
					handler: "NetworkFirst" as const,
					options: {
						cacheName: "album-art-cache",
						cacheableResponse: {
							statuses: [0, 200]
						}
					}
				},]
			},
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: '/',
			},
			
		  })
	],
	server: {
		host: true,
		fs: {
			
			allow: ['../..']
		},
	},

};

export default config;
