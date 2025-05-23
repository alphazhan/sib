import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: { adapter: adapter(),
		alias: {
			$components: 'src/lib/components',
			$utils: 'src/lib/utils',
		}
	 }
};

export default config;
