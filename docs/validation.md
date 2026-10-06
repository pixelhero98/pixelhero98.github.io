# Validation record

Pre-deployment review completed locally on 6 October 2026.

## Build and content

- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm test`: all 8 deterministic tests pass. These cover analytic transport references, missing-observation masks, Gaussian-channel capacity, relation toggles, seeded candidate scoring, diffusion invariants, and every control boundary.
- `npm run build`: 14 HTML pages plus robots and sitemap output.
- `npm run check:site`: all internal assets, links and anchors resolve; canonical URLs and descriptions are present; IDs are unique; all nine research routes appear in the sitemap.
- Homepage order, nine research rows, six server-rendered demo fallbacks, and the absence of homepage demo JavaScript are checked.
- Generated HTML, JavaScript, CSS, SVG, JSON, XML, and text were scanned for the excluded research and submission references.
- The public CV retains `/resume/Zinuo_You_EN.pdf`. It contains two pages, passed extracted-text exclusion checks, and was rendered with Poppler for visual review. Its built copy has the same SHA-256 as the public source.
- Bibliographic verification is recorded in `content-sources.md`. The original supplied CV was not changed.

## Browser review

Reviewed the production preview in the Codex Chromium browser.

- Homepage checked at 390, 768, and 1440 px viewport widths, with no horizontal page overflow.
- All six demos checked at 390 px: sliders respond to Home/End keys, checkbox branches toggle, readouts remain finite, and Reset restores the exact default summary.
- DGDNN advances from zero to one step; its Next button is disabled at the maximum.
- Skip to content moves keyboard focus to main. Range inputs have visible focus indicators and explicit labels.
- Home, papers, project descriptions, compact experience, and revised graph illustrations were visually inspected.
- Six temporary preview fixtures blocked scripts with CSP: controls stayed hidden, and SVG diagrams and numerical summaries remained available. The browser API does not expose a JavaScript-disable switch; true disabled-JavaScript parsing was checked in the generated HTML, including the noscript message. Fixtures were removed by the final production build.
- Reduced motion was audited in CSS: smooth scrolling becomes automatic, and animations/transitions are disabled. Demos do not run animations or timers.
- Body, muted, and accent text contrast against white and the pale panel background ranges from 5.74:1 to 15.26:1.
- Screenshots are retained in `tests/visual-regression/`; review images and rendered PDF pages are also in ignored `output/`.

## Scope of verification

The synthetic examples verify their documented toy systems, not paper benchmarks or trained-model performance. No GPU workload, model download, or backend is involved. No fresh Lighthouse, Firefox, or Safari claims are made; the previous redesign's measurements have been removed.
