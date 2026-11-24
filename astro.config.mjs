import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://academy.cc3po.com',
  integrations: [sitemap()],
});
