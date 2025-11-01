export default function githubPages() {
  return {
    name: '@astrojs/github-pages',
    hooks: {
      'astro:config:setup'({ config }) {
        if (!config.site) {
          console.warn('[github-pages] The `site` option is required for GitHub Pages deployments.');
        }
      },
    },
  };
}
