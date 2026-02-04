// Database types for SupremeNote

export interface Note {
  id: string
  user_id: string
  title: string
  content: string
  tags: string[]
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export interface YoutubeSummary {
  id: string
  user_id: string
  video_url: string
  video_id: string
  title: string
  thumbnail_url: string | null
  duration: number | null
  summary: string
  key_points: string[] | null
  transcript: string | null
  created_at: string
}

export interface UserDocument {
  id: string
  user_id: string
  file_name: string
  file_path: string
  file_type: string
  file_size: number
  summary: string | null
  created_at: string
}

export interface UserPreferences {
  user_id: string
  theme: 'light' | 'dark'
  language: 'ko' | 'en'
  ai_model: 'gemini' | 'openai'
  created_at: string
  updated_at: string
}

export type CreateNoteInput = Omit<Note, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type UpdateNoteInput = Partial<CreateNoteInput>

// YouTube Summary 타입 추가
export interface YoutubeSummary extends YoutubeSummary {}
