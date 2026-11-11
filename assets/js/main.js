/* =========================================================================
   THE FORGE STRENGTH CLUB: main.js
   No dependencies. No build step. Runs fine on GitHub Pages.
   -------------------------------------------------------------------------
   ▸ CONFIG below is the only part you normally need to edit.
   ========================================================================= */

/* ── CONFIG ─────────────────────────────────────────────────────────────
   Contact form delivery.

   GitHub Pages is static hosting. It cannot process a form submission by
   itself. Two options, both free:

   1) RECOMMENDED: Formspree (https://formspree.io)
      Create a free form, copy the endpoint it gives you (it looks like
      https://formspree.io/f/abcdwxyz) and paste it below. Submissions then
      arrive in the gym's inbox with no page reload.

   2) DO NOTHING: while the endpoint below is left as-is, the form falls
      back to opening the visitor's email app with everything pre-filled and
      addressed to CONTACT_EMAIL. It works today, it just costs the visitor
      one extra click.
   ──────────────────────────────────────────────────────────────────────── */
const CONFIG = {
  FORM_ENDPOINT: 'https://formspree.io/f/YOUR_FORM_ID',
  CONTACT_EMAIL: 'hello@theforgestrength.com'
};

/* ── FOUNDING 50 ────────────────────────────────────────────────────────
   Remaining founding memberships. Leave SPOTS_LEFT as null until founding
   sales open and the count is tracked: the page then just says "Only 50".
   Once it's a real number (e.g. 37), the hero shows "37 of 50 left" with a
   progress bar, and 0 shows "All 50 claimed". Only set it to a number that
   is actually being kept up to date.
   ──────────────────────────────────────────────────────────────────────── */
const FOUNDING = {
  TOTAL: 50,
  SPOTS_LEFT: null
};

