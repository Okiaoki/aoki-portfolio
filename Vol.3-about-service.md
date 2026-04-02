# AKASHIKI Portfolio 全面改修 — 設計書 Vol.3
## about.html + service.html 詳細設計

---

# PART A: 自己紹介ページ（about.html）

---

## 1. ページ構成

```
[FV — 100vh 全画面]
↓
[経歴ストーリー（黒背景）]
↓
[信条・こだわり（白背景）]
↓
[スキルセット — Terminal Index（黒背景）]
↓
[SNS（黒背景、スキルセットと連続）]
↓
[フッター]
```

白黒反転リズム：FV(黒) → 経歴(黒) → 信条(白) → スキル(黒) → フッター(黒)

---

## 2. FV（100vh全画面）

### デザイン
- 背景: #0a0a0a
- 中央揃え
- メイン: 「SUMIYAKA — 墨家」Barlow weight 200, clamp(36px, 5vw, 64px), letter-spacing 0.2em
- サブ: 「Web Designer / Front-end Developer」Barlow weight 400, 13px, letter-spacing 0.12em, color #666
- 水平ライン: 1px solid #333, width 60px, 中央配置
- 下部エッジテキスト: IBM Plex Mono, 9px, color #222
  - 左下: 「ABOUT」
  - 右下: 「SCROLL」

### アニメーション
- ページ遷移オーバーレイ消滅後に開始
- 名前: opacity 0→1 + letter-spacing 0.4em→0.2em（duration 1.2s）
- サブテキスト: delay 0.4s, opacity 0→1
- 水平ライン: delay 0.6s, scaleX 0→1
- エッジテキスト: delay 0.8s, opacity 0→1
- 背景にフィルムグレイン（トップFVと同じSVG、opacity 0.03）
- スキャンラインオーバーレイ（pointer-events: none, opacity 0.02）

---

## 3. 経歴ストーリーセクション

### レイアウト
- 背景: #0a0a0a（FVから連続、境界なし）
- padding: 160px 80px
- max-width: 640px（テキスト幅を制限して可読性確保）
- 左寄せ（中央揃えではない、空白を右に大きく残す）

### テキスト（確定済み）

**リード文:**
> 7年間、美容外科クリニックにいました。

Noto Sans JP weight 500, 18px, line-height 2.0, color #f5f5f5
（このリード文だけ太く大きく、静かなインパクト）

**本文:**
> 院内サーバーの構築と管理。医療情報と個人情報を扱う現場で求められたのは、一切の曖昧さを排した正確性と、絶対に止めない安定性。予約導線の設計見直し、業務マニュアルの体系化、症例写真データの管理基盤構築、広告掲載内容の精査——運営の根幹を裏側から支え続ける7年間でした。
>
> そこで身についたのは、「仕組みで解決する」という思考回路です。
>
> 今の仕事に転じてからも、その回路はそのまま動いています。Figma/XDからの忠実なコーディング、LP制作、WordPress構築、既存サイトの修正・改善。構成からデザイン、コーディング、公開まで一括で対応できる体制で、レスポンシブ対応やJavaScript実装（アニメーション、スライダー、検索・絞り込み機能等）も含め、表層から構造まで一貫して手がけています。
>
> 見た目を再現するだけでは足りない。表示速度、アクセシビリティ、保守性——運用まで見据えた、実務に耐えるWebサイトを作ること。それが私の仕事です。

Noto Sans JP weight 300, 15px, line-height 2.2, letter-spacing 0.04em, color #ccc

**段落間の「仕組みで解決する」：**
- この1行だけ Barlow weight 200, 24px, letter-spacing 0.1em, color #fff
- 前後に余白 40px
- 引用符「」はそのまま和文で

### スクロールアニメーション
- リード文: スクロールインで opacity 0→1, y 20→0（duration 1.2s）
- 本文各段落: stagger 0.2s で順次出現
- 「仕組みで解決する」行: 水平ライン伸長 + テキスト出現（ページのアクセント）

---

## 4. 信条・こだわりセクション

### レイアウト
- **白背景セクション**（反転）
- padding: 160px 80px
- 3つの信条を縦に並べる
- 各信条の間に 1px solid #e0e0e0 の区切り線

### テキスト（確定済み）

**信条1:**
- 見出し: 「再現ではなく、解釈する」Barlow weight 300, 28px ← 和文だがBarlowでなくNoto Sans JP weight 500, 24px
- 本文: 「デザインデータの意図を正確に汲み取り、画面上で最も効果的に機能する形に落とし込む。ピクセル単位の再現性と、その先にある「なぜこの配置なのか」への理解を両立させる。」
  Noto Sans JP weight 300, 14px, line-height 2.0, color #666

