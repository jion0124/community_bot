'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, Bot, Sparkles, Clock, AlertCircle } from 'lucide-react'

interface DefaultPrompt {
  id: string
  name: string
  system_prompt: string
  user_prompt: string
  analysis_type: string
}

interface DefaultPromptDisplayProps {
  onOpenBotSettings: () => void
}

export function DefaultPromptDisplay({ onOpenBotSettings }: DefaultPromptDisplayProps) {
  const [defaultPrompt, setDefaultPrompt] = useState<DefaultPrompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    loadDefaultPrompt()
  }, [])

  const loadDefaultPrompt = async () => {
    try {
      const response = await fetch('/api/bot-settings')
      if (response.ok) {
        const settings = await response.json()
        if (settings.default_prompt_id) {
          const promptResponse = await fetch('/api/prompts')
          if (promptResponse.ok) {
            const prompts = await promptResponse.json()
            const prompt = prompts.find((p: DefaultPrompt) => p.id === settings.default_prompt_id)
            setDefaultPrompt(prompt || null)
            setLastUpdated(new Date().toLocaleString('ja-JP'))
          }
        }
      }
    } catch (error) {
      console.error('デフォルトプロンプト読み込みエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAnalysisTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      event: 'イベント提案',
      engagement: 'エンゲージメント向上',
      moderation: 'モデレーション支援',
      custom: 'カスタム分析',
    }
    return labels[type] || type
  }

  const getAnalysisTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      event: 'bg-blue-100 text-blue-800 border-blue-200',
      engagement: 'bg-green-100 text-green-800 border-green-200',
      moderation: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      custom: 'bg-purple-100 text-purple-800 border-purple-200',
    }
    return colors[type] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  if (loading) {
    return (
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Bot className="w-5 h-5" />
            デフォルトプロンプト
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-blue-200 rounded w-3/4"></div>
            <div className="h-3 bg-blue-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!defaultPrompt) {
    return (
      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertCircle className="w-5 h-5" />
            デフォルトプロンプト
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center py-4">
            <div className="text-orange-600 font-medium mb-2">
              デフォルトプロンプトが設定されていません
            </div>
            <p className="text-sm text-orange-500 mb-4">
              Discord Botの /analyze コマンドで使用されるプロンプトを設定してください
            </p>
            <Button 
              onClick={onOpenBotSettings}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Bot設定を開く
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-800">
            <Sparkles className="w-5 h-5" />
            現在のデフォルトプロンプト
          </CardTitle>
          <Button 
            onClick={onOpenBotSettings}
            variant="outline" 
            size="sm"
            className="border-emerald-300 text-emerald-700 hover:bg-emerald-100"
          >
            <Settings className="w-4 h-4 mr-1" />
            変更
          </Button>
        </div>
        {lastUpdated && (
          <div className="flex items-center gap-1 text-xs text-emerald-600">
            <Clock className="w-3 h-3" />
            最終更新: {lastUpdated}
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-emerald-800">{defaultPrompt.name}</h3>
            <Badge className={getAnalysisTypeColor(defaultPrompt.analysis_type)}>
              {getAnalysisTypeLabel(defaultPrompt.analysis_type)}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div>
              <span className="text-xs font-medium text-emerald-700">システムプロンプト:</span>
              <div className="mt-1 p-3 bg-white rounded-lg border border-emerald-200 text-sm text-gray-700 max-h-20 overflow-y-auto">
                {defaultPrompt.system_prompt}
              </div>
            </div>
            
            <div>
              <span className="text-xs font-medium text-emerald-700">ユーザープロンプト:</span>
              <div className="mt-1 p-3 bg-white rounded-lg border border-emerald-200 text-sm text-gray-700 max-h-20 overflow-y-auto">
                {defaultPrompt.user_prompt}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-emerald-100 border border-emerald-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-emerald-800">
            <Bot className="w-4 h-4" />
            <span className="font-medium">Discord Bot で使用中</span>
          </div>
          <p className="text-xs text-emerald-700 mt-1">
            <code>/analyze</code> コマンドでこのプロンプトがデフォルトとして使用されます
          </p>
        </div>
      </CardContent>
    </Card>
  )
} 