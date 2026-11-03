# Writing and publishing a blog post

The blog lives at `/blog/`. Articles are Markdown (`.md`) or MDX (`.mdx`) files in `src/content/blog/`. MDX is useful when an article includes an Astro component; ordinary Markdown is enough for text, code, and mathematics.

## Start an article

Create `src/content/blog/my-article.md`:

```markdown
---
title: "My article title"
description: "One sentence explaining what the reader will learn."
date: 2026-11-03
tags: ["Generative modelling", "Optimization"]
draft: true
---

Write the opening paragraph here.

## First section

Inline mathematics: $x_t$.

Display mathematics:

$$
\partial_t\rho_t+\nabla\cdot(\rho_t v_t)=0.
$$
```

The filename becomes the URL: `/blog/my-article/`. Use lowercase names separated by hyphens. Start headings at `##`; the layout supplies the page's only `h1` and creates a table of contents from second-level headings. The `updated` field is optional.

## Preview

Use Node 22.18 or newer:

```sh
npm ci
npm run dev
```

Visit the local address printed by Astro, then `/blog/`. Development mode includes drafts and future-dated articles with a draft notice and `noindex`. The RSS feed always includes only published articles.

Drafts are omitted from production routes, the listing, RSS, and sitemap. **Draft source files committed to this public repository remain publicly readable on GitHub.** Keep confidential writing outside the repository.

## Publish

1. Finish the article and set its publication date. Dates without a time are parsed at midnight UTC and displayed in Asia/Shanghai time; use an explicit offset for a precise publication time.
2. Set `draft: false`. Omitting `draft` keeps an article unpublished.
3. Run the checks below.
4. Commit on a branch, review the changes, and merge into `main`.
5. Check the **Deploy to GitHub Pages** workflow in GitHub Actions. A successful deployment makes the article available at `https://pixelhero98.github.io/blog/my-article/`.

```sh
npm run check
npm test
npm run build
npm run check:site
```

Future-dated articles are excluded until their date has passed **and a new build runs**. There is no scheduled publishing job.

`research-notes.md` is the opening post. `continuity-equation.md` is an editable technical draft. Change its date and set `draft: false` when ready to publish it.

## Images, equations, and subscriptions

- Put static images under `public/blog/` and reference them as `![Descriptive alt text](/blog/filename.png)`.
- Use fenced code blocks with a language name such as `python`.
- Write inline math with `$...$` and display math with `$$` on separate lines. KaTeX renders at build time with locally bundled styles and fonts.
- RSS subscriptions use `/blog/rss.xml`. The feed contains article summaries and links.
- Reading time is an approximate word-count estimate. The existing site typography and navigation are reused.
