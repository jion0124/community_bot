'use client'

import { Button } from '@/components/ui/button'
import { 
  Plus, 
  List, 
  BarChart3, 
  Settings, 
  Bot, 
  Sparkles,
  Home
} from 'lucide-react'

interface HeaderProps {
  onShowPrompts: () => void
  onCreatePrompt: () => void
  onShowStats: () => void
  onShowBotSettings: () => void
}

export function Header({ 
  onShowPrompts, 
  onCreatePrompt, 
  onShowStats, 
  onShowBotSettings 
}: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* ロゴ・タイトル */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Community Bot
              </h1>
              <p className="text-xs text-gray-500">Discord コミュニティ分析ツール</p>
            </div>
          </div>

          {/* ナビゲーションボタン */}
          <div className="flex items-center gap-2">
            <Button
              onClick={onCreatePrompt}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4 mr-2" />
              新規作成
            </Button>
            
            <Button
              onClick={onShowPrompts}
              variant="outline"
              className="border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200"
            >
              <List className="w-4 h-4 mr-2" />
              プロンプト一覧
            </Button>
            
            <Button
              onClick={onShowStats}
              variant="outline"
              className="border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              統計
            </Button>
            
            <Button
              onClick={onShowBotSettings}
              variant="outline"
              className="border-gray-200 hover:bg-gray-50 text-gray-700 hover:text-gray-900 transition-all duration-200"
            >
              <Settings className="w-4 h-4 mr-2" />
              Bot設定
            </Button>
          </div>
        </div>

        {/* ステータスバー */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-gray-600">システム稼働中</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">GPT-4.1-nano 対応</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-gray-500">
              <Home className="w-4 h-4" />
              <span>ダッシュボード</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 