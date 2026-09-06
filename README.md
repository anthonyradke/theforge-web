# The Forge Strength Club — Website

Marketing site for The Forge Strength Club, a faith-driven strength gym opening in
Greenville, South Carolina.

**Live:** https://anthonyradke.github.io/theforge-web/

Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies to
install — open `index.html` in a browser and it works. That's deliberate: it keeps
the site fast, keeps hosting free, and means anyone can edit it with a text editor.

---

## ⚠️ Placeholder content — read this first

This site is a **starting point**. The design and structure are finished; some of
the facts are invented stand-ins so the pages look real. **Replace everything in
this table before sharing the site publicly.**

| Where | Placeholder | Replace with |
|---|---|---|
| Team section | `[Founder Name]`, `[Coach Name]` ×3 | Real names |
| Team section | `[Short founder bio …]`, `[Certification]` | Real bio and credentials |
| Story section | Garage origin story, `[Founder Name]` quote | The real story — this is drafted copy, not fact |
| Contact + footer + JSON-LD | `hello@theforgestrengthclub.com` | Real email |
| Contact + footer + JSON-LD | `(864) 555-0142` / `+18645550142` | Real phone (555-01xx is a reserved fake range) |
| Membership | `$59 / $129 / $249` and all plan features | Real pricing |
| Stats bar | `12,000+` sq ft, `40+` stations | Real numbers |
| Training | Equipment list, class times | Real inventory and schedule |
| FAQ | `[Month] 2026` opening | Real opening month |
| Contact | Social links are `href="#"` | Real Instagram / Facebook / YouTube URLs |
| Contact | Map is centred on Greenville generally | Real address once the lease is signed |
| Whole site | Photo placeholders (see below) | Real photography |

Everything above is plain text in `index.html` — search for the bracketed text and
type over it.

### Photos

Every photo slot is a styled placeholder that looks like this:

```html
<div class="media-frame__ph" data-ph="Gym floor / platform photo"></div>
```

Replace the whole `<div>` with an image and it will crop and size itself correctly:

```html
<img src="assets/img/gym-floor.jpg" alt="Lifter setting up on a competition platform" width="1200" height="900" loading="lazy">
```

Put the files in `assets/img/`. Aim for JPEGs under ~300 KB each (resize to about
1600 px on the long edge first — huge photos are the #1 thing that makes a site
feel slow). Always write a real `alt` description; it matters for screen readers
and for Google.

### The logo

The anvil-and-cross mark used in the header, footer and favicon is a **clean SVG
redraw** of the real logo, built so it stays sharp at any size and loads instantly.
It's close to the original but it is not the textured artwork.

To use the real files instead, put them in `assets/img/` and swap the `<svg>…</svg>`
blocks for `<img>` tags. The mark is defined once as `<symbol id="forge-mark">` near
the bottom of `index.html` — editing that one symbol updates every place it appears.

---

## Making the contact form actually send mail

GitHub Pages serves static files only — it cannot process a form submission. Right
now the form **falls back to opening the visitor's email app** with every field
pre-filled. That works today; it just costs the visitor one extra click.

To get submissions delivered straight to an inbox (free, ~3 minutes):

1. Sign up at [formspree.io](https://formspree.io) and create a form.
2. Copy the endpoint it gives you — it looks like `https://formspree.io/f/abcdwxyz`.
3. Open `assets/js/main.js` and paste it into `CONFIG` at the very top:

```js
const CONFIG = {
  FORM_ENDPOINT: 'https://formspree.io/f/abcdwxyz',
  CONTACT_EMAIL: 'hello@theforgestrengthclub.com'
};
```

That's the only change needed. The form then submits without a page reload, shows a
success message, and still falls back to email if the request fails. A hidden
honeypot field already filters out most spam bots.

---

## Publishing changes

The site deploys straight from the `main` branch.

```bash
git add -A
git commit -m "Update membership pricing"
git push
```

GitHub rebuilds within a minute or so. If Pages isn't switched on yet:
**Settings → Pages → Source: "Deploy from a branch" → `main` / `root` → Save.**

### Previewing locally

Open `index.html` directly, or run a local server (needed if you want the paths to
behave exactly like they do live):

```bash
python -m http.server 4321
```

Then visit http://localhost:4321.

### Custom domain

When the real domain is ready (`theforgestrengthclub.com` or similar):

1. Add a file named `CNAME` at the repo root containing just the domain.
2. Point the domain's DNS at GitHub Pages ([instructions](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site)).
3. Find-and-replace `https://anthonyradke.github.io/theforge-web/` with the new
   domain in `index.html` (the `canonical` and `og:`/`twitter:` tags),
   `sitemap.xml`, and `robots.txt`.

All internal links and asset paths are **relative**, so they keep working on either
domain without changes.

---

## What's in the repo

```
index.html            The entire site — every section lives here
404.html              Error page (self-contained; no external CSS/JS by design)
assets/css/styles.css All styling, organised into 24 numbered sections
assets/js/main.js     Nav, scroll reveals, counters, pricing toggle, embers, form
assets/img/           favicon.svg, og-image.svg — add photos here
site.webmanifest      App icon + name for "Add to Home Screen"
robots.txt            Lets search engines index the site
sitemap.xml           Helps Google find the page
.nojekyll             Tells GitHub Pages to serve files as-is
```

### Page sections, in order

Announcement bar · Hero · Stats · Marquee · The Forge (overview) · Mission & values ·
Story · Training & equipment · Iron Clubs · Membership · Team · FAQ · Contact ·
Footer

To remove a section, delete its `<section>` block in `index.html` and its link in
the nav and footer. To reorder, move the block — the CSS doesn't care about order.

---

## Design notes

**Colours** are defined once as CSS variables at the top of `styles.css`. Change
`--ember` and the red updates everywhere.

```css
--ember:  #D8232A;   /* brand red */
--ink:    #0A0A0B;   /* page background */
--bone:   #EDEBE6;   /* primary text */
```

**Type** is Anton (headlines), Barlow Condensed (labels and nav) and Inter (body),
loaded from Google Fonts. Each has a system fallback so text still renders if the
fonts are slow or blocked.

**Built in:** responsive down to 320 px · keyboard accessible with visible focus
rings · skip-to-content link · respects `prefers-reduced-motion` (animations and the
ember effect switch off) · print stylesheet · Open Graph tags for link previews ·
`ExerciseGym` structured data for local search · works with JavaScript disabled.

---

## Ideas for later

- Photo gallery or a walkthrough video once the space is built out
- A real Iron Clubs leaderboard with member names and dates
- Class schedule pulled from whatever booking software the gym adopts
- Blog or coaching notes (good for local SEO)
- Google Business Profile — genuinely the highest-impact thing for a local gym
- Swap the OpenStreetMap embed for a Google Map once there's a street address
- Export `assets/img/og-image.svg` to a 1200×630 PNG; a few social platforms
  don't render SVG link previews
