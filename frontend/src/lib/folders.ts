import { supabase } from './supabase'
import type { Folder, CreateFolderInput, UpdateFolderInput } from '@/types/database'

export async function getFolders(): Promise<Folder[]> {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .order('position', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch folders:', error)
    return []
  }

  return data || []
}

export async function getFolder(id: string): Promise<Folder | null> {
  const { data, error } = await supabase
    .from('folders')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Failed to fetch folder:', error)
    return null
  }

  return data
}

export async function createFolder(input: CreateFolderInput): Promise<Folder | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('User not authenticated')
  }

  const { data, error } = await supabase
    .from('folders')
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('Failed to create folder:', error)
    return null
  }

  return data
}

export async function updateFolder(id: string, input: UpdateFolderInput): Promise<Folder | null> {
  const { data, error } = await supabase
    .from('folders')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Failed to update folder:', error)
    return null
  }

  return data
}

export async function deleteFolder(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('folders')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Failed to delete folder:', error)
    return false
  }

  return true
}

export async function getNotesByFolder(folderId: string): Promise<any[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('folder_id', folderId)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Failed to fetch notes by folder:', error)
    return []
  }

  return data || []
}

export async function moveNoteToFolder(noteId: string, folderId: string | null): Promise<boolean> {
  const { error } = await supabase
    .from('notes')
    .update({ folder_id: folderId })
    .eq('id', noteId)

  if (error) {
    console.error('Failed to move note:', error)
    return false
  }

  return true
}
