import OpenAI from 'openai';

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

export async function analyzePrompt(systemPrompt: string, userPrompt: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 800,
    });

    return response.choices?.[0]?.message?.content ?? '（分析結果が空でした）';
  } catch (error) {
    console.error('OpenAI API エラー:', error);
    throw new Error('GPT分析に失敗しました');
  }
}

module.exports = { analyzePrompt }; 