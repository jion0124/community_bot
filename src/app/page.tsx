'use client'

import { useState } from 'react'
import { PromptForm } from '@/components/PromptForm'
import { PromptPreview } from '@/components/PromptPreview'
import { Statistics } from '@/components/Statistics'
import { QuickActions } from '@/components/QuickActions'
import { Header } from '@/components/Header'
import { PromptList } from '@/components/PromptList'
import { BotSettings } from '@/components/BotSettings'
import { CurrentPromptStatus } from '@/components/CurrentPromptStatus'
import { DefaultPromptDisplay } from '@/components/DefaultPromptDisplay'
import { usePromptManagement } from '@/hooks/usePromptManagement'

interface SavedPrompt {
  id: string
  name: string
  system_prompt: string
  user_prompt: string
  analysis_type: string
  created_at: string
  updated_at: string
}

type ViewMode = 'create' | 'prompts' | 'stats' | 'bot-settings'

export default function Home() {
  const [viewMode, setViewMode] = useState<ViewMode>('create')
  const [editingPrompt, setEditingPrompt] = useState<SavedPrompt | null>(null)
  
  const {
    promptName,
    setPromptName,
    systemPrompt,
    setSystemPrompt,
    userPrompt,
    setUserPrompt,
    analysisType,
    setAnalysisType,
    isLoading,
    testResult,
    handleSave,
    handleTest,
    handleTemplateChange,
    resetForm,
    promptTemplates
  } = usePromptManagement()

  const handleEdit = (prompt: SavedPrompt) => {
    setEditingPrompt(prompt)
    setPromptName(prompt.name)
    setSystemPrompt(prompt.system_prompt)
    setUserPrompt(prompt.user_prompt)
    setAnalysisType(prompt.analysis_type)
    setViewMode('create')
  }

  const handleDelete = (id: string) => {
    console.log('プロンプト削除:', id)
  }

  const handleCopy = (prompt: SavedPrompt) => {
    const promptText = `プロンプト名: ${prompt.name}\n分析タイプ: ${prompt.analysis_type}\n\nシステムプロンプト:\n${prompt.system_prompt}\n\nユーザープロンプト:\n${prompt.user_prompt}`
    navigator.clipboard.writeText(promptText)
    alert('プロンプト内容をクリップボードにコピーしました')
  }

  const handleTestBot = (promptId: string) => {
    console.log('Botテスト実行:', promptId)
  }

  const handleShowPrompts = () => {
    setViewMode('prompts')
    setEditingPrompt(null)
    resetForm()
  }

  const handleCreatePrompt = () => {
    setViewMode('create')
    setEditingPrompt(null)
    resetForm()
  }

  const handleShowStats = () => {
    setViewMode('stats')
  }

  const handleShowBotSettings = () => {
    setViewMode('bot-settings')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Header
          onShowPrompts={handleShowPrompts}
          onCreatePrompt={handleCreatePrompt}
          onShowStats={handleShowStats}
          onShowBotSettings={handleShowBotSettings}
        />

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-5 gap-8">
          {/* 左サイドバー: デフォルトプロンプト表示 */}
          <div className="xl:col-span-1 space-y-6">
            <DefaultPromptDisplay onOpenBotSettings={handleShowBotSettings} />
            
            <div className="bg-white/70 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                クイックアクセス
              </h3>
              <div className="space-y-2">
                <button
                  onClick={handleCreatePrompt}
                  className="w-full text-left p-2 rounded-lg hover:bg-blue-50 transition-colors text-sm text-gray-700"
                >
                  ✨ 新規プロンプト作成
                </button>
                <button
                  onClick={handleShowPrompts}
                  className="w-full text-left p-2 rounded-lg hover:bg-blue-50 transition-colors text-sm text-gray-700"
                >
                  📋 プロンプト一覧
                </button>
                <button
                  onClick={handleShowBotSettings}
                  className="w-full text-left p-2 rounded-lg hover:bg-blue-50 transition-colors text-sm text-gray-700"
                >
                  ⚙️ Bot設定
                </button>
              </div>
            </div>
          </div>

          {/* メインコンテンツエリア */}
          <div className="xl:col-span-4">
            {viewMode === 'create' && (
              <div className="space-y-6">
                {/* プロンプト作成フォーム */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                    <h2 className="text-white font-semibold text-lg">
                      {editingPrompt ? `プロンプト編集: ${editingPrompt.name}` : '新規プロンプト作成'}
                    </h2>
                  </div>
                  <div className="p-6">
                    <PromptForm
                      promptName={promptName}
                      setPromptName={setPromptName}
                      systemPrompt={systemPrompt}
                      setSystemPrompt={setSystemPrompt}
                      userPrompt={userPrompt}
                      setUserPrompt={setUserPrompt}
                      analysisType={analysisType}
                      setAnalysisType={setAnalysisType}
                      isLoading={isLoading}
                      onSave={handleSave}
                      onTest={handleTest}
                      onTemplateChange={handleTemplateChange}
                    />
                  </div>
                </div>

                {/* 編集中プロンプトの通知 */}
                {editingPrompt && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                        <span className="text-amber-600 text-sm">✏️</span>
                      </div>
                      <div>
                        <p className="font-medium text-amber-800">
                          <strong>{editingPrompt.name}</strong> を編集中です
                        </p>
                        <p className="text-sm text-amber-600">
                          変更を保存するか、キャンセルして新規作成に戻ることができます
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* プロンプトプレビュー */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-700 px-6 py-4">
                    <h3 className="text-white font-semibold">プレビュー</h3>
                  </div>
                  <div className="p-6">
                    <PromptPreview
                      systemPrompt={systemPrompt}
                      userPrompt={userPrompt}
                    />
                  </div>
                </div>

                {/* テスト結果 */}
                {testResult && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-green-600 text-sm">✅</span>
                      </div>
                      <h3 className="font-semibold text-green-800">テスト結果</h3>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-green-200">
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">{testResult}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {viewMode === 'prompts' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                  <h2 className="text-white font-semibold text-lg">プロンプト管理</h2>
                </div>
                <div className="p-6">
                  <PromptList
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onCopy={handleCopy}
                  />
                </div>
              </div>
            )}

            {viewMode === 'stats' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
                  <h2 className="text-white font-semibold text-lg">統計情報</h2>
                </div>
                <div className="p-6">
                  <Statistics />
                </div>
              </div>
            )}

            {viewMode === 'bot-settings' && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-white/20 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-4">
                  <h2 className="text-white font-semibold text-lg">Bot設定</h2>
                </div>
                <div className="p-6">
                  <BotSettings onTest={handleTestBot} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* クイックアクション */}
        <div className="mt-8">
          <QuickActions />
        </div>
      </div>
    </div>
  )
} 