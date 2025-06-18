'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  Play, 
  Sparkles, 
  Zap, 
  Target, 
  MessageSquare,
  Lightbulb,
  Shield,
  Settings,
  Plus,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { promptTemplates } from '@/lib/promptTemplates'

interface PromptFormProps {
  promptName: string
  setPromptName: (name: string) => void
  systemPrompt: string
  setSystemPrompt: (prompt: string) => void
  userPrompt: string
  setUserPrompt: (prompt: string) => void
  analysisType: string
  setAnalysisType: (type: string) => void
  isLoading: boolean
  onSave: () => void
  onTest: () => void
  onTemplateChange: (type: string) => void
}

export function PromptForm({
  promptName,
  setPromptName,
  systemPrompt,
  setSystemPrompt,
  userPrompt,
  setUserPrompt,
  analysisType,
  setAnalysisType,
  isLoading,
  onSave,
  onTest,
  onTemplateChange
}: PromptFormProps) {
  const [activeTab, setActiveTab] = useState<'create' | 'templates'>('create')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const templateIcons = {
    event: Sparkles,
    engagement: Zap,
    moderation: Shield,
    custom: Settings
  }

  const templateColors = {
    event: 'from-pink-500 to-rose-500',
    engagement: 'from-green-500 to-emerald-500',
    moderation: 'from-blue-500 to-cyan-500',
    custom: 'from-purple-500 to-violet-500'
  }

  const handleTemplateSelect = (type: string) => {
    setAnalysisType(type)
    onTemplateChange(type)
    setActiveTab('create')
  }

  const handleReset = () => {
    setPromptName('')
    setSystemPrompt('あなたは有能なコミュニティマネージャーです。コミュニティ活性化のための具体的なイベントやアクションプランの提案に長けています。\n\n以下の点に注意して回答してください：\n- 具体的で実現可能な提案を行う\n- コミュニティの特性を考慮した提案\n- エンゲージメントを最大化する施策\n- 分かりやすく構造化された回答\n- 日本語で回答')
    setUserPrompt('')
    setAnalysisType('event')
  }

  const isFormValid = promptName.trim() && systemPrompt.trim() && userPrompt.trim()

  return (
    <div className="space-y-6">
      {/* メインカード */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Sparkles className="w-6 h-6" />
                </div>
                プロンプト作成
              </CardTitle>
              <CardDescription className="text-blue-100 mt-2">
                AI 分析用のプロンプトを作成・管理します
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              リセット
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8 space-y-8">
          {/* タブナビゲーション */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'create'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              作成
            </button>
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 py-3 px-6 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTab === 'templates'
                  ? 'bg-white text-blue-600 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Lightbulb className="w-4 h-4 inline mr-2" />
              テンプレート
            </button>
          </div>

          {activeTab === 'create' ? (
            <div className="space-y-8">
              {/* プロンプト名 */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Target className="w-4 h-4 text-blue-600" />
                  プロンプト名
                  <Badge variant="outline" className="text-xs bg-blue-50">必須</Badge>
                </label>
                <Input
                  value={promptName}
                  onChange={(e) => setPromptName(e.target.value)}
                  placeholder="例: イベント提案プロンプト"
                  className="h-12 border-2 border-gray-200 rounded-xl px-4 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                />
                {promptName && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    プロンプト名が入力されました
                  </div>
                )}
              </div>

              {/* 分析タイプ */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-green-600" />
                  分析タイプ
                </label>
                <Select value={analysisType} onValueChange={setAnalysisType}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
                    <SelectValue placeholder="分析タイプを選択" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="event">🎉 イベント提案</SelectItem>
                    <SelectItem value="engagement">📈 エンゲージメント向上</SelectItem>
                    <SelectItem value="moderation">🛡️ モデレーション支援</SelectItem>
                    <SelectItem value="custom">⚙️ カスタム分析</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* システムプロンプト */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Settings className="w-4 h-4 text-purple-600" />
                  システムプロンプト
                  <Badge variant="outline" className="text-xs bg-purple-50">AIの役割定義</Badge>
                </label>
                <Textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  placeholder="AIの役割や回答の方向性を定義してください..."
                  className="min-h-[140px] border-2 border-gray-200 rounded-xl p-4 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-200 resize-none"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>AIの基本的な役割と回答スタイルを設定</span>
                  <span>{systemPrompt.length} 文字</span>
                </div>
              </div>

              {/* ユーザープロンプト */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                  ユーザープロンプト
                  <Badge variant="outline" className="text-xs bg-orange-50">分析指示</Badge>
                </label>
                <Textarea
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  placeholder="具体的な分析指示や質問を入力してください..."
                  className="min-h-[140px] border-2 border-gray-200 rounded-xl p-4 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 transition-all duration-200 resize-none"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>具体的な分析内容や質問を設定</span>
                  <span>{userPrompt.length} 文字</span>
                </div>
              </div>

              {/* アクションボタン */}
              <div className="flex gap-4 pt-6">
                <Button
                  onClick={onTest}
                  disabled={isLoading || !systemPrompt.trim() || !userPrompt.trim()}
                  className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {isLoading ? 'テスト中...' : 'テスト実行'}
                </Button>
                <Button
                  onClick={onSave}
                  disabled={isLoading || !isFormValid}
                  className="flex-1 h-12 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? '保存中...' : '保存'}
                </Button>
              </div>

              {/* バリデーション表示 */}
              {!isFormValid && (
                <div className="flex items-center gap-2 text-sm text-orange-600 bg-orange-50 p-3 rounded-xl">
                  <AlertCircle className="w-4 h-4" />
                  プロンプト名、システムプロンプト、ユーザープロンプトを入力してください
                </div>
              )}
            </div>
          ) : (
            /* テンプレート選択 */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(promptTemplates).map(([key, template]) => {
                const Icon = templateIcons[key as keyof typeof templateIcons]
                const colorClass = templateColors[key as keyof typeof templateColors]
                
                return (
                  <div
                    key={key}
                    onClick={() => handleTemplateSelect(key)}
                    className="group cursor-pointer"
                  >
                    <div className="p-6 bg-white rounded-2xl border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 bg-gradient-to-r ${colorClass} rounded-xl shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{template.name}</h3>
                          <p className="text-sm text-gray-500">{template.description}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {template.template || 'カスタムプロンプトを作成できます'}
                      </p>
                      <div className="mt-4 flex items-center text-sm text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus className="w-4 h-4 mr-2" />
                        このテンプレートを使用
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 