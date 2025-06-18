# Community Bot - Discord コミュニティ管理ボット

## 📋 概要

Discord コミュニティの管理を支援する AI ボットです。Web アプリケーションでプロンプトを管理し、Discord ボットで GPT を使用した分析・提案を行います。

## 🚀 起動方法

### 1. 環境変数の設定

```bash
# .envファイルを作成
cp env.example .env
```

`.env`ファイルに以下の値を設定してください：

```env
# Discord Bot
DISCORD_TOKEN=your_discord_bot_token
CLIENT_ID=your_discord_client_id

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. データベースのセットアップ

Supabase でプロジェクトを作成し、`supabase-schema.sql`の内容を実行してください。

### 4. アプリケーションの起動

#### Web アプリケーション（Next.js）

```bash
# 開発モードで起動
npm run dev

# 本番ビルド
npm run build
npm start
```

#### Discord ボット

```bash
# 開発モードで起動（ファイル変更を監視）
npm run bot:dev

# 通常起動
npm run bot
```

## 🏗️ システム構成

### フロントエンド（Next.js）

- **フレームワーク**: Next.js 14
- **UI ライブラリ**: shadcn/ui + Tailwind CSS
- **言語**: TypeScript
- **状態管理**: React Hooks

### バックエンド

- **API**: Next.js API Routes
- **データベース**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT API

### Discord ボット

- **ライブラリ**: discord.js
- **実行環境**: tsx
- **言語**: TypeScript

## 📁 プロジェクト構造

```
community_bot/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── prompts/       # プロンプト管理API
│   │   │   ├── stats/         # 統計情報API
│   │   │   └── test/          # GPTテストAPI
│   │   ├── globals.css        # グローバルスタイル
│   │   └── page.tsx           # メインページ
│   ├── bot/                   # Discordボット
│   │   ├── commands/          # スラッシュコマンド
│   │   ├── handlers/          # イベントハンドラー
│   │   ├── services/          # ビジネスロジック
│   │   ├── utils/             # ユーティリティ
│   │   └── index.ts           # ボットエントリーポイント
│   ├── components/            # Reactコンポーネント
│   │   ├── ui/               # shadcn/uiコンポーネント
│   │   ├── PromptForm.tsx    # プロンプト作成フォーム
│   │   ├── PromptList.tsx    # プロンプト一覧
│   │   ├── Statistics.tsx    # 統計情報
│   │   └── ...
│   ├── hooks/                # カスタムフック
│   └── lib/                  # ユーティリティライブラリ
├── env.example               # 環境変数テンプレート
├── supabase-schema.sql       # データベーススキーマ
└── package.json
```

## 🎯 主要機能

### Web アプリケーション機能

#### 1. プロンプト管理

- **プロンプト作成**: システムプロンプトとユーザープロンプトの作成
- **テンプレート機能**: イベント提案、エンゲージメント向上、モデレーション支援のテンプレート
- **プロンプト保存**: Supabase への永続化
- **プロンプト一覧**: 保存されたプロンプトの表示・編集・削除
- **プロンプトテスト**: GPT API を使用したテスト実行

#### 2. 統計情報

- 総プロンプト数
- 今日・今月の作成数
- 分析タイプ別の統計
- 平均応答時間

#### 3. ダッシュボード

- プロンプトプレビュー
- クイックアクション
- 統計情報表示

### Discord ボット機能

#### 1. スラッシュコマンド

- `/analyze`: チャンネルの会話を分析
- `/help`: ヘルプ表示

#### 2. メッセージ処理

- ping-pong テスト機能
- 自動応答機能（拡張可能）

## 🔧 技術仕様

### AI モデル設定

#### OpenAI GPT 設定

- **使用モデル**: `gpt-4.1-nano`
- **温度設定**: 0.7
- **最大トークン**: 800
- **設定箇所**:
  - Web API: `src/app/api/test/route.ts`
  - Discord Bot: `src/bot/services/openaiService.ts`

**重要**: このプロジェクトでは必ず `gpt-4.1-nano` を使用してください。他のモデルへの変更は禁止です。

### データベーススキーマ

```sql
-- プロンプトテーブル
CREATE TABLE prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  system_prompt TEXT NOT NULL,
  user_prompt TEXT NOT NULL,
  analysis_type VARCHAR(50) NOT NULL,
  channel_name VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API エンドポイント

#### プロンプト管理

- `GET /api/prompts` - プロンプト一覧取得
- `POST /api/prompts` - プロンプト作成
- `PUT /api/prompts/[id]` - プロンプト更新
- `DELETE /api/prompts/[id]` - プロンプト削除

#### 統計情報

- `GET /api/stats` - 統計情報取得

#### GPT テスト

- `POST /api/test` - GPT API テスト実行

### 環境変数

| 変数名                          | 説明                        | 必須 |
| ------------------------------- | --------------------------- | ---- |
| `DISCORD_TOKEN`                 | Discord ボットトークン      | ✅   |
| `CLIENT_ID`                     | Discord クライアント ID     | ✅   |
| `OPENAI_API_KEY`                | OpenAI API キー             | ✅   |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase プロジェクト URL   | ✅   |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名キー           | ✅   |
| `SUPABASE_SERVICE_ROLE_KEY`     | Supabase サービスロールキー | ✅   |

## 🚀 デプロイ

### Vercel（Web アプリケーション）

1. GitHub リポジトリを Vercel に接続
2. 環境変数を設定
3. デプロイ実行

### Railway/Heroku（Discord ボット）

1. リポジトリを接続
2. 環境変数を設定
3. デプロイ実行

## 🔍 トラブルシューティング

### よくある問題

#### 1. 環境変数エラー

```
Error: Missing required environment variables
```

→ `.env`ファイルが正しく設定されているか確認

#### 2. Supabase 接続エラー

```
Error: Invalid API key
```

→ Supabase の API キーが正しいか確認

#### 3. Discord ボット接続エラー

```
Error: Invalid token
```

→ Discord Developer Portal でトークンが正しいか確認

#### 4. tsx 実行エラー

```
Error: Cannot find module 'tsx'
```

→ `npm install`を実行して依存関係を再インストール

## 📝 開発ガイド

### 新しい機能の追加

1. **API Route 追加**: `src/app/api/`に新しいエンドポイントを作成
2. **コンポーネント追加**: `src/components/`に React コンポーネントを作成
3. **ボット機能追加**: `src/bot/`に新しいコマンドやハンドラーを追加

### コードスタイル

- TypeScript を使用
- ESLint + Prettier でコードフォーマット
- コンポーネントは関数型コンポーネント
- カスタムフックでロジック分離

## 📄 ライセンス

ISC License

## 🤝 コントリビューション

1. フォークを作成
2. フィーチャーブランチを作成
3. 変更をコミット
4. プルリクエストを作成

---

**注意**: このアプリケーションを使用する前に、Discord Developer Portal でボットアプリケーションを作成し、必要な権限を設定してください。
