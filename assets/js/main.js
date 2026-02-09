/* =========================================================
   Aoki Portfolio Interactions (Dawn Theme)
   - Reveal on scroll (prefers-reduced-motion aware)
   - Contact modal open/close with focus trap
   - Contact form confirm step + Formspree submit
   - Smooth scroll for in-page anchors
   - Hero staged sequence start
   ========================================================= */

(() => {
  'use strict';

  // Auto-lite mode for lower-end devices while preserving visual theme.
  const lowEndEffects =
    (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) ||
    (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4);
  if (lowEndEffects) document.documentElement.classList.add('is-lite-effects');

  // ===== Reveal with IntersectionObserver (reduced motion aware) =====
  const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
  const revealTargets = document.querySelectorAll('.js-observe, .reveal');
  if (prefersReduced) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  } else {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });
    revealTargets.forEach((el) => observer.observe(el));
  }

  // ===== Modal Controls with focus trap =====
  const modal = document.getElementById('contact-modal');
  const openButtons = document.querySelectorAll('.js-open-modal');
  const previouslyFocused = { el: null };

  const getFocusable = (root) => root?.querySelectorAll(
    'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
  ) || [];

  const trapKey = (e) => {
    if (e.key !== 'Tab' || modal?.getAttribute('aria-hidden') !== 'false') return;
    const focusables = [...getFocusable(modal)].filter(el => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden'));
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (!first || !last) return;
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };

  const openModal = () => {
    if (!modal) return;
    previouslyFocused.el = document.activeElement;
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const first = getFocusable(modal)[0];
    setTimeout(() => first?.focus(), 40);
    document.addEventListener('keydown', trapKey);
  };
  const closeModal = () => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapKey);
    const el = previouslyFocused.el;
    if (el instanceof HTMLElement) el.focus();
  };

  openButtons.forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    try {
      const formEl = document.querySelector('.js-contact-form');
      const confirmEl = document.querySelector('.js-contact-confirm');
      const resultEl = document.querySelector('.js-contact-result');
      if (formEl) formEl.hidden = false;
      if (confirmEl) confirmEl.hidden = true;
      if (resultEl) resultEl.hidden = true;
      formEl?.querySelectorAll('.form-field__error').forEach(el => el.textContent = '');
    } catch(_){}
    openModal();
  }));
  modal?.querySelectorAll('.js-close-modal').forEach((btn) => btn.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal();
  }));
  modal?.addEventListener('click', (e) => {
    if ((e.target instanceof HTMLElement) && e.target.dataset.close === 'overlay') closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.getAttribute('aria-hidden') === 'false') closeModal();
  });

  // ===== Contact Form Stepper & Validation =====
  const form = document.querySelector('.js-contact-form');
  const confirmView = document.querySelector('.js-contact-confirm');
  const resultView = document.querySelector('.js-contact-result');

  const nameInput = form?.querySelector('#name');
  const emailInput = form?.querySelector('#email');
  const messageInput = form?.querySelector('#message');

  const errorFor = (input) => input?.closest('.form-field')?.querySelector('.form-field__error');
  const validate = () => {
    let ok = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const set = (input, msg) => {
      const err = input ? errorFor(input) : null;
      if (msg) { err && (err.textContent = msg); ok = false; }
      else { err && (err.textContent = ''); }
    };
    set(nameInput, !nameInput?.value.trim() ? 'お名前を入力してください' : '');
    set(emailInput, !emailInput?.value.trim() ? 'メールアドレスを入力してください' :
      !emailRe.test(emailInput.value.trim()) ? 'メールアドレスの形式が正しくありません' : '');
    set(messageInput, !messageInput?.value.trim() ? 'メッセージを入力してください' : '');
    return ok;
  };

  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;
    const name = nameInput?.value.trim() || '';
    const email = emailInput?.value.trim() || '';
    const message = messageInput?.value.trim() || '';
    const nn = document.querySelector('.js-confirm-name');
    const ne = document.querySelector('.js-confirm-email');
    const nm = document.querySelector('.js-confirm-message');
    if (nn) nn.textContent = name;
    if (ne) ne.textContent = email;
    if (nm) nm.textContent = message;
    if (form && confirmView) { form.hidden = true; confirmView.hidden = false; }
  });

  document.querySelector('.js-back-to-form')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (form && confirmView) { confirmView.hidden = true; form.hidden = false; }
  });

  const SEND_ENDPOINT = 'https://formspree.io/f/xdkwllne';
  document.querySelector('.js-send')?.addEventListener('click', async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      name: nameInput?.value.trim() || '',
      email: emailInput?.value.trim() || '',
      message: messageInput?.value.trim() || ''
    };
    const sendBtn = e.currentTarget instanceof HTMLElement ? e.currentTarget : null;
    const prev = sendBtn?.textContent;
    if (sendBtn) { sendBtn.setAttribute('disabled','true'); sendBtn.textContent = '送信中...'; }
    const showResult = (msg, isError = false) => {
      const status = document.querySelector('.js-result-status');
      if (status) status.textContent = msg;
      if (confirmView && resultView) { confirmView.hidden = true; resultView.hidden = false; }
      if (isError) resultView?.classList.add('is-error'); else resultView?.classList.remove('is-error');
    };
    try {
      const res = await fetch(SEND_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        showResult('送信ありがとうございます。24時間以内にご連絡します。');
      } else {
        showResult('送信に失敗しました。時間をおいて再度お試しください。', true);
      }
    } catch (_) {
      showResult('ネットワークエラーが発生しました。時間をおいてお試しください。', true);
    } finally {
      if (sendBtn) { sendBtn.removeAttribute('disabled'); sendBtn.textContent = prev || '送信する'; }
    }
  });

  // Smooth scroll for in-page anchors
  document.addEventListener('click', (e) => {
    const target = (e.target instanceof Element) ? e.target.closest('a[href^="#"]') : null;
    if (!target) return;
    const href = target.getAttribute('href');
    if (!href) return;
    const el = document.querySelector(href);
    if (el) {
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  // Honeypot (spam protection)
  if (form && !form.querySelector('input[name="_gotcha"]')){
    const hp = document.createElement('input');
    hp.type = 'text'; hp.name = '_gotcha'; hp.tabIndex = -1; hp.autocomplete = 'off';
    hp.setAttribute('aria-hidden','true');
    hp.style.position = 'absolute'; hp.style.left = '-9999px'; hp.style.opacity = '0'; hp.style.height = '0'; hp.style.width = '0';
    form.appendChild(hp);
  }

  // ===== Hero staged start on load (very subtle) =====
  document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduced) { hero.classList.add('is-hero-start','is-hero-flare'); return; }
    hero.classList.add('is-hero-prep');
    setTimeout(() => hero.classList.add('is-hero-start'), 120);
    setTimeout(() => hero.classList.add('is-hero-flare'), 1200);
  });

  // ===== Hero Sky (Canvas) — stars, planet, clouds, scroll tone =====
  const initHeroSky = () => {
    const hero = document.querySelector('.hero');
    const bg = document.querySelector('.hero__bg');
    const canvas = document.getElementById('sky-canvas');
    if (!hero || !bg || !(canvas instanceof HTMLCanvasElement)) return;

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const saveData = navigator.connection?.saveData === true;
    const lowPowerMode = reduced || saveData;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0;

    // --- Starfield state ---
    let stars = [];
    let starDrift = 0; // pixels
    let starFade = 1;  // 1 -> 0 on dawn
    let starOpts = { density: 0.0012, twinkle: true, drift: true };

    // --- Planet state ---
    let planet = null; // {cx, cy, r, hue, ring, tilt, spin}
    let planetSpin = 0;
    let planetRiseT = 0; // 0..1 easing for initial rise

    // --- Clouds ---
    let clouds = [];

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const lerp = (a, b, t) => a + (b - a) * t;
    const hexToRgb = (hex) => {
      const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : { r:0,g:0,b:0 };
    };
    const rgbToHex = (r,g,b) => `#${[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}`;
    const mixHex = (a, b, t) => {
      const A = hexToRgb(a), B = hexToRgb(b);
      return rgbToHex(
        Math.round(lerp(A.r, B.r, t)),
        Math.round(lerp(A.g, B.g, t)),
        Math.round(lerp(A.b, B.b, t))
      );
    };

    const parsePos = (v, max) => {
      if (typeof v === 'string' && v.trim().endsWith('%')) return (parseFloat(v) / 100) * max;
      const num = typeof v === 'number' ? v : parseFloat(v || 0);
      return clamp(num, 0, max);
    };

    const resize = () => {
      const rect = bg.getBoundingClientRect();
      const newW = Math.max(1, Math.floor(rect.width));
      const newH = Math.max(1, Math.floor(rect.height));
      if (newW === w && newH === h) return;
      w = newW; h = newH;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      buildStars();
      buildClouds();
      // keep planet position consistent on resize
      if (planet && planet._opts) applyPlanet(planet._opts);
      // render one static frame (useful for reduced motion or initial paint)
      ctx.clearRect(0, 0, w, h);
      drawStars(0);
      drawPlanet();
      drawClouds();
    };

    const buildStars = () => {
      const count = Math.floor(w * h * (starOpts.density || 0.0012));
      stars = Array.from({ length: count }, () => {
        const size = Math.random() * 1.5 + 0.6;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: size,
          base: 0.6 + Math.random() * 0.4,
          amp: 0.3 + Math.random() * 0.4,
          sp: 0.005 + Math.random() * 0.0035, // twinkle speed
          ph: Math.random() * Math.PI * 2,    // twinkle phase
          drift: (Math.random() * 0.12 + 0.06) * (Math.random() < 0.5 ? -1 : 1) // px/sec
        };
      });
    };

    const buildClouds = () => {
      const layers = 5;
      clouds = Array.from({ length: layers }, (_, i) => ({
        x: Math.random() * w,
        y: lerp(-h * 0.05, h * 0.35, i / (layers - 1)),
        a: 0.08 + i * 0.03,
        s: lerp(w * 0.25, w * 0.65, i / (layers - 1)),
        h: lerp(h * 0.10, h * 0.22, i / (layers - 1)),
        v: lerp(4, 12, i / (layers - 1)) * (i % 2 ? -1 : 1) // px/sec
      }));
    };

    const applyPlanet = (opts) => {
      const o = Object.assign({ x: '80%', y: '15%', size: 160, ring: true, hue: 220 }, opts || {});
      planet = {
        cx: parsePos(o.x, w),
        cy: parsePos(o.y, h),
        r: o.size,
        hue: o.hue,
        ring: !!o.ring,
        tilt: -20 * Math.PI / 180,
        spin: 0,
        _opts: o
      };
    };

    // Public API (requested names)
    const createStarfield = (canvasEl, opts) => { if (opts) starOpts = Object.assign({}, starOpts, opts); buildStars(); };
    const createPlanet = (canvasEl, opts) => { applyPlanet(opts); };

    // Drawing helpers
    const drawStars = (t) => {
      if (!stars.length) return;
      ctx.save();
      for (const s of stars) {
        const twk = starOpts.twinkle ? (s.base + Math.sin(t * s.sp + s.ph) * s.amp) : s.base;
        const a = clamp(twk * 0.9, 0, 1) * starFade;
        const x = starOpts.drift ? (s.x + starDrift * s.drift + w) % w : s.x;
        ctx.globalAlpha = a;
        const g = ctx.createRadialGradient(x, s.y, 0, x, s.y, s.r * 2);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const drawClouds = () => {
      if (!clouds.length) return;
      ctx.save();
      for (const c of clouds) {
        ctx.globalAlpha = c.a;
        const grad = ctx.createLinearGradient(c.x - c.s, c.y, c.x + c.s, c.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(0.5, 'rgba(255,255,255,0.7)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = grad;
        ctx.filter = 'blur(12px)';
        ctx.beginPath();
        ctx.ellipse(c.x, c.y, c.s, c.h, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      ctx.filter = 'none';
    };

    const drawPlanet = () => {
      if (!planet) return;
      const { cx, cy, r, hue } = planet;

      // Rise ease for initial appearance
      const rise = planetRiseT;
      const py = cy + (1 - rise) * 80; // from +80px to 0
      const scale = lerp(0.9, 1, rise);
      const pr = r * scale;

      // Glow
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const glow = ctx.createRadialGradient(cx, py, pr * 0.2, cx, py, pr * 1.8);
      glow.addColorStop(0, `hsla(${hue},70%,65%,.22)`);
      glow.addColorStop(1, 'hsla(0,0%,0%,0)');
      ctx.fillStyle = glow;
      ctx.beginPath(); ctx.arc(cx, py, pr * 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Body
      ctx.save();
      const g = ctx.createRadialGradient(cx - pr * .35, py - pr * .45, pr * 0.1, cx, py, pr);
      g.addColorStop(0, `hsl(${hue}, 60%, 78%)`);
      g.addColorStop(1, `hsl(${hue}, 60%, 40%)`);
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, py, pr, 0, Math.PI * 2); ctx.fill();
      ctx.restore();

      // Ring (behind body only)
      if (planet.ring) {
        ctx.save();
        const tilt = planet.tilt + planetSpin * 0.05;
        ctx.translate(cx, py);
        ctx.rotate(tilt);
        ctx.filter = 'blur(2px)';
        const rx = pr * 2.2, ry = pr * 0.65;
        const grd = ctx.createLinearGradient(-rx, 0, rx, 0);
        grd.addColorStop(0.0, `hsla(${hue},70%,75%,.0)`);
        grd.addColorStop(0.2, `hsla(${hue},70%,75%,.35)`);
        grd.addColorStop(0.5, `hsla(${hue},70%,75%,.65)`);
        grd.addColorStop(0.8, `hsla(${hue},70%,75%,.35)`);
        grd.addColorStop(1.0, `hsla(${hue},70%,75%,.0)`);
        ctx.strokeStyle = grd;
        ctx.lineWidth = ry * 1.2;
        ctx.globalCompositeOperation = 'lighten';
        ctx.beginPath(); ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
    };

    let rafId = 0; let lastT = 0; let running = false; let dawnStartAt = 0; let didDawn = false;
    const loop = (ts) => {
      if (!running) return;
      if (!lastT) lastT = ts; const dt = (ts - lastT) / 1000; lastT = ts;
      ctx.clearRect(0, 0, w, h);

      // Progress planet rise for first ~2.5s
      planetRiseT = clamp(planetRiseT + dt / 2.5, 0, 1);

      // Update star drift
      starDrift += dt * 12; // px/sec baseline

      // Dawn fade timing after window load
      if (didDawn) {
        const t = (performance.now() - dawnStartAt) / 3000; // ~3s fade
        starFade = clamp(1 - t, 0, 1);
      }

      // Advance clouds
      for (const c of clouds) {
        c.x += c.v * dt;
        if (c.x < -c.s) c.x = w + c.s; else if (c.x > w + c.s) c.x = -c.s;
      }

      // Draw order: stars (back), planet, clouds (front veils)
      drawStars(ts * 0.001);
      drawPlanet();
      drawClouds();

      rafId = requestAnimationFrame(loop);
    };

    const start = () => { if (!running) { running = true; lastT = 0; rafId = requestAnimationFrame(loop); } };
    const stop = () => { running = false; if (rafId) cancelAnimationFrame(rafId); };

    // Scroll tone interpolation → updates hero gradient
    const dawnColors = [ '#0D1117', '#3E517A', '#F5CBA7' ];
    let scrollRaf = 0, scrollDirty = true, scrollToneEnabled = true;
    const applyScrollTone = () => {
      if (!scrollToneEnabled) return;
      scrollRaf = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const p = clamp(window.scrollY / maxScroll, 0, 1);
      // Piecewise: 0..0.5 night→twilight, 0.5..1 twilight→morning
      const midP = p <= 0.5 ? p / 0.5 : (p - 0.5) / 0.5;
      const cA = p <= 0.5 ? dawnColors[0] : dawnColors[1];
      const cB = p <= 0.5 ? dawnColors[1] : dawnColors[2];
      const top = mixHex(cA, cB, clamp(midP, 0, 1));
      const grad = `linear-gradient(180deg, ${top} 10%, ${dawnColors[1]} 45%, ${dawnColors[2]} 100%)`;
      hero.style.background = grad;
      scrollDirty = false;
    };
    const onScroll = () => {
      if (!scrollToneEnabled) return;
      if (!scrollRaf) scrollRaf = requestAnimationFrame(applyScrollTone);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    applyScrollTone();

    let heroInView = false;
    const canAnimateHero = () => (
      !lowPowerMode &&
      document.visibilityState === 'visible' &&
      heroInView &&
      !hero.classList.contains('hero--image')
    );
    const syncHeroAnimationState = () => {
      if (canAnimateHero()) start();
      else stop();
    };

    // IO to pause when not visible
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.target === hero) heroInView = entry.isIntersecting;
      });
      syncHeroAnimationState();
    }, { threshold: 0.05 });
    io.observe(hero);
    heroInView = hero.getBoundingClientRect().bottom > 0;
    document.addEventListener('visibilitychange', syncHeroAnimationState);

    // Try load a user-provided hero image (preferred over canvas)
    const tryLoadHeroImage = async () => {
      // Prefer the user-provided cosmic photograph first
      const candidates = [
        'assets/img/hero-bg.avif',
        'assets/img/hero-bg.webp',
        'assets/img/hero-bg.jpg',
        'assets/img/hero-bg.jpeg',
        'assets/img/hero-bg.png',
        'assets/img/hero-bg.svg',
        // Fallback to previously included generic assets
        'assets/img/hero-dawn-space.svg',
        'assets/img/hero-dawn-space.avif',
        'assets/img/hero-dawn-space.webp',
        'assets/img/hero-dawn-space.jpg',
        'assets/img/hero-dawn-space.jpeg',
        'assets/img/hero-dawn-space.png'
      ];
      const load = (src) => new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => resolve(src);
        img.onerror = () => resolve(null);
        img.src = src;
      });
      for (const src of candidates) {
        // eslint-disable-next-line no-await-in-loop
        const ok = await load(src);
        if (ok) return ok;
      }
      return null;
    };

    // Initial build
    resize();
    window.addEventListener('resize', resize);

    // Public creation per spec
    createStarfield(canvas, { density: 0.0012, twinkle: true, drift: true });
    createPlanet(canvas, { x: '80%', y: '15%', size: 160, ring: true, hue: 220 });
    syncHeroAnimationState();

    // Dawn trigger on load → stars fade
    window.addEventListener('load', () => {
      document.body.classList.add('is-dawn');
      didDawn = true; dawnStartAt = performance.now();
    });

    // If a static hero image exists, prefer it and disable canvas animation
    tryLoadHeroImage().then((url) => {
      if (!url) return;
      // Use absolute URL so CSS var resolves regardless of stylesheet base
      let abs = url;
      try { abs = new URL(url, document.baseURI).href; } catch(_) {}
      hero.classList.add('hero--image');
      bg.style.setProperty('--hero-image', `url("${abs}")`);
      scrollToneEnabled = false;
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      syncHeroAnimationState();
    });

    // expose for debugging if needed
    // window.__sky = { createStarfield, createPlanet };
  };

  // Kick off sky after DOM is ready (keeps existing staged hero timing)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroSky);
  } else {
    initHeroSky();
  }

  // ===== Global Under-Hero Sky (random stars + occasional meteors) =====
  const initUnderSky = () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const saveData = navigator.connection?.saveData === true;
    if (reduced || saveData) {
      const existingCanvas = document.getElementById('under-sky-canvas');
      if (existingCanvas) existingCanvas.remove();
      return;
    }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasId = 'under-sky-canvas';
    let canvas = document.getElementById(canvasId);
    if (!(canvas instanceof HTMLCanvasElement)){
      canvas = document.createElement('canvas');
      canvas.id = canvasId;
      document.body.appendChild(canvas);
    }
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0;
    let stars = [];
    let meteors = [];
    let last = 0; let raf = 0; let running = false; let lastPaintTs = 0;
    const targetFrameMs = lowEndEffects ? 40 : 33; // ~25fps on low-end, ~30fps otherwise
    const starSprites = new Map();

    const clamp = (v,a,b) => Math.max(a, Math.min(b, v));
    const rand = (a,b) => a + Math.random() * (b - a);

    const resize = () => {
      const vw = Math.max(1, Math.floor(window.innerWidth));
      const vh = Math.max(1, Math.floor(window.innerHeight));
      if (vw === w && vh === h) return;
      w = vw; h = vh;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStars();
      render(0); // static frame
    };

    const buildStars = () => {
      const density = lowEndEffects ? 0.00056 : 0.00066;
      const count = Math.min(lowEndEffects ? 420 : 560, Math.floor(w * h * density));
      stars = Array.from({ length: count }, () => {
        const r = Math.random() * 1.4 + 0.6;
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r,
          base: 0.6 + Math.random() * 0.4,
          amp: 0.25 + Math.random() * 0.35,
          sp: 0.004 + Math.random() * 0.003,
          ph: Math.random() * Math.PI * 2,
          z: Math.random() // depth 0..1 (far→near)
        };
      });
    };

    const getStarSprite = (radius) => {
      const key = Math.max(1, Math.round(radius * 10) / 10);
      if (starSprites.has(key)) return starSprites.get(key);
      const size = Math.ceil(key * 6);
      const c = document.createElement('canvas');
      c.width = size;
      c.height = size;
      const cctx = c.getContext('2d', { alpha: true });
      if (!cctx) return null;
      const cx = size / 2;
      const cy = size / 2;
      const g = cctx.createRadialGradient(cx, cy, 0, cx, cy, key * 2);
      g.addColorStop(0, 'rgba(255,255,255,1)');
      g.addColorStop(1, 'rgba(255,255,255,0)');
      cctx.fillStyle = g;
      cctx.beginPath();
      cctx.arc(cx, cy, key, 0, Math.PI * 2);
      cctx.fill();
      const sprite = { canvas: c, size };
      starSprites.set(key, sprite);
      return sprite;
    };

    const maybeSpawnMeteor = (dt) => {
      // spawn probabilistically ~ one every 8-16 seconds on average
      if (meteors.length > 1) return;
      if (Math.random() < dt / rand(8, 16)) {
        const fromLeft = Math.random() < 0.5;
        const x = fromLeft ? rand(-w*0.2, w*0.1) : rand(w*0.9, w*1.2);
        const y = rand(-h*0.2, h*0.25);
        const speed = rand(420, 720); // px/s
        const angle = fromLeft ? rand(15, 28) * Math.PI/180 : rand(152, 165) * Math.PI/180;
        const vx = Math.cos(angle) * speed * (fromLeft ? 1 : -1);
        const vy = Math.sin(angle) * speed;
        meteors.push({ x, y, vx, vy, life: 0, ttl: rand(0.8, 1.6), len: rand(90, 150) });
      }
    };

    // Scroll-aware parallax (smoothed)
    let scrollTarget = typeof window.scrollY === 'number' ? window.scrollY : 0;
    let scrollYSmoothed = scrollTarget;
    const onScroll = () => { scrollTarget = typeof window.scrollY === 'number' ? window.scrollY : 0; };
    window.addEventListener('scroll', onScroll, { passive: true });

    const wrap = (v, max) => { let r = v % max; if (r < 0) r += max; return r; };

    const drawStars = (t) => {
      // interpolate towards latest scroll for smoothness
      scrollYSmoothed += (scrollTarget - scrollYSmoothed) * 0.08;
      const sy = -scrollYSmoothed; // move opposite to scroll to feel anchored to world
      const parYBase = 0.03, parYRange = 0.14; // near layers move more
      const parXBase = 0.004, parXRange = 0.016;
      for (const s of stars) {
        const a = clamp(s.base + Math.sin(t * s.sp + s.ph) * s.amp, 0, 1) * 0.95;
        const py = wrap(s.y + sy * (parYBase + parYRange * s.z), h);
        const px = wrap(s.x + sy * (parXBase + parXRange * (1 - s.z)), w);
        const sprite = getStarSprite(s.r);
        if (!sprite) continue;
        ctx.globalAlpha = a;
        ctx.drawImage(sprite.canvas, px - sprite.size / 2, py - sprite.size / 2, sprite.size, sprite.size);
      }
      ctx.globalAlpha = 1;
    };

    const drawMeteors = (dt) => {
      meteors = meteors.filter(m => m.life < m.ttl);
      for (const m of meteors) {
        m.life += dt;
        m.x += m.vx * dt; m.y += m.vy * dt;
        // trail
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const trail = ctx.createLinearGradient(m.x - m.len, m.y - m.len*0.2, m.x, m.y);
        trail.addColorStop(0, 'rgba(255,255,255,0)');
        trail.addColorStop(1, 'rgba(255,255,255,.85)');
        ctx.strokeStyle = trail;
        ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(m.x - m.len, m.y - m.len*0.2); ctx.lineTo(m.x, m.y); ctx.stroke();
        // head glow
        const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, 16);
        g.addColorStop(0, 'rgba(255,255,255,.9)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(m.x, m.y, 10, 0, Math.PI*2); ctx.fill();
        ctx.restore();
      }
    };

    const render = (t) => {
      ctx.clearRect(0, 0, w, h);
      drawStars(t);
      drawMeteors(0); // draw with last dt=0 for static render
    };

    const loop = (ts) => {
      if (!running) return;
      if (!last) { last = ts; lastPaintTs = ts; }
      if (ts - lastPaintTs < targetFrameMs) {
        raf = requestAnimationFrame(loop);
        return;
      }
      const dt = (ts - last) / 1000;
      last = ts;
      lastPaintTs = ts;
      ctx.clearRect(0, 0, w, h);
      drawStars(ts * 0.001);
      maybeSpawnMeteor(dt);
      drawMeteors(dt);
      raf = requestAnimationFrame(loop);
    };

    const start = () => {
      if (document.visibilityState !== 'visible') return;
      if (!running) { running = true; last = 0; lastPaintTs = 0; raf = requestAnimationFrame(loop); }
    };
    const stop = () => { running = false; if (raf) cancelAnimationFrame(raf); };

    const onVis = () => { if (document.hidden) stop(); else start(); };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', onVis);
    start();
  };

  // Start global under-sky lazily (idle first, then timeout fallback)
  const scheduleUnderSky = () => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const saveData = navigator.connection?.saveData === true;
    if (reduced || saveData) return;
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => initUnderSky(), { timeout: 2500 });
      return;
    }
    window.setTimeout(initUnderSky, 1500);
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleUnderSky);
  } else {
    scheduleUnderSky();
  }

  // Register a tiny Service Worker for offline cache and faster reloads
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    });
  }
})();
