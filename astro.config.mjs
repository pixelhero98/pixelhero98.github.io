// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
	site: process.env.PUBLIC_SITE_URL ?? 'https://pixelhero98.github.io',
	output: 'static',
	integrations: [mdx(), sitemap()],
	build: {
		format: 'directory',
	},
});
