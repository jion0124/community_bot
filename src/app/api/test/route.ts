import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { buildAnalysisPrompt } from '@/lib/promptTemplates'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { systemPrompt, userPrompt, debug = false } = body

    if (!systemPrompt || !userPrompt) {
      return NextResponse.json(
        { error: 'システムプロンプトとユーザープロンプトが必要です' },
        { status: 400 }
      )
    }

    // デバッグ: 入力されたプロンプトの内容をログ出力
    console.log('=== テストAPI 入力プロンプト ===')
    console.log('システムプロンプト:', systemPrompt)
    console.log('ユーザープロンプト:', userPrompt)

    // 共通のプロンプト構築関数を使用
    const { system, user } = buildAnalysisPrompt(systemPrompt, userPrompt)

    // デバッグ: 構築されたプロンプトの内容をログ出力
    console.log('=== テストAPI 構築されたプロンプト ===')
    console.log('システムプロンプト:', system)
    console.log('ユーザープロンプト:', user)

    // デバッグモードの場合はプロンプト内容も返す
    if (debug) {
      return NextResponse.json({
        success: true,
        debug: {
          systemPrompt: system,
          userPrompt: user,
          originalSystemPrompt: systemPrompt,
          originalUserPrompt: userPrompt
        }
      })
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    const result = response.choices?.[0]?.message?.content ?? '（分析結果が空でした）'

    return NextResponse.json({
      success: true,
      result,
      usage: response.usage,
      debug: {
        systemPrompt: system,
        userPrompt: user
      }
    })

  } catch (error) {
    console.error('GPTテスト実行エラー:', error)
    return NextResponse.json(
      { error: 'テスト実行に失敗しました' },
      { status: 500 }
    )
  }
} 