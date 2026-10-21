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
node .claude/dev.mjs            # dev mode: http://localhost:5173, rebuilds and reloads as you edit
node .claude/serve.mjs          # plain preview, no rebuilding
node tools/build-options.mjs    # one-off rebuild of option-a … option-d after editing src/
node tools/build-options.mjs --only mortgages   # rebuild just one page (or several: --only a,b; the home page is "home")
```

**Cloning on Windows:** clone with long paths on. The longest page path in the repo is 192 characters (a news post, under each of the four option folders), so unless the clone sits close to the drive root the full path passes the old 260-character limit and the checkout stops part-way:

```bash
git clone -c core.longpaths=true <repo-url>
```

In a clone made without it, run `git config core.longpaths true` and `git checkout -f HEAD -- .` to finish the checkout. Line endings are pinned to LF by `.gitattributes`, because the build matches on LF: a CRLF checkout fails on the first page.

**Adding a page:** a page owns `src/<dir>.html`, `src/data/<dir>.json` and `src/option-d/<dir>.css` (Option D's layout, picked up by name). If it needs its own renderer for `{{…}}` placeholders, put it in `tools/fill/<dir>.mjs` (default export `(html, { read, esc, fileType, revOf }) => html`); the build loads every file there. List the page in `LIVE` and `pages` in the build. A page whose source doesn't exist yet is skipped, so pages can be built side by side.

**Live content:** the live site's WordPress feed is public (`https://barbadosmaritime.com/wp-json/wp/v2/pages?slug=<slug>`, also `/posts` and `/media`). New pages take their wording, links and files from it, read-only, rather than from screenshots.

**Dev mode** (`node .claude/dev.mjs`) builds once at start, then watches `src/` and `tools/`: save a file and every option page is rebuilt (about 1.5 s) and the open browser tab reloads where you were. If a build fails (bad JSON, a leftover placeholder), a red bar on the page shows the error and the last good pages stay up; the next good save clears it. Changes to `assets/`, `review/` or the hand-written `index.html` just reload. Options: `--port 5180`, and `--no-build` to only serve and reload. The reload script is added as pages are sent, never written into the files, so the committed output is unchanged. Stop it with Ctrl+C.

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
  dev.mjs                  Dev server: rebuild on save + live reload (no dependencies)
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


**List or grid:** a toggle above the events switches between the list (the default, the approved look) and a grid of cards (3 columns on wide screens, 2 on tablets; photo on top, summary in three lines). The choice is remembered on that device (`bmsr-events-view` in localStorage, wrapped in try/catch). On phones both are one column, so the toggle hides. Option D shows the grid cards under gold rules.

## Documents page

`src/documents.html`, built as `option-*/documents/index.html`; "Documents" in the menu opens it. It's a hub with the 7 document types in 3 groups:
- **Forms & guides**: Forms · Guides;
- **Updates & guidance**: Bulletins · Marine Circulars;
- **Law & conventions**: Conventions · Barbados Legislation · Barbados Publications.

It also shows the latest notices (the home page list). It uses The BMSR hub's styles; Option D uses the same sticky side column and ruled rows (`src/option-d/documents.css`). Four of the sub-page addresses are marked to confirm.

## Forms page

`src/forms.html`, built as `option-*/forms/index.html`. It has a search (by name or number, e.g. "bill of sale" or "F05") and category chips over every form, each with a PDF button. Alongside sit the "Don't modify the documents" note and help links. `#cat-samples` and similar addresses open one category.

The list is `src/data/forms.json`. The **Registration forms** (19) are known; Mortgage, Operation, STCW and Checklists are partly filled from the new registration and seafarers pages (`"partial": true`, with a note pointing to the live page for the rest); Investigation and Sample forms still show "coming soon". Each form's PDF goes in `"file"`; until then, the buttons open the live forms page. PPR01-F03 is missing from the live list.

## Bulletins page
`src/bulletins.html`, built as `option-*/bulletins/index.html`. It reuses the Forms layout: search by number or subject (e.g. "035" or "ballast water"), topic chips, and a sort (by number, or subject A–Z). Each row has the number, subject, topic, revision, a Read button and a PDF button. Alongside sit "Download all bulletins / list of bulletins" and a bulletin subscription form (a front-end preview, `TODO(dev)`). Option D puts that column on the left as a sticky particulars sheet, with large mono numbers and ruled rows (`src/option-d/bulletins.css`).

