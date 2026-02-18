(function($){
  const data = window.SITE_DATA || {};
  window.tPath = './';

  const nav = Array.isArray(data.nav) ? data.nav : [];
  const socials = Array.isArray(data.socials) ? data.socials : [];
  const footerBanners = Array.isArray(data.footerBanners) ? data.footerBanners : [];

  const menuLabelMap = {
    news: { en: 'WORKS', ja: '制作実績' },
    movie: { en: 'FEATURED', ja: '注目作品' },
    introduction: { en: 'PROFILE', ja: '自己紹介' },
    story: { en: 'STYLE', ja: '制作スタイル' },
    music: { en: 'PRICE', ja: '料金' },
    character: { en: 'PROCESS', ja: '制作の流れ' },
    staffcast: { en: 'CONTACT', ja: 'お問い合わせ' }
  };

  const resolveMenuLabel = (item) => {
    const key = (item && item.id) || '';
    if (menuLabelMap[key]) return menuLabelMap[key];
    return { en: String(item?.label || '').toUpperCase(), ja: item?.label || '' };
  };

  const navHtml = nav.map(item => {
    const label = resolveMenuLabel(item);
    return `<li class="nav__item"><a href="#${item.id}" class="nav__itemLink js-anchor"><span class="menuLabelEn">${label.en}</span><span class="menuLabelJa">${label.ja}</span></a></li>`;
  }).join('');

  const gnavHtml = nav.map(item => {
    const label = resolveMenuLabel(item);
    return `<li class="gnav__item"><a href="#${item.id}" class="gnav__itemLink js-anchor"><span class="menuLabelEn">${label.en}</span><span class="menuLabelJa">${label.ja}</span></a></li>`;
  }).join('');

  const fvSocials = socials.filter(s => /^(x|github)$/i.test((s.label || '').trim()));

  const snsHtml = fvSocials.map(s => {
    const blank = s.targetBlank ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<dd class="fv__snsList"><a href="${s.url}" class="fv__snsListLink"${blank}>${s.label}</a></dd>`;
  }).join('');

  const gnavSocials = socials.filter(s => /^(x|github)$/i.test((s.label || '').trim()));

  const gsnsHtml = gnavSocials.map(s => {
    const blank = s.targetBlank ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<dd class="gnav__officialItem"><a href="${s.url}" class="gnav__officialLink"${blank}>${s.label}</a></dd>`;
  }).join('');

  const footerSocials = socials.filter(s => /^(x|github)$/i.test((s.label || '').trim()));

  const fsnsHtml = footerSocials.map(s => {
    const blank = s.targetBlank ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<dd class="footer__officialItem"><a href="${s.url}" class="footer__officialLink"${blank}>${s.label}</a></dd>`;
  }).join('');

  const bannerHtml = footerBanners.map(b => {
    const blank = b.targetBlank ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `<li class="footer__bnrItem"><a href="${b.url}" class="footer__bnrLink"${blank}><img src="${b.image}" alt=""></a></li>`;
  }).join('');

  $('#js-nav,#js-fnav').html(navHtml);
  $('#js-gnav').html(gnavHtml);
  $('#js-sns').append(snsHtml);
  $('#js-gsns').append(gsnsHtml);
  $('#js-fsns').append(fsnsHtml);
  $('#js-banners').html(bannerHtml);

  if ($('#js-gnavCharacter').length) {
    $('#js-gnavCharacter').html('<p class="gnav__characterLabel">Aoki Portfolio</p><p class="gnav__characterGuide">超かぐや姫風モーションを活かしたポートフォリオ版です。</p>');
  }

  // Replace garbled default text with editable template copy.
  $('.gnav__logo .hd, .footer__logo .hd').text(data.brand?.title || 'Aoki Portfolio');
  $('.fv__logo .hd').text((data.brand?.title || 'Aoki Portfolio') + ' | ' + (data.brand?.subtitle || 'ポートフォリオサイト'));
  const heroCatchMain = 'Where Finite Time Meets Infinite Possibility.';
  const heroCatchSub = '限られた時間を、無限の可能性へ。';
  $('.fv__catch .hd').html('<span class="fv__catchMain">' + heroCatchMain + '</span><span class="fv__catchSub">' + heroCatchSub + '</span>');
  $('.fv__date .hd').eq(0).text(data.portfolio?.heroDateJa || '');
  $('.fv__date .hd').eq(1).text(data.portfolio?.heroDateEn || '');
  $('.news__title .hd').text('制作実績');
  $('.movie__title .hd').text('注目作品');
  $('.introduction__title .hd').text('自己紹介');
  $('.story__title .hd').text('制作スタイル');
  $('.music__title .hd').text('料金');
  $('.character__title .hd').text('制作の流れ');
  $('.staffcast__title .hd').text('お問い合わせ');
  $('.footer__copyright').text('© Aoki Portfolio');
  $('.footer__policy a').text('プライバシーポリシー').attr('href', '#');
})(jQuery);