**信条2:**
- 見出し: 「納品して終わりにしない」Noto Sans JP weight 500, 24px, color #111
- 本文: 「表示速度、更新のしやすさ、アクセシビリティ。サイトが公開された後に何が起きるかまで考えて作る。丁寧なヒアリングと現実的なスケジュール提案で、納期を守り抜く。」

**信条3:**
- 見出し: 「AIを道具として使い倒す。ただし、出力をそのまま出すことは決してしない」Noto Sans JP weight 500, 24px, color #111
- 本文: 「AI活用を前提とした効率的な制作体制を持ちながら、すべての成果物に人の判断と手を通す。テンプレート感のない、そのクライアントだけの設計を、構造から考える。」

### アニメーション
- 各信条: スクロールインで opacity 0→1, x -20→0（左からスライド）, stagger 0.2s
- 区切り線: scaleX 0→1

---

## 5. スキルセットセクション（Terminal Index — Pattern A）

### レイアウト
- 背景: #0a0a0a（黒に戻る）
- padding: 160px 80px
- max-width: 700px
- 左寄せ

### セクションタイトル
「SKILL SET」Barlow weight 200, 48px, letter-spacing 0.2em
水平ライン: 1px solid #333, width 40px

### スキル一覧（3カラムグリッド）

| # | 技術名 | 説明 |
|---|--------|------|
| 01 | HTML / CSS | セマンティック構造設計、レスポンシブ、CSS Grid/Flexbox、アニメーション |
| 02 | JAVASCRIPT | GSAP / ScrollTrigger、DOM操作、検索・絞り込み、スライダー実装 |
| 03 | WORDPRESS | テーマカスタマイズ、静的サイトのWP化、Swell構築 |
| 04 | FIGMA / XD | デザインデータからの忠実なコーディング、デザイン制作 |
| 05 | SEO / AIO | 構造化データ、セマンティックHTML、AI検索最適化設計 |

**グリッド構造:**
```css
display: grid;
grid-template-columns: 60px 180px 1fr;
/* 番号(IBM Plex Mono 11px #333) | 技術名(Barlow 14px #999) | 説明(Noto Sans JP 12px #444) */
```

各行: padding 20px 0, border-bottom: 1px solid #1a1a1a

### アニメーション
- 各行: stagger 0.1s で上から順次出現（opacity 0→1, x -10→0）
- 番号: 先に出現し、技術名と説明が 0.05s 遅れて追従

---

## 6. SNSセクション

### レイアウト
- スキルセットと同一黒背景（分離しない）
- padding-top: 80px
- 区切り: 1px solid #1a1a1a の水平線

### コンテンツ
- 「SOCIAL」IBM Plex Mono weight 300, 10px, letter-spacing 0.2em, color #333
- X（@sumiyakaaa）: Barlow weight 400, 14px, color #666, ホバー #fff
- GitHub（sumiyakaa）: 同上
- 各リンクの先頭に「→」プレフィックス

---

# PART B: サービスページ（service.html）

---

## 1. ページ構成

```
[FV — 100vh 全画面]
↓
[制作スタイル（黒背景）]
↓
[AIO説明（白背景）]
↓
[料金詳細 + オプション（黒背景）]
↓
[制作の流れ（白背景）]
↓
[フッター]
```

白黒反転リズム：FV(黒) → 制作スタイル(黒) → AIO(白) → 料金(黒) → 制作の流れ(白) → フッター(黒)

---

## 2. FV（100vh全画面）

### デザイン
- 背景: #0a0a0a
- 中央揃え
- メイン: 「SERVICE」Barlow weight 100, clamp(48px, 8vw, 120px), letter-spacing 0.25em
- サブ: 「提供するサービスと制作の進め方」Noto Sans JP weight 300, 13px, color #666
- 水平ライン + エッジテキスト（about.htmlと同パターン）
- 背景: フィルムグレイン + スキャンライン（トップFVと共通パーツ）

### アニメーション
- about.html FVと同一パターン（統一感）
- 名前部分が「SERVICE」に変わるだけ

---

## 3. 制作スタイルセクション

### レイアウト
- 背景: #0a0a0a
- padding: 160px 80px
- 2カラム構成: 左にセクションタイトル（sticky）、右に内容

### 左カラム（sticky）
- 「HOW I WORK」Barlow weight 200, 48px, letter-spacing 0.15em
- position: sticky, top: 120px
- max-width: 300px

