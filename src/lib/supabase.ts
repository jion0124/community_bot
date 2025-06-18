import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// クライアントサイド用（匿名キー）
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// サーバーサイド用（サービスロールキー）
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// データベースの型定義
export interface Prompt {
  id: string
  name: string
  system_prompt: string
  user_prompt: string
  analysis_type: string
  channel_name: string
  created_at: string
  updated_at: string
} 