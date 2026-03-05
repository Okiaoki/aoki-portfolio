(function($) {
  const data = window.SITE_DATA || {};
  const p = data.portfolio || {};

  const esc = (v) => String(v || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

  const works = Array.isArray(p.works) ? p.works : [];
  const process = Array.isArray(p.process) ? p.process : [];
  const pricing = Array.isArray(p.pricing) ? p.pricing : [];
  const analytics = data.analytics || {};
  const ga4MeasurementId = String(analytics.ga4MeasurementId || '').trim();
  let ga4Initialized = false;

  const ensureGa4 = () => {
    if (!ga4MeasurementId) return false;

    if (!window.dataLayer) window.dataLayer = [];
    if (!window.gtag) {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }

    if (!document.querySelector('script[data-ga4="' + ga4MeasurementId + '"]')) {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ga4MeasurementId);
      script.setAttribute('data-ga4', ga4MeasurementId);
      document.head.appendChild(script);
    }

    if (!ga4Initialized) {
      window.gtag('js', new Date());
      window.gtag('config', ga4MeasurementId);
      ga4Initialized = true;
    }

    return true;
  };

  const trackGa4Event = (eventName, params) => {
    if (!ensureGa4()) return;
    window.gtag('event', eventName, params || {});
  };

  $(function() {
    // Hero
    $('.fv__catch .hd').html('<span class="fv__catchMain">Where Finite Time Meets Infinite Possibility.</span><span class="fv__catchSub">限られた時間を、無限の可能性へ。</span>');
    $('.fv__date .hd').eq(0).text(p.heroDateJa || '');
    $('.fv__date .hd').eq(1).text(p.heroDateEn || '');

    // Works (news section)
    const worksHtml = works.slice(0, 5).map((w, i) => {
      const hasSiteUrl = Boolean(String(w.url || '').trim());
      const siteUrl = hasSiteUrl ? esc(w.url) : '#';
      const siteUrlNote = hasSiteUrl ? '' : '<!-- TODO: Add site URL for this work item -->';
      const githubUrl = String(w.github || '').trim();
      const githubButton = githubUrl
        ? '<a class="portfolioWorks__btn portfolioWorks__btn--github" href="' + esc(githubUrl) + '" target="_blank" rel="noopener noreferrer">GitHub</a>'
        : '';

      return (
        '<li class="portfolioWorks__item">' +
          '<article class="portfolioWorks__card">' +
            '<span class="portfolioWorks__num">0' + (i + 1) + '</span>' +
            '<span class="portfolioWorks__body">' +
              '<strong class="portfolioWorks__title">' + esc(w.title) + '</strong>' +
              '<span class="portfolioWorks__meta">' + esc(w.meta) + '</span>' +
            '</span>' +
            '<div class="portfolioWorks__actions">' +
              '<a class="portfolioWorks__btn portfolioWorks__btn--site" href="' + siteUrl + '" target="_blank" rel="noopener noreferrer">View Site</a>' +
              githubButton +
            '</div>' +
            siteUrlNote +
          '</article>' +
        '</li>'
      );
    }).join('');
    if (worksHtml) {
      $('#js-newsLists').html(worksHtml).addClass('portfolioWorks');
      $('.news__more').html('<a href="#works-all" class="news__moreLink js-anchor"><span>制作実績をすべて見る</span></a>');
    }

    // Works list with thumbnails (movie section)
    const featuredHtml = works.map((w, i) => {
      const hasSiteUrl = Boolean(String(w.url || '').trim());
      const siteUrl = hasSiteUrl ? esc(w.url) : '#';
      const siteUrlNote = hasSiteUrl ? '' : '<!-- TODO: Add site URL for this work item -->';
      const githubUrl = String(w.github || '').trim();
      const hiddenClass = i >= 6 ? ' is-hidden js-featuredExtra' : '';
      const githubAction = githubUrl
        ? '<a class="featuredCard__action featuredCard__action--github" href="' + esc(githubUrl) + '" target="_blank" rel="noopener noreferrer">GitHub</a>'
        : '';

      return (
        '<article class="featuredCard' + hiddenClass + '">' +
          '<a class="featuredCard__mainLink" href="' + siteUrl + '" target="_blank" rel="noopener noreferrer" aria-label="' + esc(w.title) + ' のサイトを開く">' +
            '<span class="featuredCard__thumb">' +
              '<img class="featuredCard__img" src="' + esc(w.image) + '" alt="' + esc(w.title) + ' サムネイル" loading="lazy">' +
            '</span>' +
            '<span class="featuredCard__title">' + esc(w.title) + '</span>' +
            '<span class="featuredCard__meta">' + esc(w.meta) + '</span>' +
          '</a>' +
          '<span class="featuredCard__overlay" aria-hidden="true">' +
            '<span class="featuredCard__actions">' +
              '<a class="featuredCard__action featuredCard__action--site" href="' + siteUrl + '" target="_blank" rel="noopener noreferrer">View Site</a>' +
              githubAction +
            '</span>' +
          '</span>' +
          siteUrlNote +
        '</article>'
      );
    }).join('');
    if (featuredHtml) {
      const hasMoreWorks = works.length > 6;
      const moreButtonHtml = hasMoreWorks
        ? '<div class="featuredGrid__more"><button type="button" class="featuredGrid__moreBtn js-featuredToggle" aria-expanded="false">もっと見る</button></div>'
        : '';
      $('#movie .movie__inner').html(
        '<h2 class="movie__title"><span class="hd">制作実績一覧</span></h2>' +
        '<div class="featuredGrid">' + featuredHtml + '</div>' +
        moreButtonHtml
      );
    }

    if (!window.__featuredToggleBound) {
      window.__featuredToggleBound = true;
      $(document).on('click', '.js-featuredToggle', function() {
        const $btn = $(this);
        const isExpanded = $btn.attr('aria-expanded') === 'true';
        const $extras = $('#movie .js-featuredExtra');
        const $grid = $('#movie .featuredGrid');
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

    // About + Story (introduction/story section)
    $('.introduction__catch .hd').text((p.about && p.about.title) || '私について');
    $('.introduction__text').html(esc((p.about && p.about.text) || '').replace(/\n/g, '<br>'));
    $('.introduction__subCatch .hd').text((p.about && p.about.sub) || '');
    const storyText = String((p.story && p.story.text) || '');
    $('#story .story__inner').html(
      '<h2 class="story__title">' +
        '<span class="hd">制作スタイル</span>' +
        '<span class="story__title--sun"></span>' +
        '<span class="story__title--en"></span>' +
        '<span class="story__title--ja"></span>' +
      '</h2>' +
      '<div class="styleCards">' +
        '<article class="styleCard">' +
          '<h3 class="styleCard__title">設計</h3>' +
          '<ul class="styleCard__list">' +
            '<li>目的に沿った情報設計と優先順位整理</li>' +
            '<li>離脱を減らす導線とCTA配置を設計</li>' +
            '<li>運用を見据えた拡張可能な構造化</li>' +
          '</ul>' +
        '</article>' +
        '<article class="styleCard">' +
          '<h3 class="styleCard__title">実装</h3>' +
          '<ul class="styleCard__list">' +
            '<li>見本サイトを忠実に再現するコーディング</li>' +
            '<li>軽量なJavaScriptで必要な演出を実装</li>' +
            '<li>全デバイスで崩れないレスポンシブ対応</li>' +
          '</ul>' +
        '</article>' +
        '<article class="styleCard">' +
          '<h3 class="styleCard__title">品質</h3>' +
          '<ul class="styleCard__list">' +
            '<li>表示速度を意識した最適化と調整</li>' +
            '<li>読みやすく修正しやすいコード設計</li>' +
            '<li>長期運用に耐える保守性を担保</li>' +
          '</ul>' +
        '</article>' +
      '</div>' +
      '<p class="story__summary">' + esc(storyText).replace(/\n/g, '<br>') + '</p>'
    );

    // Pricing (music section)
    $('#music .music__inner').html(
      '<h2 class="music__title"><span class="hd">料金</span></h2>' +
      '<div class="portfolioPanel pricingPlan">' +
        '<h3 class="portfolioPanel__title">料金プラン</h3>' +
        '<div class="pricingPlan__section">' +
          '<h4 class="pricingPlan__heading">■ LP制作（静的コーディング）</h4>' +
          '<p class="pricingPlan__price">120,000円〜</p>' +
          '<div class="pricingPlan__meta">' +
            '<p class="pricingPlan__metaTitle">含まれるもの</p>' +
            '<ul class="pricingPlan__list">' +
              '<li>デザインデータ忠実再現</li>' +
              '<li>レスポンシブ対応</li>' +
              '<li>基本アニメーション実装・速度最適化</li>' +
            '</ul>' +
          '</div>' +
          '<p class="pricingPlan__delivery"><span>目安納期</span>10日〜15日</p>' +
        '</div>' +
        '<div class="pricingPlan__section">' +
          '<h4 class="pricingPlan__heading">■ WordPressテーマ化（既存LP移行）</h4>' +
          '<p class="pricingPlan__price">150,000円〜</p>' +
          '<div class="pricingPlan__meta">' +
            '<p class="pricingPlan__metaTitle">含まれるもの</p>' +
            '<ul class="pricingPlan__list">' +
              '<li>固定ページ／投稿機能実装</li>' +
              '<li>カスタムフィールド対応</li>' +
              '<li>管理画面から更新可能な構成設計</li>' +
            '</ul>' +
          '</div>' +
          '<p class="pricingPlan__delivery"><span>目安納期</span>14日〜21日</p>' +
        '</div>' +
        '<div class="pricingPlan__section">' +
          '<h4 class="pricingPlan__heading">■ オプション</h4>' +
          '<div class="pricingPlan__meta">' +
            '<p class="pricingPlan__metaTitle">含まれるもの</p>' +
            '<ul class="pricingPlan__list">' +
            '<li>JavaScript高度演出・機能追加　＋30,000円〜</li>' +
            '<li>セクション追加・長尺対応　＋20,000円〜</li>' +
            '<li>保守・月次更新サポート　月額15,000円〜</li>' +
            '</ul>' +
          '</div>' +
          '<p class="pricingPlan__delivery"><span>目安納期</span>3日〜（内容により変動）</p>' +
        '</div>' +
        '<div class="pricingPlan__assurance">' +
          '<p class="pricingPlan__assuranceTitle">安心してご相談いただくために</p>' +
          '<ul class="pricingPlan__assuranceList">' +
            '<li>お見積り無料（要件整理から対応）</li>' +
            '<li>原則48時間以内に初回返信</li>' +
            '<li>ご予算・納期に合わせた代替案も提示</li>' +
          '</ul>' +
        '</div>' +
        '<p class="pricingPlan__note">※内容・ボリュームにより個別お見積りいたします。</p>' +
      '</div>'
    );

    // Process (character section)
    const processMeta = {
      '01': {
        summary: '目的や条件を整理し、進行方針を明確にします。',
        points: ['目的・ターゲット整理', '参考LP共有', '納期・範囲の確認']
      },
      '02': {
        summary: '成果導線を意識して、ページ構成とUI方針を設計します。',
        points: ['ワイヤー構成', 'トーン&UI方針', 'レスポンシブ前提']
      },
      '03': {
        summary: '軽量で保守しやすい実装を、実運用を見据えて組み上げます。',
        points: ['セマンティックHTML', '再利用しやすいCSS', '必要最小限のJS']
      },
      '04': {
        summary: '公開前後の確認を行い、運用しやすい状態で引き渡します。',
        points: ['表示/動作チェック', '公開作業サポート', '更新フロー共有']
      }
    };

    const processHtml = process.map((item) => {
      const stepKey = String(item.step || '').padStart(2, '0');
      const meta = processMeta[stepKey] || {
        summary: String(item.text || ''),
        points: []
      };
      const pointsHtml = (meta.points || []).map((pText) => (
        '<li class="processCard__pointItem">' + esc(pText) + '</li>'
      )).join('');

      return (
        '<article class="processCard">' +
          '<p class="processCard__step">STEP ' + esc(stepKey) + '</p>' +
          '<h3 class="processCard__title">' + esc(item.title) + '</h3>' +
          '<p class="processCard__summary">' + esc(meta.summary) + '</p>' +
          '<ul class="processCard__points">' + pointsHtml + '</ul>' +
        '</article>'
      );
    }).join('');
    if (processHtml) {
      $('#character .character__inner').html(
        '<h2 class="character__title"><span class="hd">制作の流れ</span></h2>' +
        '<p class="processSectionLead">ヒアリングから公開まで、目的に沿って一貫して進行します。</p>' +
        '<div class="processGrid">' + processHtml + '</div>'
      );
    }

    // Contact (staffcast section)
    const contact = p.contact || {};
    $('#staffcast .staffcast__inner').html(
      '<h2 class="staffcast__title"><span class="hd">お問い合わせ</span></h2>' +
      '<div class="contactPanel">' +
        '<p class="contactPanel__lead">LP制作・WordPress移行・既存サイト改善など、お気軽にご相談ください。<br>概要のみでも問題ございません。通常48時間以内にご返信いたします。<br>X（旧Twitter）のDMからのご相談も可能です。</p>' +
        '<div class="contactPanel__links">' +
          '<div class="contactPanel__xWrap">' +
            '<a href="' + esc(contact.x || '#') + '" target="_blank" rel="noopener noreferrer">X</a>' +
            '<p class="contactPanel__xNote">DMでも受付中</p>' +
          '</div>' +
          '<a href="' + esc(contact.github || '#') + '" target="_blank" rel="noopener noreferrer">GitHub</a>' +
          '<button type="button" class="contactPanel__formBtn js-openContactForm">制作について相談する</button>' +
        '</div>' +
      '</div>'
    );

    // Contact form modal (Formspree)
    if (!$('#contactFormModal').length) {
      const contactEndpoint = esc(contact.form || 'https://formspree.io/f/xdkwllne');
      $('body').append(
        '<div class="contactFormModal" id="contactFormModal" aria-hidden="true">' +
          '<div class="contactFormModal__backdrop js-closeContactForm"></div>' +
          '<div class="contactFormModal__dialog" role="dialog" aria-modal="true" aria-label="お問い合わせフォーム">' +
            '<button type="button" class="contactFormModal__close js-closeContactForm" aria-label="閉じる">×</button>' +
            '<h3 class="contactFormModal__title">お問い合わせフォーム</h3>' +
            '<form id="contactForm" class="contactForm" action="' + contactEndpoint + '" method="POST">' +
              '<label class="contactForm__field"><span>お名前</span><input name="name" type="text" required></label>' +
              '<label class="contactForm__field"><span>メールアドレス</span><input name="email" type="email" required></label>' +
              '<label class="contactForm__field"><span>ご相談内容</span><select name="type" required>' +
                '<option value="">選択してください</option>' +
                '<option>LP制作</option><option>WordPress化</option><option>既存サイト改善</option><option>その他</option>' +
              '</select></label>' +
              '<label class="contactForm__field"><span>ご予算（任意）</span><input name="budget" type="text" placeholder="例: 15万円〜20万円"></label>' +
              '<label class="contactForm__field"><span>詳細</span><textarea name="message" rows="5" required></textarea></label>' +
              '<input type="hidden" name="_subject" value="Portfolio Contact">' +
              '<button type="submit" class="contactForm__submit">送信する</button>' +
              '<div class="contactForm__confirm" id="contactFormConfirm">' +
                '<p class="contactForm__confirmLead">以下の内容で送信します。よろしいですか？</p>' +
                '<dl class="contactForm__confirmList">' +
                  '<div><dt>お名前</dt><dd id="contactConfirmName"></dd></div>' +
                  '<div><dt>メールアドレス</dt><dd id="contactConfirmEmail"></dd></div>' +
                  '<div><dt>ご相談内容</dt><dd id="contactConfirmType"></dd></div>' +
                  '<div><dt>ご予算</dt><dd id="contactConfirmBudget"></dd></div>' +
                  '<div><dt>詳細</dt><dd id="contactConfirmMessage"></dd></div>' +
                '</dl>' +
                '<div class="contactForm__confirmActions">' +
                  '<button type="button" class="contactForm__back js-contactBack">修正する</button>' +
                  '<button type="button" class="contactForm__send js-contactSend">この内容で送信</button>' +
                '</div>' +
              '</div>' +
              '<p class="contactForm__status" id="contactFormStatus" aria-live="polite"></p>' +
              '<p class="contactForm__notice">※営業・勧誘目的のご連絡はご遠慮ください。</p>' +
            '</form>' +
          '</div>' +
        '</div>'
      );
    }

    if (!window.__contactFormHandlersBound) {
      window.__contactFormHandlersBound = true;

      $(document).on('click', '.js-openContactForm', function() {
        $('#contactFormModal').addClass('is-open').attr('aria-hidden', 'false');
        $('html,body').css({ overflow: 'hidden' });
        trackGa4Event('contact_form_open', {
          event_category: 'engagement',
          event_label: 'contact_modal'
        });
      });

      $(document).on('click', '.js-closeContactForm', function() {
        $('#contactFormModal').removeClass('is-open').attr('aria-hidden', 'true');
        $('#contactForm').removeClass('is-confirm');
        $('#contactFormStatus').text('');
        $('html,body').css({ overflow: 'visible' });
      });

      $(document).on('submit', '#contactForm', function(e) {
        e.preventDefault();
        const $form = $(this);
        const $status = $('#contactFormStatus');
        const formData = new FormData(this);
        const get = (k) => String(formData.get(k) || '');

        $('#contactConfirmName').text(get('name'));
        $('#contactConfirmEmail').text(get('email'));
        $('#contactConfirmType').text(get('type'));
        $('#contactConfirmBudget').text(get('budget') || '未入力');
        $('#contactConfirmMessage').text(get('message'));

        $form.addClass('is-confirm');
        $status.text('内容をご確認のうえ送信してください。');
        trackGa4Event('contact_form_confirm', {
          event_category: 'engagement',
          event_label: 'contact_modal'
        });
      });

      $(document).on('click', '.js-contactBack', function() {
        $('#contactForm').removeClass('is-confirm');
        $('#contactFormStatus').text('');
      });

      $(document).on('click', '.js-contactSend', function() {
        const $form = $('#contactForm');
        const $status = $('#contactFormStatus');
        const $send = $(this);

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
            trackGa4Event('generate_lead', {
              event_category: 'conversion',
              event_label: 'contact_form'
            });
          })
          .catch(() => {
            $status.text('送信に失敗しました。時間をおいて再度お試しください。');
          })
          .finally(() => {
            $send.prop('disabled', false).text('この内容で送信');
          });
      });
    }

    // KV orbit tooltip: render outside masked layers so it always appears above portal backgrounds.
    if (!window.__kvOrbitFloatingTipBound) {
      window.__kvOrbitFloatingTipBound = true;

      const floatingTip = document.createElement('div');
      floatingTip.className = 'kvOrbitFloatingTip';
      floatingTip.setAttribute('aria-hidden', 'true');
      document.body.appendChild(floatingTip);

      let activeOrbitBtn = null;

      const placeTip = (btn) => {
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        floatingTip.style.left = Math.round(rect.left + 34) + 'px';
        floatingTip.style.top = Math.round(rect.top - 12) + 'px';
      };

      const showTip = (btn) => {
        const tipId = btn.getAttribute('aria-describedby');
        const tipEl = tipId ? document.getElementById(tipId) : null;
        const text = tipEl ? String(tipEl.textContent || '').trim() : '';
        if (!text) return;
        activeOrbitBtn = btn;
        floatingTip.textContent = text;
        placeTip(btn);
        floatingTip.classList.add('is-visible');
      };

      const hideTip = () => {
        activeOrbitBtn = null;
        floatingTip.classList.remove('is-visible');
      };

      $(document).on('mouseenter focusin', '.kvOrbit__btn', function() {
        if (window.matchMedia && !window.matchMedia('(hover: hover)').matches) return;
        showTip(this);
      });

      $(document).on('mouseleave focusout', '.kvOrbit__btn', function() {
        hideTip();
      });

      window.addEventListener('resize', () => {
        if (activeOrbitBtn) placeTip(activeOrbitBtn);
      }, { passive: true });
      window.addEventListener('scroll', () => {
        if (activeOrbitBtn) placeTip(activeOrbitBtn);
      }, { passive: true });
    }
  });
})(jQuery);