The list is `src/data/bulletins.json` (44 bulletins, 001–313), transcribed from the screenshot. To check with the client: the topics are ours; rows 028–031 were hidden behind the site header (030 ISPS Code is known from the home page); no PDF addresses yet, so Read/PDF open the live bulletins page. Each PDF goes in `"file"`, each web page in `"href"`.

## Conventions page
`src/conventions.html`, built as `option-*/conventions/index.html`. The 26 ratified conventions from the live page, in five groups (safety & navigation, pollution & environment, liability & compensation, seafarers, IMO/trade/communications), each with its short name (SOLAS, MARPOL…) and year. A search box (name, short name or year) and jump chips sit above the list; alongside are the count and links to the full texts (IMO, ILO). Option D puts that column on the left as a sticky particulars sheet (`src/option-d/conventions.css`).

The list is `src/data/conventions.json`. The groups and short names are ours. Three titles were tidied (see `"check"`): the two MARPOL lines are merged, "Sediment Water" is "Sediments", and STCW's "as amended 1974" is "as amended".

## Shipboard Documents page
`src/shipboard.html`, built as `option-*/shipboard/index.html` (live `documents/shipboard-documents/`, menu Documents > Shipboard Documents; also in the Documents hub). It opens with the Standard Shipboard Document Set (first issuance at registration: USD 350.00, tankers USD 380.00), which includes one copy of each printout and the nine-item bundle listed under "Also in the set". Then the 13 printouts, each a card with a spine in its cover's colour and its price per copy: 12 for all types of vessels and 1 vessel specific (Oil Record Book Part II, tankers only). The side column has the two ways to order (the live online order form, and the PPD01-F01 offline form to email to office@) and the courier charges; only the courier box stays pinned while scrolling. An "Also useful" band has the live page's four links. Option D shows the books as a numbered register with colour swatches and prices, and the order column on the left (`src/option-d/shipboard.css`).

The list is `src/data/shipboard.json`, taken from the live online order form (WordPress feed, read 19 Oct 2026); its prices match PP01-F01 BMSR Fees Rev 04. `tools/fill/shipboard.mjs` renders the groups, prices, set and courier charges. Cover colours for the titles not on the live cover image are ours (marked `"check"`).

## News page
`src/news.html`, built as `option-*/news/index.html`, in The BMSR menu as "News" and in the footer (the live `category/news/`; the older live list `/news/` shows the same posts and is aliased to it). Every post in the live news category, newest first: the latest is a large feature and the rest are cards with topic, date, title, excerpt and photo, each linking to its live post. Topic chips filter them (Events, Press statements, Our people, Registry & flag, Industry, In the media); "All" shows the latest 13, then "Show all". A band at the end points to Bulletins and Marine Circulars, which have their own lists. The home page's "All news" button opens it. Option D shows a sticky side column (title, chips, count) and the posts as a ruled register with a large date (`src/option-d/news.css`).

The posts are `src/data/news.json` (37 posts, Aug 2021 to Jun 2026), taken from the live WordPress feed (read 19 Oct 2026), one line per post. Titles, dates, links and photos are the live ones; where a live excerpt was wrong or copied from another post, the post's own opening is used and marked `"check"`. The topics are ours. Photos are the live featured images, as WebP in `assets/img/news/`. To add a post, put it at the top of `posts`.

**Category pages:** `src/news-category.html` is built once per topic in `news.json`, as `option-*/news-<topic>/index.html` (e.g. `news-events/`, `news-press/`): a hero with the category name and count, that topic's posts (the newest as the feature), and the topic chips as links to the other categories and "All news". On the News page, choosing a topic shows a link to its page. A new topic gets its page automatically. The build sets `{{page:topic}}` and `{{page:name}}` per page (a page entry's `vars`). The News styles are shared in `src/partials/news-css.html`; Option D uses `news.css` for both. In WordPress these become the category archives.

## Ship Registration page
`src/ship-registration.html`, built as `option-*/ship-registration/index.html`. It's the first sub-page (Registration > Ship Registration), so the menu item and the Registration hub's "Ships" card now open it instead of `registration/#types`. The two stages, Provisional then Permanent, each list the forms to complete (with their Word downloads and revision) and the documents to provide. Applicants can tick each one as it's ready: a count per stage, struck-through rows, and "Clear my ticks". The ticks are kept in that browser only (localStorage, wrapped in try/catch). The side column has the PPR01-C01 checklist download, help links and the progress box; only the progress box stays pinned while scrolling, so the column never runs off the bottom of the screen. The four links from the live page sit in an "Also useful" band. Option D puts the side column on the left as a particulars sheet (`src/option-d/ship-registration.css`).

