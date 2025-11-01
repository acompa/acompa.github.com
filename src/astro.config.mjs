import { defineConfig } from 'astro/config';
import githubPages from '@astrojs/github-pages';

export default defineConfig({
  site: 'https://acompa.net',
  base: '/',
  output: 'static',
  integrations: [githubPages()],
});
