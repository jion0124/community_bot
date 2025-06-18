'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  TrendingUp, 
  Calendar, 
  Clock, 
  Target,
  BarChart3,
  Users,
  MessageSquare,
  Sparkles
} from 'lucide-react'

interface Stats {
  totalPrompts: number
  todayCreated: number
  thisMonthCreated: number
  averageResponseTime: number
  analysisTypes: {
    event: number
    engagement: number
    moderation: number
    custom: number
  }
}

export function Statistics() {
  const [stats, setStats] = useState<Stats>({
    totalPrompts: 0,
    todayCreated: 0,
    thisMonthCreated: 0,
    averageResponseTime: 0,
    analysisTypes: {
      event: 0,
      engagement: 0,
      moderation: 0,
      custom: 0
    }
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats')
      if (response.ok) {
        const data = await response.json()
        setStats({
          totalPrompts: data.totalPrompts ?? 0,
          todayCreated: data.todayCreated ?? 0,
          thisMonthCreated: data.thisMonthCreated ?? 0,
          averageResponseTime: data.averageResponseTime ?? 0,
          analysisTypes: {
            event: data.analysisTypes?.event ?? 0,
            engagement: data.analysisTypes?.engagement ?? 0,
            moderation: data.analysisTypes?.moderation ?? 0,
            custom: data.analysisTypes?.custom ?? 0
          }
        })
      }
    } catch (error) {
      console.error('統計取得エラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const statCards = [
    {
      title: '総プロンプト数',
      value: stats.totalPrompts,
      icon: Target,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      textColor: 'text-blue-700'
    },
    {
      title: '今日作成',
      value: stats.todayCreated,
      icon: Calendar,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      textColor: 'text-green-700'
    },
    {
      title: '今月作成',
      value: stats.thisMonthCreated,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-700'
    },
    {
      title: '平均応答時間',
      value: `${stats.averageResponseTime}s`,
      icon: Clock,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      textColor: 'text-orange-700'
    }
  ]

  const analysisTypeData = [
    { key: 'event', label: 'イベント提案', icon: Sparkles, color: 'bg-pink-500' },
    { key: 'engagement', label: 'エンゲージメント', icon: TrendingUp, color: 'bg-green-500' },
    { key: 'moderation', label: 'モデレーション', icon: Users, color: 'bg-blue-500' },
    { key: 'custom', label: 'カスタム', icon: MessageSquare, color: 'bg-purple-500' }
  ]

  const totalAnalysis = (Object.values(stats.analysisTypes ?? {}) as number[]).reduce((a, b) => a + b, 0)

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white pb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold">統計情報</CardTitle>
            <CardDescription className="text-indigo-100">
              プロンプト使用状況の詳細
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* メイン統計カード */}
            <div className="grid grid-cols-2 gap-4">
              {statCards.map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgColor} border border-white/50`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg shadow-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-600">{stat.title}</p>
                        <p className={`text-lg font-bold ${stat.textColor}`}>
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* 分析タイプ別統計 */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                分析タイプ別使用状況
              </h3>
              
              <div className="space-y-3">
                {analysisTypeData.map((type) => {
                  const Icon = type.icon
                  const count = stats.analysisTypes?.[type.key as keyof typeof stats.analysisTypes] ?? 0
                  const percentage = totalAnalysis > 0 ? Math.round((count / totalAnalysis) * 100) : 0
                  
                  return (
                    <div key={type.key} className="flex items-center gap-3">
                      <div className={`p-2 ${type.color} rounded-lg shadow-sm`}>
                        <Icon className="w-3 h-3 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium text-gray-700">{type.label}</span>
                          <span className="text-gray-500">{count}回 ({percentage}%)</span>
                        </div>
                        <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 ${type.color} rounded-full transition-all duration-500`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* 総計 */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">総分析回数</span>
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  {totalAnalysis} 回
                </Badge>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
} 