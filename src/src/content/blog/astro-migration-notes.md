---
title: "Migration notes: from legacy HTML to Astro"
description: "How we staged the new Astro experience alongside our existing static site."
pubDate: 2025-01-20
heroImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
---

Astro made it straightforward to coexist with our legacy HTML exports. By placing the Astro project inside the repository's `src/` directory we can iterate without rewriting history, while GitHub Pages keeps serving the current production site.

### Key takeaways

1. **Parallel builds.** We continue committing HTML updates as usual and run `npm run build` inside `src/` to produce the static output for testing.
2. **Content collections.** The new blog template treats posts as markdown/mdx files with strong frontmatter typing via Zod.
3. **GitHub Actions.** Deployments are now automated with dedicated staging and production workflows.

Expect more detailed tutorials once we flip the switch and make the Astro version live.
