# The Forge Strength Club

Website I built for The Forge Strength Club, a strength gym opening in Piedmont, South Carolina in early 2027.
Live at [anthonyradke.github.io/theforge-web](https://anthonyradke.github.io/theforge-web/).

It's one static page with no framework, build step or dependencies. That keeps hosting free on GitHub Pages and
lets the owner edit copy in a text editor. `index.html` holds every section, `assets/css/styles.css` holds the
styles in numbered sections, and `assets/js/main.js` handles the nav, scroll reveals, stat counters, the ember
effect in the hero and the contact form.

## Running locally

```sh
python3 -m http.server 4321
```

Pushing to `main` deploys it.

## How it's built

- Colors and type are CSS custom properties at the top of `styles.css`. Headlines are Anton, labels Barlow
  Condensed, body text Inter, each with a system fallback.
- The logo is an SVG redraw of the gym's mark, defined once as `<symbol id="forge-mark">` in `index.html` and
  reused in the header and footer. `assets/img/favicon.svg` is a separate copy.
- Links and assets use relative paths, so moving to a custom domain only means updating the canonical URL,
  Open Graph tags, `sitemap.xml` and `robots.txt`, and adding a `CNAME` file.
- `ExerciseGym` JSON-LD for local search, Open Graph tags, a print stylesheet, and a skip link. It works with
  JavaScript off and turns animations off under `prefers-reduced-motion`.

### Contact form

GitHub Pages can't receive form posts. With a Formspree endpoint set in `CONFIG` at the top of `main.js`, the form
submits over `fetch` and shows a confirmation in place. Until then, or if the request fails, it opens the
visitor's mail app with the fields filled in. A hidden honeypot field catches most bots.

### Mobile notes

These came from bugs on real phones:

- Form fields stay at 16px below 940px, or iOS Safari zooms the page when one is focused.
- The mobile menu lives inside `.site-header`, which is its own stacking context, so `body.nav-open .site-header`
  raises the whole header above the backdrop.
- Opening the menu locks scrolling with `overflow: hidden` plus a `touchmove` guard, not `position: fixed` on the
  body. A fixed body jumps to the top, and restoring the scroll position afterwards could land in the wrong place.
- The sticky bar is solid on mobile. With `backdrop-filter` on a sticky element, phones showed compositing
  artifacts as content scrolled underneath.
- The film-grain overlay (`body::after`) is off below 940px. Mobile browser toolbars resizing the viewport left it
  misaligned as a dark band along the bottom of the screen.

## Still to do

- Real photos in the founder and about sections, replacing the placeholder frames
  (`<div class="media-frame__ph">`). Swap each one for an `<img>` with a width, height and alt text.
- The real contact email, and Facebook and YouTube links once those accounts exist.
- Pricing, staffed hours, street address and exact opening date stay off the site until they're final.
- A 1200×630 PNG of `assets/img/og-image.svg`, since some platforms won't render SVG link previews.
