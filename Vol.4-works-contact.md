# AKASHIKI Portfolio 全面改修 — 設計書 Vol.4
## works.html + contact.html 詳細設計

---

# PART A: 実績一覧ページ（works.html）

---

## 1. ページ構成

```
[FV — 100vh 全画面]
↓
[絞り込みフィルター（黒背景）]
↓
[作品一覧グリッド（黒背景、フィルターと連続）]
↓
[フッター]
```

白黒反転リズム：FV(黒) → 一覧(黒、全面黒で統一) → フッター(黒)
※このページは全面黒。作品サムネイルが唯一の「光」として浮かぶ構成。

---

## 2. FV（100vh全画面）

### デザイン
- 背景: #0a0a0a
- メイン: 「WORKS」Barlow weight 100, clamp(48px, 8vw, 120px), letter-spacing 0.25em
- サブ: 「すべての制作実績」Noto Sans JP weight 300, 13px, color #666
- 作品総数: IBM Plex Mono, 11px, color #333（例: 「12 PROJECTS」）
- 水平ライン + エッジテキスト（共通パターン）
- 背景: フィルムグレイン + スキャンライン

### アニメーション
- 他ページFVと同一パターン

---

## 3. 絞り込みフィルター

### レイアウト
- padding: 0 80px 40px
- 1行に横並び、左寄せ

### フィルターボタン

```
ALL / LP / CORPORATE / MULTI-LANG / WORDPRESS
```

- Barlow weight 400, 12px, letter-spacing 0.1em
- デフォルト: color #444
- アクティブ: color #fff + 下線（1px solid #fff, padding-bottom 4px）
- ホバー: color #999
- transition: 0.3s
- gap: 32px

### フィルタリング動作
- JavaScript で DOM フィルタリング（ページリロードなし）
- 切り替え時: 該当しないカードが opacity 1→0（0.3s）→ display:none → 該当カードが opacity 0→1（0.3s）
- 機械的な切り替え感を意識（ふわっとしない、パチッと切り替わる）

---

## 4. 作品一覧グリッド

### レイアウト
- display: grid
- grid-template-columns: repeat(3, 1fr)（PC）
- gap: 1px（グリッドライン = パネル区切り、ZZZテーマ）
- 背景色: #1a1a1a（gap部分に見える色 = グリッドライン）

### 作品カード仕様

```
┌──────────────────────────────┐
│                              │
│   [サムネイル — 自動スクロール] │
│                              │
├──────────────────────────────┤
│ 01   BISTRO AOKI             │
│      Restaurant LP / 5P      │
│      2026.03                 │
└──────────────────────────────┘
```

- カード背景: #0a0a0a
- サムネイル: width 100%, aspect-ratio 16/10, overflow hidden
- 番号: IBM Plex Mono, 10px, color #333
- 作品名: Barlow weight 300, 16px, letter-spacing 0.1em, color #fff
- ジャンル/ページ数: Barlow weight 400, 11px, color #555
- 制作年月: IBM Plex Mono, 10px, color #333
- padding（テキストエリア）: 20px 24px

### ホバー演出
1. サムネイル: **自動スクロール**（フルページスクショが translateY でゆっくり下方向に移動）
   - duration: 画像高さに比例（3〜6秒）
   - ease: none（等速）
   - ホバー解除: translateY: 0 に戻る（0.5s）
2. カード下部テキスト: 作品名の color #fff → 維持、番号 #333 → #666
3. カード全体: border 1px solid #1a1a1a → #333（微細な明度UP）

### クリック/タップ動作
- 作品の公開URLを新規タブで開く（target="_blank"）
- ページ遷移トランジションは使わない（外部サイトへの遷移のため）

### 掲載順序
- 新しい順（制作年月降順）
- data属性でカテゴリ・年月を管理

```html
<div class="work-card" data-category="lp" data-date="2026-03">
```

### レスポンシブ
- タブレット: 2カラム
- SP: 1カラム

