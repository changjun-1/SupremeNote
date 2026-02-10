'use client'

import { useState, useEffect } from 'react'
import { Search, FileText, Youtube, FileUp, Plus, Clock, TrendingUp, BookOpen, LogOut, User, Folder, FolderPlus, ChevronRight, ChevronDown, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

import type { Note, Folder as FolderType } from '@/types/database'
import { deleteNote } from '@/lib/notes'
import { getFolders, createFolder, deleteFolder } from '@/lib/folders'
import { Trash2, Loader2 } from 'lucide-react'

interface SidebarProps {
  session: any
  notes: Note[]
  selectedNoteId: string | null
  onSelectNote: (noteId: string) => void
  onNewNote: () => void
  onNewYoutubeSummary: () => void
  onDeleteNote: (noteId: string) => void
  isLoading: boolean
}

export default function Sidebar({ session, notes, selectedNoteId, onSelectNote, onNewNote, onNewYoutubeSummary, onDeleteNote, isLoading }: SidebarProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'favorites'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [folders, setFolders] = useState<FolderType[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [isCreatingFolder, setIsCreatingFolder] = useState(false)
  
  useEffect(() => {
    loadFolders()
  }, [])

  const loadFolders = async () => {
    const fetchedFolders = await getFolders()
    setFolders(fetchedFolders)
  }

  const handleCreateFolder = async () => {
    const folderName = prompt('폴더 이름을 입력하세요:')
    if (!folderName || !folderName.trim()) return

    setIsCreatingFolder(true)
    try {
      const newFolder = await createFolder({
        name: folderName.trim(),
        color: '#2383e2',
        icon: '📁',
        parent_id: null,
        position: folders.length,
      })

      if (newFolder) {
        setFolders([...folders, newFolder])
      }
    } catch (error) {
      alert('폴더 생성 실패')
    } finally {
      setIsCreatingFolder(false)
    }
  }

  const handleDeleteFolder = async (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation()
    
    if (!confirm('이 폴더를 삭제하시겠습니까? (폴더 내 노트는 삭제되지 않습니다)')) return

    const success = await deleteFolder(folderId)
    if (success) {
      setFolders(folders.filter(f => f.id !== folderId))
      if (selectedFolderId === folderId) {
        setSelectedFolderId(null)
      }
    }
  }

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  const handleDelete = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation()
    
    if (!confirm('정말 삭제하시겠습니까?')) return
    
    setDeletingId(noteId)
    try {
      await deleteNote(noteId)
      onDeleteNote(noteId)
    } catch (error) {
      alert('삭제 실패')
    } finally {
      setDeletingId(null)
    }
  }

  const filteredNotes = notes.filter((note) => {
    if (selectedFolderId !== null) {
      if (note.folder_id !== selectedFolderId) {
        return false
      }
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const titleMatch = note.title.toLowerCase().includes(query)
      const contentMatch = note.content.toLowerCase().includes(query)
      const tagMatch = note.tags?.some(tag => tag.toLowerCase().includes(query))
      
      if (!titleMatch && !contentMatch && !tagMatch) {
        return false
      }
    }

    if (activeFilter === 'favorites' && !note.is_favorite) {
      return false
    }

    return true
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (activeFilter === 'recent') {
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    }
    return 0
  })

  // 최근 기록: 중복 제거 + 최대 3개
  const displayNotes = activeFilter === 'recent' 
    ? (() => {
        const seen = new Set<string>()
        const uniqueNotes = []
        
        for (const note of sortedNotes) {
          // 제목으로 중복 체크
          const key = note.title.toLowerCase().trim()
          if (!seen.has(key) && uniqueNotes.length < 3) {
            seen.add(key)
            uniqueNotes.push(note)
          }
        }
        
        return uniqueNotes
      })()
    : sortedNotes

  return (
    <div className="w-80 bg-[#f7f6f3] border-r border-[#e9e9e7] flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b border-[#e9e9e7]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white border border-[#e9e9e7] rounded flex items-center justify-center">
              <FileText className="w-4 h-4 text-[#37352f]" />
            </div>
            <span className="font-semibold text-[#37352f]">SupremeNote</span>
          </div>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-[#e9e9e7] rounded transition-colors"
          >
            <Youtube className="w-4 h-4 text-red-500" />
          </a>
        </div>

        {/* New Note Buttons */}
        <div className="space-y-2">
          <button 
            onClick={onNewNote}
            className="w-full py-2 px-3 bg-white hover:bg-[#e9e9e7] text-[#37352f] border border-[#e9e9e7] rounded font-medium flex items-center justify-center gap-2 transition-all text-sm"
          >
            <Plus className="w-4 h-4" />
            새 노트 작성
          </button>
          <button 
            onClick={onNewYoutubeSummary}
            className="w-full py-2 px-3 bg-[#2383e2] hover:bg-[#1a74d1] text-white rounded font-medium flex items-center justify-center gap-2 transition-all text-sm"
          >
            <Sparkles className="w-4 h-4" />
            AI 콘텐츠 요약
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-[#e9e9e7]">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#9b9a97]" />
          <input
            type="text"
            placeholder="검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#e9e9e7] rounded text-[#37352f] text-sm placeholder-[#9b9a97] focus:outline-none focus:ring-1 focus:ring-[#2383e2] focus:border-[#2383e2] transition-all"
          />
          {searchQuery && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <span className="text-xs bg-[#2383e2] text-white px-1.5 py-0.5 rounded">
                {filteredNotes.length}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="px-3 py-2 border-b border-[#e9e9e7]">
        <div className="flex gap-1">
          <button
            onClick={() => { setActiveFilter('all'); setSelectedFolderId(null) }}
            className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${
              activeFilter === 'all' && !selectedFolderId
                ? 'bg-[#e9e9e7] text-[#37352f]'
                : 'text-[#787774] hover:bg-[#f1f1ef]'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => { setActiveFilter('recent'); setSelectedFolderId(null) }}
            className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${
              activeFilter === 'recent' && !selectedFolderId
                ? 'bg-[#e9e9e7] text-[#37352f]'
                : 'text-[#787774] hover:bg-[#f1f1ef]'
            }`}
          >
            최근
          </button>
          <button
            onClick={() => { setActiveFilter('favorites'); setSelectedFolderId(null) }}
            className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-all ${
              activeFilter === 'favorites' && !selectedFolderId
                ? 'bg-[#e9e9e7] text-[#37352f]'
                : 'text-[#787774] hover:bg-[#f1f1ef]'
            }`}
          >
            즐겨찾기
          </button>
        </div>
      </div>

      {/* Folders */}
      <div className="px-3 py-2 border-b border-[#e9e9e7]">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-semibold text-[#9b9a97] uppercase tracking-wide">폴더</h3>
          <button onClick={handleCreateFolder} disabled={isCreatingFolder} className="p-0.5 hover:bg-[#e9e9e7] rounded transition-all disabled:opacity-50">
            <FolderPlus className="w-3.5 h-3.5 text-[#787774]" />
          </button>
        </div>
        <div className="space-y-0.5 max-h-32 overflow-y-auto">
          {folders.map((folder) => (
            <div key={folder.id} className="relative group">
              <button
                onClick={() => {
                  setSelectedFolderId(folder.id === selectedFolderId ? null : folder.id)
                  setActiveFilter('all')
                }}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded text-sm transition-all ${
                  selectedFolderId === folder.id
                    ? 'bg-[#e9e9e7] text-[#37352f]'
                    : 'text-[#787774] hover:bg-[#f1f1ef]'
                }`}
              >
                <span className="text-sm">{folder.icon}</span>
                <span className="flex-1 text-left truncate text-xs">{folder.name}</span>
                <span className="text-xs text-[#9b9a97]">
                  {notes.filter(n => n.folder_id === folder.id).length}
                </span>
              </button>
              <button
                onClick={(e) => handleDeleteFolder(e, folder.id)}
                className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[#e9e9e7] rounded transition-all"
              >
                <Trash2 className="w-3 h-3 text-[#eb5757]" />
              </button>
            </div>
          ))}
          {folders.length === 0 && (
            <p className="text-xs text-[#9b9a97] text-center py-2">폴더를 만들어보세요</p>
          )}
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-5 h-5 text-[#9b9a97] animate-spin" />
          </div>
        ) : displayNotes.length === 0 ? (
          <div className="text-center py-8 px-4">
            <p className="text-sm text-[#9b9a97] mb-2">노트가 없습니다</p>
            <p className="text-xs text-[#9b9a97]">새 노트를 작성해보세요</p>
          </div>
        ) : (
          displayNotes.map((note) => (
            <div key={note.id} className="relative group mb-1">
              <button
                onClick={() => onSelectNote(note.id)}
                className={`w-full text-left p-2 rounded transition-all ${
                  selectedNoteId === note.id
                    ? 'bg-[#e9e9e7]'
                    : 'hover:bg-[#f1f1ef]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-medium text-sm text-[#37352f] truncate flex-1">
                    {note.title || '제목 없음'}
                  </h3>
                  {note.is_favorite && (
                    <span className="text-yellow-500 text-xs">★</span>
                  )}
                </div>
                <p className="text-xs text-[#9b9a97] line-clamp-2 mb-1">
                  {note.content.replace(/[#*\->`]/g, '').substring(0, 60)}...
                </p>
                <div className="flex items-center gap-1">
                  {note.tags && note.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs px-1.5 py-0.5 bg-[#f1f1ef] text-[#787774] rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
              <button
                onClick={(e) => handleDelete(e, note.id)}
                disabled={deletingId === note.id}
                className="absolute right-1 top-1 opacity-0 group-hover:opacity-100 p-1 hover:bg-[#e9e9e7] rounded transition-all disabled:opacity-50"
              >
                <Trash2 className="w-3 h-3 text-[#eb5757]" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* User Profile */}
      <div className="p-3 border-t border-[#e9e9e7]">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-[#e9e9e7] rounded transition-all text-sm text-[#37352f]"
        >
          <User className="w-4 h-4" />
          <span className="flex-1 text-left truncate text-xs">
            {session?.user?.email || '사용자'}
          </span>
          <LogOut className="w-3.5 h-3.5 text-[#9b9a97]" />
        </button>
      </div>
    </div>
  )
}
