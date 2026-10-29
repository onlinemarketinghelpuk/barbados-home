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
- Local preview: `node .claude/dev.mjs` (dev mode: rebuilds on changes to src/ or tools/ and live-reloads the browser; build errors show as a red bar) or `node .claude/serve.mjs` (plain), then open http://localhost:5173 (Python is not installed on this machine). Add `?theme=light` to a URL to force a theme.
- The final build will be moved into WordPress. Forms are placeholders (Contact Form 7 id 51587 + reCAPTCHA).

## Structure: one source page, three generated options
```
/src/home.html          the home page source. Edit here, never in option-*/
/src/contact.html       the contact page source (built as option-*/contact/index.html)
/src/about.html, /src/team.html   About and Team page sources (built as option-*/about/, option-*/team/)
/src/team-v2.html       Option C's Team page (option-c/team/): the departments layout from the client's mock-up; plug-in tools/fill/team-v2.mjs. C's earlier team page (src/team.html) is built at option-c/team-old/; A, B, D keep src/team.html at team/
/src/data/team.json     the 14 team members and team intros; team cards are generated from it
/src/registrars.html, /src/data/registrars.json   Regional Registrars page (built as option-*/registrars/) and its 42 entries (transcribed: client to verify)
/src/ros.html           Recognised Organisations page (option-*/ros/); the RO list is src/option-d/ros.json (23, names as on the live RO page)
/src/quality.html       Quality Assurance page (option-*/quality/); certificate expires 15 Nov 2026
/src/links.html, /src/data/useful-links.json   Useful Links page (option-*/links/): 3 organisations, 7 services
/src/bmsr.html          The BMSR hub (option-*/the-bmsr/): 9 link cards in 3 groups; the menu item "The BMSR" opens it
/src/why.html           Why register in Barbados (option-*/why-barbados/): BMSR wording of Invest Barbados facts; tax points for client to check; IMO year 1970 vs 1971 to confirm
/src/holidays.html, /src/data/holidays.json   Public Holidays (option-*/holidays/); update the dates each year
/src/registration.html  Registration hub (option-*/registration/): steps, 4 types, mortgages, bareboat, fees/forms/alterations
/src/seafarers.html     Seafarers hub (option-*/seafarers/): 2 tasks, crewing sheet, STCW team via {{team-of:stcw}}
/src/inspections.html   Inspections (option-*/inspections/): facts, arranging, 5-type timeline, B004, resources
/src/investigations.html Investigations (option-*/investigations/): report within 4h/24h, duty sheet, 3 sections
/src/events.html, /src/data/events.json   Events (option-*/events/): one card per event, newest first
/src/documents.html     Documents hub (option-*/documents/): 8 types in 3 groups + latest notices; Events has a list/grid toggle (remembered)
/src/forms.html, /src/data/forms.json   Forms (option-*/forms/): search + categories; only Registration (19) known
/src/bulletins.html, /src/data/bulletins.json   Bulletins (option-*/bulletins/): search + topics + sort, subscription; 028–031 and PDFs to confirm
/src/conventions.html, /src/data/conventions.json   Conventions (option-*/conventions/): 26 in 5 groups, search; 3 titles tidied (see "check")
/src/shipboard.html, /src/data/shipboard.json   Shipboard Documents (option-*/shipboard/): 9 record books, order online/offline; also in the Documents menu and hub
/src/news.html, /src/data/news.json   News (option-*/news/, live category/news/): feature + cards, topic chips; page 1 only (10 posts), newest first; photos in assets/img/news/
/src/ship-registration.html, /src/data/ship-registration.json   Ship Registration (option-*/ship-registration/, live registration/ship-registration/): 2 stages, Word forms + documents as tick lists (localStorage); content from the live WordPress feed
/src/{yacht-registration,mortgages,bareboat-charter,registry-alterations,registration-fees}.html   Registration sub-pages (option-*/<name>/), each with src/data/<name>.json, src/option-d/<name>.css and tools/fill/<name>.mjs; content from the live WordPress feed. Bareboat's live page is /bareboat-charter/; Registry Alterations holds its 4 live sub-pages as sections (#deletion etc.); Registration Fees shows the PP01-F01 Rev 04 schedule + NRT estimator
/src/endorsement-discharge-book.html   Seafarers > Endorsement & discharge book (live seafarers-manning/endorsement-discharge-book/), same pattern
/src/{inspection-templates,notices-to-nautical-inspectors,nautical-inspectors}.html   Inspections sub-pages (live inspections/…, list-of-appointed-nautical-inspectors/); Nautical Inspectors is a finder over 124 listings in 58 countries (parsed from the feed; 53 phone links inferred, see "checks")
/src/{casualty-investigations,accident-incident-reports}.html   Investigations sub-pages ("Marine Accident Reporting", "Marine Safety Investigation Reports"; "Ongoing investigations" = accident-incident-reports#ongoing)
/src/{marine-circulars,guides,barbados-legislation}.html   Documents sub-pages (live documents/marine-circulars-bmsr/, guides/, barbados-legislation/ with #acts and #regulations); shipboard rebuilt from the live order form (13 books, prices)
/src/{change-of-ownership,change-of-vessels-name,change-of-owners-name,deletion}.html   Registry Alterations sub-pages (live registration/registry-alterations/…), a flyout under Registry alterations; shared rs- layout with tick lists; registry-alterations is now the overview
/src/yacht-masters-guide.html   Documents > Guides > Yacht Master's Guide: PDF.js reader (cdnjs 3.11.174) over assets/docs/yacht-masters-guide.pdf
/src/{acts,regulations}.html   Documents > Barbados Legislation > Acts / Regulations (live documents/acts/, documents/regulations/); barbados-legislation is now the overview
/src/news-category.html   one page per news topic (option-*/news-<topic>/), built from news.json topics with page vars {{page:topic}}/{{page:name}}; News styles in src/partials/news-css.html; footer has News (live /news/ = same page)
/src/news-post.html, /src/data/news-posts.json   one page per news post at its live address (option-*/<slug>/, 37), text cleaned from the feed; tools/fill/news-post.mjs; pictures in assets/img/news/posts/
- New pages: own src/<dir>.html, src/data/<dir>.json, src/option-d/<dir>.css, optional tools/fill/<dir>.mjs (build plug-in); build one with --only <dir>; list it in LIVE + pages. Pull content from the live WordPress feed (wp-json), not screenshots
- Header dropdowns on The BMSR, Registration, Seafarers, Inspections, Investigations, Documents (src/partials/top.html + src/option-d/nav.html); keep both navs in step. Our team is a flyout under About us; News is the last item; Why register is not in the menu
/src/partials/page-css.html, script-base.html   inner-page styles (page hero, team cards) and shared page script
/src/partials/          head, top (header, announcement bar), bottom (footer): shared by both pages via <!-- @include name -->
/src/type-{a,b,c}.css   each option's hero typography (the only thing that differs)
/tools/build-options.mjs  writes option-{a,b,c}/index.html: inserts the type CSS and fonts,
                        and rewrites asset paths to ../assets/ (no review switcher: removed 15 Oct; the review page opens each option in a new tab)
/option-{a,b,c}/        GENERATED, but committed (Vercel serves them)
/index.html             review page comparing the three (hand-written)
/src/option-d/           Option D only: replacement blocks (nav, slides, isle, ros, cta, newsletter .html), d.css,
                        ros.json (RO list: one line per organisation), assets.json (image swaps), text.json (copy swaps);
                        contact page: cmain.html (layout), cfbui.html (message/feedback switch + topic chips), contact.css;
                        about/team: acred.html (particulars sheet), tclose.html (closing band), inner.css
- Every new page: build it for all 4 options, and give Option D its own layout in D's home-page style (particulars sheet, gold chips, gold-top cards, paths band)
/assets/img/ro/, /assets/img/d/   Option D's cleaned logos and optimised images (A–C still use the originals)
/review/                thumbnails for the review page
/assets/                shared
```
- After any change to `src/`: run `node tools/build-options.mjs`, then commit the source and the generated files together.
- Links: a page with a review copy goes in `LIVE` (tools/build-options.mjs). An unbuilt sub-page opens its parent page at a section via `SUB` (e.g. `registration#mortgages`); anything else one level under a LIVE page falls back to that page. Adding a page to `LIVE` switches its links over automatically. `#live` keeps a link on the live site.
- `src/` and `tools/` are in `.vercelignore`.
- Option D must never change A–C: after editing `src/home.html` markers or the build, diff A–C's output against the last commit.
- Before go-live: build one final page from the chosen option and replace the review `index.html`.

## Design rules
- Define every colour as a variable on `:root`. Support both themes with `[data-theme="light"|"dark"]`, defaulting to dark (the client-approved look; see the decisions log in `docs/spec.md`). Store the user's choice in `localStorage` (wrapped in try/catch) and apply it from a script in `<head>` so there's no flash of the wrong theme.
- **The palette is the Barbados flag and nothing else** (client request, 21 Oct 2026): ultramarine `#00267F`, gold `#FFC726`, black `#0A0E1A`, white. They are the tokens `--flag-blue`, `--flag-gold`, `--flag-black`, `--flag-white` on `:root`; every other colour is one of the four, lightened or darkened. No teal, cyan or green anywhere, and no green/red status colours: the "open now" dot is gold, and form errors use a gold mark with the wording carrying the meaning.
- Dark theme runs on a deep ultramarine scale (`--abyss` `#000C22` → `--card` `#001F52`, `--night` `#00081C` for the announcement bar and footer); light theme is white and near-white with `--flag-blue` as the accent.
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
