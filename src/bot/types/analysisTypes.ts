// 分析関連の型定義

export interface AnalysisRequest {
  channel: any;
  prompt: string;
  promptName?: string;
}

export interface AnalysisResult {
  success: boolean;
  result: string;
  error?: string;
}

export interface PromptInfo {
  id: string;
  name: string;
  system_prompt: string;
  user_prompt: string;
  analysis_type: string;
  created_at: string;
  updated_at: string;
}

export interface AnalysisContext {
  channelName: string;
  messageHistory: string;
  userInput: string;
  defaultPrompt: PromptInfo | null;
}

export interface AnalysisOptions {
  useDefaultPrompt: boolean;
  isDetailedPrompt: boolean;
  promptLength: number;
} 