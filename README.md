# Barbados Maritime Ship Registry: home page revisions

Revised home page designs for the **Barbados Maritime Ship Registry (BMSR)**, built by Online Marketing Help. They're based on "v6", the design the client chose as their favourite.

There are four options, plus a review page that compares them:

| Option | Name | What's different |
|---|---|---|
| **A** | Refined Hull | Headline in Archivo capitals: light 300 lead-in, heavy 900 key phrase. Closest to v6. |
| **B** | Soft Modern | Headline in Nunito (rounded), sentence case, weights 800/900. |
| **C** | Clean Authority | Headline in Plus Jakarta Sans, sentence case: bold 700 statement, light 300 key phrase. |
| **D** | Refined Plus | Option A's headline, plus redesigned sections (see [Option D](#option-d)). |

Options A–C are identical apart from the banner headline, so the client can compare typography like for like.

## Quick start

There are no dependencies to install. You only need [Node.js](https://nodejs.org/) to preview and build.

```bash
node .claude/serve.mjs          # preview at http://localhost:5173
node tools/build-options.mjs    # rebuild option-a … option-d after editing src/
```

Python isn't needed. You can also open `index.html` straight from the folder: every link points at an `index.html` file, so pages work over `file://`.

Useful URL parameters:

| Parameter | Effect |
|---|---|
| `?theme=light` / `?theme=dark` | Force a theme (the default is dark). |
| `?logos=colour` | Option D: show Recognised Organisation logos in colour, not greyscale. |

## Project structure

```
index.html                 Review page comparing the four options (hand-written)
review/                    Screenshots used on the review page
option-a/ … option-d/      GENERATED pages. Never edit these by hand
src/
  home.html                The single source for the home page, shared by every option
  type-a.css … type-c.css  Each option's headline typography (D uses type-a.css)
  option-d/                Option D only (see below)
tools/
  build-options.mjs        Builds option-a … option-d from src/
assets/
  img/                     Original images (used by A–C)
  img/ro/                  Cleaned Recognised Organisation logos (WebP, used by D)
  img/d/                   Optimised images for D (WebP)
  video/                   Hero and band videos
.claude/
  serve.mjs                Local preview server (no dependencies)
  CLAUDE.md                Project notes and design rules
```

## How to make changes

1. **Edit `src/home.html`**, never `option-*/index.html`. The generated files say so at the top.
2. **Run `node tools/build-options.mjs`.** It writes all four option pages:
   - inserts each option's headline typography and fonts;
   - for Option D, swaps in its own sections, images and copy;
   - rewrites asset paths to `../assets/`.
3. **Check the result** in the browser, in both themes (sun/moon button in the header).
4. **Commit the source and the generated pages together.** Vercel serves the committed files as they are; there's no build step on Vercel.

A change to `src/home.html` reaches all four options. To change only one option's headline, edit its `src/type-*.css`.

## Option D

D is built from the same source. In `src/home.html`, some blocks are wrapped in markers:

```html
<!-- @d:ros (Option D swaps this block; see src/option-d/) -->
  …shared version, used by A–C…
<!-- /@d:ros -->
```

For A–C the build simply removes the markers. For D it replaces each block with `src/option-d/<name>.html`. The rest of D's changes come from these files:

| File | Purpose |
|---|---|
| `nav.html` | Main menu with "Contact" added |
| `slides.html` | Hero with 5 distinct slides (was 12) |
| `isle.html` | Registry figures band (in place of the island facts) |
| `ros.html` | Recognised Organisations: tiles, filters, "Show all" |
| `cta.html` | "Ready to register?" band (in place of the bottom 24/7 band) |
| `newsletter.html` | Sign-up form with privacy wording |
| `ftrbottom.html` | Footer bar: Privacy policy and Terms and conditions |
| `totop.html` | Floating "Back to top" button with a scroll-progress ring |
| `d.css` | All of D's styles |
| `ros.json` | The list of Recognised Organisations (see below) |
| `assets.json` | Image swaps: originals → optimised WebP in `assets/img/d/` |
| `text.json` | Copy swaps (e.g. the IACS count) |

**Rule:** a change for D must never alter A–C. After touching markers or the build, compare A–C's output with the last commit (`git diff option-a option-b option-c` should show nothing unintended).

### Adding a Recognised Organisation (D)

1. Add a clean logo to `assets/img/ro/`: transparent background, trimmed, WebP, up to 480×240px.
2. Add one line to `src/option-d/ros.json`:
   ```json
   { "name": "Example Register", "url": "https://example.org/", "iacs": false, "logo": "example-register.webp", "w": 300, "h": 120 }
   ```
   `w` and `h` are the logo file's pixel size; the page uses them to size every logo to the same visual weight.
3. Run the build. Tiles are sorted A–Z. The section always shows 2 rows (3 on phones) before "Show all", so it stays the same height however many organisations there are.

## What's in every option

- Larger, clearer logo, with the Barbados flag at the same height (an inline SVG, transparent background).
- Full-width layout (content up to 1760px), with readable line lengths.
- Scrolling announcement bar with a pause button and the 24/7 emergency number.
- Light and dark mode: dark by default; the visitor's choice is remembered and applied before the page draws.
- Office hours under the banner, with a live "Open now / Closed" badge in UK time.
- Emergency contacts in the hours band, announcement bar, mobile contact bar and footer.
- Accreditations (ISO 9001, Paris MoU, QUALSHIP 21, IMO) above the Recognised Organisations.
- Smooth scrolling for in-page links, except for visitors who prefer reduced motion.

## Accessibility

- Text passes WCAG AA contrast in both themes (checked automatically on every page).
- Moving content can be paused, and stops for visitors who prefer reduced motion.
- Keyboard focus states, a skip link, labelled controls and tap-to-call links.
- Links that open a new tab say so to screen readers.

The pages use modern CSS (`color-mix()`, `sqrt()`, `:is()`), so they need a current browser (Chrome, Edge, Firefox or Safari from 2023 onwards).

## Deployment

The site is plain static files, deployed to the Vercel project `barbados-v6`. Anything not listed in `.vercelignore` is **public**. `src/`, `tools/`, `.claude/` and this README are excluded.

## Before go-live

- [ ] The client chooses an option.
- [ ] Build one final home page from that option, and replace the review `index.html` with it.
- [ ] Replace every placeholder: search the source for `TODO(client)`.
- [ ] Create the **Terms and conditions** page; the footer links to `/terms-and-conditions/`, which doesn't exist yet.
- [ ] Move the page into WordPress, and wire the newsletter form to Contact Form 7 (id 51587) with reCAPTCHA.

### Waiting on the client

1. Their preferred option.
2. The logo as a vector file (SVG, AI or EPS).
3. Confirmed office hours, and any other emergency contacts.
4. Announcements for the scrolling bar.
5. The full list of accreditations and affiliations, with official logos.
6. (D) Fleet figures: vessels on the register, and gross tonnage.
7. (D) Which Recognised Organisations are IACS members (we currently show 11).
8. (D) A current DNV logo, and better logo files for Hellenic Register, Korean Register and RS.
9. (D) The terms and conditions text.
