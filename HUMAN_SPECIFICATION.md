# Community Bot - 人間向け仕様書

## 📋 プロジェクト概要

**Community Bot** は、Discord サーバーのコミュニティ分析を支援する統合システムです。

### 🎯 主な機能

- **Discord Bot**: `/analyze` コマンドでチャンネル分析
- **Web 管理画面**: プロンプト作成・管理・Bot 設定
- **AI 分析**: GPT-4.1-nano による高度なコミュニティ分析

---

## 📁 ファイル構造ガイド

### 🏠 ルートディレクトリ

```
community_bot/
├── 📄 package.json          # プロジェクト設定・依存関係
├── 📄 railway.json          # Railwayデプロイ設定
├── 📄 tsconfig.json         # TypeScript設定
├── 📄 next.config.js        # Next.js設定
├── 📄 tailwind.config.js    # Tailwind CSS設定
├── 📄 supabase-schema.sql   # データベーススキーマ
├── 📄 env.example           # 環境変数テンプレート
└── 📁 src/                  # ソースコード
```

### 🎨 Web アプリ部分 (`src/app/`)

```
src/app/
├── 📄 page.tsx              # メインページ（ダッシュボード）
├── 📄 globals.css           # グローバルスタイル
└── 📁 api/                  # APIエンドポイント
    ├── 📁 prompts/          # プロンプト管理API
    ├── 📁 bot-settings/     # Bot設定API
    └── 📁 analyze/          # 分析実行API
```

### 🤖 Discord Bot 部分 (`src/bot/`)

```
src/bot/
├── 📄 index.ts              # Bot起動ファイル
├── 📁 commands/             # Discordコマンド
│   ├── 📄 analyzeCommand.ts      # /analyze コマンド
│   └── 📄 analyzeSavedCommand.ts # /analyze-saved コマンド
├── 📁 handlers/             # イベント処理
├── 📁 services/             # ビジネスロジック
│   ├── 📄 openaiService.ts       # OpenAI API呼び出し
│   ├── 📄 promptService.ts       # プロンプト管理
│   └── 📄 promptBuilderService.ts # プロンプト構築
├── 📁 types/                # 型定義
└── 📁 utils/                # ユーティリティ
```

### 🧩 UI コンポーネント (`src/components/`)

```
src/components/
├── 📄 Header.tsx                    # ナビゲーションヘッダー
├── 📄 PromptForm.tsx                # プロンプト作成フォーム
├── 📄 PromptList.tsx                # プロンプト一覧表示
├── 📄 BotSettings.tsx               # Bot設定画面
├── 📄 DefaultPromptDisplay.tsx      # 現在のデフォルトプロンプト表示
├── 📄 QuickActions.tsx              # クイックアクション
├── 📄 Statistics.tsx                # 統計情報
└── 📁 ui/                          # 基本UIコンポーネント
    ├── 📄 button.tsx
    ├── 📄 card.tsx
    └── 📄 ...
```

---

## 🔄 機能フロー図

### 1. プロンプト作成・管理フロー

```
ユーザー → Web画面 → プロンプト作成 → 保存 → データベース
                ↓
            Bot設定で選択 → Discord Botで使用
```

### 2. Discord 分析フロー

```
Discordユーザー → /analyze コマンド → Bot処理 → GPT分析 → 結果返信
```

### 3. 設定管理フロー

```
管理者 → Web画面 → Bot設定 → デフォルトプロンプト設定 → Discord Bot反映
```

---

## 🎮 使用方法

### Web 管理画面

1. **プロンプト作成**: 新しい分析プロンプトを作成
2. **プロンプト管理**: 保存済みプロンプトの編集・削除
3. **Bot 設定**: Discord Bot のデフォルトプロンプト設定
4. **統計確認**: 使用状況の確認

### Discord Bot コマンド

- `/analyze #チャンネル名 [追加指示]` - チャンネル分析
- `/analyze-saved #チャンネル名 プロンプト名` - 保存済みプロンプトで分析

---

## 🛠️ 開発・デプロイ

### ローカル開発

```bash
# 依存関係インストール
npm install

# 開発サーバー起動（Webアプリ）
npm run dev

# Bot起動（別ターミナル）
npm run bot

# 両方同時起動
npm run start:all
```

### デプロイ（Railway）

1. **環境変数設定**

   - Discord Bot Token
   - OpenAI API Key
   - Supabase 接続情報

2. **デプロイ実行**
   ```bash
   # Railwayにプッシュ
   git push railway main
   ```

---

## 📊 データベース構造

### プロンプト管理

- **prompts**: 保存されたプロンプト一覧
- **bot_settings**: Bot の設定情報

### 主要フィールド

- `name`: プロンプト名
- `system_prompt`: システムプロンプト
- `user_prompt`: ユーザープロンプト
- `analysis_type`: 分析タイプ（event/engagement/moderation/custom）

---

## 🔧 カスタマイズポイント

### 新しい分析タイプの追加

1. `src/components/PromptForm.tsx` で選択肢追加
2. `src/bot/services/promptBuilderService.ts` で処理追加

### 新しい Discord コマンドの追加

1. `src/bot/commands/` に新しいコマンドファイル作成
2. `src/bot/commands/index.ts` で登録

### UI のカスタマイズ

1. `src/components/` でコンポーネント編集
2. `tailwind.config.js` でスタイル調整

---

## 🚨 注意事項

### セキュリティ

- 環境変数は必ず設定ファイルで管理
- Discord Bot Token は絶対に公開しない
- OpenAI API Key の使用量に注意

### パフォーマンス

- 大量のメッセージ分析時は処理時間に注意
- OpenAI API の制限に注意
- データベース接続の適切な管理

### 運用

- Bot の接続状態を定期的に確認
- ログの監視
- バックアップの定期実行

---

## 📞 サポート

### トラブルシューティング

1. **Bot が応答しない**: トークンと権限を確認
2. **分析が失敗する**: OpenAI API Key と使用量を確認
3. **Web 画面が表示されない**: 環境変数とポート設定を確認

### ログ確認

- Railway ダッシュボードでログ確認
- Discord Bot の接続状態確認
- OpenAI API 呼び出しログ確認
