(function($) {
  const data          = window.SITE_DATA || {};
  const nav           = Array.isArray(data.nav)           ? data.nav           : [];
  const socials       = Array.isArray(data.socials)       ? data.socials       : [];
  const footerBanners = Array.isArray(data.footerBanners) ? data.footerBanners : [];
  const brand         = data.brand || {};

  window.tPath = './';

  // ── Helpers ───────────────────────────────────────────────────────────────
  const xGhSocials = socials.filter(s => /^(x|github)$/i.test((s.label || '').trim()));
  const blankAttr  = (s) => s.targetBlank ? ' target="_blank" rel="noopener noreferrer"' : '';
  const resolveLabel = (item) => ({
    en: item.en || String(item.label || '').toUpperCase(),
    ja: item.ja || item.label || ''
  });

  // ── Nav ───────────────────────────────────────────────────────────────────
  const navHtml = nav.map(item => {
    const l = resolveLabel(item);
    return `<li class="nav__item"><a href="#${item.id}" class="nav__itemLink js-anchor"><span class="menuLabelEn">${l.en}</span><span class="menuLabelJa">${l.ja}</span></a></li>`;
  }).join('');

  const gnavHtml = nav.map(item => {
    const l = resolveLabel(item);
    return `<li class="gnav__item"><a href="#${item.id}" class="gnav__itemLink js-anchor"><span class="menuLabelEn">${l.en}</span><span class="menuLabelJa">${l.ja}</span></a></li>`;
  }).join('');

  // ── Social links ──────────────────────────────────────────────────────────
  const snsHtml  = xGhSocials.map(s => `<dd class="fv__snsList"><a href="${s.url}" class="fv__snsListLink"${blankAttr(s)}>${s.label}</a></dd>`).join('');
  const gsnsHtml = xGhSocials.map(s => `<dd class="gnav__officialItem"><a href="${s.url}" class="gnav__officialLink"${blankAttr(s)}>${s.label}</a></dd>`).join('');
  const fsnsHtml = xGhSocials.map(s => `<dd class="footer__officialItem"><a href="${s.url}" class="footer__officialLink"${blankAttr(s)}>${s.label}</a></dd>`).join('');

  const bannerHtml = footerBanners.map(b =>
    `<li class="footer__bnrItem"><a href="${b.url}" class="footer__bnrLink"${blankAttr(b)}><img src="${b.image}" alt=""></a></li>`
  ).join('');

  // ── Render ────────────────────────────────────────────────────────────────
  $('#js-nav,#js-fnav').html(navHtml);
  $('#js-gnav').html(gnavHtml);
  $('#js-sns').append(snsHtml);
  $('#js-gsns').append(gsnsHtml);
  $('#js-fsns').append(fsnsHtml);
  $('#js-banners').html(bannerHtml);

  if ($('#js-gnavCharacter').length) {
    $('#js-gnavCharacter').html('<p class="gnav__characterLabel">Aoki Portfolio</p><p class="gnav__characterGuide">モーションを活かしたポートフォリオ版です。</p>');
  }

  $('.gnav__logo .hd, .footer__logo .hd').text(brand.title || 'Aoki Portfolio');
  $('.fv__logo .hd').text((brand.title || 'Aoki Portfolio') + ' | ' + (brand.subtitle || 'ポートフォリオサイト'));
  $('.news__title .hd').text('最新の制作実績');
  $('.introduction__title .hd').text('自己紹介');
  $('.footer__copyright').text('© Aoki Portfolio');
  $('.footer__policy a')
    .text('プライバシーポリシー')
    .attr('href', './privacy.html')
    .attr('target', '_blank')
    .attr('rel', 'noopener noreferrer');

  // Move fixed SNS outside the sticky FV layer so later sections cannot cover it.
  if ($('.fv__sns').length) {
    $('.fv__sns').appendTo('body');
  }
})(jQuery);
