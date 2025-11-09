import { defineConfig } from 'astro/config';
import githubPages from '@astrojs/github-pages';
import legacyStatic from './integrations/legacy-static.js';

export default defineConfig({
  site: 'https://acompa.net',
  base: '/',
  output: 'static',
  integrations: [githubPages(), legacyStatic()],
});
