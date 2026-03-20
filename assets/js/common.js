const rt        = $('body').data('rt');
const epUrl     = '';
const localData = window.SITE_DATA || {};

// ── Data helpers ───────────────────────────────────────────────────────────
const getParam = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex   = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const getPosts = (_ep, _page, _limit = 10, _args = {}) => {
  if (Array.isArray(localData[_ep])) {
    const start    = Math.max(0, (_page - 1) * _limit);
    const slice    = localData[_ep].slice(start, start + _limit);
    const deferred = $.Deferred();
    const mockXhr  = {
      getResponseHeader: (name) => (name && name.toLowerCase() === 'x-wp-total' ? String(localData[_ep].length) : null)
    };
    setTimeout(() => deferred.resolve(slice, 'success', mockXhr), 0);
    return deferred.promise();
  }
  _args.per_page = _limit;
  _args.page     = _page;
  return $.ajax({ url: epUrl + _ep + '?acf_format=standard&context=embed', type: 'GET', dataType: 'json', timeout: 10000, cache: false, data: _args });
};

const getPost = (_ep, _id) => {
  if (localData[_ep] && localData[_ep][_id]) {
    const deferred = $.Deferred();
    setTimeout(() => deferred.resolve(localData[_ep][_id]), 0);
    return deferred.promise();
  }
  return $.ajax({ url: epUrl + _ep + '/' + _id + '?acf_format=standard', type: 'GET', dataType: 'json', timeout: 10000 });
};

const getYmdHis = (_date) => {
  const d = new Date(_date);
  return {
    Y: d.getFullYear().toString(),
    m: (d.getMonth() + 1).toString().padStart(2, '0'),
    d: d.getDate().toString().padStart(2, '0'),
    H: d.getHours().toString().padStart(2, '0'),
    i: d.getMinutes().toString().padStart(2, '0'),
    s: d.getSeconds().toString().padStart(2, '0')
  };
};

// ── Anchor smooth scroll ───────────────────────────────────────────────────
$(document).on('click', '.js-navCharacter', function() {
  const cid = $(this).data('cid');
  if (!$('#character')[0]) return;
  if (window.characterSwiper) window.characterSwiper.slideToLoop(cid);
  $('body,html').animate({ scrollTop: $('#character').offset().top }, 1000, 'easeOutQuart');
  $('.js-menu,.gnav').removeClass('is-active');
  $('#js-gnavMenuLabel').text('メニュー');
  $('html,body').css({ overflow: 'visible' });
});

$('.js-anchor').on('click', function() {
  const href     = $(this).attr('href');
  const target   = $(href === '#' || href === '' ? 'html' : href);
  const offset   = href === '#movie' ? 150 : 0;
  const position = target.offset().top + offset;
  $('body,html').animate({ scrollTop: position }, 1000, 'easeOutQuart');
  $('.js-menu,.gnav').removeClass('is-active');
  $('#js-gnavMenuLabel').text('メニュー');
  $('html,body').css({ overflow: 'visible' });
  return false;
});

// ── Hamburger menu ────────────────────────────────────────────────────────
$('.js-menu').on('click', function() {
  $(this).toggleClass('is-active');
  if ($(this).hasClass('is-active')) {
    $('.gnav').addClass('is-active');
    $('html,body').css({ overflow: 'hidden' });
    $('#js-gnavMenuLabel').text('閉じる');
  } else {
    $('.gnav').removeClass('is-active');
    $('html,body').css({ overflow: 'visible' });
    $('#js-gnavMenuLabel').text('メニュー');
  }
});

// ── YouTube modal ─────────────────────────────────────────────────────────
if ($('.js-movieThumb')[0]) {
  $('.js-movieThumb').each(function() {
    const ytID = $(this).data('yt');
    if (ytID) $(this).css({ 'background-image': 'url(https://img.youtube.com/vi/' + ytID + '/maxresdefault.jpg)' });
  });
}

$(document).on('click', '.js-moviePlay', function() {
  const ytID = $(this).data('yt');
  $('#movieModal').show();
  $('.modal__movieContent iframe').attr('src', 'https://www.youtube.com/embed/' + ytID + '?autoplay=1');
  $('html,body').css({ overflow: 'hidden' });
  $('#movieModal .modal__inner').fadeIn(500);
});

$('.js-modalClose_movie').on('click', function() {
  $('#movieModal').fadeOut(500, 'linear', function() {
    $('html,body').css({ overflow: 'visible' });
    $('.modal__movieContent iframe').attr('src', '');
    $('#movieModal .modal__inner').hide();
  });
});

// ── Hot news (gnav) ───────────────────────────────────────────────────────
$(function() {
  getPosts('posts', 1, 1).done(function(data) {
    data.forEach((v) => {
      const d    = getYmdHis(v.date);
      const href = v.link || ((window.tPath || './') + 'news/detail.html?id=' + v.id);
      $('#js-hotnews').append(
        '<a href="' + href + '" class="gnav__hotTopicsLink">' +
          '<time class="gnav__hotTopicsItemTime" datetime="' + d.Y + '-' + d.m + '-' + d.d + '">' + d.Y + '<span><br></span>' + d.m + '.' + d.d + '</time>' +
          '<p class="gnav__hotTopicsItemTitle">' + v.title.rendered + '</p>' +
        '</a>'
      );
    });
  }).fail(function() {
    console.warn('[WARN] Failed to get news list');
  });
});

// ── Page load animation ────────────────────────────────────────────────────
$(window).on('load', function() {
  const $loading = $('#loading');
  const hs = location.hash;

  if (hs && $(hs)[0]) {
    // Deep-link: skip opening, remove immediately
    $loading.remove();
    $('#fv').addClass('ani2');
    return;
  }

  $('html,body').animate({ scrollTop: 0 }, 10);

  // Phase 1: Logo + progress bar appear immediately
  $loading.addClass('is-visible');

  // Phase 2: 1.5s gauge fill → 0.5s exit → done at 2.0s
  setTimeout(() => {
    $loading.addClass('is-exit');
    setTimeout(() => {
      $loading.remove();
      $('#fv').addClass('ani2');
    }, 500);
  }, 1500);
});
