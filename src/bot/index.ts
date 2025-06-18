import 'dotenv/config';
import { Client, GatewayIntentBits, Message } from 'discord.js';
import { initializeCommands } from './commands';
import { handleInteraction } from './handlers/interactionHandler';
import { validateEnvironment } from './utils/environment';

// 環境変数の検証
validateEnvironment();

// Discord クライアント初期化
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Ready イベント
client.once('ready', async () => {
  console.log(`✅ Bot is online! Logged in as ${client.user?.tag}`);
  await initializeCommands(client);
});

// Interaction 処理
client.on('interactionCreate', handleInteraction);

// メッセージ処理
client.on('messageCreate', async (message: Message) => {
  // Bot自身のメッセージは無視
  if (message.author.bot) return;

  // ping-pong テスト
  if (message.content === 'ping') {
    await message.reply('pong');
  }
});

// Bot 起動
client.login(process.env.DISCORD_TOKEN); 