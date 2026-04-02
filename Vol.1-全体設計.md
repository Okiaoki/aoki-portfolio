# AKASHIKI Portfolio 全面改修 — 設計書 Vol.1
## 全体設計

作成日：2026/04/02
作成者：Claude（chat）
対象：https://sumiyakaa.github.io/portfolio/

---

## 1. 改修の目的

現在制作しているサイト群（Caldwell, Atelier, Beauty Clinic No2等）の品質水準と、ポートフォリオ自体の品質が乖離している。トップページから下層セクションまで全面改修し、1ページ構成→6ページ構成に刷新する。

---

## 2. 核心テーマ（全設計判断の最上位基準）

**「表面はモノトーンで静寂。しかし裏では精密な機械が静かに駆動している」**

UI参考：ゼンレスゾーンゼロ（HoYoverse）のUI設計言語
- レトロフューチャー的テレビ画面モチーフ → モノトーンに翻訳
- グリッチ → 極めて抑制的な白黒RGBズレ（ホバー・遷移時のみ、一瞬）
- スキャンライン → 薄い水平線オーバーレイ（背景テクスチャ）
- パネル配置 → ボーダーラインで区切られた情報ブロック
- デジタル感 → letter-spacing広めのモノスペースをアクセントに

**安っぽくならないための制約：**
- グリッチ・グレイン・スキャンラインの使用頻度を厳密に抑制する
- 全面的に使うのではなく、ごく一部（FVスプラッシュ、ホバー、遷移）に限定
- 「静寂の中に確かに機械がある」感覚 ＝ 99%の静けさ + 1%の精密な動き

**このテーマが反映される全場面：**
- ページ遷移：画面が静かにクリップされ、次ページが機械的に精密なタイミングでスライドイン
- スクロール連動：要素が「ふわっ」ではなく、工業的なイーズ（cubic-bezier）で正確に動く
- リーダーライン：通信ケーブル風の光がデータ転送を暗示
- FVスプラッシュ：垂直ラインの伸長が起動シーケンスを想起させる
- ホバーエフェクト：状態変化がスイッチの切り替えのように明確で一瞬
- イージング基準値：`cubic-bezier(0.16, 1, 0.3, 1)`（機械的だが滑らか）

---

## 3. ページ構成

| # | ファイル | ページ名 | Phase |
|---|---------|---------|-------|
| 1 | index.html | トップページ | Phase 1 |
| 2 | about.html | 自己紹介 | Phase 2 |
| 3 | service.html | サービス | Phase 2 |
| 4 | works.html | 実績一覧 | Phase 3 |
| 5 | contact.html | お問い合わせ | Phase 3 |
| 6 | privacy.html | プライバシーポリシー | 既存維持 |

---

## 4. ブランド表記の階層

| 場所 | 表記 |
|------|------|
| ヘッダーロゴ | AKASHIKI（のみ） |
| FVスプラッシュ | AKASHIKI（起動シーケンスの主役） |
| aboutページFV | SUMIYAKA — 墨家（個人フォーカス） |
| フッター | AKASHIKI（大）+ SUMIYAKA — 墨家（小）併記 |
| © 表記 | © 2026 AKASHIKI |

---

## 5. フォント設計

### 5-1. フォントファミリー

| 用途 | フォント | 読み込みウェイト |
|------|---------|----------------|
| 欧文メイン | Barlow | 100, 200, 300, 400, 600, 800 |
| 和文メイン | Noto Sans JP | 100, 300, 400, 500, 700 |
| アクセント（番号・ステータス） | IBM Plex Mono | 300, 400 |

Google Fonts CDN使用。

### 5-2. タイポグラフィスケール

| 要素 | フォント | weight | size | letter-spacing | 用途 |
|------|---------|--------|------|---------------|------|
| ブランド名 | Barlow | 200 | 64px〜120px | 0.25em | FVスプラッシュ、ページ見出し |
| セクション見出し | Barlow | 300 | 42px〜64px | 0.15em | SELECTED WORKS等 |
| サブ見出し | Barlow | 600 | 18px〜24px | 0.08em | 料金、カテゴリ名 |
| ナビゲーション | Barlow | 400 | 13px | 0.12em | ヘッダーナビ |
| インデックス番号 | IBM Plex Mono | 300 | 9px〜11px | 0.1em | セクション番号、スキル番号 |
| 和文本文 | Noto Sans JP | 300 | 15px | 0.04em | 経歴、説明文 |
| 和文補助 | Noto Sans JP | 300 | 11px〜12px | 0.02em | スキル説明、注釈 |

line-height基準：欧文 1.4〜1.6 / 和文 2.0〜2.2

---

## 6. カラー設計

### 6-1. 基本パレット

