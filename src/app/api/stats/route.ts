import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 今日の日付を取得
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // 今月の日付を取得
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    // プロンプト総数
    const { count: totalPrompts } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true });

    // 今日作成されたプロンプト数
    const { count: todayPrompts } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfDay.toISOString())
      .lt('created_at', endOfDay.toISOString());

    // 今月作成されたプロンプト数
    const { count: monthPrompts } = await supabase
      .from('prompts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())
      .lt('created_at', endOfMonth.toISOString());

    // 分析タイプ別の統計
    const { data: analysisTypes } = await supabase
      .from('prompts')
      .select('analysis_type');

    const typeStats = analysisTypes?.reduce((acc, prompt) => {
      acc[prompt.analysis_type] = (acc[prompt.analysis_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>) || {};

    return NextResponse.json({
      totalPrompts: totalPrompts || 0,
      todayPrompts: todayPrompts || 0,
      monthPrompts: monthPrompts || 0,
      typeStats,
      averageResponseTime: '2.3秒', // 将来的に実際のデータから計算
    });
  } catch (error) {
    console.error('統計取得エラー:', error);
    return NextResponse.json({ error: '統計の取得に失敗しました' }, { status: 500 });
  }
} 