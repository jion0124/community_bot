import { TextChannel } from 'discord.js';

export async function buildMessageHistory(channel: TextChannel): Promise<string> {
  try {
    // 最新 20 件メッセージを取得
    const messages = await channel.messages.fetch({ limit: 20 });
    
    // 履歴を構築
    const history = messages
      .map(m => `- **${m.author.username}**: ${m.content}`)
      .reverse()
      .join('\n');
    
    return history;
  } catch (error) {
    console.error('メッセージ履歴取得エラー:', error);
    return '（メッセージ履歴の取得に失敗しました）';
  }
}

module.exports = { buildMessageHistory }; 