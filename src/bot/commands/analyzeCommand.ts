import { SlashCommandBuilder, ChannelType, ChatInputCommandInteraction, TextChannel } from 'discord.js';
import { analyzePrompt } from '../services/openaiService';
import { buildMessageHistory } from '../utils/messageHistory';
import { PromptBuilderService } from '../services/promptBuilderService';
import { getDefaultPrompt } from '../services/botSettingsService';
import { 
  COMMAND_NAMES, 
  COMMAND_DESCRIPTIONS, 
  OPTION_NAMES, 
  OPTION_DESCRIPTIONS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} from '../constants/commandConstants';
import { AnalysisRequest, AnalysisResult } from '../types/analysisTypes';

export const analyzeCommand = new SlashCommandBuilder()
  .setName(COMMAND_NAMES.ANALYZE)
  .setDescription(COMMAND_DESCRIPTIONS.ANALYZE)
  .addChannelOption(opt =>
    opt.setName(OPTION_NAMES.CHANNEL)
       .setDescription(OPTION_DESCRIPTIONS.CHANNEL)
       .addChannelTypes(ChannelType.GuildText)
       .setRequired(true)
  )
  .addStringOption(opt =>
    opt.setName(OPTION_NAMES.PROMPT)
       .setDescription(OPTION_DESCRIPTIONS.PROMPT)
       .setRequired(true)
  )
  .toJSON();

export async function handleAnalyze(interaction: ChatInputCommandInteraction): Promise<void> {
  const request = extractAnalysisRequest(interaction);
  
  await interaction.deferReply();

  try {
    const result = await performAnalysis(request);
    
    if (result.success) {
      await interaction.editReply(result.result);
    } else {
      await interaction.editReply(result.error || ERROR_MESSAGES.ANALYSIS_ERROR);
    }
  } catch (error) {
    console.error('分析エラー:', error);
    await interaction.editReply(ERROR_MESSAGES.ANALYSIS_ERROR);
  }
}

/**
 * 分析リクエストを抽出する
 */
function extractAnalysisRequest(interaction: ChatInputCommandInteraction): AnalysisRequest {
  const channel = interaction.options.getChannel(OPTION_NAMES.CHANNEL, true);
  const prompt = interaction.options.getString(OPTION_NAMES.PROMPT, true);
  
  return { channel, prompt };
}

/**
 * 分析を実行する
 */
async function performAnalysis(request: AnalysisRequest): Promise<AnalysisResult> {
  // チャンネルタイプの検証
  if (request.channel.type !== ChannelType.GuildText) {
    return {
      success: false,
      result: '',
      error: ERROR_MESSAGES.TEXT_CHANNEL_ONLY
    };
  }

  // デフォルトプロンプトの取得
  const defaultPrompt = await getDefaultPrompt();
  
  // メッセージ履歴の取得
  const messageHistory = await buildMessageHistory(request.channel as TextChannel);
  
  // プロンプトの構築
  const promptResult = PromptBuilderService.buildAnalysisPrompt(
    request.prompt,
    defaultPrompt,
    request.channel.name || 'general',
    messageHistory
  );

  // GPT分析の実行
  const analysisResult = await analyzePrompt(promptResult.system, promptResult.user);

  // 結果の構築
  const promptName = defaultPrompt ? defaultPrompt.name : undefined;
  const result = SUCCESS_MESSAGES.ANALYSIS_RESULT(request.channel.name || 'general', promptName) + analysisResult;

  return {
    success: true,
    result
  };
} 