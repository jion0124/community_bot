import { buildAnalysisPrompt, defaultSystemPrompt } from '../../lib/promptTemplates';

export interface PromptConfig {
  systemPrompt: string;
  userPrompt: string;
  channelName: string;
  messageHistory: string;
}

export interface AnalysisPromptResult {
  system: string;
  user: string;
}

export class PromptBuilderService {
  /**
   * 分析用プロンプトを構築する
   */
  static buildAnalysisPrompt(
    userInput: string,
    defaultPrompt: any | null,
    channelName: string,
    messageHistory: string
  ): AnalysisPromptResult {
    const config = this.createPromptConfig(userInput, defaultPrompt, channelName, messageHistory);
    
    return buildAnalysisPrompt(
      config.systemPrompt,
      config.userPrompt,
      config.channelName,
      config.messageHistory
    );
  }

  /**
   * プロンプト設定を作成する
   */
  private static createPromptConfig(
    userInput: string,
    defaultPrompt: any | null,
    channelName: string,
    messageHistory: string
  ): PromptConfig {
    if (defaultPrompt) {
      return this.createConfigWithDefaultPrompt(userInput, defaultPrompt, channelName, messageHistory);
    } else {
      return this.createConfigWithoutDefaultPrompt(userInput, channelName, messageHistory);
    }
  }

  /**
   * デフォルトプロンプトがある場合の設定作成
   */
  private static createConfigWithDefaultPrompt(
    userInput: string,
    defaultPrompt: any,
    channelName: string,
    messageHistory: string
  ): PromptConfig {
    const userPromptLength = userInput.length;
    const isUserPromptDetailed = userPromptLength > 20;
    
    let userPrompt: string;
    
    if (isUserPromptDetailed) {
      userPrompt = `【主要な分析指示】
${userInput}

【参考情報】
${defaultPrompt.user_prompt}`;
    } else {
      userPrompt = `【分析指示】
${userInput}

【分析の方向性】
${defaultPrompt.user_prompt}`;
    }

    return {
      systemPrompt: defaultPrompt.system_prompt,
      userPrompt,
      channelName,
      messageHistory
    };
  }

  /**
   * デフォルトプロンプトがない場合の設定作成
   */
  private static createConfigWithoutDefaultPrompt(
    userInput: string,
    channelName: string,
    messageHistory: string
  ): PromptConfig {
    return {
      systemPrompt: defaultSystemPrompt,
      userPrompt: `【分析指示】
${userInput}`,
      channelName,
      messageHistory
    };
  }
} 