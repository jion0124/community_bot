// コマンド関連の定数

export const COMMAND_NAMES = {
  ANALYZE: 'analyze',
  ANALYZE_SAVED: 'analyze-saved',
  LIST_PROMPTS: 'list-prompts',
  HELP: 'help'
} as const;

export const COMMAND_DESCRIPTIONS = {
  ANALYZE: '指定したチャンネルの最新メッセージを GPT で分析します',
  ANALYZE_SAVED: '保存されたプロンプトを使用してチャンネルを分析します',
  LIST_PROMPTS: '保存されたプロンプト一覧を表示します',
  HELP: '利用可能なコマンドの一覧を表示します'
} as const;

export const OPTION_NAMES = {
  CHANNEL: 'channel',
  PROMPT: 'prompt',
  PROMPT_NAME: 'prompt-name'
} as const;

export const OPTION_DESCRIPTIONS = {
  CHANNEL: '分析対象のテキストチャンネル',
  PROMPT: '分析プロンプト（例：次のイベント案を出してください）',
  PROMPT_NAME: '使用するプロンプトの名前'
} as const;

export const ERROR_MESSAGES = {
  TEXT_CHANNEL_ONLY: '❌ テキストチャンネルのみ分析可能です。',
  PROMPT_NOT_FOUND: (name: string) => `❌ プロンプト「${name}」が見つかりません。\n使用可能なプロンプト: \`/list-prompts\` で確認してください。`,
  ANALYSIS_ERROR: '❌ 分析中にエラーが発生しました。',
  SAVED_PROMPT_ANALYSIS_ERROR: '❌ 保存されたプロンプト分析中にエラーが発生しました。'
} as const;

export const SUCCESS_MESSAGES = {
  ANALYSIS_RESULT: (channelName: string, promptName?: string) => 
    `**分析結果（#${channelName}）${promptName ? ` (${promptName})` : ''}**\n`
} as const;

export const PROMPT_THRESHOLDS = {
  DETAILED_PROMPT_LENGTH: 20
} as const; 