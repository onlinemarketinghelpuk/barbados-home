# BMSR White Label Site: barbados v6

Barbados Maritime Ship Registry (BMSR) home page redesign, built for the agency Online Marketing Help (OMH).
v6 is the **client's favourite** design (live preview: https://barbados-v6.vercel.app/). The brief is in `requirements.txt`.

## Milestones
- **Mon 19 Oct 2026**: deliver 3 revised home page options (they differ only in hero typography)
- **1 Feb 2027**: target go-live. Inner pages come after the home page is approved.

## Tech
- Static site with inline CSS and JS, no framework. Vercel serves the committed files as they are (no build step on Vercel).
- Fonts come from Google Fonts: Archivo (variable width and weight) and IBM Plex Mono site-wide; Nunito (option B) and Plus Jakarta Sans (option C) for the hero only.
- Deployed to Vercel (project `barbados-v6`). Anything not listed in `.vercelignore` is **public**, so keep briefs and notes out of the deploy.
- Local preview: `node .claude/serve.mjs` then open http://localhost:5173 (Python is not installed on this machine). Add `?theme=light` to a URL to force a theme.
- The final build will be moved into WordPress. Forms are placeholders (Contact Form 7 id 51587 + reCAPTCHA).

## Structure: one source page, three generated options
```
/src/home.html          THE home page source. Edit here, never in option-*/
/src/type-{a,b,c}.css   each option's hero typography (the only thing that differs)
/tools/build-options.mjs  writes option-{a,b,c}/index.html: inserts the type CSS and fonts,
                        the A/B/C review switcher (in the announcement bar), and rewrites asset paths to ../assets/
/option-{a,b,c}/        GENERATED, but committed (Vercel serves them)
/index.html             review page comparing the three (hand-written)
/src/option-d/           Option D only: replacement blocks (nav, slides, isle, ros, cta, newsletter .html), d.css,
                        ros.json (RO list: one line per organisation), assets.json (image swaps), text.json (copy swaps)
/assets/img/ro/, /assets/img/d/   Option D's cleaned logos and optimised images (A–C still use the originals)
/review/                thumbnails for the review page
/assets/                shared
```
- After any change to `src/`: run `node tools/build-options.mjs`, then commit the source and the generated files together.
- `src/` and `tools/` are in `.vercelignore`.
- Option D must never change A–C: after editing `src/home.html` markers or the build, diff A–C's output against the last commit.
- Before go-live: build one final page from the chosen option without the review switcher (the `@option-review` marker), and replace the review `index.html`.

## Design rules
- Define every colour as a variable on `:root`. Support both themes with `[data-theme="light"|"dark"]`, defaulting to dark (the client-approved look; see the decisions log in `docs/spec.md`). Store the user's choice in `localStorage` (wrapped in try/catch) and apply it from a script in `<head>` so there's no flash of the wrong theme.
- Brand accent is `#FEC725`. On light backgrounds use a darker accent for text so it passes WCAG AA contrast.
- Full-width layout: fluid container with gutters of `clamp(20px,5vw,96px)`. Keep body text to about 65ch.
- Logo and flag are the same height. The flag is a transparent inline SVG with no white ring. Swap the logo per theme (`bmsr-logo-white.png` / `bmsr-logo-navy.png`; the navy one is a transparent version made from `bmsr-logo.png`, which has a white box).
- Motion: the announcement bar and logo strips pause on hover and focus, and become static under `prefers-reduced-motion`.
- Accessibility: keyboard focus states, skip link, aria labels, tap-to-call links. Test at 360 / 768 / 1024 / 1440 / 1920 / 2560.
- Copy is in UK English.

## Do not change without client approval
- 24hr emergency number: +44 (0)7494 116754
- Office: +44 (0)207 636 5739, office@barbadosmaritime.com
- Address: Barbados High Commission, 1 Great Russell Street, London, WC1B 3ND
- Office hours: Mon–Fri, 9am–5pm (UK time). Exact hours still to be confirmed.
- The list of Recognised Organisations (21 class societies in the `.ros` section)

## Open questions for the client
1. Logo as a vector file (SVG/AI/EPS)
2. Exact opening hours, which office(s), and time zone
3. Any further emergency contacts (Principal Registrar etc.)
4. Announcement bar items (3–5)
5. List of accreditations and affiliations, with logos
6. URL of the OMH site whose light/dark toggle we should match

Full spec and acceptance criteria: `docs/spec.md`. Tick items there as they are verified, and log client answers and decisions there.
