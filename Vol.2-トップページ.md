# AKASHIKI Portfolio 全面改修 — 設計書 Vol.2
## トップページ（index.html）詳細設計

---

## 1. ページ構成概要

```
[スプラッシュスクリーン]
↓
[Hero FV — 100vh sticky + 100vh スクロール]
↓
[Works セクション — 案D 片寄せ（黒背景）]
↓
[料金ダイジェスト（白背景）]
↓
[CTA — 完成後に入れるか判断]
↓
[フッター]
```

白黒反転リズム：スプラッシュ(黒) → FV(黒) → Works(黒) → 料金(白) → フッター(黒)

---

## 2. スプラッシュスクリーン

### 演出シーケンス
1. 画面中央に1pxの垂直ライン出現、上下に同時伸長（duration 0.8s）
2. ライン中央から「AKASHIKI」がレタースペーシングアニメで出現
   - 初期: letter-spacing 1em, opacity 0 → 最終: letter-spacing 0.25em, opacity 1
   - Barlow weight 200, font-size clamp(32px, 5vw, 64px)
   - duration 1.0s, delay 0.4s
3. 全体がフェードアウト（opacity 1→0, duration 0.6s, delay 0.8s）
4. clip-path: inset(0) → inset(50% 0) で中央に収束して消滅（duration 0.6s）

### 技術仕様
- position: fixed, inset: 0, z-index: 9999
- 背景: #000000
- GSAP timeline で全ステップを順序制御
- アニメーション完了後に DOM から remove（パフォーマンス）
- スプラッシュ中はスクロールロック（body overflow: hidden）
- 再訪問時はスキップ（sessionStorage フラグ管理）

---

## 3. Hero FV（First View）

### 3-1. レイヤー構造

```
z-index 順（下→上）:
1. 背景レイヤー（グレイン + ラジアルグラデ + 光オーブ）
2. 3D空間コンテナ（perspective: 2000px）
3. テキスト群（各要素が異なる translateZ に配置）
4. コーナーフレーム + エッジテキスト
5. スキャンラインオーバーレイ（pointer-events: none）
```

### 3-2. 背景レイヤー

**フィルムグレイン：**
```css
background-image: url("data:image/svg+xml,..."); /* SVG feTurbulence */
animation: grain 0.5s steps(5) infinite;
opacity: 0.04; /* 極めて薄く */
```

**ラジアルグラデ光源：**
```css
background: radial-gradient(ellipse at 30% 40%, rgba(255,255,255,0.03) 0%, transparent 60%);
```

**マウス追従光オーブ（3個）：**
- border-radius: 50%, filter: blur(80px)
- サイズ: 200px / 150px / 100px
- opacity: 0.02 / 0.015 / 0.01（非常に薄く）
- マウス座標に対して各オーブが異なる遅延で追従（lerp 0.03 / 0.05 / 0.08）
- SP: 光オーブ非表示（パフォーマンス）

### 3-3. テキストアニメーション

**出現順序（スプラッシュ完了後に revealAndBind() 実行）：**

```
1. gsap.set() で全要素に visibility:visible + opacity:0
2. entrance timeline 開始（stagger 付き）:
   - メインレター「WEB DESIGN & DEVELOPMENT」Barlow weight 100, clamp(48px, 8vw, 120px)
     translateZ(100px), opacity 0→1, duration 1.4s
   - サブコピー「DESIGNED WITH PRECISION」Barlow weight 300, 16px
     translateZ(60px), delay 0.3s
   - 和文「— 静寂の裏に、精密な機械。」Noto Sans JP weight 300, 13px
     translateZ(40px), delay 0.5s
   - 水平ライン（幅200px, 1px solid #333）scaleX(0→1), delay 0.6s
   - エッジテキスト（画面端に配置）IBM Plex Mono, 9px
     左下: 「PORTFOLIO 2026」
     右下: 「TOKYO, JAPAN」
     delay 0.8s
   - コーナーフレーム（四隅の L字ライン）stroke-dashoffset アニメ, delay 1.0s
3. onComplete で bindScroll() 実行
```

