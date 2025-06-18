import { Client, REST, Routes } from 'discord.js';
import { analyzeCommand } from './analyzeCommand';
import { analyzeSavedCommand } from './analyzeSavedCommand';
import { listPromptsCommand } from './listPromptsCommand';

const GUILD_ID = process.env.GUILD_ID || '1314144873917579334';

// コマンド定義
export const commands = [
  analyzeCommand,
  analyzeSavedCommand,
  listPromptsCommand,
];

// コマンド初期化
export async function initializeCommands(client: Client): Promise<void> {
  try {
    console.log('⏳ ギルドコマンドを登録中…');
    
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID!, GUILD_ID),
      { body: commands }
    );
    
    console.log(`✅ コマンドをサーバー(${GUILD_ID})に登録しました`);
  } catch (error) {
    console.error('❌ コマンド登録エラー:', error);
  }
} 