```
--c-black: #0a0a0a;        /* メイン背景（黒セクション） */
--c-white: #f5f5f5;        /* メイン背景（白セクション） */
--c-pure-black: #000000;   /* FVスプラッシュ背景 */
--c-pure-white: #ffffff;   /* テキスト（黒背景上） */
--c-gray-900: #111111;     /* ホバー背景 */
--c-gray-800: #1a1a1a;     /* ボーダー、グリッド線 */
--c-gray-600: #444444;     /* 補助テキスト（黒背景上） */
--c-gray-400: #666666;     /* セクションラベル */
--c-gray-300: #999999;     /* 技術名、ナビテキスト */
--c-gray-200: #cccccc;     /* メインテキスト（黒背景上） */
--c-gray-100: #e5e5e5;     /* メインテキスト（白背景上、反転時） */
```

### 6-2. セクション白黒反転リズム

NOT A HOTEL ARCHITECTS方式。セクションごとに背景色を黒⇔白で反転し、テキストカラーも連動して反転する。

```
セクション1（黒背景）→ セクション2（白背景）→ セクション3（黒背景）→ ...
```

反転時のテキストカラー対応：
- 黒背景: テキスト #f5f5f5、補助 #666、ボーダー #1a1a1a
- 白背景: テキスト #111、補助 #999、ボーダー #e0e0e0

### 6-3. アクセントカラー

