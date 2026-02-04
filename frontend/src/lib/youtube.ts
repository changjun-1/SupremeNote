// YouTube API - Backend 연동
import type { YoutubeSummary } from '@/types/database'

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export interface YoutubeSummaryRequest {
  video_url: string
  custom_instruction?: string
  user_id: string
}

export interface YoutubeSummaryResponse {
  id: string
  video_id: string
  video_url: string
  title: string
  thumbnail_url?: string
  duration?: number
  summary: string
  key_points: string[]
  transcript?: string
  created_at: string
}

/**
 * YouTube 비디오 요약 생성
 */
export async function summarizeYoutubeVideo(
  request: YoutubeSummaryRequest
): Promise<YoutubeSummaryResponse> {
  const response = await fetch(`${BACKEND_URL}/api/youtube/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '요약 생성 실패')
  }

  return response.json()
}

/**
 * YouTube 비디오 정보 미리보기
 */
export async function getYoutubeVideoInfo(videoUrl: string) {
  const response = await fetch(
    `${BACKEND_URL}/api/youtube/info?video_url=${encodeURIComponent(videoUrl)}`
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || '비디오 정보 가져오기 실패')
  }

  return response.json()
}

/**
 * 사용자의 YouTube 요약 목록 가져오기
 */
export async function getUserYoutubeSummaries(userId: string, limit: number = 20) {
  const response = await fetch(
    `${BACKEND_URL}/api/youtube/summaries?user_id=${userId}&limit=${limit}`
  )

  if (!response.ok) {
    throw new Error('요약 목록 가져오기 실패')
  }

  return response.json()
}

/**
 * 특정 YouTube 요약 가져오기
 */
export async function getYoutubeSummary(summaryId: string) {
  const response = await fetch(`${BACKEND_URL}/api/youtube/summaries/${summaryId}`)

  if (!response.ok) {
    throw new Error('요약을 찾을 수 없습니다')
  }

  return response.json()
}

/**
 * YouTube 요약 삭제
 */
export async function deleteYoutubeSummary(summaryId: string): Promise<boolean> {
  const response = await fetch(`${BACKEND_URL}/api/youtube/summaries/${summaryId}`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('삭제 실패')
  }

  return true
}
