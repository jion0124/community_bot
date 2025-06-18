import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Calendar } from 'lucide-react'

interface PromptPreviewProps {
  systemPrompt: string
  userPrompt: string
}

export function PromptPreview({ systemPrompt, userPrompt }: PromptPreviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          プロンプトプレビュー
        </CardTitle>
        <CardDescription>
          実際にGPTに送信される内容
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">システムプロンプト</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm max-h-32 overflow-y-auto">
              {systemPrompt || 'システムプロンプトが設定されていません'}
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">ユーザープロンプト</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md text-sm max-h-32 overflow-y-auto">
              {userPrompt || 'ユーザープロンプトが設定されていません'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 