**原則なし。** モノトーン厳守。唯一の例外はリーダーラインの通信ケーブル演出で、白(#fff)の輝度変化のみ許容。カラフルな要素は一切入れない。

---

## 7. 共通パーツ

### 7-1. ヘッダー（A案：スマートヘッダー）

**表示条件：**
- FV（Hero）では非表示
- Hero通過後（スクロール量 > 100vh）で `translateY(-100%)` → `translateY(0)` で上から降下出現
- 以降、下スクロールで隠れ、上スクロールで再出現
- transition: `transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)`

**デザイン：**
- 高さ: 60px
- 背景: `backdrop-filter: blur(12px)` + `rgba(10, 10, 10, 0.85)`
- 下ボーダー: 1px solid #1a1a1a
- ロゴ（左）: 「AKASHIKI」Barlow weight 300, 13px, letter-spacing 0.2em
- ナビ（右）: ABOUT / SERVICE / WORKS / CONTACT — Barlow weight 400, 12px, letter-spacing 0.12em, gap 40px
- ホバー: テキストカラー #666 → #fff、transition 0.3s
- SP（768px以下）: ハンバーガーアイコン（右上固定）、タップでフルスクリーンメニュー

**フルスクリーンメニュー（SP）：**
- 背景: #000 opacity 0.98
- 中央にナビリンク縦並び、Barlow weight 200, 32px, letter-spacing 0.2em
- 下部に「AKASHIKI」ロゴ小
- 開閉: clip-path inset アニメーション（起動シーケンステーマ）

### 7-2. フッター

**レイアウト：**
- 背景: #0a0a0a
- padding: 80px
- 上ボーダー: 1px solid #1a1a1a

**コンテンツ配置（2カラム）：**
- 左エリア:
  - 「AKASHIKI」Barlow weight 200, 36px, letter-spacing 0.2em
  - その下に「SUMIYAKA — 墨家」Noto Sans JP weight 300, 11px, color #444
- 右エリア:
  - ナビリンク（ABOUT / SERVICE / WORKS / CONTACT）Barlow weight 400, 12px, 縦並び, gap 16px
  - SNSリンク（X / GitHub）IBM Plex Mono, 11px

**最下部：**
- `© 2026 AKASHIKI` IBM Plex Mono weight 300, 10px, color #333
- 「PRIVACY POLICY」リンク（右寄せ）

---

## 8. ページ遷移トランジション

**方式：** サイネージチック — 起動シーケンステーマ

**遷移演出：**
1. リンククリック → 現ページ上に黒オーバーレイが `clip-path: inset(50% 0)` → `inset(0)` で中央から上下に展開（0.5s）
2. オーバーレイ中央に水平ラインが `scaleX(0)` → `scaleX(1)` で伸長（0.3s、ディレイ0.2s）
3. ページ遷移実行（通常ナビゲーション）
4. 新ページロード後、黒オーバーレイが `inset(0)` → `inset(50% 0)` で中央に収束して消滅（0.5s）

**技術実装：**
- JavaScriptでリンククリックを `preventDefault` → アニメーション → `window.location` で遷移
- 新ページ側は `DOMContentLoaded` で逆アニメーション実行
- sessionStorageで遷移元を管理（直アクセス時はアニメなし）

---

## 9. アニメーション設計指針

### 9-1. 全体方針
- 速度：デモ版より全体的にゆっくり（1.2〜1.8倍の duration）
- イージング標準値：`cubic-bezier(0.16, 1, 0.3, 1)`（機械的だが滑らか）
- GSAP `fromTo()` を使用し、明示的 from 状態を指定（tween競合防止）
- CSS/JSの行数制限なし。モリモリで書いた上で軽量化

### 9-2. スクロール連動アニメーション
- GSAP ScrollTrigger + scrub で実装
- start/end はセクションごとに明示指定（`'top 80%'` 等）
- 出現アニメ基本パターン：`opacity: 0, y: 30` → `opacity: 1, y: 0`（duration 1.2s）
- テキスト出現：スタガー（stagger 0.08s）で1要素ずつ
- 水平ライン伸長：`scaleX(0)` → `scaleX(1)`、transform-origin: left

### 9-3. ホバーエフェクト標準
- テキストリンク：color transition 0.3s、#666 → #fff（黒背景）/ #999 → #111（白背景）
- ボタン・カード：背景色が1段階明るくなる（#0a0a0a → #111）、transition 0.3s
- グリッチ禁止場所：本文テキスト、ナビゲーション（可読性優先）
- グリッチ許容場所：FVスプラッシュ直後、ページ遷移オーバーレイ、Works リーダーライン

### 9-4. ZZZ的演出の使用箇所（厳密に限定）
- スキャンラインオーバーレイ：FV背景のみ（SVG feTurbulence + CSS steps アニメ）
- 微細グリッチ：ページ遷移時の水平ライン上（0.1秒間だけ RGB 1pxズレ）
- デジタルタイプ：IBM Plex Mono のインデックス番号・ステータステキストのみ
- パネル区切り：スキルセクション、料金セクションのグリッドライン

---

## 10. SEO / AIO 標準実装（裏側、全ページ共通）

### SEO
- semantic HTML（header / main / section / article / footer）
- 各ページ適切な `<title>` + `<meta name="description">`
- OGP設定（og:title, og:description, og:image, og:url, og:type）
- 構造化データ（JSON-LD）: Person + Organization + WebSite
- 画像 alt 属性（全画像に意味のある代替テキスト）
- 内部リンク構造の明示設計
- sitemap.xml

### AIO（AI検索最適化）
- 明確な Q&A 構造：検索者の意図に直接答える構成
- エンティティの明確化：JSON-LD で「灯敷（AKASHIKI）」が何者で何ができるかを機械可読に
- FAQ 構造化データ：service.html の制作の流れ・オプション説明を FAQ Schema で記述
- ページ間の相互参照：about ↔ service ↔ works の内部リンクを明示設計

---

## 11. 技術スタック

### 基盤
- HTML5 / CSS3 / JavaScript（ES6+）
- GSAP 3.12.5 + ScrollTrigger（CDN: cdnjs.cloudflare.com）
- CSS 3D Transform（perspective + preserve-3d + translateZ）
- Formspree（contact.html）
- GitHub Pages（ホスティング）

### CDN読み込み
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@100;200;300;400;600;800&family=Noto+Sans+JP:wght@100;300;400;500;700&family=IBM+Plex+Mono:wght@300;400&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
```

### ファイル構成

```
Sumiyaka-Portfolio/
├── index.html
├── about.html
├── service.html
├── works.html
├── contact.html
├── privacy.html
├── manifest.webmanifest
├── sitemap.xml
├── assets/
│   ├── css/
│   │   ├── reset.css          （リセット）
│   │   ├── variables.css      （CSS変数定義）
│   │   ├── base.css           （共通スタイル）
│   │   ├── header.css         （ヘッダー）
│   │   ├── footer.css         （フッター）
│   │   ├── transition.css     （ページ遷移）
│   │   ├── index.css          （トップ固有）
│   │   ├── about.css          （about固有）
│   │   ├── service.css        （service固有）
│   │   ├── works.css          （works固有）
│   │   └── contact.css        （contact固有）
│   ├── js/
│   │   ├── common.js          （ヘッダー/遷移/共通）
│   │   ├── index.js           （トップ固有）
│   │   ├── about.js           （about固有）
│   │   ├── service.js         （service固有）
│   │   ├── works.js           （works固有）
│   │   └── contact.js         （contact固有）
│   └── img/
│       ├── works/             （作品サムネイル）
│       ├── hero/              （FV用画像・動画）
│       ├── ogp/               （OGP画像）
│       └── common/            （ロゴ、favicon等）
└── CLAUDE.md
```

---

## 12. レスポンシブ設計

### ブレイクポイント
- PC: 1280px〜（基準）
- タブレット: 768px〜1279px
- SP: 〜767px

### SP対応方針
- ヘッダー → ハンバーガー + フルスクリーンメニュー
- FVタイポ → font-size を vw 単位で可変（clamp 使用）
- Works片寄せレイアウト → 縦積みに変更
- グリッド → 1カラムに折り返し
- ページ遷移アニメーション → 同一演出を維持（軽量化のため duration 短縮）

---

## 13. パフォーマンス目標

- Lighthouse Performance: 90+
- FCP（First Contentful Paint）: < 1.5s
- LCP（Largest Contentful Paint）: < 2.5s
- CLS（Cumulative Layout Shift）: < 0.1
- 画像: WebP形式、各500KB以下
- GSAP読み込み: defer属性
- フォント: `font-display: swap`

---

**Vol.1 完了。Vol.2（トップページ詳細設計）に続く。**
