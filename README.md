# Barbados Maritime Ship Registry: home page revisions

Revised home page designs for the **Barbados Maritime Ship Registry (BMSR)**, built by Online Marketing Help. They're based on "v6", the design the client chose as their favourite.

There are four options, plus a review page that compares them:

| Option | Name | What's different |
|---|---|---|
| **A** | Refined Hull | Headline in Archivo capitals: light 300 lead-in, heavy 900 key phrase. Closest to v6. |
| **B** | Soft Modern | Nunito (rounded) **throughout the page**: headline, headings, body text, buttons and labels. Sentence case, weights 800/900. |
| **C** | Clean Authority | Plus Jakarta Sans **throughout the page**, sentence case. Every heading pairs a bold 700 statement with a light 300 gold key phrase. |
| **D** | Refined Plus | Option A's headline, plus redesigned sections (see [Option D](#option-d)). |

Option A changes only the banner headline. Options B and C each carry their own font through the whole page.

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
  index.html               Home page
  contact/index.html       Contact page
  about/index.html         About page
  team/index.html          Team page
src/
  home.html                Source of the home page, shared by every option
  contact.html             Source of the contact page, shared by every option
  about.html, team.html    Sources of the About and Team pages
  data/team.json           The team: one line per person (name, role, team, photo), plus each team's intro
  partials/                Blocks shared by every page: head (fonts, theme script, CSS),
                           top (announcement bar, header, mobile menu), bottom (footer, mobile contact bar)
  type-a.css … type-c.css  Each option's typography: A the headline only, B and C the whole page (D uses type-a.css)
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

1. **Edit the source in `src/`**, never the generated `option-*/` pages. The generated files say so at the top.
   - The header, footer, announcement bar and shared CSS live in `src/partials/`. Edit them once and every page follows.
   - Page content lives in `src/home.html` and `src/contact.html`.
2. **Run `node tools/build-options.mjs`.** It writes the home and contact page for all four options:
   - stitches in the partials (`<!-- @include name -->`);
   - inserts each option's typography and fonts;
   - for Option D, swaps in its own sections, images and copy;
   - points "Contact us" links at that option's contact page, so the review flows between pages;
   - rewrites asset paths (`../assets/` for home, `../../assets/` for contact).
3. **Check the result** in the browser, in both themes (sun/moon button in the header).
4. **Commit the source and the generated pages together.** Vercel serves the committed files as they are; there's no build step on Vercel.

A change to `src/home.html` reaches all four options. To change only one option's headline, edit its `src/type-*.css`.

## About and Team pages

**About** (`src/about.html`): the hero, "Who we are" (with the full copy), credentials, how we work, the island facts over the beach video, **Meet the leadership** (the 5 leaders, linking to the Team page), news, and the closing band. Option D gets its own closing band ("Ready to register?") through the same `@d:cta` swap as its home page.

**Team** (`src/team.html`): the hero, **team chips** (All 14 · Leadership 5 · Operations 2 · Registry 4 · STCW 2 · Office 1) that show one team at a time and keep the choice in the address (e.g. `team/index.html#registry`), one section per team, and "The whole crew" with the group photo.

**Option D has its own About and Team layouts**, in the style of its home page (`src/option-d/acred.html`, `tclose.html`, `inner.css`):
- About: the credential cards and the "How we work" columns become one **registry particulars sheet** ("Why owners trust us").
- Team: each team gets a sticky side column with its title and intro, and the cards sit to the right. The cards follow the Recognised Organisations tiles (dark card, gold top border, inset white photo panel). The page ends with a "Talk to the team" band.

Every team card is generated from `src/data/team.json`. To add, remove or change a person, edit one line there and add their photo to `assets/img/team/` (square, at least 300px), then run the build.

The portraits in `assets/img/team/` were **cropped from a screenshot of the live team page**, so they're review quality only. Replace them with the original photos from the WordPress media library before go-live.

## Regional Registrars page

