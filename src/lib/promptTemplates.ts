// 共通のプロンプトテンプレート

export const promptTemplates = {
  event: {
    name: 'イベント提案',
    description: 'コミュニティの会話からイベント案を提案',
    template: 'このコミュニティで盛り上がっているトピックを基に、具体的なイベント案を提案してください。'
  },
  engagement: {
    name: 'エンゲージメント向上',
    description: 'コミュニティの活性化策を提案',
    template: 'このコミュニティの会話を分析し、エンゲージメント向上のための施策を提案してください。'
  },
  moderation: {
    name: 'モデレーション支援',
    description: 'コミュニティの健全性を分析',
    template: 'このコミュニティの会話を分析し、モデレーションの改善点を指摘してください。'
  },
  custom: {
    name: 'カスタム分析',
    description: '独自の分析プロンプトを作成',
    template: ''
  }
}

// デフォルトのシステムプロンプト（より簡潔に）
export const defaultSystemPrompt = `あなたは有能なコミュニティマネージャーです。

回答のポイント：
- 具体的で実現可能な提案
- コミュニティの特性を考慮
- 分かりやすく構造化
- 日本語で回答`

// テスト用のサンプルメッセージ履歴
export const sampleMessageHistory = `
- **ユーザーA**: 今日は天気がいいですね！
- **ユーザーB**: そうですね！散歩に行こうかな
- **ユーザーC**: プログラミングの勉強も進めたいです
- **ユーザーA**: 何かおすすめの技術書ありますか？
- **ユーザーB**: 最近はAI関連の本が面白いですよ
- **ユーザーC**: そうですね！AI勉強会とか開催してみませんか？
- **ユーザーA**: いいアイデアですね！参加したいです
- **ユーザーB**: 私も参加します！
- **ユーザーC**: では、来週の土曜日に開催しましょう
- **ユーザーA**: 楽しみにしています！
`.trim()

// プロンプト構築関数（改善版）
export function buildAnalysisPrompt(
  systemPrompt: string,
  userPrompt: string,
  channelName: string = 'general',
  messageHistory: string = sampleMessageHistory
): { system: string; user: string } {
  const fullUserPrompt = `
【分析対象】: #${channelName}

【会話履歴】
${messageHistory}

【分析指示】
${userPrompt}

上記の指示に基づいて分析してください。
`.trim()

  return {
    system: systemPrompt,
    user: fullUserPrompt
  }
} 