(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── Founder photo carousel ──────────────────────────────────────────
     Crossfades every 6s. Pauses on hover, while off screen and while the
     tab is hidden. Arrows, keys and swipes wrap around both ends. */
  $$('[data-carousel]').forEach((root) => {
    const slides = $$('.carousel__slide', root);
    if (slides.length < 2) return;

    const prev   = $('.carousel__btn--prev', root);
    const next   = $('.carousel__btn--next', root);
    const dotBox = $('.carousel__dots', root);
    const status = $('[data-carousel-status]', root);
    const DELAY  = 6000;
    let index = 0, timer = null, hovering = false, visible = true;

    dotBox.innerHTML = slides.map(() => '<span></span>').join('');
    const dots = $$('span', dotBox);
    [prev, next, dotBox].forEach((el) => { el.hidden = false; });

    // Load every slide up front so a fade never lands on a blank frame.
    slides.forEach((img) => { img.loading = 'eager'; });

    const show = (i, announce) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, n) => s.classList.toggle('is-active', n === index));
      dots.forEach((d, n) => d.classList.toggle('is-active', n === index));
      if (announce && status) status.textContent = 'Photo ' + (index + 1) + ' of ' + slides.length;
    };

    const stop  = () => { clearInterval(timer); timer = null; };
    const start = () => {
      stop();
      if (reduceMotion || hovering || !visible || document.hidden) return;
      timer = setInterval(() => show(index + 1), DELAY);
    };
    const step = (d) => { show(index + d, true); start(); };

    prev.addEventListener('click', () => step(-1));
    next.addEventListener('click', () => step(1));
    root.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); step(1); }
    });

    // Hover pause is for mice only: a tap would leave it stuck on.
    root.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { hovering = true; stop(); } });
    root.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { hovering = false; start(); } });
    document.addEventListener('visibilitychange', start);

    let x0 = null;
    root.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      x0 = null;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        start();
      }).observe(root);
    }

    show(0);
    start();
  });

  /* ── Footer year ─────────────────────────────────────────────────────── */
  const year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ── Sticky header ───────────────────────────────────────────────────── */
  const header = $('#siteHeader');
  if (header) {
    const onScroll = () => header.classList.toggle('is-stuck', window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ── Mobile navigation ───────────────────────────────────────────────── */
  const nav = $('#nav');
  const navToggle = $('#navToggle');

  if (nav && navToggle) {
    const isOpen = () => nav.classList.contains('is-open');

    // Stops the page behind the drawer from scrolling on touch, without taking
    // the body out of flow. Anything inside the drawer still scrolls normally.
    const blockBackgroundScroll = (e) => {
      const t = e.target;
      if (!(t instanceof Element) || !t.closest('#nav')) e.preventDefault();
    };

    const setNav = (open) => {
      if (open === isOpen()) return;

      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');

      if (open) {
        document.addEventListener('touchmove', blockBackgroundScroll, { passive: false });
      } else {
        document.removeEventListener('touchmove', blockBackgroundScroll, { passive: false });
      }
    };

    // Close on the toggle without letting the tap reach the page behind it.
    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setNav(!isOpen());
    });

    // Close on link tap, Escape, or a click on the backdrop.
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', (e) => {
      if (!isOpen()) return;

      if (e.key === 'Escape') {
        setNav(false);
        navToggle.focus();
        return;
      }

      // Keep Tab inside the open drawer instead of letting it wander onto the
      // page hidden behind it.
      if (e.key !== 'Tab') return;

      const focusables = [navToggle, ...$$('a, button', nav)]
        .filter((el) => el.offsetParent !== null || el === navToggle);
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-open')) return;
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) setNav(false);
    });

    // Reset state if the viewport grows past the drawer breakpoint.
    window.matchMedia('(min-width: 941px)').addEventListener('change', (e) => {
      if (e.matches) setNav(false);
    });
  }

  /* ── Reveal on scroll ────────────────────────────────────────────────── */
  const revealables = $$('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealables.forEach((el) => el.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        obs.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    revealables.forEach((el) => revealObserver.observe(el));
  }

  /* ── Count-up stats ──────────────────────────────────────────────────── */
  const counters = $$('[data-count]');

  const runCount = (el) => {
    const target = Number(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';

    if (reduceMotion) {
      el.textContent = target.toLocaleString() + suffix;
      return;
    }

    const duration = 1500;
    const start = performance.now();

    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(runCount);
    } else {
      const countObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCount(entry.target);
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.6 });

      counters.forEach((el) => countObserver.observe(el));
    }
  }

  /* ── Founding 50 availability ─────────────────────────────────────── */
  const left = FOUNDING.SPOTS_LEFT;
  if (Number.isInteger(left) && left >= 0) {
    const total = FOUNDING.TOTAL;
    const n = Math.min(left, total);
    const text = n === 0
      ? `All ${total} founding memberships claimed`
      : `${n} of ${total} founding memberships left`;
    $$('[data-spots-text]').forEach((el) => { el.textContent = text + '.'; });
    $$('[data-spots]').forEach((el) => {
      const t = $('[data-spots-text]', el);
      if (t) t.textContent = text;
      const bar = $('.spots__bar', el);
      const fill = $('[data-spots-fill]', el);
      if (bar && fill) {
        bar.hidden = false;
        fill.style.width = ((total - n) / total * 100) + '%';
      }
    });
  }

  /* ── Buttons that preselect the form's "interested in" option ──────── */
  const interest = $('#fInterest');
  if (interest) {
    $$('[data-interest]').forEach((a) => {
      a.addEventListener('click', () => {
        const want = a.dataset.interest;
        const opt = Array.from(interest.options).find((o) => o.value === want);
        if (opt) interest.value = want;
      });
    });
  }

  /* ── Equipment photo viewer ─────────────────────────────────────────
     Tiles become clickable only once a real <img> replaces the placeholder. */
  const viewer = $('#viewer');
  const gearWithPhotos = $$('.gear').filter((li) => $('.gear__media img', li));
  if (viewer && typeof viewer.showModal === 'function' && gearWithPhotos.length) {
    const vImg = $('.viewer__img', viewer);
    const vCap = $('.viewer__cap', viewer);
    let current = 0;
    const show = (i) => {
      current = (i + gearWithPhotos.length) % gearWithPhotos.length;
      const li = gearWithPhotos[current];
      const img = $('.gear__media img', li);
      vImg.src = img.currentSrc || img.src;
      vImg.alt = img.alt;
      vCap.textContent = $('.gear__name', li).textContent;
    };
    gearWithPhotos.forEach((li, i) => {
      li.classList.add('has-photo');
      const btn = $('.gear__btn', li);
      btn.removeAttribute('tabindex');
      btn.setAttribute('aria-label', 'View photo: ' + $('.gear__name', li).textContent);
      btn.addEventListener('click', () => { show(i); viewer.showModal(); });
    });
    $('.viewer__close', viewer).addEventListener('click', () => viewer.close());
    // Click on the backdrop closes it.
    viewer.addEventListener('click', (e) => { if (e.target === viewer) viewer.close(); });
    viewer.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
    });
  }

  /* ── Scroll spy (highlights the current group in the nav) ──────────────
     The nav has one link per stretch of the page, not per section. Each
     section names its link in data-nav; sections without one (hero, stats,
     contact) clear the highlight. */
  const navLinks = $$('.nav__list > li > a[href^="#"]');
  const spied = $$('main > section');

  if (navLinks.length && spied.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const group = '#' + (entry.target.dataset.nav || '');
        navLinks.forEach((a) => {
          a.classList.toggle('is-active', a.getAttribute('href') === group);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    spied.forEach((s) => spy.observe(s));
  }

  /* ── Hero embers ─────────────────────────────────────────────────────── */
  const canvas = $('#embers');

  if (canvas && !reduceMotion && window.matchMedia('(min-width: 700px)').matches) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, dpr = 1, raf = null, running = false;
    let embers = [];

    const seed = () => {
      const count = Math.round(Math.min(w, 1600) / 22); // ~55-70 on desktop
      embers = Array.from({ length: count }, () => spawn(true));
    };

    function spawn(scatter) {
      return {
        x: Math.random() * w,
        y: scatter ? Math.random() * h : h + Math.random() * 40,
        r: Math.random() * 1.7 + 0.5,
        vy: -(Math.random() * 0.35 + 0.12),
        vx: (Math.random() - 0.5) * 0.22,
        life: Math.random(),
        decay: Math.random() * 0.0035 + 0.0012,
        hue: Math.random() * 22 + 6 // ember orange → red
      };
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.x += e.vx;
        e.y += e.vy;
        e.vx += (Math.random() - 0.5) * 0.014; // drift
        e.life -= e.decay;

        if (e.life <= 0 || e.y < -20) {
          embers[i] = spawn(false);
          continue;
        }

        const alpha = Math.sin(e.life * Math.PI) * 0.75;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${e.hue}, 92%, 58%, ${alpha})`;
        ctx.shadowBlur = 9;
        ctx.shadowColor = `hsla(${e.hue}, 95%, 52%, ${alpha * 0.8})`;
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(draw);
    };

    const start = () => { if (!running) { running = true; draw(); } };
    const stop  = () => { running = false; if (raf) cancelAnimationFrame(raf); };

    resize();
    start();

    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 180);
    });

    // Don't burn CPU when the hero is scrolled away or the tab is hidden.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        entry.isIntersecting ? start() : stop();
      }, { threshold: 0 }).observe(canvas);
    }

    document.addEventListener('visibilitychange', () => {
      document.hidden ? stop() : start();
    });
  }

  /* ── Forge anvil: hammer strikes, sparks, tilt ───────────────────────── */
  const forge = $('#forge');

  if (forge && !reduceMotion) {
    const sparkCanvas = $('#sparks');
    const sctx = sparkCanvas.getContext('2d');
    const anvilSvg = $('.forge__anvil', forge);
    const STRIKE = { x: 520, y: 89 };           // strike point in anvil viewBox units
    const VB = { x: -6, y: -6, w: 652, h: 366 };
    let sparks = [], sw = 0, sh = 0, sdpr = 1, sraf = null, visible = true, timer = null;

    const sizeSparks = () => {
      sdpr = Math.min(window.devicePixelRatio || 1, 2);
      sw = sparkCanvas.offsetWidth;
      sh = sparkCanvas.offsetHeight;
      sparkCanvas.width = sw * sdpr;
      sparkCanvas.height = sh * sdpr;
      sctx.setTransform(sdpr, 0, 0, sdpr, 0, 0);
    };

    // Strike point in canvas pixels (the canvas overhangs the stage by 20%).
    const strikeOrigin = () => {
      const c = sparkCanvas.getBoundingClientRect();
      const a = anvilSvg.getBoundingClientRect();
      return {
        x: a.left - c.left + ((STRIKE.x - VB.x) / VB.w) * a.width,
        y: a.top - c.top + ((STRIKE.y - VB.y) / VB.h) * a.height
      };
    };

    const burst = () => {
      const o = strikeOrigin();
      const n = 44 + Math.floor(Math.random() * 20);
      for (let i = 0; i < n; i++) {
        const ang = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
        const sp = 2.6 + Math.random() * 7;
        sparks.push({
          x: o.x + (Math.random() - 0.5) * 30, y: o.y,
          vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp,
          life: 1, decay: 0.012 + Math.random() * 0.02,
          w: 0.8 + Math.random() * 1.4
        });
      }
      if (!sraf) sraf = requestAnimationFrame(tick);
    };

    function tick() {
      sctx.clearRect(0, 0, sw, sh);
      sctx.globalCompositeOperation = 'lighter';
      for (let i = sparks.length - 1; i >= 0; i--) {
        const p = sparks[i];
        const px = p.x, py = p.y;
        p.vy += 0.16; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy;
        p.life -= p.decay;
        if (p.life <= 0) { sparks.splice(i, 1); continue; }
        const hue = 18 + p.life * 30;                // white-gold cooling to red
        const light = 50 + p.life * 40;
        sctx.strokeStyle = `hsla(${hue}, 100%, ${light}%, ${p.life})`;
        sctx.lineWidth = p.w;
        sctx.lineCap = 'round';
        sctx.beginPath();
        sctx.moveTo(px - p.vx * 1.6, py - p.vy * 1.6);
        sctx.lineTo(p.x, p.y);
        sctx.stroke();
      }
      sctx.globalCompositeOperation = 'source-over';
      sraf = sparks.length ? requestAnimationFrame(tick) : null;
      if (!sraf) sctx.clearRect(0, 0, sw, sh);
    }

    const strike = () => {
      forge.classList.remove('is-strike');
      void forge.offsetWidth;                         // restart the CSS animations
      forge.classList.add('is-strike');
      burst();
    };

    const schedule = () => {
      clearTimeout(timer);
      if (!visible || document.hidden) return;
      timer = setTimeout(() => { strike(); schedule(); }, 3800 + Math.random() * 2600);
    };

    sizeSparks();
    window.addEventListener('resize', sizeSparks);
    forge.addEventListener('click', () => { strike(); schedule(); });

    // First strike lands once the entrance animation has drawn the anvil.
    setTimeout(() => { if (visible && !document.hidden) strike(); schedule(); }, 2600);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        visible ? schedule() : clearTimeout(timer);
      }).observe(forge);
    }
    document.addEventListener('visibilitychange', schedule);

    // Subtle tilt toward the pointer.
    const hero = $('.hero');
    if (hero && window.matchMedia('(hover: hover)').matches) {
      hero.addEventListener('pointermove', (e) => {
        const r = forge.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
        const dy = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
        forge.style.setProperty('--ry', (dx * 10).toFixed(2) + 'deg');
        forge.style.setProperty('--rx', (-dy * 8).toFixed(2) + 'deg');
      });
      hero.addEventListener('pointerleave', () => {
        forge.style.setProperty('--ry', '0deg');
        forge.style.setProperty('--rx', '0deg');
      });
    }
  }

  /* ── Contact form ────────────────────────────────────────────────────── */
  const form = $('#contactForm');

  if (form) {
    const status = $('#formStatus');
    const submit = $('#formSubmit');
    const endpointReady =
      CONFIG.FORM_ENDPOINT && !CONFIG.FORM_ENDPOINT.includes('YOUR_FORM_ID');

    const setStatus = (msg, kind) => {
      status.textContent = msg;
      status.className = 'form__status' + (kind ? ' is-' + kind : '');
    };

    const setFieldError = (input, msg) => {
      const field = input.closest('.field');
      const slot = field && field.querySelector('.field__error');
      field?.classList.toggle('is-invalid', Boolean(msg));
      if (slot) slot.textContent = msg || '';
      input.setAttribute('aria-invalid', msg ? 'true' : 'false');
    };

    const validate = () => {
      let firstBad = null;

      const name = form.elements.name;
      const email = form.elements.email;

      if (!name.value.trim()) {
        setFieldError(name, 'Tell us who you are.');
        firstBad = firstBad || name;
      } else {
        setFieldError(name, '');
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.value.trim());
      if (!emailOk) {
        setFieldError(email, 'We need a valid email to reach you.');
        firstBad = firstBad || email;
      } else {
        setFieldError(email, '');
      }

      return firstBad;
    };

    // Clear an error as soon as the visitor starts fixing it.
    ['name', 'email'].forEach((n) => {
      const input = form.elements[n];
      input?.addEventListener('input', () => {
        if (input.closest('.field')?.classList.contains('is-invalid')) setFieldError(input, '');
      });
    });

    const mailtoFallback = (data) => {
      const body = [
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || 'not given'}`,
        `Interested in: ${data.interest}`,
        '',
        data.message || '(no message)'
      ].join('\n');

      const href =
        `mailto:${CONFIG.CONTACT_EMAIL}` +
        `?subject=${encodeURIComponent(data.interest + ': ' + data.name)}` +
        `&body=${encodeURIComponent(body)}`;

      window.location.href = href;
      setStatus(
        'Your email app should be opening with everything filled in. Just hit send. ' +
        `If nothing happened, email us directly at ${CONFIG.CONTACT_EMAIL}.`,
        'ok'
      );
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const bad = validate();
      if (bad) {
        setStatus('Check the highlighted fields and try again.', 'err');
        bad.focus();
        return;
      }

      // Honeypot: a real visitor never fills this in.
      if (form.elements._gotcha.value) return;

      const data = Object.fromEntries(new FormData(form).entries());
      setStatus('');

      if (!endpointReady) {
        mailtoFallback(data);
        return;
      }

      submit.classList.add('is-busy');
      submit.textContent = 'Sending…';

      try {
        const res = await fetch(CONFIG.FORM_ENDPOINT, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: new FormData(form)
        });

        if (!res.ok) throw new Error('Bad response: ' + res.status);

        form.reset();
        setStatus(
          "Got it. We'll be in touch soon about " + data.interest.toLowerCase() +
          ', the opening date, and everything else you asked about.',
          'ok'
        );
      } catch (err) {
        setStatus(
          'Something went wrong sending that. Opening your email app instead…',
          'err'
        );
        setTimeout(() => mailtoFallback(data), 900);
      } finally {
        submit.classList.remove('is-busy');
        submit.textContent = 'Send it';
      }
    });
  }
})();
