# Zinuo (Henry) You — Research Portfolio

Static research portfolio for [zinuoyou.com](https://zinuoyou.com), built with Astro, strict TypeScript, MDX content collections, and lightweight CSS.

## Local development

```sh
npm install
npm run dev
```

## Validation

```sh
npm run check
npm run build
```

Content schemas live in `src/content.config.ts`. Project and publication entries are stored in `src/content/`; invalid statuses, missing required fields, and malformed URLs fail validation.

The reviewed visual baselines are stored in `tests/visual-regression/`, with QA results recorded in `docs/validation.md`.

## Deployment

Pushes to `main` deploy through GitHub Actions to GitHub Pages. The build defaults to `https://pixelhero98.github.io` as its public URL. After the domain is purchased and DNS is ready, set `PUBLIC_SITE_URL=https://zinuoyou.com` for the build and move `docs/CNAME.after-domain-purchase` to `public/CNAME` before deploying.

## Pending approved assets

- Replace the initials placeholder with a high-resolution professional headshot.
- Add approved causal-video WebM/MP4 clips, poster frames, prompts, and captions.
- Keep any under-review venue anonymous unless disclosure is explicitly cleared.
