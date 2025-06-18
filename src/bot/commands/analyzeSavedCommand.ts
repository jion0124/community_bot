import { SlashCommandBuilder, ChannelType, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { analyzePrompt } from '../services/openaiService';
import { loadPrompts } from '../services/promptService';
import { buildMessageHistory } from '../utils/messageHistory';
import { PromptBuilderService } from '../services/promptBuilderService';
import { 
  COMMAND_NAMES, 
  COMMAND_DESCRIPTIONS, 
  OPTION_NAMES, 
  OPTION_DESCRIPTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} from '../constants/commandConstants';
import { AnalysisRequest, AnalysisResult, PromptInfo } from '../types/analysisTypes';

export const analyzeSavedCommand = new SlashCommandBuilder()
  .setName(COMMAND_NAMES.ANALYZE_SAVED)
  .setDescription(COMMAND_DESCRIPTIONS.ANALYZE_SAVED)
  .addChannelOption(opt =>
    opt.setName(OPTION_NAMES.CHANNEL)
       .setDescription(OPTION_DESCRIPTIONS.CHANNEL)
       .addChannelTypes(ChannelType.GuildText)
       .setRequired(true)
  )
  .addStringOption(opt =>
    opt.setName(OPTION_NAMES.PROMPT_NAME)
       .setDescription(OPTION_DESCRIPTIONS.PROMPT_NAME)
       .setRequired(true)
  )
  .toJSON();

export async function handleAnalyzeSaved(interaction: ChatInputCommandInteraction): Promise<void> {
  const request = extractSavedAnalysisRequest(interaction);
  
  await interaction.deferReply();

  try {
    const result = await performSavedAnalysis(request);
    
    if (result.success) {
      await interaction.editReply(result.result);
    } else {
      await interaction.editReply(result.error || ERROR_MESSAGES.SAVED_PROMPT_ANALYSIS_ERROR);
    }
  } catch (error) {
    console.error('保存されたプロンプト分析エラー:', error);
    await interaction.editReply(ERROR_MESSAGES.SAVED_PROMPT_ANALYSIS_ERROR);
  }
}

/**
 * 保存済み分析リクエストを抽出する
 */
function extractSavedAnalysisRequest(interaction: ChatInputCommandInteraction): AnalysisRequest & { promptName: string } {
  const channel = interaction.options.getChannel(OPTION_NAMES.CHANNEL, true);
  const promptName = interaction.options.getString(OPTION_NAMES.PROMPT_NAME, true);
  
  return { channel, prompt: '', promptName };
}

/**
 * 保存済みプロンプトでの分析を実行する
 */
async function performSavedAnalysis(request: AnalysisRequest & { promptName: string }): Promise<AnalysisResult> {
  // チャンネルタイプの検証
  if (request.channel.type !== ChannelType.GuildText) {
    return {
      success: false,
      result: '',
      error: ERROR_MESSAGES.TEXT_CHANNEL_ONLY
    };
  }

  // 保存されたプロンプトの読み込み
  const prompts = await loadPrompts();
  const selectedPrompt = prompts.find(p => p.name === request.promptName);

  if (!selectedPrompt) {
    return {
      success: false,
      result: '',
      error: ERROR_MESSAGES.PROMPT_NOT_FOUND(request.promptName)
    };
  }

  // メッセージ履歴の取得
  const messageHistory = await buildMessageHistory(request.channel as TextChannel);

  // プロンプトの構築
  const promptResult = PromptBuilderService.buildAnalysisPrompt(
    '', // 保存済みプロンプトの場合は空文字
    selectedPrompt,
    request.channel.name || 'general',
    messageHistory
  );

  // GPT分析の実行
  const analysisResult = await analyzePrompt(promptResult.system, promptResult.user);

  // 結果の構築
  const result = SUCCESS_MESSAGES.ANALYSIS_RESULT(request.channel.name || 'general', selectedPrompt.name) + analysisResult;

  return {
    success: true,
    result
  };
} 