**重要：** この実行順序（splash完了→revealAndBind()→gsap.set→entrance→onComplete→bindScroll()）が崩れると opacity キャプチャバグが再発する。

### 3-4. 3D パララックス

**CSS設定：**
```css
.fv__container {
  perspective: 2000px;
  perspective-origin: 50% 50%;
}
.fv__sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: visible; /* hidden だと translateZ でクリッピング消失 */
}
```

**スクロール挙動：**
- スクロール量: 200vh（FV sticky 100vh + 100vh分のスクロールでフェードアウト）
- ScrollTrigger: start `'15% top'`（即座にアニメ開始しない余白を確保）
- fromTo() で明示的 from 状態指定
- 各要素が異なる速度で translateY + translateZ 変化（多層パララックス）
- 3D空間全体の微傾斜: スクロールで `rotateX(3deg) rotateY(-1.5deg)`
- フェードアウト: スクロール後半で全要素 opacity 1→0

**Z座標配置：**
| 要素 | translateZ |
|------|-----------|
| メインレター | 100px |
| サブコピー | 60px |
| 和文 | 40px |
| 水平ライン | 20px |
| エッジテキスト | -20px |
| コーナーフレーム | -40px |
| グレインオーバーレイ | 0px（固定） |

---

## 4. Works セクション（案D — 極端な片寄せ）

### 4-1. レイアウト

```
|                                              |  [thumb1]  |
|  「SELECTED」or 作品名タイピング              |  [thumb2]  |
|  （画面左70%）                               |  [thumb3]  |
|                                              |            |
```

- 背景: #0a0a0a
- padding: 120px 80px
- display: grid, grid-template-columns: 1fr 300px, gap: 0

### 4-2. 掲載作品（固定3件）

| # | 作品名 | ジャンル | ページ数 |
|---|--------|---------|---------|
| 1 | Bistro Aoki | レストランLP | 5P |
| 2 | AOKI GYM | フィットネスLP | 5P |
| 3 | J. Caldwell & Sons | ヴィンテージワークウェア | 5P・2言語 |

### 4-3. サムネイル仕様

- サイズ: 280px × 180px
- border: 1px solid #1a1a1a
- border-radius: 0（角丸なし、シャープ）
- 縦積み、gap: 12px
- overflow: hidden
- **マウスホバーでサムネ内のスクショが自動スクロール**
  - 画像は作品のフルページスクショ（縦長）
  - ホバー時に translateY でゆっくり下方向にスクロール
  - duration: 画像高さに比例（3〜6秒）
  - ease: none（等速）
  - ホバー解除: translateY: 0 に戻る（duration 0.5s）

### 4-4. デフォルト状態（ホバーなし）

- 左エリアに「SELECTED」を表示
- Barlow weight 100, font-size clamp(48px, 6vw, 96px), letter-spacing 0.15em
- color: #fff
- opacity が sin波でじんわりパルスアニメーション
  - 中心値: 0.15、振幅: ±0.07（0.08〜0.22の範囲）
  - gsap.to + repeat:-1 + yoyo:true + ease: 'sine.inOut' + duration: 3s

### 4-5. ホバー時の演出（サムネイルにマウスオン）

**演出シーケンス：**
1. サムネイルの border-color: #1a1a1a → #444、テキスト明度UP
2. リーダーラインがサムネイルからタイポエリアに向けて SVG stroke-dashoffset アニメで伸長
   - duration: 0.8s（デモより遅く）
   - ease: `cubic-bezier(0.16, 1, 0.3, 1)`
3. ライン到着後、同座標上に2本目の破線ライン出現
   - stroke-dasharray: 4 12
   - stroke-dashoffset を連続アニメで流す（通信ケーブル風の光が走る演出）
   - duration: 2s, repeat: -1, ease: none（等速で流れ続ける）
