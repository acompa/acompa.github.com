# acompa.net

Personal blog built with [Astro](https://astro.build/) and deployed to GitHub Pages.

## Setup

```
git clone git@github.com:acompa/acompa.github.com.git
cd acompa.github.com/src
npm install
```

## Local development

```
cd src
npm run dev
```

Visit [http://localhost:4321](http://localhost:4321).

## Writing a new post

Add a Markdown file to `src/src/content/blog/` with YAML frontmatter:

```markdown
---
title: "Post title"
description: "A short summary for RSS and meta tags."
pubDate: 2026-02-22
---

Post content here.
```

Posts render at `/posts/{slug}/` where the slug is the filename without `.md`.

LaTeX is supported via remark-math and rehype-katex: use `$...$` for inline math and `$$...$$` for display math.

## Building

```
cd src
npm run build
```

Output goes to `src/dist/`.

## Deploying

Pushes to `main` automatically deploy to production via GitHub Actions. There is also a `staging` branch/environment. To trigger a deploy manually:

```
cd src
npm run deploy:prod    # or deploy:staging
```

## Project structure

```
src/
  src/
    content/blog/   # Markdown blog posts
    layouts/        # BaseLayout.astro
    pages/          # index, /posts, /posts/[slug], rss.xml
  public/
    images/         # Local post images
    styles/         # global.css
  astro.config.mjs  # Site config, redirects, markdown plugins
  package.json
```
