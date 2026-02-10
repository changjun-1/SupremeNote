const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export interface WebSummaryResponse {
  id: string
  url: string
  title: string
  description?: string
  author?: string
  summary: string
  key_points: string[]
  word_count: number
  created_at: string
}

export async function summarizeWebPage(
  url: string,
  customInstruction?: string,
  userId?: string
): Promise<WebSummaryResponse> {
  const response = await fetch(`${BACKEND_URL}/api/web/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
      custom_instruction: customInstruction,
      user_id: userId,
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '웹 페이지 요약 실패')
  }

  return response.json()
}