The content is `src/data/ship-registration.json`, taken from the live page's WordPress feed (wording as live, modified 14 Oct 2026), with the real file links. Those links also fill `"file"` for the seven matching forms in `src/data/forms.json`, and the Forms page's buttons now show the real file type (DOCX/DOC) instead of always "PDF".

## Yacht Registration page
`src/yacht-registration.html`, built as `option-*/yacht-registration/index.html` (Registration > Yacht Registration; the live `registration/yacht-registration/`). The live page is short, so it's set out as three steps: ask for a quote, complete the PPR01-C02 checklist (Word download), and the Flag State Inspection, shown as two cards: commercial yachts (required at least every five years) and private yachts (recommended). The side column has the checklist download and links to Nautical Inspectors, Registration fees and Ship registration. "Get in touch with us here" has the live wording, the office phone and email, and a quote form (name, email, commercial/private, subject, message): a front-end preview that validates and thanks, to be wired to Contact Form 7 + reCAPTCHA in WordPress (`TODO(dev)`). Option D puts the side column on the left as a particulars sheet (`src/option-d/yacht-registration.css`).

The content is `src/data/yacht-registration.json`, from the live page's WordPress feed (modified 12 Sep 2025), rendered by `tools/fill/yacht-registration.mjs`.

## Mortgages page
`src/mortgages.html`, built as `option-*/mortgages/index.html` (live `registration/mortgages/`, Registration > Mortgages). The live page's text is set out as five numbered sections: recording a mortgage, priority by letter (A, B, C… shown as tiles), the mortgage forms, completing the mortgage (four rules, with the 'Trust' caveat flagged), and recording & discharge. The two common forms, PPR02-F01 and PPR02-F02, have their Word downloads and revision. The side column has the live page's three links (Registration fees, Contact us, Useful links) and an "At a glance" facts box, which is the only part that stays pinned while scrolling. Option D puts the side column on the left as a particulars sheet, with the section numbers set large in their own margin (`src/option-d/mortgages.css`).

The forms are `src/data/mortgages.json`, rendered by the plug-in `tools/fill/mortgages.mjs`. Wording is from the live page's WordPress feed (modified 23 Mar 2026); the section headings are ours.

## Bareboat Charter page
`src/bareboat-charter.html`, built as `option-*/bareboat-charter/index.html` (the live page is `/bareboat-charter/`; the old menu address `registration/bareboat-charters-registration/` redirects there and is aliased in `SUB`). It explains the two directions, chartering out of the Barbados flag (registration suspended, mortgages still recorded, the ship under the 'secondary' flag's laws) and chartering in (consent from the foreign flag, or evidence it wasn't needed), then what the charter-party agreement must state: commencement date, intended duration (normally two to five years, extendable) and the parties' full names and addresses, in English, with BIMCO BARECON recommended. The side column has the PPR01-C05 checklist download, key facts and help links; only the small help box stays pinned while scrolling. Option D puts the side column on the left as a particulars sheet (`src/option-d/bareboat-charter.css`).

The content is `src/data/bareboat-charter.json`, taken from the live page's WordPress feed (wording as live, modified 15 Sep 2025); `tools/fill/bareboat-charter.mjs` fills the page from it. The live text is three paragraphs; it's split here into the two directions and a list (marked `"check"`). The two photos are the live page's own, in `assets/img/bareboat-charter/`.

## Registry Alterations page
`src/registry-alterations.html`, built as `option-*/registry-alterations/index.html` (Registration > Registry alterations). The live page is only four photo links to sub-pages, so here those sub-pages (Change of Ownership, Change of Vessel's Name, Change of Owner's Name and/or Address, Deletion) are sections of one page. Their old live addresses open the matching section (`#change-of-ownership`, `#change-of-vessels-name`, `#change-of-owners-name`, `#deletion`, via `SUB`). Each section has the live wording, what you'll receive, and its downloads and links: Change of Vessel's Name has PPR01-F01 and the portal's name-availability check; Change of Owner's Name and/or Address has PPR01-C04; Deletion has the four items the Registrar needs and the compulsory de-registration note. The side column has help links and an "On this page" list; only that list stays pinned. Option D shows the four changes as a ruled register with thumbnails, and puts the side column on the left (`src/option-d/registry-alterations.css`).