4. 同時に「SELECTED」が display:none → 作品名がタイピングアニメーションで出現
   - 1文字ずつ DOM 追加
   - カーソル（border-right: 2px solid #fff）付き
   - 1文字あたり 60ms（デモの45msから遅く調整）
   - Barlow weight 200, font-size clamp(36px, 5vw, 72px)
5. タイピング完了後にサブテキスト出現（ジャンル / ページ数）
   - Barlow weight 400, 13px, color #666
   - opacity 0→1, duration 0.4s

### 4-6. ホバー解除

- 全アニメーション即リセット
- 作品名テキスト消去 → 「SELECTED」パルスに復帰
- リーダーライン非表示
- transition なし（機械的スイッチOFF）

### 4-7. リーダーライン仕様

- SVG `<line>` を3本分用意（各サムネイルに対応）
- 常に1本だけ表示（ホバー中のサムネイルに対応する1本のみ）
- 他2本は `visibility: hidden`
- 始点: サムネイル左端の垂直中央
- 終点: タイポエリアの作品名表示位置
- stroke: #fff, strokeWidth: 1

### 4-8. 「もっと見る」導線

- Worksセクション右下に小さなリンク
- 「VIEW ALL WORKS →」Barlow weight 400, 12px, letter-spacing 0.1em, color #444
- ホバー: color #fff
- works.html へ遷移（ページ遷移トランジション付き）

### 4-9. SP対応（768px以下）

- レイアウト変更: 片寄せ → 縦積み
- サムネイル: 幅100%, 3枚縦積み
- リーダーライン: 非表示（SPでは不要）
- タイピングアニメ: サムネイルタップで作品名を下部に表示
- 「SELECTED」パルス: 非表示

---

## 5. 料金ダイジェストセクション

### 5-1. レイアウト

- **白背景セクション**（黒から反転）
- padding: 160px 80px
- max-width: 制限なし（画面幅100%）

### 5-2. コンテンツ構成

```
PRICE
—————————————————

LP DESIGN                    ¥150,000〜
静的コーディング / レスポンシブ対応

WORDPRESS                    ¥200,000〜
テーマ構築 / カスタマイズ

                            → VIEW DETAILS
```

**タイポ設計：**
- セクションタイトル「PRICE」: Barlow weight 200, 48px, letter-spacing 0.2em, color #111
- 水平ライン: 1px solid #e0e0e0, width 40px
- サービス名: Barlow weight 300, 24px, letter-spacing 0.1em, color #111
- 価格: Barlow weight 600, 24px, color #111（右寄せ）
- 説明: Noto Sans JP weight 300, 12px, color #999
- リンク「VIEW DETAILS →」: Barlow weight 400, 12px, color #999, ホバーで #111

**レイアウト方式：**
- 2つの料金項目を縦に並べる（間に1px solid #e0e0e0 の区切り線）
- 各項目は display: flex, justify-content: space-between
- 左にサービス名+説明、右に価格
- 最下部にリンク（将来的にはFinder、現在はcontact.htmlへ）

### 5-3. スクロールアニメーション

- セクションタイトル: スクロールインで opacity 0→1, y 20→0（duration 1.0s）
- 水平ライン: scaleX 0→1（duration 0.8s, delay 0.2s）
- 各料金項目: stagger 0.15s で順次出現
- 価格テキスト: 数字がカウントアップではなく、opacity 0→1 で静かに出現（カウントアップ横並び不使用ルール厳守）

---

## 6. CTA セクション

**現時点では保留。** トップページ完成後にデザイン性を見て、入れるか入れないかを判断する。

入れる場合の想定：
- 黒背景
- 「お気軽にご相談ください」Noto Sans JP weight 300 + 「CONTACT →」Barlow weight 400
- シンプルな1行テキスト + リンク
- contact.html へ遷移

---

**Vol.2 完了。Vol.3（about.html + service.html）に続く。**