### スクロールアニメーション
- カード群: stagger 0.1s で順次出現（opacity 0→1, y 15→0）
- グリッドライン: スクロールに応じて上から下に「電力が通る」ように明度が上がる演出
  - #111 → #1a1a1a（微細だが、スクロールで「起動」する感覚）

---

# PART B: お問い合わせページ（contact.html）

---

## 1. ページ構成

```
[FV — 100vh 全画面]
↓
[フォームセクション（白背景）]
↓
[フッター]
```

白黒反転リズム：FV(黒) → フォーム(白) → フッター(黒)

---

## 2. FV（100vh全画面）

### デザイン
- 背景: #0a0a0a
- メイン: 「CONTACT」Barlow weight 100, clamp(48px, 8vw, 120px), letter-spacing 0.25em
- サブ: 「お気軽にご相談ください」Noto Sans JP weight 300, 13px, color #666
- 水平ライン + エッジテキスト（共通パターン）
- 背景: フィルムグレイン + スキャンライン

---

## 3. フォームセクション

### レイアウト
- **白背景セクション**
- padding: 160px 80px
- max-width: 640px, 左寄せ（空白を右に残す、aboutの経歴と同じ思想）

### Formspree設定
- action: `https://formspree.io/f/{FORM_ID}`（実装時にあおきさんがIDを提供）
- method: POST
- 送信先メール: leliel.soukomu74@gmail.com（既存維持）

### フォームフィールド

**1. お名前（必須）**
- label: 「NAME」Barlow weight 400, 12px, letter-spacing 0.1em, color #111
- input: type="text", name="name", required
- placeholder: 「お名前をご記入ください」

**2. メールアドレス（必須）**
- label: 「EMAIL」
- input: type="email", name="email", required
- placeholder: 「example@email.com」

**3. ご予算（任意）**
- label: 「BUDGET」
- select: name="budget"
- options:
  - 「選択してください」（default, disabled）
  - 「〜10万円」
  - 「10万円〜20万円」
  - 「20万円〜30万円」
  - 「30万円〜50万円」
  - 「50万円〜」
  - 「未定・相談したい」

**4. ご希望納期（任意）**
- label: 「DEADLINE」
- select: name="deadline"
- options:
  - 「選択してください」（default, disabled）
  - 「1ヶ月以内」
  - 「1〜2ヶ月」
  - 「2〜3ヶ月」
  - 「3ヶ月以上」
  - 「未定・相談したい」

**5. ご相談内容（必須）**
- label: 「MESSAGE」
- textarea: name="message", required, rows="6"
- placeholder: 「ご相談内容をご記入ください」

### フォームスタイリング

**input / select / textarea 共通：**
- background: transparent
- border: none
- border-bottom: 1px solid #e0e0e0
- padding: 12px 0
- font-family: 'Noto Sans JP', sans-serif
- font-weight: 300, font-size: 14px
- color: #111
- focus時: border-bottom-color #111, outline: none
- transition: border-color 0.3s
- margin-bottom: 48px

**select（プルダウン）：**
- appearance: none
- 右端にカスタム矢印（CSS border trick or SVG）
- 未選択時: color #999

**送信ボタン：**
- 「SEND →」Barlow weight 400, 14px, letter-spacing 0.1em
- background: #111, color: #fff
- padding: 16px 48px
- border: none
- ホバー: background #333
- transition: 0.3s
- active: transform scale(0.98)

### 送信完了状態
- フォームが fadeOut → 「THANK YOU.」Barlow weight 200, 36px + 「お問い合わせを受け付けました。」Noto Sans JP weight 300, 14px
- FormspreeのリダイレクトではなくAJAX送信 + DOM書き換え

### アニメーション
- 各フィールド: stagger 0.1s で上から順次出現（opacity 0→1, y 15→0）
- ラベル: 先に出現、input が 0.05s 後に追従
- 送信ボタン: 最後に出現

### SP対応
- max-width: 100%, padding: 80px 24px
- 送信ボタン: width 100%

---

**Vol.4 完了。CLAUDE.md + full-migration.md に続く。**