`src/registrars.html`, built as `option-*/registrars/index.html`. A **finder** (search by country, person, company or city, accent-insensitive; region chips; "Jump to a country") over the registrars, **grouped by country**. Every phone number is tap-to-call, and every email has a copy button.

The list is `src/data/registrars.json`, one entry per registrar (country, code, region, name, company, address, tel[], email[]). It was **transcribed from a screenshot** of the live page, so the client must check every entry before go-live. Six entries carry a `check` note where the live data looks wrong (e.g. a Cyprus number for Bulgaria, an incomplete Panama number).

Option D sets the finder in a sticky side column, with each registrar as one ruled row (person | address | contacts), and ends with the paths band (`src/option-d/registrars.css`, `rrclose.html`).

## Recognised Organisations page

`src/ros.html`, built as `option-*/ros/index.html`: the intro, a "Questions about authority" box (ops@ with a copy button), a **searchable directory** of all 23 ROs with All / IACS / Other filters, bulletins, and the closing band. Tiles come from `src/option-d/ros.json`, which is **the single RO list for the whole site** (it also feeds Option D's home page section). Names follow the live RO page. A missing logo shows a text mark (`"mark"`), and a missing website makes a plain tile. Option D sets the directory beside a sticky side column (`src/option-d/rodir.html`, `ros-page.css`).

A–C home pages still list the ROs by hand in `src/home.html` (the original logo files). Keep them in step with `ros.json`.

## Quality Assurance page

`src/quality.html`, built as `option-*/quality/index.html`:
- the certificate image (cropped from a screenshot: replace it with the real certificate);
- the certificate facts as a particulars sheet;
- the 3 BMSR advantages;
- the **quality policy** split into five parts: commitments, customers first, supporting compliance, people and culture, continual improvement. Each has an "On this page" link.

The policy keeps the live wording, with typos corrected. The corrections are listed in a comment in the source for client approval.

Option D turns "On this page" into a sticky side column, and the commitments into ruled rows (`src/option-d/quality.css`).

⚠ The LRQA certificate shown **expires on 15 November 2026**. Update the facts sheet, the image and the PDF link when it's renewed.

## Useful Links page

`src/links.html`, built as `option-*/links/index.html`. One card per organisation: Barbados, the IMO and the ILO. Each service is a row with Website ↗ / Email (with copy) / Call buttons, and there are filter chips (All · Barbados · Maritime · Labour).

The data is `src/data/useful-links.json`, transcribed from a screenshot. Links marked `"confirm": true` were hidden behind link text on the live page, and point to the organisation's website for now. A phone entry can give an exact dial string in `"tel"` (used for the Barbados +1 246 numbers).

Option D sets each organisation as a particulars sheet, with a sticky side column (`src/option-d/links.css`).

## The BMSR (hub page)

`src/bmsr.html`, built as `option-*/the-bmsr/index.html`; "The BMSR" in the main menu opens it on every page. It has:
- the hero with the Barbados coat of arms (cropped from a screenshot: replace it with the official artwork);
- the hours and emergency band;
- **9 link cards in 3 groups**: About the registry (About · Our team · Contact), Registry network (Regional Registrars · Recognised Organisations · Quality Assurance), Useful resources (News · Useful links · Public holidays).

Seven of the links open our redesigned pages. News and Public holidays still go to the live site. Option D sets each group as a particulars sheet: a sticky side column and numbered ruled rows (`src/option-d/bmsr.css`).

## Why register in Barbados

`src/why.html`, built as `option-*/why-barbados/index.html`, and featured at the top of The BMSR hub. It's a **new page in BMSR's own words**, based on the facts on Invest Barbados' shipping page (investbarbados.org/shipping), which it credits and links to. It covers:
- international standing (IMO, Paris MoU, QUALSHIP 21, ISO 9001) as a particulars sheet;
- the fleet (tankers, bulk carriers, container ships, yachts);
- the **two shipping vehicles and their tax advantages**: Shipping Corporations Act s.330, and the Shipping Incentives Act (15 years).

It ends with next steps. The tax and legal points are marked for the client to check, and the page carries a "guidance only, not tax or legal advice" note.

Its live address doesn't exist yet. Links use the planned `/why-register-in-barbados/`. Option D sets the two vehicles as particulars sheets beside a sticky side column (`src/option-d/went.html`, `why.css`).

## Public Holidays page

`src/holidays.html`, built as `option-*/holidays/index.html`. It has:
- a "Next office closure" card with a countdown;
- **Add all to my calendar**, which downloads an `.ics` file of all-day events;
- the year's closures, with past days dimmed and the next one highlighted (in UK time);
- a reminder that the 24/7 line stays open.

The data is `src/data/holidays.json`, as ISO dates. The **weekday and date wording are computed by the build**, so they can't be wrong. **Each year, replace the `days` list and `year`.** Option D makes the next-closure card a sticky side column (`src/option-d/holidays.css`).

## Registration page

`src/registration.html`, built as `option-*/registration/index.html`. "Registration" in the menu and every "Register a vessel" link open it. It has:
- **How registration works**, in 4 steps (quotation → provisional within hours → initial inspection, then annually → permanent within six months);
- **Choose a registration**: ship · yacht · mortgages · bareboat;
- **Ship mortgages**: the A–Z priority explained, and 4 numbered facts;
- **Bareboat charters**: charter out and charter in, drawn as flag-to-flag routes;
- **Fees, forms & changes**: registration fees · registry alterations · forms.

The sub-pages (ship, yacht, mortgages, bareboat, alterations) still go to the live site; two of those addresses are marked to confirm. Option D sets the steps as a particulars sheet beside a sticky side column (`src/option-d/rsteps.html`, `registration.css`).

## Seafarers page

`src/seafarers.html`, built as `option-*/seafarers/index.html`; "Seafarers" in the menu opens it. It has:
- the two main tasks as large cards: **Endorsements & discharge books** and **Document validity check**;
- "Flexible crewing" as a particulars sheet;
- **the STCW team** (Elvis and Jay, cards from `team.json` via `{{team-of:stcw}}`), with stcw@ and the office phone;
- related links: MLC · Forms · Bulletins.

The two task pages still go to the live site; their addresses are marked to confirm. Option D sets the tasks and related links as ruled rows (`src/option-d/seafarers.css`).

## Inspections page

`src/inspections.html`, built as `option-*/inspections/index.html`; "Inspections" in the menu opens it. It has:
- 3 key facts: annual (Shipping Act 1994, s.202–208) · worldwide ANIs · certificate on display;
- **Arranging an inspection** in 3 steps;
- **the five inspection types as a timeline**: pre-registration · initial · AFSI · follow-up · additional, with the possible reasons in an expandable list;
- the Bulletin B004 callout;
- resources: ANI list · inspection templates · notices to nautical inspectors.

The B004, templates and notices addresses are marked to confirm. Option D sets the five types as a particulars sheet beside a sticky side column (`src/option-d/itypes.html`, `inspections.css`).

## Investigations page

`src/investigations.html`, built as `option-*/investigations/index.html`; "Investigations" in the menu opens it. It has:
- **Report within 4 hours**: the 24/7 line, accidents@ and the online form, beside a deadline timeline (event → 4h initial report → 24h Form 45);
- who must report what, as a particulars sheet;
- the three sections: accident reporting · investigation reports · ongoing MSI;
- the purpose statement.

The section addresses and the online form / Form 45 links are marked to confirm. Option D sets the three sections as ruled rows (`src/option-d/investigations.css`).

## Events page

`src/events.html`, built as `option-*/events/index.html`; "Events" in the menu opens it. One card per event, newest first and marked "Latest", with date, place and type chips. The cards come from `src/data/events.json`; add an event as one entry, and its photo to `assets/img/events/`. An event without a photo shows its city name and "Photos coming soon". Option D sets each event as a ruled row under a gold line (`src/option-d/events.css`).

## Documents page

`src/documents.html`, built as `option-*/documents/index.html`; "Documents" in the menu opens it. It's a hub with the 7 document types in 3 groups:
- **Forms & guides**: Forms · Guides;
- **Updates & guidance**: Bulletins · Marine Circulars;
- **Law & conventions**: Conventions · Barbados Legislation · Barbados Publications.

It also shows the latest notices (the home page list). It uses The BMSR hub's styles; Option D uses the same sticky side column and ruled rows (`src/option-d/documents.css`). Four of the sub-page addresses are marked to confirm.

## Forms page

`src/forms.html`, built as `option-*/forms/index.html`. It has a search (by name or number, e.g. "bill of sale" or "F05") and category chips over every form, each with a PDF button. Alongside sit the "Don't modify the documents" note and help links. `#cat-samples` and similar addresses open one category.

The list is `src/data/forms.json`. Only the **Registration forms** (19) are known; the other 6 categories show "coming soon" with a link to the live page. Each form's PDF goes in `"file"`; until then, the buttons open the live forms page. PPR01-F03 is missing from the live list.

## Bulletins page
`src/bulletins.html`, built as `option-*/bulletins/index.html`. It reuses the Forms layout: search by number or subject (e.g. "035" or "ballast water"), topic chips, and a sort (by number, or subject A–Z). Each row has the number, subject, topic, revision, a Read button and a PDF button. Alongside sit "Download all bulletins / list of bulletins" and a bulletin subscription form (a front-end preview, `TODO(dev)`). Option D puts that column on the left as a sticky particulars sheet, with large mono numbers and ruled rows (`src/option-d/bulletins.css`).

The list is `src/data/bulletins.json` (44 bulletins, 001–313), transcribed from the screenshot. To check with the client: the topics are ours; rows 028–031 were hidden behind the site header (030 ISPS Code is known from the home page); no PDF addresses yet, so Read/PDF open the live bulletins page. Each PDF goes in `"file"`, each web page in `"href"`.

## Conventions page
`src/conventions.html`, built as `option-*/conventions/index.html`. The 26 ratified conventions from the live page, in five groups (safety & navigation, pollution & environment, liability & compensation, seafarers, IMO/trade/communications), each with its short name (SOLAS, MARPOL…) and year. A search box (name, short name or year) and jump chips sit above the list; alongside are the count and links to the full texts (IMO, ILO). Option D puts that column on the left as a sticky particulars sheet (`src/option-d/conventions.css`).

The list is `src/data/conventions.json`. The groups and short names are ours. Three titles were tidied (see `"check"`): the two MARPOL lines are merged, "Sediment Water" is "Sediments", and STCW's "as amended 1974" is "as amended".

## Shipboard Documents page
`src/shipboard.html`, built as `option-*/shipboard/index.html`. The record books and logbooks (9, read from the live page's cover image), each a card with a spine in its cover's colour, and the two ways to order: the online order form, or the offline form emailed to office@. Option D shows the books as a numbered register with colour swatches, and the order column on the left (`src/option-d/shipboard.css`). It's also in the Documents menu and the Documents hub (now eight types).

The list is `src/data/shipboard.json`. To check with the client: part of the cover image was hidden, so there may be more books; Oil Record Book Part I's subtitle is assumed; the online form's address and the offline form's PDF go in `orderOnline` / `orderOffline` (they open the live page until then).

## Header dropdowns

"Documents" in the main menu has a dropdown: Forms · Shipboard Documents · Bulletins · Marine Circulars · Guides · Conventions · Barbados Legislation · Barbados Publications. The panels have no "All …" link (removed 18 Oct 2026): the menu name itself opens each hub page. It opens on hover or keyboard focus; the arrow button toggles it on touch screens, and Escape or a click outside closes it. In the mobile menu, the same links are listed under Documents. It's in `src/partials/top.html` and `src/option-d/nav.html`, styled in `src/partials/head.html`. That file also keeps the logo and flag from shrinking, and tightens the menu between 1241 and 1400px.


**All six menu items with sub-pages now have dropdowns:** The BMSR, Registration, Seafarers, Inspections, Investigations and Documents. Events, and Option D's Contact, stay plain links. Each panel has its own id (`dd-bmsr`, `dd-reg`, `dd-sea`, `dd-insp`, `dd-inv`, `dd-docs`). Escape closes a panel and keeps it shut until focus or the mouse leaves. Between 1241 and 1400px the arrows and gaps tighten so the header still fits; Option D gets slightly smaller gaps because of its extra Contact item.

**The BMSR menu:** Our team is a second-level item under About us, and "Shipping – Invest Barbados – A Welcoming Investment Climate" (https://www.investbarbados.org/shipping/, new tab) under Useful links: a flyout to the side in the desktop menu (opens on hover or keyboard focus; `.dd-n`, `.dd-p`, `.dd-s` in head.html), and an indented "↳ Our team" in the mobile menu. "Why register in Barbados" is not in the menu (client request); it is reached from The BMSR hub.

## Contact page

`src/contact.html`, built for every option as `option-*/contact/index.html`. Top to bottom:

1. **Hero** with a live "Open now / Closed" badge and buttons to call, email, or ring the 24/7 line.
2. **Emergency band**: the 24/7 line, tap to call.
3. **"Who do you need?"**: the five team inboxes (office, registry, ops, stcw, accidents) and the office phone, each with a copy button.
4. **Visit us**: address, "Get directions", the opening hours with today highlighted, and an OpenStreetMap map (no cookies; dark in dark mode).
5. **Message form** with inline validation, an enquiry type (so messages can go to the right team), and a call-first warning for accidents.
6. **Customer feedback** (BMSR Quality Management System): the same 11 questions and scales as the current form, as 1–5 tap buttons. It's collapsed behind "Give feedback". A low score (1–2 for satisfaction and resolution, 4–5 for how often issues happen) asks for a comment.
7. **Useful links**: Regional Registrars, Recognised Organisations, Appointed Nautical Inspectors.

**Option D has its own contact layout**, built from D's home page parts so the two pages read as one site:
- the home hero (shorter, one photo, with the live status in the ruled footer row);
- the home page's hours and emergency band, with "On this page" links;
- the teams set out like the **registry particulars sheet**, with gold topic chips that highlight a team and pre-fill the form;
- **one card switching between "Send a message" and "Give feedback"** (arrow keys work; `#feedback` in the address opens the feedback form);
- a full-width **map band** with the address card floating over it;
- the "Ready to register?" band reused for useful links.

It lives in `src/option-d/cmain.html`, `cfbui.html` (its script for the switch and chips) and `contact.css`. The form validation, copy buttons, live status and feedback questions stay shared with A–C.

Both forms are **front-end previews**: they validate and show a thank-you message, but send nothing until they're connected in WordPress (search for `TODO(dev)`). The contact page has its own copy of the shared scripts (menu, theme, announcement bar). On WordPress these become one site-wide script.

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

## Links between pages
Live-site addresses are rewritten at build time so the review stays inside the review pages (`tools/build-options.mjs`):
- **A page we've built** is listed in `LIVE`, and every link to its live address opens the review copy.
- **A sub-page we haven't built yet** opens its main page at the matching section, via `SUB`. For example Ship registration goes to `registration/#types`, Mortgages to `#mortgages`, Document validity check to `seafarers/#check`, Guides to `documents/#directory`.
- **Anything else one level under a built page** (e.g. a new `registration/<name>/` address) falls back to that page.
- **When you build a sub-page,** add it to `LIVE`: its links switch from the parent to the new page automatically, and its `SUB` line can go.
- **Staying live:** news posts, PDFs, privacy and terms keep their live addresses, and so does any link ending in `#live` (downloads whose files we don't have yet).

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
- [ ] Move the pages into WordPress, and wire the newsletter, contact and feedback forms (Contact Form 7 + reCAPTCHA).

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
