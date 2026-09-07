# The Forge Strength Club — Website

Marketing site for The Forge Strength Club, a faith-driven strength gym coming to
Piedmont, South Carolina (Greenville area) in early 2027.

**Live:** https://anthonyradke.github.io/theforge-web/

Plain HTML, CSS and JavaScript. No build step, no framework, no dependencies to
install — open `index.html` in a browser and it works. That's deliberate: it keeps
the site fast, keeps hosting free, and means anyone can edit it with a text editor.

---

## What's still a placeholder

The site now reflects real, confirmed information. A few things remain to fill in:

| Where | Placeholder | Replace with |
|---|---|---|
| Founder section | `Owner photo` frame | Jonathan's Forge owner photo |
| About section | 3 photo frames | Gym floor, powerlifting section, community shots |
| Contact + footer + JSON-LD | `hello@theforgestrengthclub.com` | The real email address |
| Contact | Facebook + YouTube markup is commented out | Uncomment and paste the URLs once those accounts exist |
| Founder section | `<!-- TODO -->` comment in the bio | The longer "Meet the Owner" story, if you want more depth |

**Deliberately not on the site yet**, because it isn't final — don't add it back
until it is:

- **Pricing.** No plan tiers, no dollar figures, no discounts, no day-pass rate.
  The membership section explains that pricing is coming and drives people to the
  founding list instead.
- **Staffed hours.** Only "24/7 member access — staffed hours announced before
  opening."
- **Street address.** Only "Piedmont, South Carolina."
- **A phone number.** Email only until there's a real line.
- **Exact opening date.** Only "early 2027."
- **Square footage** is published as "9,000+" — if the lease changes the number,
  it appears in the stats bar, the story timeline, and the FAQ.

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
git commit -m "Update opening date"
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
assets/js/main.js     Nav, scroll reveals, counters, hero embers, form handling
assets/img/           favicon.svg, og-image.svg — add photos here
site.webmanifest      App icon + name for "Add to Home Screen"
robots.txt            Lets search engines index the site
sitemap.xml           Helps Google find the page
.nojekyll             Tells GitHub Pages to serve files as-is
```

### Page sections, in order

Announcement bar · Hero · Stats · Marquee · The Forge (overview) · Our Purpose
(physical / emotional / spiritual) · Our Story · Training & equipment ·
Iron Clubs · Membership · The Founder · FAQ · Contact · Footer

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

**Voice.** The copy is written to sound like a serious gym where everyone belongs —
not a hardcore gym that's proud of excluding people, and never at the expense of
other gyms. Two rules worth keeping when you edit: don't take shots at commercial
gyms, and don't imply that training for aesthetics is a lesser goal. The Forge is
pro-strength *and* pro-bodybuilding.

**Built in:** responsive down to 320 px · keyboard accessible with visible focus
rings · skip-to-content link · respects `prefers-reduced-motion` (animations and the
ember effect switch off) · print stylesheet · Open Graph tags for link previews ·
`ExerciseGym` structured data for local search · works with JavaScript disabled.

---

## Ideas for later

- Photo gallery or a walkthrough video once the space is built out
- A real Iron Clubs leaderboard with member names and dates
- Publish membership plans once they're locked, as a proper pricing section
- Blog or coaching notes (good for local SEO)
- Google Business Profile — genuinely the highest-impact thing for a local gym
- Swap the OpenStreetMap embed for a Google Map once there's a street address
- Export `assets/img/og-image.svg` to a 1200×630 PNG; a few social platforms
  don't render SVG link previews
