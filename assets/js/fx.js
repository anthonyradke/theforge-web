/* =========================================================================
   THE FORGE STRENGTH CLUB — fx.js
   Decorative animation layer. Loaded after main.js and paired with
   assets/css/fx.css. Every numbered block is independent: removing a block
   here and the block with the same number in fx.css removes that effect and
   nothing else. The page works fully without this file.
   ========================================================================= */

(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // Runs fn once, the first time el scrolls into view.
  const onView = (el, fn, opts) => {
    if (!hasIO) { fn(); return; }
    new IntersectionObserver((entries, obs) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      obs.disconnect();
      fn();
    }, opts || { threshold: 0.3 }).observe(el);
  };

  // Calls on() while el is on screen and off() while it is not.
  const whileVisible = (el, on, off) => {
    if (!hasIO) { on(); return; }
    new IntersectionObserver(([entry]) => {
      entry.isIntersecting ? on() : off();
    }).observe(el);
  };

  // One effect failing must never take the others down with it.
  const block = (fn) => {
    try { fn(); } catch (err) { console.warn('fx:', err); }
  };

  /* ── 1. Scroll progress barbell ──────────────────────────────────────── */
  block(() => {
    const marks = $$('main > section[id]').filter((s) => s.id !== 'top' && s.id !== 'stats');
    if (!marks.length) return;

    const bar = document.createElement('div');
    bar.className = 'fx-progress';
    bar.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('span');
    fill.className = 'fx-progress__fill';
    bar.appendChild(fill);
    const plates = marks.map(() => {
      const p = document.createElement('i');
      p.className = 'fx-progress__plate';
      bar.appendChild(p);
      return p;
    });
    document.body.appendChild(bar);

    const HEADER = 110;                      // sticky header height, roughly
    let max = 1, stops = [], queued = false;

    const paint = () => {
      queued = false;
      const p = Math.min(Math.max(window.scrollY / max, 0), 1);
      fill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      plates.forEach((el, i) => el.classList.toggle('is-on', p >= stops[i] - 0.002));
    };

    // A plate sits where its section's top meets the header.
    const measure = () => {
      max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      stops = marks.map((s) => {
        const top = s.getBoundingClientRect().top + window.scrollY - HEADER;
        return Math.min(Math.max(top / max, 0), 1);
      });
      plates.forEach((el, i) => el.style.setProperty('--x', (stops[i] * 100).toFixed(2) + '%'));
      paint();
    };

    window.addEventListener('scroll', () => {
      if (!queued) { queued = true; requestAnimationFrame(paint); }
    }, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    // Page height changes when photos load or an FAQ answer opens.
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.body);
    measure();
  });

  /* ── 2. Records board split-flap ─────────────────────────────────────── */

  /* ── 3. Heated-metal buttons ─────────────────────────────────────────── */

  /* ── 4. Founding 50 plate rack ───────────────────────────────────────── */

  /* ── 5. Weld-line section dividers ───────────────────────────────────── */

  /* ── 6. Pricing card tilt and founding border ────────────────────────── */

  /* ── 7. Contact section embers ───────────────────────────────────────── */

  /* ── 8. Quenched section headings (CSS only) ─────────────────────────── */

  /* ── 9. Founder barbell and credentials ──────────────────────────────── */

  /* ── End ─────────────────────────────────────────────────────────────── */
})();
