import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Bot設定を取得
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('bot_settings')
      .select('*')
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116はデータが見つからないエラー
      console.error('Bot設定取得エラー:', error)
      return NextResponse.json(
        { error: 'Bot設定の取得に失敗しました' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data || { default_prompt_id: null })
  } catch (error) {
    console.error('Bot設定取得エラー:', error)
    return NextResponse.json(
      { error: 'Bot設定の取得に失敗しました' },
      { status: 500 }
    )
  }
}

// Bot設定を保存
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { defaultPromptId } = body
    
    // プロンプトの存在確認
    if (defaultPromptId) {
      const { data: promptExists, error: promptError } = await supabase
        .from('prompts')
        .select('id')
        .eq('id', defaultPromptId)
        .single()
      
      if (promptError || !promptExists) {
        console.error('プロンプト存在確認エラー:', promptError)
        return NextResponse.json(
          { error: '指定されたプロンプトが見つかりません' },
          { status: 400 }
        )
      }
    }
    
    // 既存の設定を確認
    const { data: existingSettings, error: selectError } = await supabase
      .from('bot_settings')
      .select('*')
      .single()
    
    if (selectError && selectError.code !== 'PGRST116') {
      console.error('Bot設定確認エラー:', selectError)
      return NextResponse.json(
        { error: 'Bot設定の確認に失敗しました' },
        { status: 500 }
      )
    }
    
    let result
    if (existingSettings) {
      // 既存の設定を更新
      const { data, error } = await supabase
        .from('bot_settings')
        .update({ 
          default_prompt_id: defaultPromptId,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings.id)
        .select()
        .single()
      
      if (error) {
        console.error('Bot設定更新エラー:', error)
        return NextResponse.json(
          { error: 'Bot設定の更新に失敗しました' },
          { status: 500 }
        )
      }
      result = data
    } else {
      // 新しい設定を作成
      const { data, error } = await supabase
        .from('bot_settings')
        .insert([{ 
          default_prompt_id: defaultPromptId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()
      
      if (error) {
        console.error('Bot設定作成エラー:', error)
        return NextResponse.json(
          { error: 'Bot設定の作成に失敗しました' },
          { status: 500 }
        )
      }
      result = data
    }
    
    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('API エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラー' },
      { status: 500 }
    )
  }
} 