The content is `src/data/registry-alterations.json`, from the live WordPress feed (read 19 Oct 2026), rendered by `tools/fill/registry-alterations.mjs`. Photos are the live ones, as WebP in `assets/img/registry-alterations/`.

## Registration Fees page
`src/registration-fees.html`, built as `option-*/registration-fees/index.html` (live `registration/registration-fees/`, menu Registration > Registration fees). The live page only offers the Word download, so the review page shows the whole schedule from PP01-F01 BMSR Fees Rev 04: ships by net tonnage (initial and annual fee per band), yachts by use, 35 other fees, and the shipboard document prices. A fee estimator works out a ship's initial and annual fee from its NRT, and one search box filters every table. On phones each row stacks as label and amount. The side column has the fees-list download, next steps and a jump list (only the jump list stays pinned). Option D puts that column on the left as a particulars sheet with ruled, mono-figure rows (`src/option-d/registration-fees.css`).

The fees are `src/data/registration-fees.json`, rendered by `tools/fill/registration-fees.mjs`. Every amount is in US dollars and copied exactly from the Word file; only the number format is made consistent, and "/hr." reads "per hour". When the fees list is revised, update the amounts, `rev` and `file` there.

## Endorsement & Discharge Book page
`src/endorsement-discharge-book.html`, built as `option-*/endorsement-discharge-book/index.html` (Seafarers > Endorsement & discharge book; the live `seafarers-manning/endorsement-discharge-book/`, whose earlier guessed address is aliased in `SUB`). It opens with the live page's photo and its first paragraphs (Shipping Act 1994, certificated officers, STCW Reg. I/10 undertakings), then "The key rules" as four tiles (officers only, white-listed countries, English translation, valid medical certificate) and "How to apply" as four steps: download PPS01-F01 (Word), the owner/manager or authorised crewing agency applies (no individual applications; a signed letter of authorisation confirming ISM and MLC compliance), the Certificate of Receipt of Application (CRA, valid for up to three months), and the full endorsement, which can be verified on the portal. The side column has the form download, useful links and "Check an endorsement"; only that last small box stays pinned. Option D puts the side column on the left as a particulars sheet, with the steps' numbers set large (`src/option-d/endorsement-discharge-book.css`).

The content is `src/data/endorsement-discharge-book.json`, from the live page's WordPress feed (modified 18 Dec 2025), rendered by `tools/fill/endorsement-discharge-book.mjs`. The photo is the live page's own, in `assets/img/endorsement-discharge-book/`.

## Inspection Templates page
`src/inspection-templates.html`, built as `option-*/inspection-templates/index.html` (live `inspections/inspection-templates/`, menu Inspections > Inspection templates). The live page is two download tiles, so it's two numbered cards: the Annual Flag State Inspection pack (a ZIP holding PPO01-F01 Flag State Inspection Checklist, Excel Rev 00, and PPO01-F02 Inspection Photos, Word Rev 02; the contents are listed on the card) and PPO01-F03 Certificate of Inspection (Word, Rev 0), each with its file type and size. The side column links to Notices to Nautical Inspectors, the Appointed Nautical Inspectors list, Inspections and Contact; nothing in it is pinned. Option D puts that column on the left as a particulars sheet and the templates in a ruled register (`src/option-d/inspection-templates.css`).

The content is `src/data/inspection-templates.json`, from the live page's WordPress feed (modified 17 Oct 2025), rendered by `tools/fill/inspection-templates.mjs`. When a template is revised, update its `file`, `size` and (for the pack) `contains` there.

## Notices to Nautical Inspectors page
`src/notices-to-nautical-inspectors.html`, built as `option-*/notices-to-nautical-inspectors/index.html` (Inspections > Notices to Nautical Inspectors; the live `inspections/notices-to-nautical-inspectors/`). The active notices, newest first, each with its date, kind, the live wording, a "Read the notice" link to its live post and a related link: the updated AFSI form (8 February 2021, with Inspection Templates) and Bulletin 341, MLC/DMLC change of policy (21 January 2021, with the bulletins). The side column has inspector resources (Inspection Templates, Appointed Nautical Inspectors, Bulletins) and the live page's three help links; only the help box stays pinned while scrolling. Option D puts the side column on the left as a particulars sheet and shows the notices as a ruled register with a large date (`src/option-d/notices-to-nautical-inspectors.css`).