### 右カラム（スクロール）
各項目を縦に並べ、1px solid #1a1a1a で区切る。

**項目1: STRATEGY**
- 見出し: Barlow weight 400, 18px, letter-spacing 0.1em
- 番号: IBM Plex Mono, 10px, color #333
- 本文（叩き台、Claude作成）:
  「制作に入る前に、まず訊く。誰に届けるのか、何を伝えたいのか、競合はどこか。ヒアリングで得た情報を構造化し、訴求軸を定め、ワイヤーフレームに落とし込む。見た目の前に、設計がある。」
  Noto Sans JP weight 300, 14px, line-height 2.0, color #999

**項目2: FRONT-END**
- 本文（叩き台）:
  「HTML/CSS/JavaScriptを手書きで組む。Figma/XDのデザインデータを受け取り、ピクセル単位の再現性を担保しながら、表示速度・アクセシビリティ・保守性を同時に達成する。GSAP、CSS 3D Transform、ScrollTriggerを用いたインタラクティブな演出も対応。」

**項目3: WORDPRESS**
- 本文（叩き台）:
  「静的サイトのWordPress化、既存テーマのカスタマイズ、Swellを使ったサイト構築。更新しやすさを第一に設計し、クライアントが自分で運用できる状態で納品する。」

**項目4: QUALITY ASSURANCE**
- 本文（叩き台）:
  「納品前にLighthouseスコア、レスポンシブ表示、ブラウザ互換性、リンク切れ、画像最適化を全チェック。公開してから「あれ？」がない状態を作る。納期厳守、進捗は随時共有。」

### アニメーション
- 左タイトル: sticky のまま固定、スクロールインで opacity 0→1
- 右の各項目: stagger で順次出現（opacity 0→1, y 20→0）

---

## 4. AIO説明セクション

### レイアウト
- **白背景セクション**
- padding: 160px 80px
- max-width: 800px, 中央寄せ

### コンテンツ（叩き台、Claude作成）

**セクションタイトル:**
「AI SEARCH OPTIMIZATION」Barlow weight 200, 42px, letter-spacing 0.15em, color #111

**リード文:**
「AI検索に対応した設計を、標準で組み込んでいます。」
Noto Sans JP weight 500, 18px, color #111

**本文:**
「Google検索だけでなく、ChatGPTやPerplexity、Claude等のAIアシスタントが情報を探す時代に入っています。AIが正確にサイトの情報を読み取り、検索者に推薦できるよう、構造化データ（JSON-LD）、セマンティックHTML、FAQ Schema、エンティティ定義を全ページに実装します。

具体的には：
- JSON-LD で「この会社/この人は何者で、何ができるか」を機械が読める形で定義
- 各ページに検索者の意図に直接答えるQ&A構造を設計
- ページ間の相互参照（内部リンク）を明示的に設計し、サイト全体の情報構造を最適化

従来のSEOに加え、AIウェブサーチへの最適化を標準装備。まだ対応しているWeb制作者が少ない今こそ、差別化の武器になります。」
Noto Sans JP weight 300, 14px, line-height 2.0, color #666

### 表現上の注意
- トーン: 実績・技術寄り、営業臭を排除
- 1gの人間味: 「〜時代に入っています」のような柔らかい導入
- 専門用語に頼りすぎず、一般の経営者にもわかる言い回し
- 箇条書きは3項目まで（テンプレ感の排除）

### アニメーション
- タイトル+リード: opacity 0→1（duration 1.0s）
- 本文: delay 0.3s で出現
- 箇条書き: stagger 0.15s で順次出現

---

## 5. 料金詳細 + オプションセクション

### レイアウト
- **黒背景セクション**
- padding: 160px 80px
- 左寄せ、max-width: 900px

### セクションタイトル
「PRICE」Barlow weight 200, 48px, letter-spacing 0.2em
水平ライン: 1px solid #333, width 40px

### 料金テーブル（テーブルではなくリスト形式、テンプレ感排除）

**基本料金：**

```
01  LP DESIGN                              ¥150,000〜
    静的コーディング / レスポンシブ対応 / 5ページまで
    ————————————————————————————————————————

02  WORDPRESS                               ¥200,000〜
    テーマ構築 / カスタマイズ / 管理画面設計
    ————————————————————————————————————————
```

- 番号: IBM Plex Mono, 11px, color #333
- サービス名: Barlow weight 300, 22px, letter-spacing 0.1em, color #fff
- 価格: Barlow weight 600, 22px, color #fff（右寄せ、同一行）
- 説明: Noto Sans JP weight 300, 12px, color #555
- 区切り: 1px solid #1a1a1a

