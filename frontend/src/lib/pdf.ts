const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export interface PdfSummaryResponse {
  id: string
  filename: string
  title: string
  author?: string
  page_count: number
  summary: string
  key_points: string[]
  word_count: number
  created_at: string
}

export async function uploadAndSummarizePdf(
  file: File,
  customInstruction?: string,
  userId?: string
): Promise<PdfSummaryResponse> {
  const formData = new FormData()
  formData.append('file', file)
  
  if (customInstruction) {
    formData.append('custom_instruction', customInstruction)
  }
  
  if (userId) {
    formData.append('user_id', userId)
  }

  const response = await fetch(`${BACKEND_URL}/api/pdf/upload`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'PDF 업로드 실패')
  }

  return response.json()
}
