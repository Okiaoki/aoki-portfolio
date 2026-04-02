# CLAUDE.md — AKASHIKI Portfolio 全面改修

## プロジェクト概要
灯敷（AKASHIKI）ポートフォリオサイトの全面改修。6ページ構成、モノトーン（白×黒）、GSAP + CSS 3D。
公開URL: https://sumiyakaa.github.io/portfolio/

## 核心テーマ（全実装判断の最上位基準）
「表面はモノトーンで静寂。しかし裏では精密な機械が静かに駆動している」
- アニメーションは「ふわっ」ではなく「機械的に精密」
- イージング標準: `cubic-bezier(0.16, 1, 0.3, 1)`
- 速度は全体的にゆっくり（duration 1.0s〜1.5s 基準）
- グリッチ・スキャンラインは極めて限定的に使用

## 品質基準（実装前に必読）
1. CSS/JSの行数制限なし。品質のために量を書く
2. レスポンシブ: PC(1280+) / タブレット(768-1279) / SP(-767)
3. Lighthouse Performance 90+ を目指す
4. 画像: WebP, 各500KB以下
5. GSAP fromTo() で明示的 from 状態を常に指定（tween競合防止）
6. カウントアップ横並び不使用（数字は静かに出現）

## ホバー・アニメーション基準値
- テキストリンク hover: color transition 0.3s
- ボタン hover: background 1段階明るく, transition 0.3s
- カード hover: border-color 微増, transition 0.3s
- スクロール出現: opacity 0→1, y 20→0, duration 1.2s
- テキスト stagger: 0.08s
- 水平ライン伸長: scaleX 0→1, duration 0.8s
- ページ遷移: clip-path inset, duration 0.5s
- リーダーライン: stroke-dashoffset, duration 0.8s
- タイピング: 1文字 60ms

## フォント
- 欧文: Barlow (100/200/300/400/600/800)
- 和文: Noto Sans JP (100/300/400/500/700)
- アクセント: IBM Plex Mono (300/400)

## カラー（CSS変数で管理）
```css
:root {
  --c-black: #0a0a0a;
  --c-white: #f5f5f5;
  --c-pure-black: #000;
  --c-pure-white: #fff;
  --c-gray-900: #111;
  --c-gray-800: #1a1a1a;
  --c-gray-600: #444;
  --c-gray-400: #666;
  --c-gray-300: #999;
  --c-gray-200: #ccc;
  --c-gray-100: #e5e5e5;
}
```

## セクション白黒反転ルール
- 黒背景: text #f5f5f5, sub #666, border #1a1a1a
- 白背景: text #111, sub #999, border #e0e0e0
- セクションごとに交互に反転

## ファイル構造
```
index.html / about.html / service.html / works.html / contact.html / privacy.html
assets/css/ → reset.css, variables.css, base.css, header.css, footer.css, transition.css, [page].css
assets/js/ → common.js, [page].js
assets/img/ → works/, hero/, ogp/, common/
```

## 設計書参照先
- Vol.1: 全体設計（テーマ・フォント・カラー・共通パーツ）
- Vol.2: index.html（FV・Works・料金）
- Vol.3: about.html + service.html
- Vol.4: works.html + contact.html

## 実装時の絶対ルール
1. 設計書の仕様に忠実に実装する。迷った場合は設計書を再読
2. FVのGSAP実行順序を厳守: splash完了→revealAndBind()→gsap.set→entrance→onComplete→bindScroll()
3. .fv__sticky の overflow は visible（hidden禁止）
4. fromTo() のみ使用、gsap.to() 単体禁止（opacity キャプチャバグ防止）
5. ページ遷移: sessionStorage管理、直アクセス時はアニメなし
6. SP: 光オーブ非表示、ハンバーガーメニュー、リーダーライン非表示
7. 画像: loading="lazy" + decoding="async"（FV画像除く）
8. semantic HTML厳守（header/main/section/article/footer）

## 完了報告時の自己診断（11項目）
1. 全ページレスポンシブ確認（PC/タブレット/SP）
2. ヘッダー表示/非表示の挙動確認
3. ページ遷移トランジション動作確認
4. FV アニメーション完走確認
5. Works ホバー演出（リーダーライン・タイピング）確認
6. フォームバリデーション + 送信テスト
7. Lighthouse スコア確認
8. 画像最適化確認（WebP, 500KB以下）
9. OGP + 構造化データ確認
10. 内部リンク全通確認
11. SP ハンバーガーメニュー開閉確認
