import { useState } from 'react'
import { promptTemplates, defaultSystemPrompt } from '@/lib/promptTemplates'

export function usePromptManagement() {
  const [promptName, setPromptName] = useState('')
  const [systemPrompt, setSystemPrompt] = useState(defaultSystemPrompt)
  const [userPrompt, setUserPrompt] = useState('')
  const [analysisType, setAnalysisType] = useState('event')
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState('')

  const resetForm = () => {
    setPromptName('')
    setSystemPrompt(defaultSystemPrompt)
    setUserPrompt('')
    setAnalysisType('event')
    setTestResult('')
  }

  const handleTemplateChange = (value: string) => {
    setAnalysisType(value)
    if (value !== 'custom') {
      setUserPrompt(promptTemplates[value as keyof typeof promptTemplates].template)
    } else {
      setUserPrompt('')
    }
  }

  const handleSave = async () => {
    if (!promptName.trim()) {
      alert('プロンプト名を入力してください')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: promptName,
          systemPrompt,
          userPrompt,
          analysisType,
        }),
      })

      if (!response.ok) {
        throw new Error('保存に失敗しました')
      }

      alert('プロンプトが保存されました！')
      resetForm()
    } catch (error) {
      alert('保存に失敗しました')
      console.error('保存エラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTest = async () => {
    if (!systemPrompt.trim() || !userPrompt.trim()) {
      alert('システムプロンプトとユーザープロンプトを入力してください')
      return
    }

    setIsLoading(true)
    setTestResult('')
    
    try {
      const response = await fetch('/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          systemPrompt,
          userPrompt,
        }),
      })

      if (!response.ok) {
        throw new Error('テストに失敗しました')
      }

      const data = await response.json()
      setTestResult(data.result)
    } catch (error) {
      alert('テストに失敗しました')
      console.error('テストエラー:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
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
  }
} 