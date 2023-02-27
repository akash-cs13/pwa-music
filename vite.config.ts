import { sveltekit } from '@sveltejs/kit/vite';
import type { UserConfig } from 'vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit'


const config: UserConfig = {
	plugins: [
		sveltekit(),
		SvelteKitPWA({
			srcDir: './src',
				mode: 'development',
				strategies: 'injectManifest',
				filename: 'prompt-sw.ts',
				scope: '/',
				base: '/',
			manifest: {
				short_name: 'Svelteify',
				name: 'Svelteify',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				theme_color: "#1e1e1e",
				background_color: "#1e1e1e",
				icons: [
					{
						src: '/svelteify_192px.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: '/svelteify.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: '/svelteify.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable',
					},
				],
			},
			
			injectManifest: {
				globPatterns: ['client/**/*.{js,css,ico,png,svg,webp,woff,woff2}']
			},
			devOptions: {
				enabled: true,
				type: 'module',
				navigateFallback: '/',
			},
			// if you have shared info in svelte config file put in a separate module and use it also here
			kit: {}
		
		})
	],
	server: {
		host: true,
		
	},

};

export default config;
