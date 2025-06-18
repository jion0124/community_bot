import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// プロンプト一覧を取得
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('プロンプト取得エラー:', error)
      return NextResponse.json(
        { error: 'プロンプトの取得に失敗しました' },
        { status: 500 }
      )
    }
    
    return NextResponse.json(data || [])
  } catch (error) {
    console.error('プロンプト取得エラー:', error)
    return NextResponse.json(
      { error: 'プロンプトの取得に失敗しました' },
      { status: 500 }
    )
  }
}

// 新しいプロンプトを保存
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, systemPrompt, userPrompt, analysisType } = body
    
    // デバッグ: 保存されるプロンプトの内容をログ出力
    console.log('=== プロンプト保存情報 ===')
    console.log('プロンプト名:', name)
    console.log('システムプロンプト:', systemPrompt)
    console.log('ユーザープロンプト:', userPrompt)
    console.log('分析タイプ:', analysisType)
    
    const { data, error } = await supabase
      .from('prompts')
      .insert([
        {
          name,
          system_prompt: systemPrompt,
          user_prompt: userPrompt,
          analysis_type: analysisType,
        }
      ])
      .select()
    
    if (error) {
      console.error('プロンプト保存エラー:', error)
      return NextResponse.json(
        { error: 'プロンプトの保存に失敗しました' },
        { status: 500 }
      )
    }
    
    console.log('プロンプト保存成功:', data[0])
    return NextResponse.json({ success: true, data: data[0] })
  } catch (error) {
    console.error('API エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラー' },
      { status: 500 }
    )
  }
} 