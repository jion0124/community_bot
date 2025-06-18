-- Bot設定テーブルのupdated_atトリガーを追加
-- 既存のテーブルがある場合は、このスクリプトを実行してください

-- updated_at を自動更新する関数（既に存在する場合はスキップ）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- bot_settingsテーブルにupdated_atトリガーを追加（既に存在する場合はスキップ）
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_bot_settings_updated_at'
  ) THEN
    CREATE TRIGGER update_bot_settings_updated_at
      BEFORE UPDATE ON bot_settings
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- テーブル構造の確認
SELECT 
  table_name,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'bot_settings'
ORDER BY ordinal_position;

-- トリガーの確認
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'bot_settings'; 