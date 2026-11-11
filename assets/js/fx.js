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