The notices are `src/data/notices-to-nautical-inspectors.json` (from the live page's WordPress feed, modified 8 Jun 2022), rendered by `tools/fill/notices-to-nautical-inspectors.mjs`. To add a notice, put it at the top of `notices`.

## Appointed Nautical Inspectors page
`src/nautical-inspectors.html`, built as `option-*/nautical-inspectors/index.html` (live `list-of-appointed-nautical-inspectors/`, menu Inspections > Appointed Nautical Inspectors). A finder like the Regional Registrars page: search by country, port, name or company, filter by region (Europe, Middle East, Africa, Asia & Pacific, Americas), jump to a country, with a live count. The results are 58 country groups of port cards (124 listings), each with the inspector, company, address and every contact as published: phones tap-to-call with full international numbers, emails with copy buttons. The jump lands each country just below the pinned finder. The live page's Google map isn't reproduced. Option D puts the finder in a sticky side column and shows each port as a ruled row (`src/option-d/nautical-inspectors.css`).

The list is `src/data/nautical-inspectors.json`, parsed by script from the live page's WordPress feed (last updated 31 Jan 2023 on the live site) and rendered by `tools/fill/nautical-inspectors.mjs`. Names, companies, addresses and contacts are kept exactly; only the phone links are made international, and every one that was inferred or repaired is listed in `"checks"` (53) for the client to confirm.

## Marine Accident Reporting page
`src/casualty-investigations.html`, built as `option-*/casualty-investigations/index.html` (Investigations > Marine accident reporting; the live `investigations/casualty-investigations/`, whose earlier guessed address `investigations/marine-accident-reporting/` is aliased in `SUB`). It sets out the duty to report under the Shipping Act and who investigates (the Ministry of Maritime Affairs and the Blue Economy, independently of the BMSR), then "Report now" with the 24/7 line, accidents@barbadosmaritime.com and the PPI01-F01 Accident Report Form (Word), "How investigations work" as three cards (purpose, the IMO Casualty Investigation Code, inspectors' powers) and what has to be reported and what can be investigated. A band links to the Marine Safety Investigation Reports. The side column has the form download and the live page's three help links; only the help box stays pinned. Option D puts the side column on the left as a particulars sheet, with the principles' numbers set large (`src/option-d/casualty-investigations.css`).

The content is `src/data/casualty-investigations.json`, from the live page's WordPress feed (modified 6 Jun 2025), rendered by `tools/fill/casualty-investigations.mjs`. The photo is the live page's own, in `assets/img/casualty-investigations/`.

## Marine Safety Investigation Reports page
`src/accident-incident-reports.html`, built as `option-*/accident-incident-reports/index.html` (live `investigations/accident-incident-reports/`, menu Investigations > Marine safety investigation reports; Investigations > Ongoing investigations opens its `#ongoing` section, and the earlier guessed addresses are aliased in `SUB`). "Ongoing MSI" has the live intro and, as none are listed live, a "none published" line; "Completed MSI" is a register of the 7 vessels (8 report files), newest first, each with its IMO number, date and Word/PDF download, plus a search by vessel, IMO number or year. Each report has its own anchor (e.g. `#concordia`). The side column has the accident contacts and the 24/7 emergency line (only that small box stays pinned), and the live page's three useful links close the page. Option D puts the side column on the left as a particulars sheet and the reports in a ruled register (`src/option-d/accident-incident-reports.css`).

The reports are `src/data/accident-incident-reports.json`, from the live page's WordPress feed (modified 22 Jul 2025), rendered by `tools/fill/accident-incident-reports.mjs`. To add a report, add it to `reports` (it's sorted by date); an ongoing investigation goes in `ongoing`.

## Marine Circulars page
`src/marine-circulars.html`, built as `option-*/marine-circulars/index.html` (Documents > Marine Circulars; the live `documents/marine-circulars-bmsr/`, with our earlier menu address `documents/marine-circulars/` aliased in `SUB`). A register like Bulletins: search by number or subject, topic chips (Inspections, Registration, Security & sanctions, Environment, Crew & STCW, Investigations) and a sort (newest first or by number), with a live count. Each circular shows its number and date, title, topic, "Notice to" and its purpose (section 1.1) as a short summary, with Read (the live post) and the circular's own PDF; the newest is marked "Latest". The live page carries every circular's full text; here it's behind Read and PDF. The side column has the two "everything at once" downloads (the Google Drive folder and the list spreadsheet), related links and a small Operations help box (ops@), which is the only part that stays pinned. Option D puts the side column on the left as a particulars sheet, with each number set large in its own margin (`src/option-d/marine-circulars.css`).

The circulars are `src/data/marine-circulars.json` (9, MC 012025 to MC 102026), parsed by script from the live page's WordPress feed (modified 14 Oct 2026), with dates from each circular's post, and rendered by `tools/fill/marine-circulars.mjs`. To add a circular, add a line to `circulars`.

## Guides page
`src/guides.html`, built as `option-*/guides/index.html` (live `documents/guides/`, menu Documents > Guides). The two Masters' guides as cards with their real covers: the Ship Master's Guide for commercial vessels (PDF, Rev 3, 2017) and the Yacht Master's Guide for yachts, commercial and pleasure (PDF, 2016, also readable online on the live site), each with its format, size and year and a download button. The side column has the live page's related links (Forms, Nautical Inspectors, Bulletins, Conventions) and Contact; nothing in it is pinned. Option D puts the side column on the left as a particulars sheet and shows the guides as a ruled register with large numbers (`src/option-d/guides.css`).

The content is `src/data/guides.json`, from the live page's WordPress feed (modified 29 Jul 2025), rendered by `tools/fill/guides.mjs`. The live page shows only the Yacht Master's tile; the Ship Master's guide it names is taken from the media library (marked `"check"`). Covers are in `assets/img/guides/`.

## Barbados Legislation page
`src/barbados-legislation.html`, built as `option-*/barbados-legislation/index.html` (live `documents/barbados-legislation/`, menu Documents > Barbados Legislation, with Acts and Regulations in its flyout). An overview, like the live page's two tiles: one card for the Merchant Shipping Acts, 2024 (the five titles) and one for the Merchant Shipping Regulations, 2025 (S.I. 2025 Nos. 22–44, counted by subject), each linking to its own page, where the full registers and the search are. The side column has the technical and operational support email (ops@) and links, and a small "In this section" box, the only part that stays pinned. Option D shows the two cards as ruled sheets under gold rules (`src/option-d/barbados-legislation.css`).

The data is `src/data/barbados-legislation.json`, parsed by script from the live pages' WordPress feed (read 19 Oct 2026) and rendered by `tools/fill/barbados-legislation.mjs`; `acts.json` and `regulations.json` were generated from it. Each item keeps its title exactly as published in `"live"` (capitals). The legal texts aren't reproduced: every item links to its PDF.

## Change of Ownership page
`src/change-of-ownership.html`, built as `option-*/change-of-ownership/index.html` (live `registration/registry-alterations/change-of-ownership/`, menu Registration > Registry alterations > Change of ownership). The live text (the vessel stays on the Register; ownership documents, mortgage discharge/transfer and new mortgages go to the Registry; Declarations of Agreement from mortgagees and bareboat charter party principals), then "What you'll need" as a tick list (five items, saved on the device, with "Clear my ticks"), what you'll receive (a new Certificate of Registry) and links to Registration fees and Mortgages. The side column links to the other three registry alterations and the overview, plus Registration fees and Contact; only the small progress box stays pinned. Option D puts the side column on the left as a particulars sheet (`src/option-d/change-of-ownership.css`).

The content is `src/data/change-of-ownership.json`, from the live page's WordPress feed (modified 8 Jun 2022), rendered by `tools/fill/change-of-ownership.mjs`. The live page has no downloads.

## Change of Vessel's Name page
`src/change-of-vessels-name.html`, built as `option-*/change-of-vessels-name/index.html` (live `registration/registry-alterations/change-of-vessels-name/`, menu Registration > Registry alterations > Change of vessel's name; the Registry Alterations page's card opens it). The live page's three paragraphs, a name-availability band linking to the portal check (new tab), "What you'll need" as a tick list (the new name checked as available, PPR01-F01, any mortgagees' written consent, the Notice of Name Proposed form), with a count and "Clear my ticks" saved in that browser only, and the PPR01-F01 Application for Registration download (Word, Rev 6). The side column has help links, the other registry alterations and the progress box, which is the only part that stays pinned. Option D puts the side column on the left as a particulars sheet (`src/option-d/change-of-vessels-name.css`).

The content is `src/data/change-of-vessels-name.json`, from the live page's WordPress feed (modified 28 May 2026), rendered by `tools/fill/change-of-vessels-name.mjs`. The photo is the live one, shared with the Registry Alterations page.

## Change of Owner's Name and/or Address page
`src/change-of-owners-name.html`, built as `option-*/change-of-owners-name/index.html` (Registration > Registry alterations > Change of owner's name or address; the live `registration/registry-alterations/change-of-owners-name-and-or-address/`). The live text, what you'll receive (a new Certificate of Registration and CSR), "What you'll need" as a tick list (written notice, the PPR01-C04 checklist, the mortgagees' agreement, the fee; ticks saved on the device) and the PPR01-C04 Checklist for Change of Owner download (Word). The side column links to the other three registry alterations and the overview, and has help links and a small "Your progress" box, the only part that stays pinned. The live page's three useful links close the page. Option D puts the side column on the left as a particulars sheet (`src/option-d/change-of-owners-name.css`).

The content is `src/data/change-of-owners-name.json`, from the live page's WordPress feed (modified 23 Sep 2025), rendered by `tools/fill/change-of-owners-name.mjs`.

## Deletion page
`src/deletion.html`, built as `option-*/deletion/index.html` (Registration > Registry alterations > Deletion; the live `registration/registry-alterations/deletion/`). One of the four Registry Alterations sub-pages, in their shared layout: the live text (the Registry must be told in writing; Registrars confirm the documents and that all fees are paid), then "What you'll need" as a tick list of the four items the Registrar must receive (fees paid, the original Certificate of Registry, the mortgage instrument if one is recorded, and, if bareboat chartered in, evidence the primary flag has accepted the vessel), saved on the device, and the compulsory de-registration note. The live page has no downloads. The side column links to the other three alterations and the overview, plus Registration fees and Contact; only the small progress box stays pinned. Option D puts the side column on the left as a particulars sheet (`src/option-d/deletion.css`).

The content is `src/data/deletion.json`, from the live page's WordPress feed (modified 2 Mar 2025), rendered by `tools/fill/deletion.mjs`.

## Yacht Master's Guide page
`src/yacht-masters-guide.html`, built as `option-*/yacht-masters-guide/index.html` (live `yacht-masters-guide/`, menu Documents > Guides > Yacht Master's Guide; the Guides page's "Read online" opens it). The live page is a flipbook of the 2016 PDF; here the guide is read on the page with PDF.js (3.11.174 from cdnjs): one page at a time, previous/next, a page box, zoom and fit, full screen, keyboard arrows and a PDF download, and each page's text is passed to screen readers. PDF.js loads only when the reader comes into view. Because the live PDF can't be framed from another site, a copy is served from `assets/docs/yacht-masters-guide.pdf`; if the reader can't load (offline, a blocked CDN, or the page opened from disk), it offers the PDF itself. The side column has the guide's details, its own 14-section contents (each opens its page) and a note that the guide dates from 2016, with the current 24/7 number. Option D puts the side column on the left as a particulars sheet (`src/option-d/yacht-masters-guide.css`).

The details and contents are `src/data/yacht-masters-guide.json`, from the guide itself (its contents page; the printed page numbers match the PDF's), rendered by `tools/fill/yacht-masters-guide.mjs`. If the guide is replaced, update the PDF in `assets/docs/`, `pages` and `contents`.

## Acts page
`src/acts.html`, built as `option-*/acts/index.html` (live `documents/acts/`, menu Documents > Barbados Legislation > Acts). The five Merchant Shipping Acts, 2024, in the live order, each with its live tile photo, its number (e.g. Act 2024-30), title and year, and its PDF (opens in a new tab); the principal Merchant Shipping Act, 2024 leads as a wide card. The side column has Technical and Operational Support (ops@) with links to Barbados Legislation, International conventions and Contact, and a small box pointing to the 23 Regulations, which is the only part that stays pinned. Option D puts the side column on the left as a particulars sheet and shows the Acts as a ruled register with the numbers set large (`src/option-d/acts.css`).

The content is `src/data/acts.json`, from the live page's WordPress feed (modified 30 May 2025), rendered by `tools/fill/acts.mjs`; titles, numbers and PDF links match `src/data/barbados-legislation.json`, and `"live"` keeps each published title exactly. Photos are the live page's own, as WebP in `assets/img/acts/`.

## Regulations page
`src/regulations.html`, built as `option-*/regulations/index.html` (live `documents/regulations/`, menu Documents > Barbados Legislation > Regulations). The 23 Merchant Shipping Regulations, 2025 (S.I. 2025 Nos. 22–44) as a register in number order, each with its S.I. number, title, subject and PDF (opens in a new tab). A finder searches by title or number (e.g. "No. 40") and filters by the six subjects, with a live count. The side column has Technical and Operational Support (ops@) with links to the Acts, Barbados Legislation, conventions, bulletins and contact; the live page's "new Regulations by email" signup as a front-end preview (TODO(dev): wire in WordPress); and an "At a glance" box, the only part that stays pinned. The legal texts aren't reproduced, nor the Bulletin B011 text the live page repeats under every regulation. Option D puts the side column on the left as a particulars sheet, with the S.I. numbers set large (`src/option-d/regulations.css`).

The register is `src/data/regulations.json`, generated from `src/data/barbados-legislation.json` (itself parsed from the live WordPress feed), and rendered by `tools/fill/regulations.mjs`.

## News post pages
`src/news-post.html` is built once per post in `src/data/news.json`, at the post's own live address (`barbadosmaritime.com/<slug>/` → `option-*/<slug>/index.html`; the build's `POSTS` adds each slug to `LIVE`), so News cards, the category pages, the home news strip and older/newer links all open them. Each has the featured image as its hero (crumbs Home / News / topic, title, date, reading time, topic), the article at reading width (lead paragraph, headings, lists, pictures, links; outside links open in a new tab), a Downloads box when the post has files, its tags, a side column (published, topic, reading time, All news) with "Share this post" (copy link, LinkedIn, X, email; no third-party scripts; the only part that stays pinned), older/newer post navigation, "More in <topic>" as three News cards, and the closing band. Option D puts the side column on the left as a particulars sheet with the date set large (`src/option-d/news-post.css`).

The text is `src/data/news-posts.json`, cleaned from the live WordPress feed (read 19 Oct 2026) by a script: page-builder wrappers, inline styles and LinkedIn hashtag links removed (hashtags are kept as tags), wording unchanged; `{{fig:n}}` marks where each in-body picture goes. In-body pictures are WebP copies in `assets/img/news/posts/`. `tools/fill/news-post.mjs` renders each page; the build sets the post with the page var `{{page:post}}`. A new post in `news.json` needs its text in `news-posts.json` (re-run the parser).

## Header dropdowns

"Documents" in the main menu has a dropdown: Forms · Shipboard Documents · Bulletins · Marine Circulars · Guides · Conventions · Barbados Legislation · Barbados Publications. The panels have no "All …" link (removed 18 Oct 2026): the menu name itself opens each hub page. It opens on hover or keyboard focus; the arrow button toggles it on touch screens, and Escape or a click outside closes it. In the mobile menu, the same links are listed under Documents. It's in `src/partials/top.html` and `src/option-d/nav.html`, styled in `src/partials/head.html`. That file also keeps the logo and flag from shrinking, and tightens the menu between 1241 and 1400px.


**All six menu items with sub-pages now have dropdowns:** The BMSR, Registration, Seafarers, Inspections, Investigations and Documents. Events, and Option D's Contact, stay plain links. Each panel has its own id (`dd-bmsr`, `dd-reg`, `dd-sea`, `dd-insp`, `dd-inv`, `dd-docs`). Escape closes a panel and keeps it shut until focus or the mouse leaves. Between 1241 and 1400px the arrows and gaps tighten so the header still fits; Option D gets slightly smaller gaps because of its extra Contact item.

**Second-level flyouts:** Registration > Registry alterations (its four sub-pages), Documents > Guides (Yacht Master's Guide) and Documents > Barbados Legislation (Acts, Regulations) use the same flyout as The BMSR > About us. **The BMSR menu:** Our team is a second-level item under About us, and "Shipping – Invest Barbados – A Welcoming Investment Climate" (https://www.investbarbados.org/shipping/, new tab) under Useful links: a flyout to the side in the desktop menu (opens on hover or keyboard focus; `.dd-n`, `.dd-p`, `.dd-s` in head.html), and an indented "↳ Our team" in the mobile menu. "Why register in Barbados" is not in the menu (client request); it is reached from The BMSR hub.

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
