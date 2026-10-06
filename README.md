# Zinuo (Henry) You — research website

An English-language academic website built with Astro, TypeScript, MDX, and static SVG illustrations. Research and papers lead the homepage; experience and awards appear compactly at the bottom.

## Develop and verify

```sh
npm ci
npm run check
npm test
npm run build
npm run check:site
npm run preview -- --host 127.0.0.1
```

Requires Node 22.18 or newer. The demo tests use Node's built-in TypeScript stripping. The Astro content environment explicitly prebundles its CommonJS `picomatch` dependency to avoid a Vite module-runner error.

## Content

- `src/content/publications/` owns publication titles, authors, venues, and links.
- `src/content/projects/` references those publications and supplies display order, summaries, and explanations.
- `src/lib/demos.ts` contains the six deterministic numerical illustrations, control definitions, and SVG renderer.
- `src/components/Demo.astro` renders the same default example on the server and updates it in the browser. No demo JavaScript is loaded by the homepage.
- Existing research, publication, and about URLs remain available except the deliberately removed research entries.

Every demo is explicitly synthetic. The simplified operators are documented beside each experiment; no trained model, benchmark result, private dataset, or GPU runtime is embedded.

## Public CV and social image

`scripts/build-public-cv.py` generates `public/resume/Zinuo_You_EN.pdf`. Publication metadata comes directly from the content files. It requires reportlab, pypdf, and Arial regular/bold TTF files; pass their directory as the first argument on non-Windows systems. The original supplied CV is never read or overwritten by this builder.

`scripts/build-social-image.py` generates the social preview using Pillow and local Arial fonts.

## Deployment

The existing GitHub Actions workflow publishes pushes to main through GitHub Pages. The default site URL is https://pixelhero98.github.io. Local implementation and review do not publish changes.

Set `PUBLIC_SITE_URL` only when using an already configured custom domain. Do not add a CNAME until its DNS is ready.

See `docs/validation.md` for the current QA record and `docs/content-sources.md` for publication verification.
