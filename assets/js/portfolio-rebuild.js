(function($) {
  // ── Data references ────────────────────────────────────────────────────────
  const data    = window.SITE_DATA || {};
  const p       = data.portfolio   || {};
  const works   = Array.isArray(p.works)   ? p.works   : [];
  const process = Array.isArray(p.process) ? p.process : [];
  const ga4Id   = String((data.analytics || {}).ga4MeasurementId || '').trim();
  let ga4Ready  = false;

  // ── Helpers ───────────────────────────────────────────────────────────────
  const esc = (v) => String(v || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

  // ── GA4 ───────────────────────────────────────────────────────────────────
  const ensureGa4 = () => {
    if (!ga4Id) return false;
    if (!window.dataLayer) window.dataLayer = [];
    if (!window.gtag) window.gtag = function() { window.dataLayer.push(arguments); };
    if (!document.querySelector('script[data-ga4="' + ga4Id + '"]')) {
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4Id);
      s.setAttribute('data-ga4', ga4Id);
      document.head.appendChild(s);
    }
    if (!ga4Ready) { window.gtag('js', new Date()); window.gtag('config', ga4Id); ga4Ready = true; }
    return true;
  };

  const track = (name, params) => { if (ensureGa4()) window.gtag('event', name, params || {}); };

  // ── Section builders ──────────────────────────────────────────────────────
  const buildWorksCard = (w, i) => {
    const siteUrl  = String(w.url || '').trim() ? esc(w.url) : '#';
    const ghBtn    = w.github
      ? `<a class="portfolioWorks__btn portfolioWorks__btn--github" href="${esc(w.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`
      : '';
    return (
      `<li class="portfolioWorks__item"><article class="portfolioWorks__card">` +
        `<span class="portfolioWorks__num">0${i + 1}</span>` +
        `<span class="portfolioWorks__body">` +
          `<strong class="portfolioWorks__title">${esc(w.title)}</strong>` +
          `<span class="portfolioWorks__meta">${esc(w.meta)}</span>` +
        `</span>` +
        `<div class="portfolioWorks__actions">` +
          `<a class="portfolioWorks__btn portfolioWorks__btn--site" href="${siteUrl}" target="_blank" rel="noopener noreferrer">View Site</a>` +
          ghBtn +
        `</div>` +
      `</article></li>`
    );
  };

  const buildFeaturedCard = (w, i) => {
    const siteUrl     = String(w.url || '').trim() ? esc(w.url) : '#';
    const hiddenClass = i >= 6 ? ' is-hidden js-featuredExtra' : '';
    const ghBtn       = w.github
      ? `<a class="featuredCard__action featuredCard__action--github" href="${esc(w.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`
      : '';
    return (
      `<article class="featuredCard${hiddenClass}">` +
        `<a class="featuredCard__mainLink" href="${siteUrl}" target="_blank" rel="noopener noreferrer" aria-label="${esc(w.title)} のサイトを開く">` +
          `<span class="featuredCard__thumb"><img class="featuredCard__img" src="${esc(w.image)}" alt="${esc(w.title)} サムネイル" loading="lazy"></span>` +
          `<span class="featuredCard__title">${esc(w.title)}</span>` +
          `<span class="featuredCard__meta">${esc(w.meta)}</span>` +
        `</a>` +
        `<span class="featuredCard__overlay" aria-hidden="true"><span class="featuredCard__actions">` +
          `<a class="featuredCard__action featuredCard__action--site" href="${siteUrl}" target="_blank" rel="noopener noreferrer">View Site</a>` +
          ghBtn +
        `</span></span>` +
      `</article>`
    );
  };

  const buildStyleCard = (card) =>
    `<article class="styleCard">` +
      `<p class="styleCard__label">${esc(card.label)}</p>` +
      `<h3 class="styleCard__lead">${esc(card.title)}</h3>` +
      `<p class="styleCard__text">${esc(card.text)}</p>` +
    `</article>`;

  const buildPricingCard = (plan) =>
    `<article class="pricingCard">` +
      `<p class="pricingCard__eyebrow">${esc(plan.label)}</p>` +
      `<h3 class="pricingCard__title">${esc(plan.title)}</h3>` +
      `<p class="pricingCard__price">${esc(plan.price)}</p>` +
      `<p class="pricingCard__delivery"><span>納期目安</span>${esc(plan.delivery)}</p>` +
      `<ul class="pricingCard__list">${(plan.items || []).map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` +
      `<button type="button" class="pricingCard__cta js-openContactForm">${esc(plan.cta)}</button>` +
    `</article>`;

  const buildProcessCard = (item, processMeta) => {
    const key    = String(item.step || '').padStart(2, '0');
    const meta   = processMeta[key] || { summary: String(item.text || ''), points: [] };
    const points = (meta.points || []).map((t) => `<li class="processCard__pointItem">${esc(t)}</li>`).join('');
    return (
      `<article class="processCard">` +
        `<p class="processCard__step">STEP ${esc(key)}</p>` +
        `<h3 class="processCard__title">${esc(item.title)}</h3>` +
        `<p class="processCard__summary">${esc(meta.summary)}</p>` +
        `<ul class="processCard__points">${points}</ul>` +
      `</article>`
    );
  };

  const buildContactSection = (contact) =>
    `<h2 class="staffcast__title"><span class="hd">お問い合わせ</span></h2>` +
    `<div class="contactPanel">` +
      `<p class="contactPanel__lead">LP制作・WordPress移行・既存サイト改善など、まずはお気軽にご相談ください。<br>概要段階のご相談でも問題ありません。</p>` +
      `<div class="contactPanel__ctaWrap">` +
        `<button type="button" class="contactPanel__formBtn js-openContactForm">制作について相談する</button>` +
        `<p class="contactPanel__assurance">通常48時間以内にご返信します。</p>` +
      `</div>` +
      `<p class="contactPanel__subLead">X（旧Twitter）のDMからもご相談いただけます。</p>` +
      `<div class="contactPanel__links">` +
        `<div class="contactPanel__xWrap">` +
          `<a class="contactPanel__iconLink contactPanel__iconLink--x" href="${esc(contact.x || '#')}" target="_blank" rel="noopener noreferrer" aria-label="Xを開く"></a>` +
          `<p class="contactPanel__xNote">DMでも受付中</p>` +
        `</div>` +
        `<a class="contactPanel__iconStack contactPanel__iconStack--github" href="${esc(contact.github || '#')}" target="_blank" rel="noopener noreferrer" aria-label="GitHubを開く">` +
          `<span class="contactPanel__iconLink contactPanel__iconLink--github" aria-hidden="true"></span>` +
          `<span class="contactPanel__iconLabel">GitHub</span>` +
        `</a>` +
      `</div>` +
    `</div>`;

  const buildContactFormModal = (action) =>
    `<div class="contactFormModal" id="contactFormModal" aria-hidden="true">` +
      `<div class="contactFormModal__backdrop js-closeContactForm"></div>` +
      `<div class="contactFormModal__dialog" role="dialog" aria-modal="true" aria-label="お問い合わせフォーム">` +
        `<button type="button" class="contactFormModal__close js-closeContactForm" aria-label="閉じる">×</button>` +
        `<h3 class="contactFormModal__title">お問い合わせフォーム</h3>` +
        `<form id="contactForm" class="contactForm" action="${action}" method="POST">` +
          `<label class="contactForm__field"><span>お名前</span><input name="name" type="text" required></label>` +
          `<label class="contactForm__field"><span>メールアドレス</span><input name="email" type="email" required></label>` +
          `<label class="contactForm__field"><span>ご相談内容</span><select name="type" required>` +
            `<option value="">選択してください</option>` +
            `<option>LP制作</option><option>WordPress化</option><option>既存サイト改善</option><option>その他</option>` +
          `</select></label>` +
          `<label class="contactForm__field"><span>ご予算（任意）</span><input name="budget" type="text" placeholder="例: 15万円〜20万円"></label>` +
          `<label class="contactForm__field"><span>詳細</span><textarea name="message" rows="5" required></textarea></label>` +
          `<input type="hidden" name="_subject" value="Portfolio Contact">` +
          `<button type="submit" class="contactForm__submit">送信する</button>` +
          `<div class="contactForm__confirm" id="contactFormConfirm">` +
            `<p class="contactForm__confirmLead">以下の内容で送信します。よろしいですか？</p>` +
            `<dl class="contactForm__confirmList">` +
              `<div><dt>お名前</dt><dd id="contactConfirmName"></dd></div>` +
              `<div><dt>メールアドレス</dt><dd id="contactConfirmEmail"></dd></div>` +
              `<div><dt>ご相談内容</dt><dd id="contactConfirmType"></dd></div>` +
              `<div><dt>ご予算</dt><dd id="contactConfirmBudget"></dd></div>` +
              `<div><dt>詳細</dt><dd id="contactConfirmMessage"></dd></div>` +
            `</dl>` +
            `<div class="contactForm__confirmActions">` +
              `<button type="button" class="contactForm__back js-contactBack">修正する</button>` +
              `<button type="button" class="contactForm__send js-contactSend">この内容で送信</button>` +
            `</div>` +
          `</div>` +
          `<p class="contactForm__status" id="contactFormStatus" aria-live="polite"></p>` +
          `<p class="contactForm__notice">※営業・勧誘目的のご連絡はご遠慮ください。</p>` +
        `</form>` +
      `</div>` +
    `</div>`;

  // ── Init ──────────────────────────────────────────────────────────────────
  $(function() {
    // Hero
    $('.fv__catch .hd').html('<span class="fv__catchMain">Where Finite Time Meets Infinite Possibility.</span><span class="fv__catchSub">限られた時間を、無限の可能性へ。</span>');
    $('.fv__date .hd').eq(0).text(p.heroDateJa || '');
    $('.fv__date .hd').eq(1).text(p.heroDateEn || '');

    // Works — first 5 (news section)
    const worksHtml = works.slice(0, 5).map(buildWorksCard).join('');
    if (worksHtml) {
      $('#js-newsLists').html(worksHtml).addClass('portfolioWorks');
      $('.news__more').html('<a href="#works-all" class="news__moreLink js-anchor"><span>制作実績をすべて見る</span></a>');
    }

    // Featured grid — all works (movie section)
    const featuredHtml = works.map(buildFeaturedCard).join('');
    if (featuredHtml) {
      const moreBtn = works.length > 6
        ? '<div class="featuredGrid__more"><button type="button" class="featuredGrid__moreBtn js-featuredToggle" aria-expanded="false">もっと見る</button></div>'
        : '';
      $('#movie .movie__inner').html(
        '<h2 class="movie__title"><span class="hd">制作実績一覧</span></h2>' +
        '<div class="featuredGrid">' + featuredHtml + '</div>' + moreBtn
      );
    }

    if (!window.__featuredToggleBound) {
      window.__featuredToggleBound = true;
      $(document).on('click', '.js-featuredToggle', function() {
        const $btn       = $(this);
        const isExpanded = $btn.attr('aria-expanded') === 'true';
        const $extras    = $('#movie .js-featuredExtra');
        const $grid      = $('#movie .featuredGrid');
        const fromHeight = $grid.outerHeight();
        $grid.addClass('is-animating').css('height', fromHeight + 'px');
        if (isExpanded) {
          $extras.addClass('is-hidden');
          $btn.attr('aria-expanded', 'false').text('もっと見る');
        } else {
          $extras.removeClass('is-hidden');
          $btn.attr('aria-expanded', 'true').text('閉じる');
        }
        const toHeight = $grid.get(0) ? $grid.get(0).scrollHeight : fromHeight;
        $grid.stop(true).animate({ height: toHeight }, 220, 'swing', function() {
          $grid.removeClass('is-animating').css('height', '');
        });
      });
    }

    // About (introduction section)
    const about = p.about || {};
    $('.introduction__catch .hd').text(about.title || '私について');
    $('.introduction__text').html(esc(about.text || '').replace(/\n/g, '<br>'));
    $('.introduction__subCatch .hd').text(about.sub || '');

    // Style (story section)
    const styleCards   = Array.isArray(p.styleCards) ? p.styleCards : [];
    const storySummary = String(p.storySummary || '目的整理から実装・運用まで見据え、見た目だけで終わらないWeb制作を行います。');
    $('#story .story__inner').html(
      '<h2 class="story__title"><span class="hd">制作スタイル</span>' +
        '<span class="story__title--sun"></span><span class="story__title--en"></span><span class="story__title--ja"></span>' +
      '</h2>' +
      '<div class="styleCards">' + styleCards.map(buildStyleCard).join('') + '</div>' +
      '<p class="story__summary">' + esc(storySummary) + '</p>'
    );

    // Pricing (music section)
    const pricingPlans      = Array.isArray(p.pricingPlans)      ? p.pricingPlans      : [];
    const pricingOptions    = Array.isArray(p.pricingOptions)    ? p.pricingOptions    : [];
    const pricingAssurances = Array.isArray(p.pricingAssurances) ? p.pricingAssurances : [];
    $('#music .music__inner').html(
      '<h2 class="music__title"><span class="hd">料金</span></h2>' +
      '<section class="portfolioPanel pricingPlan" aria-label="料金プラン">' +
        '<div class="pricingPlan__grid">' + pricingPlans.map(buildPricingCard).join('') + '</div>' +
        '<div class="pricingPlan__subgrid">' +
          '<section class="pricingSupport pricingSupport--options" aria-label="オプション">' +
            '<p class="pricingSupport__title">オプション</p>' +
            '<ul class="pricingSupport__list">' + pricingOptions.map((t) => `<li>${esc(t)}</li>`).join('') + '</ul>' +
          '</section>' +
          '<section class="pricingSupport pricingSupport--assurance" aria-label="安心材料">' +
            '<p class="pricingSupport__title">安心してご相談いただくために</p>' +
            '<ul class="pricingTrust">' + pricingAssurances.map((t) => `<li class="pricingTrust__item">${esc(t)}</li>`).join('') + '</ul>' +
          '</section>' +
        '</div>' +
        '<p class="pricingPlan__note">※内容・ボリュームにより個別お見積りいたします。</p>' +
      '</section>'
    );

    // Process (character section)
    const processMeta = (p.processMeta && typeof p.processMeta === 'object') ? p.processMeta : {};
    const processHtml = process.map((item) => buildProcessCard(item, processMeta)).join('');
    if (processHtml) {
      $('#character .character__inner').html(
        '<h2 class="character__title"><span class="hd">制作の流れ</span></h2>' +
        '<p class="processSectionLead">ヒアリングから公開まで、目的に沿って一貫して進行します。</p>' +
        '<div class="processGrid">' + processHtml + '</div>'
      );
    }

    // Contact (staffcast section)
    const contact = p.contact || {};
    $('#staffcast .staffcast__inner').html(buildContactSection(contact));

    if (!$('#contactFormModal').length) {
      $('body').append(buildContactFormModal(esc(contact.form || 'https://formspree.io/f/xdkwllne')));
    }

    if (!window.__contactFormHandlersBound) {
      window.__contactFormHandlersBound = true;

      $(document).on('click', '.js-openContactForm', function() {
        $('#contactFormModal').addClass('is-open').attr('aria-hidden', 'false');
        $('html,body').css({ overflow: 'hidden' });
        track('contact_form_open', { event_category: 'engagement', event_label: 'contact_modal' });
      });

      $(document).on('click', '.js-closeContactForm', function() {
        $('#contactFormModal').removeClass('is-open').attr('aria-hidden', 'true');
        $('#contactForm').removeClass('is-confirm');
        $('#contactFormStatus').text('');
        $('html,body').css({ overflow: 'visible' });
      });

      $(document).on('submit', '#contactForm', function(e) {
        e.preventDefault();
        const get = (k) => String(new FormData(this).get(k) || '');
        $('#contactConfirmName').text(get('name'));
        $('#contactConfirmEmail').text(get('email'));
        $('#contactConfirmType').text(get('type'));
        $('#contactConfirmBudget').text(get('budget') || '未入力');
        $('#contactConfirmMessage').text(get('message'));
        $(this).addClass('is-confirm');
        $('#contactFormStatus').text('内容をご確認のうえ送信してください。');
        track('contact_form_confirm', { event_category: 'engagement', event_label: 'contact_modal' });
      });

      $(document).on('click', '.js-contactBack', function() {
        $('#contactForm').removeClass('is-confirm');
        $('#contactFormStatus').text('');
      });

      $(document).on('click', '.js-contactSend', function() {
        const $form   = $('#contactForm');
        const $status = $('#contactFormStatus');
        const $send   = $(this);
        $send.prop('disabled', true).text('送信中...');
        $status.text('');
        fetch($form.attr('action'), {
          method: 'POST',
          body: new FormData($form[0]),
          headers: { Accept: 'application/json' }
        })
          .then((res) => {
            if (!res.ok) throw new Error('send-failed');
            $status.text('送信ありがとうございました。内容を確認のうえご連絡します。');
            $form[0].reset();
            $form.removeClass('is-confirm');
            track('generate_lead', { event_category: 'conversion', event_label: 'contact_form' });
          })
          .catch(() => { $status.text('送信に失敗しました。時間をおいて再度お試しください。'); })
          .finally(() => { $send.prop('disabled', false).text('この内容で送信'); });
      });
    }

    // KV orbit tooltip
    if (!window.__kvOrbitFloatingTipBound) {
      window.__kvOrbitFloatingTipBound = true;
      const tip = document.createElement('div');
      tip.className = 'kvOrbitFloatingTip';
      tip.setAttribute('aria-hidden', 'true');
      document.body.appendChild(tip);
      let activeBtn = null;

      const placeTip = (btn) => {
        const r = btn.getBoundingClientRect();
        tip.style.left = Math.round(r.left + 34) + 'px';
        tip.style.top  = Math.round(r.top  - 12) + 'px';
      };
      const showTip = (btn) => {
        const el   = document.getElementById(btn.getAttribute('aria-describedby') || '');
        const text = el ? String(el.textContent || '').trim() : '';
        if (!text) return;
        activeBtn = btn;
        tip.textContent = text;
        placeTip(btn);
        tip.classList.add('is-visible');
      };
      const hideTip = () => { activeBtn = null; tip.classList.remove('is-visible'); };

      $(document).on('mouseenter focusin', '.kvOrbit__btn', function() {
        if (window.matchMedia && !window.matchMedia('(hover: hover)').matches) return;
        showTip(this);
      });
      $(document).on('mouseleave focusout', '.kvOrbit__btn', hideTip);
      window.addEventListener('resize', () => { if (activeBtn) placeTip(activeBtn); }, { passive: true });
      window.addEventListener('scroll', () => { if (activeBtn) placeTip(activeBtn); }, { passive: true });
    }
  });
})(jQuery);
