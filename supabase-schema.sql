-- プロンプトテーブルの作成
CREATE TABLE prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  system_prompt TEXT NOT NULL,
  user_prompt TEXT NOT NULL,
  analysis_type VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bot設定テーブルの作成
CREATE TABLE bot_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  default_prompt_id UUID REFERENCES prompts(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLSの設定
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON prompts FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON prompts FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON prompts FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON prompts FOR DELETE USING (true);

ALTER TABLE bot_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access for all users" ON bot_settings FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON bot_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON bot_settings FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON bot_settings FOR DELETE USING (true);

-- サンプルデータの挿入
INSERT INTO prompts (name, system_prompt, user_prompt, analysis_type) VALUES
(
  'イベント提案プロンプト',
  'あなたは有能なコミュニティマネージャーです。\n\n回答のポイント：\n- 具体的で実現可能な提案\n- コミュニティの特性を考慮\n- 分かりやすく構造化\n- 日本語で回答',
  'このコミュニティで盛り上がっているトピックを基に、具体的なイベント案を提案してください。',
  'event'
),
(
  'エンゲージメント向上プロンプト',
  'あなたは有能なコミュニティマネージャーです。\n\n回答のポイント：\n- 具体的で実現可能な提案\n- コミュニティの特性を考慮\n- 分かりやすく構造化\n- 日本語で回答',
  'このコミュニティの会話を分析し、エンゲージメント向上のための施策を提案してください。',
  'engagement'
),
(
  'モデレーション支援プロンプト',
  'あなたは有能なコミュニティマネージャーです。\n\n回答のポイント：\n- 具体的で実現可能な提案\n- コミュニティの特性を考慮\n- 分かりやすく構造化\n- 日本語で回答',
  'このコミュニティの会話を分析し、モデレーションの改善点を指摘してください。',
  'moderation'
);

-- updated_at を自動更新する関数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_at の自動更新トリガー
CREATE TRIGGER update_prompts_updated_at
  BEFORE UPDATE ON prompts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bot_settings_updated_at
  BEFORE UPDATE ON bot_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column(); 