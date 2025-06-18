'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Copy, Eye } from 'lucide-react'

interface SavedPrompt {
  id: string
  name: string
  system_prompt: string
  user_prompt: string
  analysis_type: string
  created_at: string
  updated_at: string
}

interface PromptListProps {
  onEdit: (prompt: SavedPrompt) => void
  onDelete: (id: string) => void
  onCopy: (prompt: SavedPrompt) => void
}

export function PromptList({ onEdit, onDelete, onCopy }: PromptListProps) {
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
      } else {
        console.error('プロンプト取得エラー:', response.statusText)
      }
    } catch (error) {
      console.error('プロンプト取得エラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('このプロンプトを削除しますか？')) return

    try {
      const response = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setPrompts(prompts.filter(p => p.id !== id))
        onDelete(id)
      }
    } catch (error) {
      console.error('削除エラー:', error)
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
      <Card>
        <CardHeader>
          <CardTitle>保存されたプロンプト</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">読み込み中...</div>
        </CardContent>
      </Card>
    )
  }

  if (prompts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>保存されたプロンプト</CardTitle>
          <CardDescription>まだプロンプトが保存されていません</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            プロンプトを作成して保存してください
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>保存されたプロンプト ({prompts.length})</CardTitle>
        <CardDescription>Discord Botで使用できるプロンプト一覧</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{prompt.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getAnalysisTypeColor(prompt.analysis_type)}>
                      {getAnalysisTypeLabel(prompt.analysis_type)}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onCopy(prompt)}
                    title="コピー"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(prompt)}
                    title="編集"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(prompt.id)}
                    title="削除"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-2">
                <div>
                  <span className="font-medium">システムプロンプト:</span>
                  <p className="mt-1 bg-gray-50 p-2 rounded text-xs">
                    {prompt.system_prompt.substring(0, 100)}
                    {prompt.system_prompt.length > 100 && '...'}
                  </p>
                </div>
                <div>
                  <span className="font-medium">ユーザープロンプト:</span>
                  <p className="mt-1 bg-gray-50 p-2 rounded text-xs">
                    {prompt.user_prompt.substring(0, 100)}
                    {prompt.user_prompt.length > 100 && '...'}
                  </p>
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                作成日: {new Date(prompt.created_at).toLocaleDateString('ja-JP')}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 