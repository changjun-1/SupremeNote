'use client'

import { useState } from 'react'
import { Search, FileText, Youtube, FileUp, Plus, Clock, TrendingUp, BookOpen, LogOut, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'

interface SidebarProps {
  selectedNoteId: string | null
  onSelectNote: (noteId: string) => void
  onNewNote: () => void
}

export default function Sidebar({ selectedNoteId, onSelectNote, onNewNote }: SidebarProps) {
  const { data: session } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'favorites'>('all')

  // Mock data
  const mockNotes = [
    {
      id: '1',
      title: '머신러닝 기초 강의',
      sourceType: 'youtube',
      createdAt: '2시간 전',
      instruction: '핵심 개념 5가지로 요약',
      thumbnail: '🤖'
    },
    {
      id: '2',
      title: 'React 19 새로운 기능',
      sourceType: 'youtube',
      createdAt: '1일 전',
      instruction: 'Server Components 위주로',
      thumbnail: '⚛️'
    },
    {
      id: '3',
      title: 'AI 논문 리뷰',
      sourceType: 'pdf',
      createdAt: '3일 전',
      instruction: '연구 방법론 중심 정리',
      thumbnail: '📄'
    },
    {
      id: '4',
      title: 'TypeScript 고급 패턴',
      sourceType: 'youtube',
      createdAt: '1주 전',
      instruction: '실전 예제 중심',
      thumbnail: '💎'
    },
  ]

  const getSourceColor = (type: string) => {
    switch (type) {
      case 'youtube': return 'text-red-400 bg-red-400/10'
      case 'pdf': return 'text-blue-400 bg-blue-400/10'
      case 'ppt': return 'text-orange-400 bg-orange-400/10'
      default: return 'text-gray-400 bg-gray-400/10'
    }
  }

  return (
    <div className="w-80 bg-slate-800/50 backdrop-blur-xl border-r border-slate-700/50 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-slate-700/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xl font-bold">
            🎯
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">SupremeNote</h1>
            <p className="text-xs text-slate-400">AI Study Companion</p>
          </div>
        </div>

        {/* New Note Button */}
        <button 
          onClick={onNewNote}
          className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
        >
          <Plus className="w-5 h-5" />
          새 노트 만들기
        </button>
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
        {mockNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => onSelectNote(note.id)}
            className={`group p-4 rounded-xl cursor-pointer transition-all duration-200 card-hover ${
              selectedNoteId === note.id
                ? 'bg-blue-500/15 border border-blue-500/30 shadow-lg shadow-blue-500/10'
                : 'bg-slate-700/20 border border-slate-700/30 hover:bg-slate-700/40 hover:border-slate-600/50'
            }`}
          >
            <div className="flex items-start gap-3">
              {/* Thumbnail */}
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${getSourceColor(note.sourceType)}`}>
                {note.thumbnail}
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-sm mb-1 truncate group-hover:text-blue-300 transition-colors">
                  {note.title}
                </h3>
                <p className="text-xs text-slate-400 mb-2 line-clamp-1">
                  {note.instruction}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">{note.createdAt}</span>
                  {selectedNoteId === note.id && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* User Profile & Stats */}
      <div className="border-t border-slate-700/50 bg-slate-800/30">
        <div className="p-4">
          <div className="flex items-center justify-between text-xs mb-3">
            <div className="flex items-center gap-1.5 text-slate-400">
              <TrendingUp className="w-3.5 h-3.5 text-green-400" />
              <span>총 {mockNotes.length}개 노트</span>
            </div>
            <div className="text-slate-500">
              오늘 2개 생성
            </div>
          </div>
          
          {/* User Info */}
          {session?.user && (
            <div className="space-y-2">
              <div className="glass-morphism rounded-xl p-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {session.user.name || '사용자'}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {session.user.email}
                  </p>
                </div>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
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
