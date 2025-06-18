import { Message } from 'discord.js';

export async function handleMessage(message: Message): Promise<void> {
  // Bot自身のメッセージは無視
  if (message.author.bot) return;

  // ping-pong テスト
  if (message.content === 'ping') {
    await message.reply('pong');
  }
} 