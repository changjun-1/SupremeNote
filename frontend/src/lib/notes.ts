// Notes API - Supabase CRUD operations
import { supabase } from './supabase'
import type { Note, CreateNoteInput, UpdateNoteInput } from '@/types/database'

/**
 * 사용자의 모든 노트 가져오기
 */
export async function getNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching notes:', error)
    throw error
  }

  return data || []
}

/**
 * 특정 노트 가져오기
 */
export async function getNote(id: string): Promise<Note | null> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching note:', error)
    return null
  }

  return data
}

/**
 * 새 노트 생성
 */
export async function createNote(input: CreateNoteInput): Promise<Note | null> {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('User not authenticated')
    return null
  }

  const { data, error } = await supabase
    .from('notes')
    .insert({
      user_id: user.id,
      title: input.title,
      content: input.content,
      tags: input.tags || [],
      is_favorite: input.is_favorite || false,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating note:', error)
    throw error
  }

  return data
}

/**
 * 노트 업데이트
 */
export async function updateNote(id: string, input: UpdateNoteInput): Promise<Note | null> {
  const { data, error } = await supabase
    .from('notes')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating note:', error)
    throw error
  }

  return data
}

/**
 * 노트 삭제
 */
export async function deleteNote(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting note:', error)
    return false
  }

  return true
}

/**
 * 노트 검색 (제목 + 내용)
 */
export async function searchNotes(query: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error searching notes:', error)
    throw error
  }

  return data || []
}

/**
 * 즐겨찾기 토글
 */
export async function toggleFavorite(id: string, isFavorite: boolean): Promise<Note | null> {
  return updateNote(id, { is_favorite: isFavorite })
}

/**
 * 태그로 필터링
 */
export async function getNotesByTag(tag: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .contains('tags', [tag])
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching notes by tag:', error)
    throw error
  }

  return data || []
}

/**
 * 즐겨찾기 노트만 가져오기
 */
export async function getFavoriteNotes(): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('is_favorite', true)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching favorite notes:', error)
    throw error
  }

  return data || []
}