**オプション：**

タイトル「OPTION」IBM Plex Mono, 11px, letter-spacing 0.2em, color #444, margin-top 80px

```
+   JS高度演出（GSAP / パララックス / 3D）       ¥30,000〜
+   セクション追加（1セクションあたり）            ¥20,000〜
+   保守・運用サポート（月額）                    ¥15,000〜
```

- 「+」プレフィックス: IBM Plex Mono, color #444
- 項目名: Noto Sans JP weight 300, 14px, color #999
- 価格: Barlow weight 400, 14px, color #999（右寄せ）
- 各行: padding 16px 0, border-bottom: 1px solid #111
- **オプション説明はここが唯一の掲載場所**（Finderにも未掲載）

### 料金補足テキスト
「上記は目安です。ページ数・機能・素材の有無により変動します。お気軽にご相談ください。」
Noto Sans JP weight 300, 12px, color #444, margin-top 40px

### アニメーション
- 基本料金: 各項目 stagger 0.15s（opacity 0→1, y 15→0）
- 価格数字: opacity 0→1（カウントアップ不使用、静かに出現）
- オプション: 基本料金出現完了後に delay 0.3s で出現開始

---

## 6. 制作の流れセクション

### レイアウト
- **白背景セクション**
- padding: 160px 80px

### セクションタイトル
「PROCESS」Barlow weight 200, 48px, letter-spacing 0.2em, color #111
水平ライン: 1px solid #e0e0e0, width 40px

### フロー（縦並び、左に番号ライン）

左端に垂直ライン（1px solid #e0e0e0）を配置し、各ステップの番号が線上に乗る構造。

**STEP 01: ヒアリング**
- 見出し: Barlow weight 400, 16px, letter-spacing 0.1em, color #111
- 番号: IBM Plex Mono, 10px, color #999
- 本文（叩き台）:
  「ご要望・ターゲット層・競合・ご予算・納期をお伺いします。ヒアリングシートをご用意しておりますので、回答いただくだけで方向性が整理されます。」
  Noto Sans JP weight 300, 13px, color #666, line-height 2.0

**STEP 02: ラフ提案**
- 「ヒアリング内容をもとに、デザインラフを複数パターンご提案します。この段階では費用は発生しません。方向性の合意が取れたら、1案に絞って詳細を詰めていきます。」

**STEP 03: デザイン・コーディング**
- 「確定した方向性に基づき、デザインとコーディングを進行します。途中経過は随時共有し、修正対応も含めて丁寧にお作りします。」

**STEP 04: 確認・修正**
- 「テスト環境でPC/タブレット/スマートフォン全デバイスの表示を確認いただきます。修正は2回まで標準対応。細部まで納得いただける状態を目指します。」

**STEP 05: 公開・納品**
- 「最終確認後、本番環境に公開します。WordPress案件の場合は管理画面の操作方法もご案内します。公開後の軽微な修正は1週間以内であれば無償対応いたします。」

### アニメーション
- 垂直ライン: scaleY 0→1（上から下に伸長、duration 1.5s、スクロール連動）
- 各ステップ: ラインが到達するタイミングで opacity 0→1（機械的な連鎖起動テーマ）
- 番号: 先に出現（0.1s先行）、見出し→本文の順で追従

### SP対応
- 2カラム構成（制作スタイル）→ 1カラム縦積み、stickyタイトル解除
- 料金テーブル: サービス名と価格を縦に積む（横幅不足対応）
- 制作の流れ: 垂直ラインを左端に維持、レイアウトはそのまま

---

## 7. FAQ構造化データ（裏側、AIO用）

service.html に以下の FAQ Schema を JSON-LD で埋め込む：

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "LP制作の料金はいくらですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "LP制作（静的コーディング）は15万円〜、WordPress構築は20万円〜です。ページ数・機能により変動します。"
      }
    },
    {
      "@type": "Question",
      "name": "制作の流れを教えてください",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ヒアリング→ラフ提案→デザイン・コーディング→確認・修正→公開の5ステップで進行します。"
      }
    },
    {
      "@type": "Question",
      "name": "AI検索最適化（AIO）とは何ですか？",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "ChatGPTやPerplexity等のAIアシスタントがサイト情報を正確に読み取れるよう、構造化データやセマンティックHTMLを実装する最適化手法です。"
      }
    }
  ]
}
```

---

**Vol.3 完了。Vol.4（works.html + contact.html）に続く。**
