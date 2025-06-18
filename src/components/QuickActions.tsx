'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { 
  Plus, 
  BookOpen, 
  Settings, 
  BarChart3, 
  Bot, 
  Sparkles,
  Zap,
  Target,
  Users,
  MessageSquare
} from 'lucide-react'

export function QuickActions() {
  const quickActions = [
    {
      title: '新規プロンプト作成',
      description: 'AI分析用のプロンプトを作成',
      icon: Plus,
      color: 'from-blue-500 to-indigo-600',
      bgColor: 'from-blue-50 to-indigo-50',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-800'
    },
    {
      title: 'プロンプト一覧',
      description: '保存されたプロンプトを管理',
      icon: BookOpen,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200',
      textColor: 'text-purple-800'
    },
    {
      title: 'Bot設定',
      description: 'Discord Botのデフォルト設定',
      icon: Settings,
      color: 'from-indigo-500 to-purple-600',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-200',
      textColor: 'text-indigo-800'
    },
    {
      title: '統計情報',
      description: '使用状況と分析結果を確認',
      icon: BarChart3,
      color: 'from-teal-500 to-cyan-600',
      bgColor: 'from-teal-50 to-cyan-50',
      borderColor: 'border-teal-200',
      textColor: 'text-teal-800'
    }
  ]

  const features = [
    {
      title: 'AI分析',
      description: 'GPT-4.1-nano による高度な分析',
      icon: Sparkles,
      color: 'text-blue-600'
    },
    {
      title: 'リアルタイム',
      description: 'Discord チャンネルの即座な分析',
      icon: Zap,
      color: 'text-yellow-600'
    },
    {
      title: 'カスタマイズ',
      description: '用途に応じたプロンプト調整',
      icon: Target,
      color: 'text-green-600'
    },
    {
      title: 'コミュニティ',
      description: 'メンバーエンゲージメント向上',
      icon: Users,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="space-y-8">
      {/* クイックアクション */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Zap className="w-6 h-6 text-blue-600" />
          クイックアクション
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${action.bgColor} border ${action.borderColor} rounded-xl p-4 hover:shadow-lg transition-all duration-200 cursor-pointer group`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className={`font-semibold ${action.textColor}`}>{action.title}</h3>
                  <p className="text-xs text-gray-600">{action.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 機能紹介 */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Bot className="w-6 h-6 text-indigo-600" />
          主な機能
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <feature.icon className={`w-4 h-4 ${feature.color}`} />
                </div>
                <h3 className="font-semibold text-gray-800">{feature.title}</h3>
              </div>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Discord Bot 情報 */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <MessageSquare className="w-7 h-7 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-indigo-800">Discord Bot コマンド</h3>
            <p className="text-sm text-indigo-600">サーバーで使用可能なコマンド</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/70 rounded-lg p-4 border border-indigo-200">
            <h4 className="font-semibold text-indigo-800 mb-2">/analyze</h4>
            <p className="text-sm text-indigo-700 mb-2">チャンネルの会話を分析</p>
            <code className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
              /analyze #general イベント案を出して
            </code>
          </div>
          
          <div className="bg-white/70 rounded-lg p-4 border border-indigo-200">
            <h4 className="font-semibold text-indigo-800 mb-2">/analyze-saved</h4>
            <p className="text-sm text-indigo-700 mb-2">保存済みプロンプトで分析</p>
            <code className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
              /analyze-saved #general イベント提案プロンプト
            </code>
          </div>
        </div>
      </div>
    </div>
  )
} 