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

})();
