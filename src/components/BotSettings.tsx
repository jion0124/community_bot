'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Bot, Settings, Save, Play, AlertCircle, CheckCircle, Sparkles, Clock } from 'lucide-react'

interface SavedPrompt {
  id: string
  name: string
  system_prompt: string
  user_prompt: string
  analysis_type: string
  created_at: string
  updated_at: string
}

interface BotSettingsProps {
  onTest: (promptId: string) => void
}

export function BotSettings({ onTest }: BotSettingsProps) {
  const [prompts, setPrompts] = useState<SavedPrompt[]>([])
  const [selectedPromptId, setSelectedPromptId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [currentDefaultPromptId, setCurrentDefaultPromptId] = useState<string | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      // プロンプト一覧を取得
      const promptsResponse = await fetch('/api/prompts')
      if (promptsResponse.ok) {
        const promptsData = await promptsResponse.json()
        setPrompts(promptsData || [])
      }

      // Bot設定を取得
      const settingsResponse = await fetch('/api/bot-settings')
      if (settingsResponse.ok) {
        const settingsData = await settingsResponse.json()
        setCurrentDefaultPromptId(settingsData.default_prompt_id)
        setSelectedPromptId(settingsData.default_prompt_id || '')
      }
    } catch (error) {
      console.error('データ読み込みエラー:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveSettings = async () => {
    if (!selectedPromptId) {
      alert('デフォルトプロンプトを選択してください')
      return
    }

    setIsSaving(true)
    setSaveStatus('idle')

    try {
      const response = await fetch('/api/bot-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          defaultPromptId: selectedPromptId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || '設定の保存に失敗しました')
      }

      setCurrentDefaultPromptId(selectedPromptId)
      setSaveStatus('success')
      
      // 3秒後にステータスをリセット
      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      console.error('設定保存エラー:', error)
      setSaveStatus('error')
      
      // エラーメッセージをアラートで表示
      if (error instanceof Error) {
        alert(`設定の保存に失敗しました: ${error.message}`)
      } else {
        alert('設定の保存に失敗しました')
      }
      
      // 3秒後にステータスをリセット
      setTimeout(() => setSaveStatus('idle'), 3000)
    } finally {
      setIsSaving(false)
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

  const selectedPrompt = prompts.find(p => p.id === selectedPromptId)

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-blue-800">Bot設定</h2>
              <p className="text-sm text-blue-600">読み込み中...</p>
            </div>
          </div>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-blue-200 rounded w-3/4"></div>
            <div className="h-3 bg-blue-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (prompts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-orange-800">Bot設定</h2>
              <p className="text-sm text-orange-600">プロンプトが保存されていません</p>
            </div>
          </div>
          <div className="text-center py-6">
            <p className="text-orange-700 mb-4">まずプロンプトを作成してください</p>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              プロンプトを作成
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* メイン設定カード */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <Settings className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-indigo-800">Discord Bot設定</h2>
            <p className="text-sm text-indigo-600">デフォルトプロンプトを設定して /analyze コマンドをカスタマイズ</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* プロンプト選択 */}
          <div className="space-y-3">
            <Label className="text-sm font-semibold text-indigo-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              デフォルトプロンプト
            </Label>
            <Select value={selectedPromptId} onValueChange={setSelectedPromptId}>
              <SelectTrigger className="h-14 border-2 border-indigo-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 bg-white">
                <SelectValue placeholder="デフォルトプロンプトを選択" />
              </SelectTrigger>
              <SelectContent>
                {prompts.map((prompt) => (
                  <SelectItem key={prompt.id} value={prompt.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{prompt.name}</span>
                      <Badge className={getAnalysisTypeColor(prompt.analysis_type)}>
                        {getAnalysisTypeLabel(prompt.analysis_type)}
                      </Badge>
                      {currentDefaultPromptId === prompt.id && (
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                          現在の設定
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-indigo-600 flex items-center gap-1">
              <Bot className="w-3 h-3" />
              このプロンプトが <code>/analyze</code> コマンドのデフォルトとして使用されます
            </p>
          </div>

          {/* 選択されたプロンプトのプレビュー */}
          {selectedPrompt && (
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-indigo-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <h4 className="font-semibold text-indigo-800">選択されたプロンプト</h4>
                <Badge className={getAnalysisTypeColor(selectedPrompt.analysis_type)}>
                  {getAnalysisTypeLabel(selectedPrompt.analysis_type)}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-indigo-600">システムプロンプト:</span>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 max-h-16 overflow-y-auto">
                    {selectedPrompt.system_prompt}
                  </div>
                </div>
                <div>
                  <span className="text-xs font-medium text-indigo-600">ユーザープロンプト:</span>
                  <div className="mt-1 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 max-h-16 overflow-y-auto">
                    {selectedPrompt.user_prompt}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 保存ステータス表示 */}
          {saveStatus === 'success' && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">設定が正常に保存されました</p>
                  <p className="text-sm text-green-600">Discord Botで即座に反映されます</p>
                </div>
              </div>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <p className="font-medium text-red-800">設定の保存に失敗しました</p>
                  <p className="text-sm text-red-600">もう一度お試しください</p>
                </div>
              </div>
            </div>
          )}

          {/* アクションボタン */}
          <div className="flex gap-3">
            <Button 
              onClick={handleSaveSettings} 
              disabled={isSaving || !selectedPromptId}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Save className="h-4 w-4 mr-2" />
              {isSaving ? '保存中...' : '設定を保存'}
            </Button>
            <Button 
              onClick={() => onTest(selectedPromptId)}
              disabled={!selectedPromptId}
              variant="outline"
              className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              <Play className="h-4 w-4 mr-2" />
              テスト
            </Button>
          </div>
        </div>
      </div>

      {/* 使用方法ガイド */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
          <Bot className="w-5 h-5" />
          使用方法
        </h3>
        <div className="space-y-3 text-sm text-blue-700">
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">1</span>
            <p>Discord上で <code className="bg-blue-100 px-1 rounded">/analyze</code> コマンドを使用</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">2</span>
            <p>設定されたデフォルトプロンプトが自動的に適用されます</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold">3</span>
            <p>ユーザーが追加の指示を入力した場合、設定されたプロンプトに追加されます</p>
          </div>
        </div>
      </div>
    </div>
  )
} 