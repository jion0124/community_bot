import { Interaction } from 'discord.js';
import { handleAnalyze } from '../commands/analyzeCommand';
import { handleAnalyzeSaved } from '../commands/analyzeSavedCommand';
import { handleListPrompts } from '../commands/listPromptsCommand';

export async function handleInteraction(interaction: Interaction): Promise<void> {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  try {
    switch (commandName) {
      case 'analyze':
        await handleAnalyze(interaction);
        break;
      case 'analyze-saved':
        await handleAnalyzeSaved(interaction);
        break;
      case 'list-prompts':
        await handleListPrompts(interaction);
        break;
      default:
        console.warn(`未実装のコマンド: ${commandName}`);
    }
  } catch (error) {
    console.error(`コマンド実行エラー (${commandName}):`, error);
    
    if (interaction.deferred) {
      await interaction.editReply('❌ コマンド実行中にエラーが発生しました。');
    } else {
      await interaction.reply({ 
        content: '❌ コマンド実行中にエラーが発生しました。', 
        ephemeral: true 
      });
    }
  }
}

module.exports = { handleInteraction }; 