import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface BotSettings {
  id: string;
  default_prompt_id: string | null;
  created_at: string;
  updated_at: string;
}

export async function getBotSettings(): Promise<BotSettings | null> {
  try {
    const { data, error } = await supabase
      .from('bot_settings')
      .select('*')
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116はデータが見つからないエラー
      console.error('Bot設定取得エラー:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Bot設定取得エラー:', error);
    return null;
  }
}

export async function getDefaultPrompt(): Promise<any | null> {
  try {
    const settings = await getBotSettings();
    
    if (!settings || !settings.default_prompt_id) {
      return null;
    }
    
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', settings.default_prompt_id)
      .single();
    
    if (error) {
      console.error('デフォルトプロンプト取得エラー:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('デフォルトプロンプト取得エラー:', error);
    return null;
  }
}

module.exports = { getBotSettings, getDefaultPrompt }; 