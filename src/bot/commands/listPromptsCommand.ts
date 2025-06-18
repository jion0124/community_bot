import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { loadPrompts } from '../services/promptService';

export const listPromptsCommand = new SlashCommandBuilder()
  .setName('list-prompts')
  .setDescription('保存されたプロンプトの一覧を表示します')
  .toJSON();

export async function handleListPrompts(interaction: ChatInputCommandInteraction): Promise<void> {
  await interaction.deferReply();

  try {
    const prompts = await loadPrompts();

    if (prompts.length === 0) {
      await interaction.editReply('📝 保存されたプロンプトがありません。\nWebアプリからプロンプトを保存してください。');
      return;
    }

    const promptList = prompts
      .map(p => `• **${p.name}** (${p.analysis_type})
  📝 システムプロンプト: ${p.system_prompt.substring(0, 150)}...
  💬 ユーザープロンプト: ${p.user_prompt.substring(0, 150)}...`)
      .join('\n\n');

    await interaction.editReply(
      `📝 **保存されたプロンプト一覧**\n\n${promptList}\n\n使用するには: \`/analyze-saved channel:#チャンネル名 prompt-name:プロンプト名\``
    );

  } catch (error) {
    console.error('プロンプト一覧取得エラー:', error);
    await interaction.editReply('❌ プロンプト一覧の取得に失敗しました。');
  }
} 