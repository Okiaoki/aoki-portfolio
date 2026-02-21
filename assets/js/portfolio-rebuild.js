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

  $(function() {
    // Hero
    $('.fv__catch .hd').html('<span class="fv__catchMain">Where Finite Time Meets Infinite Possibility.</span><span class="fv__catchSub">限られた時間を、無限の可能性へ。</span>');
    $('.fv__date .hd').eq(0).text(p.heroDateJa || '');
    $('.fv__date .hd').eq(1).text(p.heroDateEn || '');

    // Works (news section)
    const worksHtml = works.slice(0, 4).map((w, i) => (
      '<li class="portfolioWorks__item">' +
        '<a class="portfolioWorks__link" href="' + esc(w.url) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="portfolioWorks__num">0' + (i + 1) + '</span>' +
          '<span class="portfolioWorks__body">' +
            '<strong class="portfolioWorks__title">' + esc(w.title) + '</strong>' +
            '<span class="portfolioWorks__meta">' + esc(w.meta) + '</span>' +
          '</span>' +
        '</a>' +
      '</li>'
    )).join('');
    if (worksHtml) {
      $('#js-newsLists').html(worksHtml).addClass('portfolioWorks');
      $('.news__more').html('<a href="#movie" class="news__moreLink js-anchor"><span>制作実績をすべて見る</span></a>');
    }

    // Featured (movie section)
    const featuredHtml = works.map((w) => (
      '<article class="featuredCard">' +
        '<a href="' + esc(w.url) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="featuredCard__img" style="background-image:url(' + esc(w.image) + ');"></span>' +
          '<span class="featuredCard__title">' + esc(w.title) + '</span>' +
          '<span class="featuredCard__meta">' + esc(w.meta) + '</span>' +
        '</a>' +
      '</article>'
    )).join('');
    if (featuredHtml) {
      $('#movie .movie__inner').html(
        '<h2 class="movie__title"><span class="hd">注目の制作実績</span></h2>' +
        '<div class="featuredGrid">' + featuredHtml + '</div>'
      );
    }

    // About + Story (introduction/story section)
    $('.introduction__catch .hd').text((p.about && p.about.title) || '私について');
    $('.introduction__text').html(esc((p.about && p.about.text) || '').replace(/\n/g, '<br>'));
    $('.introduction__subCatch .hd').text((p.about && p.about.sub) || '');
    $('.story__catchText .hd').text((p.story && p.story.catch) || '');
    $('.story__text').text((p.story && p.story.text) || '');

    // Pricing (music section)
    $('#music .music__inner').html(
      '<h2 class="music__title"><span class="hd">料金</span></h2>' +
      '<div class="portfolioPanel pricingPlan">' +
        '<h3 class="portfolioPanel__title">料金プラン</h3>' +
        '<div class="pricingPlan__section">' +
          '<h4 class="pricingPlan__heading">■ LP制作（静的コーディング）</h4>' +
          '<p class="pricingPlan__price">120,000円〜</p>' +
          '<ul class="pricingPlan__list">' +
            '<li>デザインデータ忠実再現</li>' +
            '<li>レスポンシブ対応</li>' +
            '<li>基本アニメーション実装</li>' +
            '<li>表示速度最適化</li>' +
          '</ul>' +
        '</div>' +
        '<div class="pricingPlan__section">' +
          '<h4 class="pricingPlan__heading">■ WordPressテーマ化（既存LP移行）</h4>' +
          '<p class="pricingPlan__price">150,000円〜</p>' +
          '<ul class="pricingPlan__list">' +
            '<li>固定ページ／投稿機能実装</li>' +
            '<li>カスタムフィールド対応</li>' +
            '<li>管理画面から更新可能な構成設計</li>' +
          '</ul>' +
        '</div>' +
        '<div class="pricingPlan__section">' +
          '<h4 class="pricingPlan__heading">■ オプション</h4>' +
          '<ul class="pricingPlan__list">' +
            '<li>JavaScript高度演出・機能追加　＋30,000円〜</li>' +
            '<li>セクション追加・長尺対応　＋20,000円〜</li>' +
            '<li>保守・月次更新サポート　月額15,000円〜</li>' +
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
          })
          .catch(() => {
            $status.text('送信に失敗しました。時間をおいて再度お試しください。');
          })
          .finally(() => {
            $send.prop('disabled', false).text('この内容で送信');
          });
      });
    }
  });
})(jQuery);
