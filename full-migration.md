# full-migration.md — AKASHIKI Portfolio 全面改修

## 品質基準（実装開始前に必読）
本プロジェクトの核心テーマは「表面はモノトーンで静寂。しかし裏では精密な機械が静かに駆動している」。
全アニメーション・トランジション・ホバーエフェクトはこのテーマに基づいて実装すること。
CSS/JSの行数制限なし。品質のために必要なコード量を書く。
設計書承認以外ではノンストップで完了まで自走すること。

---

## Phase 1: トップページ（index.html）

### 作業順序
1. 共通ファイル作成（reset.css / variables.css / base.css / header.css / footer.css / transition.css / common.js）
2. index.html 骨格作成（semantic HTML）
3. index.css 作成
4. スプラッシュスクリーン実装（GSAP timeline）
5. Hero FV 実装
   - 背景レイヤー（グレイン + ラジアルグラデ + 光オーブ）
   - 3D空間コンテナ（perspective設定）
   - テキスト配置 + 出現アニメーション
   - ScrollTrigger パララックス（fromTo厳守）
   - スキャンラインオーバーレイ
6. Works セクション実装
   - 片寄せレイアウト（grid: 1fr 300px）
   - サムネイル配置 + 自動スクロール機能
   - 「SELECTED」パルスアニメーション
   - リーダーライン SVG（3本分）
   - ホバー演出（リーダーライン伸長 + 通信ケーブル + タイピング）
   - 「VIEW ALL WORKS →」リンク
7. 料金ダイジェストセクション実装（白背景反転）
8. ヘッダー実装（スマートヘッダー、ScrollTrigger連動）
9. フッター実装
10. ページ遷移トランジション実装（clip-path + sessionStorage）
11. レスポンシブ対応（タブレット + SP）
12. SPハンバーガーメニュー実装
13. meta / OGP / JSON-LD 実装
14. 画像最適化（WebP変換、500KB以下）

### Phase 1 検証項目
- スプラッシュ → FV → Works → 料金 の流れが途切れないか
- FV の fromTo() が正しく可逆動作するか
- Works ホバーが3枚全てで正しく動作するか
- ヘッダーの出現/隠蔽タイミング
- SP表示の崩れ
- Lighthouse 90+

**Phase 1のみ実装。Phase 2以降には一切着手しないこと。**

---

## Phase 2: about.html + service.html

### about.html 作業順序
1. about.html 骨格作成
2. about.css 作成
3. FV 実装（100vh、SUMIYAKA — 墨家）
4. 経歴ストーリーセクション（テキスト配置 + スクロールアニメ）
5. 信条・こだわりセクション（白背景反転 + スクロールアニメ）
6. スキルセット Terminal Index（3カラムグリッド + stagger出現）
7. SNSセクション
8. レスポンシブ対応
9. meta / OGP / JSON-LD

### service.html 作業順序
1. service.html 骨格作成
2. service.css 作成
3. FV 実装（100vh、SERVICE）
4. 制作スタイルセクション（2カラム sticky + スクロール）
5. AIO説明セクション（白背景反転）
6. 料金詳細 + オプション（Terminal Index風レイアウト）
7. 制作の流れセクション（垂直ライン + ステップ連鎖起動）
8. FAQ構造化データ JSON-LD 埋め込み
9. レスポンシブ対応
10. meta / OGP / JSON-LD

### Phase 2 検証項目
- 全ページのヘッダー/フッター/ページ遷移が共通動作するか
- about FV → 経歴 → 信条 → スキル の白黒反転リズム
- service 2カラム sticky の挙動
- 料金テーブルの表示崩れ
- 制作の流れ垂直ラインの連鎖起動アニメ
- index → about / service の遷移動作
- SP全セクションの表示確認

**Phase 2のみ実装。Phase 3以降には一切着手しないこと。**

---

## Phase 3: works.html + contact.html

### works.html 作業順序
1. works.html 骨格作成
2. works.css / works.js 作成
3. FV 実装（100vh、WORKS）
4. 絞り込みフィルター実装（DOMフィルタリング、パチッと切り替え）
5. 作品一覧グリッド（3カラム、1px gap グリッドライン）
6. 作品カード（サムネイル自動スクロール + ホバー）
7. 全作品データ投入（data属性管理）
8. レスポンシブ対応（タブレット2カラム / SP1カラム）
9. meta / OGP / JSON-LD

### contact.html 作業順序
1. contact.html 骨格作成
2. contact.css / contact.js 作成
3. FV 実装（100vh、CONTACT）
4. フォーム実装（Formspree AJAX送信）
5. バリデーション + 送信完了DOM書き換え
6. レスポンシブ対応
7. meta / OGP / JSON-LD

### Phase 3 最終仕上げ
1. sitemap.xml 生成
2. manifest.webmanifest 更新
3. 全ページ内部リンク疎通確認
4. 全ページ Lighthouse 確認
5. 全ページ SP 表示最終確認
6. OGP画像設定確認
7. favicon 設定

### Phase 3 検証項目
- works フィルタリングの切り替え動作
- works サムネイル自動スクロール全カードで動作確認
- contact フォーム送信 + 完了画面
- 全ページ間の遷移トランジション
- sitemap.xml の全URL記載確認
- 最終 Lighthouse 全ページ 90+

**Phase 3のみ実装。全Phase完了後に自己診断11項目を実施し報告すること。**
