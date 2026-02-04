'use client'

import { useState } from 'react'
import { Search, FileText, Youtube, FileUp, Plus, Clock, TrendingUp, BookOpen, LogOut, User } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

import type { Note } from '@/types/database'
import { deleteNote } from '@/lib/notes'
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
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  const handleDelete = async (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation()
    
    if (!confirm('정말 삭제하시겠습니까?')) return
    
    setDeletingId(noteId)
    try {
      const success = await deleteNote(noteId)
      if (success) {
        onDeleteNote(noteId)
      }
    } catch (error) {
      alert('삭제 실패: ' + (error as Error).message)
    } finally {
      setDeletingId(null)
    }
  }

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!note.title.toLowerCase().includes(query) && 
          !note.content.toLowerCase().includes(query)) {
        return false
      }
    }

    // Active filter
    if (activeFilter === 'favorites' && !note.is_favorite) {
      return false
    }

    return true
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (days > 7) {
      return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    } else if (days > 0) {
      return `${days}일 전`
    } else if (hours > 0) {
      return `${hours}시간 전`
    } else if (minutes > 0) {
      return `${minutes}분 전`
    } else {
      return '방금 전'
    }
  }

  return (
    <div className="w-80 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold">
              🎯
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SupremeNote</h1>
              <p className="text-xs text-slate-400">AI Study Companion</p>
            </div>
          </div>
          
          {/* YouTube 바로가기 */}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-center w-9 h-9 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 hover:border-red-500/50 transition-all duration-200"
            title="YouTube 바로가기"
          >
            <Youtube className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
          </a>
        </div>

        {/* New Note Buttons */}
        <div className="space-y-2">
          <button 
            onClick={onNewNote}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            <Plus className="w-5 h-5" />
            새 노트 작성
          </button>
          <button 
            onClick={onNewYoutubeSummary}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-red-500/40"
          >
            <Youtube className="w-5 h-5" />
            YouTube 요약
          </button>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 space-y-3 border-b border-slate-700/50">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="노트 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'all'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            <BookOpen className="w-3 h-3 inline mr-1" />
            전체
          </button>
          <button
            onClick={() => setActiveFilter('recent')}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              activeFilter === 'recent'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
            }`}
          >
            <Clock className="w-3 h-3 inline mr-1" />
            최근
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">
              {searchQuery ? '검색 결과가 없습니다' : '노트가 없습니다'}
            </p>
            <p className="text-slate-500 text-xs mt-1">
              {!searchQuery && '새 노트를 만들어보세요!'}
            </p>
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => onSelectNote(note.id)}
              className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 card-hover relative ${
                selectedNoteId === note.id
                  ? 'bg-blue-500/15 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                  : 'bg-slate-700/20 border border-slate-700/30 hover:bg-slate-700/40 hover:border-slate-600/50'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                  📝
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm truncate group-hover:text-blue-300 transition-colors flex-1">
                      {note.title || '제목 없음'}
                    </h3>
                    {note.is_favorite && (
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mb-2 line-clamp-2">
                    {note.content || '내용 없음'}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">{formatDate(note.updated_at)}</span>
                    {note.tags.length > 0 && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs text-blue-400">#{note.tags[0]}</span>
                        {note.tags.length > 1 && (
                          <span className="text-xs text-slate-500">+{note.tags.length - 1}</span>
                        )}
                      </>
                    )}
                    {selectedNoteId === note.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse ml-auto"></span>
                    )}
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={(e) => handleDelete(e, note.id)}
                disabled={deletingId === note.id}
                className="absolute top-2 right-2 p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
              >
                {deletingId === note.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {/* User Profile & Stats */}
      <div className="border-t border-slate-700/50 bg-slate-800/30">
        <div className="p-4">
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              <span>총 {notes.length}개 노트</span>
            </div>
            <div className="text-slate-500">
              {notes.filter(n => {
                const today = new Date()
                const noteDate = new Date(n.created_at)
                return noteDate.toDateString() === today.toDateString()
              }).length}개 생성
            </div>
          </div>
          
          {/* User Info */}
          {session?.user && (
            <div className="space-y-2">
              <div className="glass-morphism rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {session.user.user_metadata?.name?.[0] || session.user.email?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {session.user.user_metadata?.name || session.user.user_metadata?.full_name || '사용자'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={handleSignOut}
                className="w-full py-2.5 px-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/30 text-red-400 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
