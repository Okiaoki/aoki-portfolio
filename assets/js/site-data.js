window.SITE_DATA = {
  brand: {
    title: 'Aoki Portfolio',
    subtitle: 'デザイン x コード x ストーリー'
  },
  nav: [
    { id: 'news', label: '制作実績' },
    { id: 'movie', label: '注目作品' },
    { id: 'introduction', label: '自己紹介' },
    { id: 'music', label: '料金' },
    { id: 'character', label: '制作の流れ' },
    { id: 'staffcast', label: 'お問い合わせ' }
  ],
  socials: [
    { label: 'X', url: 'https://x.com/okiaoki74', targetBlank: true },
    { label: 'GitHub', url: 'https://github.com/Okiaoki', targetBlank: true },
    { label: 'LinkedIn', url: 'https://www.linkedin.com', targetBlank: true }
  ],
  footerBanners: [
    { image: 'assets/img/work-cafeaoki.jpg', url: 'https://okiaoki.github.io/cafe-aoki/', targetBlank: true },
    { image: 'assets/img/work-AokiFamilyEnglish.jpg', url: 'https://okiaoki.github.io/aoki-family-english/', targetBlank: true },
    { image: 'assets/img/work-AokiDesignStudio.jpg', url: 'https://okiaoki.github.io/aoki-design-studio/', targetBlank: true }
  ],
  pages: {
    131: {
      acf: {
        fv_bnrlists: [
          { fv_bnrimg: 'assets/img/work-cafeaoki.jpg', fv_bnrurl: 'https://okiaoki.github.io/cafe-aoki/', fv_bnrtarget: true },
          { fv_bnrimg: 'assets/img/work-AokiFamilyEnglish.jpg', fv_bnrurl: 'https://okiaoki.github.io/aoki-family-english/', fv_bnrtarget: true },
          { fv_bnrimg: 'assets/img/work-AokiDesignStudio.jpg', fv_bnrurl: 'https://okiaoki.github.io/aoki-design-studio/', fv_bnrtarget: true }
        ]
      }
    }
  },
  posts: [
    { id: 1, date: '2026-02-14T12:00:00+09:00', title: { rendered: 'Aoki制作実績を反映してポートフォリオを更新しました' }, link: '#movie' },
    { id: 2, date: '2026-02-10T12:00:00+09:00', title: { rendered: '制作実績セクションを4件構成に刷新しました' }, link: '#news' },
    { id: 3, date: '2026-02-03T12:00:00+09:00', title: { rendered: '料金とお問い合わせ導線を更新しました' }, link: '#music' }
  ],
  movie: [
    { id: 1, title: { rendered: 'Cafe Aoki' }, acf: { youtube_id: '' }, url: 'https://okiaoki.github.io/cafe-aoki/', image: 'assets/img/work-cafeaoki.jpg' },
    { id: 2, title: { rendered: 'Aoki Family English' }, acf: { youtube_id: '' }, url: 'https://okiaoki.github.io/aoki-family-english/', image: 'assets/img/work-AokiFamilyEnglish.jpg' },
    { id: 3, title: { rendered: 'Aoki Design Studio' }, acf: { youtube_id: '' }, url: 'https://okiaoki.github.io/aoki-design-studio/', image: 'assets/img/work-AokiDesignStudio.jpg' }
  ],
  mv: [
    { id: 1, title: { rendered: 'Cafe Aoki LP' }, acf: { mv_ytid: '', mv_url: 'https://okiaoki.github.io/cafe-aoki/', mv_thumb: { sizes: { large: 'assets/img/work-cafeaoki.jpg' } } } },
    { id: 2, title: { rendered: 'Aoki Family English LP' }, acf: { mv_ytid: '', mv_url: 'https://okiaoki.github.io/aoki-family-english/', mv_thumb: { sizes: { large: 'assets/img/work-AokiFamilyEnglish.jpg' } } } },
    { id: 3, title: { rendered: 'Aoki Design Studio LP' }, acf: { mv_ytid: '', mv_url: 'https://okiaoki.github.io/aoki-design-studio/', mv_thumb: { sizes: { large: 'assets/img/work-AokiDesignStudio.jpg' } } } },
    { id: 4, title: { rendered: 'AokiCosmetic (WordPress Theme)' }, acf: { mv_ytid: '', mv_url: 'https://github.com/Okiaoki/aokicosmetic-wp', mv_thumb: { sizes: { large: 'assets/img/work-aokicosmetic-fv.png' } } } }
  ],
  portfolio: {
    leadJa: 'ストーリー性と実装力を軸にした、UIとコーディング重視のポートフォリオです。',
    heroDateJa: '更新日: 2026年2月16日',
    heroDateEn: 'Aoki Portfolio',
    about: {
      title: '私について',
      text: 'HTML / CSS / JavaScript を用いたLPサイト制作を行っています。\nデザインの忠実な再現にとどまらず、表示パフォーマンス・可読性・保守性まで考慮した設計を重視しています。\n\nまた、静的LPの構築から WordPress への移行・テーマ化まで一貫して対応可能です。\n制作後の運用効率や拡張性を見据え、実務に耐える構成で実装いたします。',
      sub: 'HTML / CSS / JavaScript / WordPress / Figma'
    },
    story: {
      title: '強みとスタイル',
      catch: 'デザインから実装まで一貫して対応します。',
      text: '目的を明確化したうえで情報設計を行い、成果導線を意識したページ構成へと落とし込みます。\n軽量かつ保守性の高いフロントエンドを実装し、運用フェーズまで見据えた構造で構築します。\n\n静的コーディングに加え、WordPressテーマ化やコンポーネント設計にも対応可能です。'
    },
    pricing: [
      'ランディングページのデザイン・実装: 50,000円〜',
      'JavaScript演出を含むランディングページ: 70,000円〜',
      'WordPressテーマのカスタマイズ: 100,000円〜',
      '保守・月次更新: 月額10,000円〜'
    ],
    process: [
      { step: '01', title: 'ヒアリング', text: '目的・制約・参考情報を整理して、対応範囲を明確化します。' },
      { step: '02', title: '設計', text: 'レスポンシブ対応を前提に、構成とビジュアル方針を設計します。' },
      { step: '03', title: '実装', text: 'セマンティックなHTML、拡張しやすいCSS、必要なJSで構築します。' },
      { step: '04', title: '公開', text: '公開後の確認、運用引き継ぎ、更新フローまで整備します。' }
    ],
    contact: {
      lead: '新規制作や既存サイト改善のご相談をお気軽にどうぞ。',
      x: 'https://x.com/okiaoki74',
      github: 'https://github.com/Okiaoki',
      form: 'https://formspree.io/f/xdkwllne'
    },
    works: [
      {
        title: 'Cafe Aoki',
        meta: 'カフェ向けLPの設計とフロントエンド実装',
        url: 'https://okiaoki.github.io/cafe-aoki/',
        image: 'assets/img/work-cafeaoki.jpg'
      },
      {
        title: 'Aoki Family English',
        meta: '教育サービス向けLPと情報設計',
        url: 'https://okiaoki.github.io/aoki-family-english/',
        image: 'assets/img/work-AokiFamilyEnglish.jpg'
      },
      {
        title: 'Aoki Design Studio',
        meta: '実績訴求を重視したスタジオサイト',
        url: 'https://okiaoki.github.io/aoki-design-studio/',
        image: 'assets/img/work-AokiDesignStudio.jpg'
      },
      {
        title: 'AokiCosmetic',
        meta: 'WordPressテーマ開発プロジェクト',
        url: 'https://github.com/Okiaoki/aokicosmetic-wp',
        image: 'assets/img/work-aokicosmetic-fv.png'
      }
    ]
  },
  comments: {
    defaultHtml: '<div class="commentTpl"><p>このポートフォリオでは旧コメントページを使用していません。</p></div>'
  }
};
