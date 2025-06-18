# Community Bot - AI 技術仕様書

## プロジェクト概要

Discord コミュニティ分析ボットと Web 管理 UI を統合したシステム。GPT-4.1-nano を使用したチャンネル分析機能を提供。

## アーキテクチャ

### 技術スタック

- **フロントエンド**: Next.js 14.2.30, React 18, TypeScript
- **UI**: Tailwind CSS, Radix UI, Lucide React
- **バックエンド**: Next.js API Routes
- **Discord Bot**: discord.js 14.14.1
- **AI**: OpenAI GPT-4.1-nano
- **データベース**: Supabase (PostgreSQL)
- **デプロイ**: Railway (統合デプロイ)

### ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── prompts/       # プロンプト管理API
│   │   ├── bot-settings/  # Bot設定API
│   │   └── analyze/       # 分析実行API
│   ├── globals.css        # グローバルスタイル
│   └── page.tsx           # メインページ
├── bot/                   # Discord Bot
│   ├── commands/          # スラッシュコマンド
│   ├── handlers/          # イベントハンドラー
│   ├── services/          # ビジネスロジック
│   ├── types/             # 型定義
│   ├── utils/             # ユーティリティ
│   └── index.ts           # Botエントリーポイント
├── components/            # Reactコンポーネント
├── hooks/                 # カスタムフック
└── lib/                   # 共通ライブラリ
```

## データフロー

### 1. プロンプト管理フロー

```
ユーザー入力 → PromptForm → API Route → Supabase → レスポンス
```

### 2. Discord 分析フロー

```
/analyze コマンド → analyzeCommand → promptBuilderService → openaiService → レスポンス
```

### 3. Bot 設定フロー

```
Bot設定画面 → bot-settings API → Supabase → Discord Bot反映
```

## 主要コンポーネント

### Web UI コンポーネント

- `PromptForm`: プロンプト作成・編集フォーム
- `PromptList`: 保存済みプロンプト一覧
- `BotSettings`: Discord Bot 設定画面
- `DefaultPromptDisplay`: 現在のデフォルトプロンプト表示
- `Header`: ナビゲーションヘッダー

### Discord Bot コンポーネント

- `analyzeCommand`: `/analyze` コマンド処理
- `analyzeSavedCommand`: `/analyze-saved` コマンド処理
- `promptBuilderService`: プロンプト構築ロジック
- `openaiService`: OpenAI API 呼び出し
- `messageHistory`: メッセージ履歴取得

## API 仕様

### プロンプト管理 API

- `GET /api/prompts`: プロンプト一覧取得
- `POST /api/prompts`: プロンプト作成
- `PUT /api/prompts/[id]`: プロンプト更新
- `DELETE /api/prompts/[id]`: プロンプト削除

### Bot 設定 API

- `GET /api/bot-settings`: 現在の設定取得
- `POST /api/bot-settings`: 設定保存

### 分析 API

- `POST /api/analyze`: プロンプトテスト実行

## データベーススキーマ

### prompts テーブル

```sql
CREATE TABLE prompts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  system_prompt TEXT NOT NULL,
  user_prompt TEXT NOT NULL,
  analysis_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### bot_settings テーブル

```sql
CREATE TABLE bot_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_prompt_id UUID REFERENCES prompts(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 環境変数

```env
# Discord
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## デプロイ設定

### Railway 設定

- 統合デプロイ（Web アプリ + Bot）
- 環境変数設定必須
- ヘルスチェック: `/` エンドポイント

### 起動コマンド

```bash
npm run start:all  # Webアプリ + Bot同時起動
```

## セキュリティ考慮事項

- Discord Bot Token の適切な管理
- OpenAI API Key の環境変数化
- Supabase RLS (Row Level Security) の実装
- API Route での入力検証

## パフォーマンス最適化

- Next.js App Router の使用
- コンポーネントの適切な分割
- API Route でのエラーハンドリング
- Discord.js の適切なイベント処理

## 監視・ログ

- Discord Bot の接続状態監視
- OpenAI API 呼び出しのログ
- エラーハンドリングとログ出力
- Railway の統合ログ機能

## 拡張性

- 新しい分析タイプの追加
- 追加の Discord コマンド実装
- 複数サーバー対応
- 分析結果の保存機能
