# mavpy-design — MAVPY studio site, "Workshop" v2 (handoff)

Repository: `mavpy/mavpy-design`. Design + production-ready static code of the MAVPY studio website.

Static HTML + CSS + vanilla JS, no build step. Two languages:

| Page | File | Language |
|---|---|---|
| `/` | `index.html` | EN (default) |
| `/ua/` | `ua/index.html` | UA (`lang="uk"`) |

Shared: `styles.css`, `main.js`. Screenshots of the intended result: `previews/` (rendered with the real kit fonts; "clients" uses Inter 100 there because Helvetica Neue Thin is licensed and wasn't available for the render).

Design source: Figma file **MAVPY — Site v2 Workshop** (https://www.figma.com/design/hlVOUverBQLP4qj3I4FTub): UI kit, EN/UA desktop 1920 + mobile 390, motion spec, Dev Mode annotations. Also the canvas "MAVPY — редизайн главной", artboards `D · Workshop EN` / `D · Workshop UA` (desktop + mobile 390). The canvas uses this exact `styles.css`, so class names match 1:1.

## Versions and sync with Figma
How we work day to day (RU): [WORKFLOW.md](WORKFLOW.md).
One version number everywhere: section `## vX.Y — date` in [CHANGELOG.md](CHANGELOG.md) = Git tag + GitHub Release `vX.Y` = Figma page `🗂 vX.Y · date`.
1. Change in Figma (if visual) → 2. change in code on a branch → 3. pull request using the template, CHANGELOG section gets its date → 4. Figma snapshot page `🗂 vX.Y` is added in the same PR round → 5. merge → the `Release from CHANGELOG` action creates the tag and the Release automatically.
All versions with notes: the repo's **Releases** page. Roll back: `git checkout vX.Y` + open page `🗂 vX.Y` in Figma.

## Fonts
| Role | EN | UA (Cyrillic) | Source |
|---|---|---|---|
| "MORE" | BBH Hegarty 400 | Unbounded 900 | Google Fonts. BBH Hegarty is Latin-only |
| "clients" | Helvetica Neue Thin 100 | the same, if the file has Cyrillic, else Inter 100 | **licensed .otf → `fonts/HelveticaNeue-Thin.otf`** |
| Headings | Archivo 800 / 900 | Inter 800 / 900 | Google Fonts. Archivo has no Cyrillic |
| Text, buttons, nav | Roboto 400 / 500 / 700 | Roboto (has Cyrillic) | Google Fonts |
| Marker notes | Caveat 700 | Caveat (has Cyrillic) | Google Fonts. New, not in the kit yet |

All Google families load from one `<link>` in the `<head>` of both pages. Swap to self-hosted files (e.g. Fontsource) if you prefer.

## Tokens (`:root` in styles.css)
From the UI kit: `--amber-700 #9C6800`, `--amber-600 #C68400`, `--amber-500 #FFAB01` (btn_main), `--amber-400 #FFBD3A`, `--amber-300 #FFCB64`, `--black #0F0F0F`, `--ink #202020` (also the footer), `--grey-100 #F2F2F2` (hero), `--grey-200 #EFEDEA` (sections), `--white #FDFDFD` (cards, strip), `--graphite #313131`.
Added: `--text-2 #4A4A4A` (secondary text), `--text-3 #62625F` (muted text), `--line rgba(15,15,15,.12)`.

## Layout: the hero is 1:1 with the current site
Everything is measured on a 1920 frame and scales with `--u = min(1px, 100vw/1920)`:
- container 1240u; header 108u
- kicker Roboto 500 23u → "MORE" BBH Hegarty 135u, tracking 5%, with three bars before it (11u, 8u, 26u, gap 8u)
- "Not just a new website" Archivo 900 48u / 47u, right-aligned, absolutely positioned top-right
- "clients" Helvetica Neue Thin 438u, tracking 4%, spans the container
- note (Roboto 700 23u) + button (58u high) bottom-right, 72u below "clients"
- trust strip under the hero: white marquee with the 4 advantage phrases (no logos)

Text sizes never drop below the `max(…px, …)` floors, so tablets stay readable. Below 1024px the hero stacks: kicker → MORE → clients (sized to the screen width) → "Not just…" → note → full-width button.

## Motion
Root `.mv` class sets the level: `m-kinetic` (default), `m-calm` or `m-off`. `prefers-reduced-motion` turns everything off.
| What | Timing |
|---|---|
| Hero: MORE and clients rise from a mask → kicker, "Not just…" and the note from blur → button → grid background | 0 → 1.05s via `--d` |
| Grid light under the cursor (hero) | follows the mouse, fine pointers only |
| Trust strip (phrases only) and reviews marquee, pause on hover | 50s / 90s per loop |
| Proof block: print drops in, marker circle and arrow draw, notes appear, sticker pops | starts when the block enters the viewport (`data-reveal`) |
| Situation cards: orange 1px outline + marker underline on hover | .3s / .45s |
| Steps and reviews: lift 5px + orange outline | .3s |
| Cases: one open at a time, height via `grid-template-rows`, screenshot fades in, + rotates to × | .45s |
| Pricing rows: lift 3px + amber light under the cursor | .3s |
| Mascot scales 1 → 1.14 from its bottom-left corner while scrolling | rAF |

## Language switch
`EN / UA` links in the header. The choice is saved in `localStorage` (`mavpy-lang`). On the next visit to `/` a saved `uk` redirects to `/ua/`. Add `hreflang` alternates on the live domain (already in the `<head>`, relative).

## Lead form → bot
`main.js` posts `{name, email, phone, page, lang}` as JSON to the URL in the form's `data-endpoint`. Point it at a webhook (own server, n8n, Make) that forwards to Telegram. Keep the bot token on the server. Error texts live in `data-err-*` attributes, per language.

## Replace before launch
See `assets/README.txt` and `fonts/README.txt`. Placeholders are the striped `.mv-ph` blocks: logo, case screenshots, mascot, sticker, Serhii portrait, team photos, review author photos. All texts are filled.

- Cases (5): Medical clinic (open by default), Massage studio, English school, Crypto company, B2B Solar (concept, last). Texts for Massage / English school / Crypto / B2B Solar are drafts to confirm with the clients. New cases: copy an `<article class="mv-case">` and add it before B2B Solar.
- About, variant B: founder polaroid (smaller) + "The team behind your project": 3 role cards (Development & automation, Motion & visuals, Ads & analytics). Variant A (two founders) sits in `<template data-about-a>`.
- Footer contacts: `[email]`, `[phone]`, `[@instagram]` and `[email]` in the form error text (`data-err-net`) still need real values.
