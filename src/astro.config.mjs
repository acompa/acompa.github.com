import { defineConfig } from 'astro/config';
import githubPages from '@astrojs/github-pages';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

export default defineConfig({
  site: 'https://acompa.net',
  base: '/',
  output: 'static',
  integrations: [githubPages()],
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
  },
  redirects: {
    '/beyond-trending-topics.html': '/posts/beyond-trending-topics/',
    '/git-for-ds-at-iheart.html': '/posts/git-for-ds-at-iheart/',
    '/installing-r-and-rpy2-from-scratch.html': '/posts/installing-r-and-rpy2-from-scratch/',
    '/large-scale-data-airbnb.html': '/posts/large-scale-data-airbnb/',
    '/mle-job-hunt-2024.html': '/posts/mle-job-hunt-2024/',
    '/on-regularization.html': '/posts/on-regularization/',
    '/presenting-leptoid-at-surge-2012.html': '/posts/presenting-leptoid-at-surge-2012/',
    '/recsys-2018.html': '/posts/recsys-2018/',
    '/scipy-2017.html': '/posts/scipy-2017/',
    '/sleeplessness-bad-code.html': '/posts/sleeplessness-bad-code/',
    '/using-item-response-theory-instead-of-traditional-grading-to-assess-student-proficiency.html': '/posts/using-item-response-theory-instead-of-traditional-grading-to-assess-student-proficiency/',
    '/feeds/all.atom.xml': '/rss.xml',
  },
});
