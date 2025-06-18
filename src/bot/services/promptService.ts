import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface SavedPrompt {
  id: string;
  name: string;
  system_prompt: string;
  user_prompt: string;
  analysis_type: string;
  channel_name: string;
  created_at: string;
  updated_at: string;
}

export async function loadPrompts(): Promise<SavedPrompt[]> {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('プロンプト取得エラー:', error);
      return [];
    }
    
    // デバッグ: 取得されたプロンプトの内容をログ出力
    console.log('=== 取得されたプロンプト一覧 ===');
    if (data && data.length > 0) {
      data.forEach((prompt, index) => {
        console.log(`プロンプト ${index + 1}:`);
        console.log('  ID:', prompt.id);
        console.log('  名前:', prompt.name);
        console.log('  システムプロンプト:', prompt.system_prompt);
        console.log('  ユーザープロンプト:', prompt.user_prompt);
        console.log('  分析タイプ:', prompt.analysis_type);
        console.log('---');
      });
    } else {
      console.log('プロンプトが見つかりませんでした');
    }
    
    return data || [];
  } catch (error) {
    console.error('プロンプト取得エラー:', error);
    return [];
  }
}

module.exports = { loadPrompts }; 