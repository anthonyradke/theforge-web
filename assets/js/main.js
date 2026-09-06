/* =========================================================================
   THE FORGE STRENGTH CLUB — main.js
   No dependencies. No build step. Runs fine on GitHub Pages.
   -------------------------------------------------------------------------
   ▸ CONFIG below is the only part you normally need to edit.
   ========================================================================= */

/* ── CONFIG ─────────────────────────────────────────────────────────────
   Contact form delivery.

   GitHub Pages is static hosting — it cannot process a form submission by
   itself. Two options, both free:

   1) RECOMMENDED — Formspree (https://formspree.io)
      Create a free form, copy the endpoint it gives you (it looks like
      https://formspree.io/f/abcdwxyz) and paste it below. Submissions then
      arrive in the gym's inbox with no page reload.

   2) DO NOTHING — while the endpoint below is left as-is, the form falls
      back to opening the visitor's email app with everything pre-filled and
      addressed to CONTACT_EMAIL. It works today, it just costs the visitor
      one extra click.
   ──────────────────────────────────────────────────────────────────────── */
const CONFIG = {
  FORM_ENDPOINT: 'https://formspree.io/f/YOUR_FORM_ID',
  CONTACT_EMAIL: 'hello@theforgestrengthclub.com'
};

(function () {
  'use strict';

  const $  = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    const setNav = (open) => {
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    navToggle.addEventListener('click', () => {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    // Close on link tap, Escape, or a click on the backdrop.
    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setNav(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setNav(false);
        navToggle.focus();
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

  /* ── Scroll spy (highlights the current section in the nav) ──────────── */
  const navLinks = $$('.nav__list a[href^="#"]');
  const sections = navLinks
    .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sections.forEach((s) => spy.observe(s));
  }

  /* ── Membership billing toggle ───────────────────────────────────────── */
  const billingToggle = $('#billingToggle');

  if (billingToggle) {
    const wrap = billingToggle.closest('.toggle');

    billingToggle.addEventListener('click', () => {
      const annual = billingToggle.getAttribute('aria-checked') !== 'true';
      billingToggle.setAttribute('aria-checked', String(annual));
      wrap.classList.toggle('is-annual', annual);

      $$('.plan__amt, .plan__per').forEach((el) => {
        el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
      });
    });
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
        `Phone: ${data.phone || '—'}`,
        `Interested in: ${data.interest}`,
        '',
        data.message || '(no message)'
      ].join('\n');

      const href =
        `mailto:${CONFIG.CONTACT_EMAIL}` +
        `?subject=${encodeURIComponent('Founding member inquiry — ' + data.name)}` +
        `&body=${encodeURIComponent(body)}`;

      window.location.href = href;
      setStatus(
        'Your email app should be opening with everything filled in — just hit send. ' +
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
          "You're on the list. We'll be in touch with founding member details, " +
          'the opening date, and your walkthrough invite.',
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
