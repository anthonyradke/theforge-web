# The Forge Strength Club

A website I built for The Forge Strength Club, a strength gym opening in Piedmont, South Carolina in early 2027.

Live at [anthonyradke.github.io/theforge-web](https://anthonyradke.github.io/theforge-web/)

It's a single page of plain HTML, CSS and JavaScript. I kept it simple on purpose so hosting is free and the
owner can update text without any tools.

## Files

```
index.html             every section of the site
assets/css/styles.css  styles
assets/js/main.js      menu, scroll effects, counters, contact form
assets/img/            favicon and link preview image
```

## Running locally

```sh
python3 -m http.server 4321
```

Pushing to `main` updates the live site.

## How it's built

- Colors and fonts are set once as CSS variables at the top of `styles.css`. Fonts are Anton, Barlow Condensed
  and Inter.
- The logo is an SVG drawn to match the gym's real logo. It's defined once in `index.html` and reused in the
  header and footer.
- It includes structured data so Google can show it as a local gym, plus link previews for social media.
- The site works with JavaScript turned off, and animations stop if the visitor has reduced motion enabled.

## Contact form

GitHub Pages can't process form submissions on its own. If a [Formspree](https://formspree.io) link is added to
`CONFIG` at the top of `main.js`, the form sends messages directly. Without it, the form opens the visitor's
email app with everything filled in. A hidden field catches most spam bots.

## Fixes for phones

A few things I ran into while testing on real phones:

- Form fields stay at 16px on small screens. Anything smaller and iPhones zoom in when you tap a field.
- Opening the menu locks the page from scrolling behind it. I avoided the usual `position: fixed` approach
  because it made the page jump back to the top.
- The sticky header is solid on phones. The blurred glass effect caused flickering while scrolling.
- The grain texture over the page is turned off on phones. It shifted out of place when the browser's toolbar
  showed or hid.

## Still to do

- Swap the placeholder photo frames for real photos.
- Add the real email address and social links once they exist.
- Add pricing, hours, address and opening date once they're final.
- Add a PNG version of the link preview image, since some sites can't show SVG.
