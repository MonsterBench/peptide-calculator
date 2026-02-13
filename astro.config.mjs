import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://peptalkpeptides.com',
  integrations: [
    preact({ compat: true }),
    sitemap(),
    tailwind(),
  ],
  output: 'static',
});
