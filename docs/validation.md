# Validation record

Validated against the production build on 15 August 2026.

## Automated checks

- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: 15 static pages generated, including the custom 404, robots file, and sitemap.
- Chromium, Firefox, and WebKit: homepage, work index, GenODE case study, publications, about, robots, sitemap, and CV all returned successfully.
- Responsive widths: 390 px, 768 px, and 1440 px with no horizontal overflow.
- Keyboard: the skip link is the first focus target.
- Reduced motion: the media query is honoured.
- Initial page load: no MP4 or WebM resource is requested.

## Lighthouse

| Profile | Performance | Accessibility | Best practices | SEO | CLS |
| --- | ---: | ---: | ---: | ---: | ---: |
| Mobile | 100 | 100 | 100 | 100 | 0 |
| Desktop | 100 | 100 | 100 | 100 | 0 |

These measurements were taken from the local Astro production preview. Scores should be rechecked after GitHub Pages deployment and again after custom-domain DNS is connected.
