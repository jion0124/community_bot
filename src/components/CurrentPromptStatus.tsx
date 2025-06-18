'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Settings, Eye, Edit, Plus } from 'lucide-react'

interface SavedPrompt {
  id: string
  name: string
  system_prompt: string
  user_prompt: string
  analysis_type: string
  created_at: string
  updated_at: string
}

interface CurrentPromptStatusProps {
  onShowPrompts: () => void
  onCreatePrompt: () => void
}

export function CurrentPromptStatus({ onShowPrompts, onCreatePrompt }: CurrentPromptStatusProps) {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPrompts()
  }, [])

  const loadPrompts = async () => {
    try {
      const response = await fetch('/api/prompts')
      if (response.ok) {
        const data = await response.json()
        setPrompts(data || [])
      }
    } catch (error) {
      console.error('プロンプト取得エラー:', error)
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
      event: 'bg-blue-100 text-blue-800',
      engagement: 'bg-green-100 text-green-800',
      moderation: 'bg-yellow-100 text-yellow-800',
      custom: 'bg-purple-100 text-purple-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <Card className="border-2 border-dashed border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            現在のプロンプト状況
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-gray-500">読み込み中...</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-dashed border-gray-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            現在のプロンプト状況
          </CardTitle>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCreatePrompt}
              className="flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              新規作成
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onShowPrompts}
              className="flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              一覧表示
            </Button>
          </div>
        </div>
        <CardDescription>
          保存済みプロンプト: {prompts.length}件
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {prompts.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">プロンプトが保存されていません</p>
            <p className="text-sm">Discord Botで使用するプロンプトを作成してください</p>
            <Button
              variant="outline"
              size="sm"
              onClick={onCreatePrompt}
              className="mt-3 flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              プロンプトを作成
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-700">最新のプロンプト:</p>
            {prompts.slice(0, 3).map((prompt) => (
              <div
                key={prompt.id}
                className="p-3 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{prompt.name}</h4>
                  <Badge className={getAnalysisTypeColor(prompt.analysis_type)}>
                    {getAnalysisTypeLabel(prompt.analysis_type)}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p className="line-clamp-2">
                    <span className="font-medium">システム:</span> {prompt.system_prompt.substring(0, 100)}...
                  </p>
                  <p className="line-clamp-2">
                    <span className="font-medium">ユーザー:</span> {prompt.user_prompt.substring(0, 100)}...
                  </p>
                </div>
              </div>
            ))}
            {prompts.length > 3 && (
              <div className="text-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onShowPrompts}
                  className="text-blue-600 hover:text-blue-700"
                >
                  他 {prompts.length - 3}件のプロンプトを表示
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 