'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, X, Tag, Star, Sparkles, Loader2 } from 'lucide-react'
import { createNote, updateNote } from '@/lib/notes'
import type { Note } from '@/types/database'

interface NoteEditorProps {
  note?: Note | null
  onSave: (note: Note) => void
  onCancel: () => void
}

export default function NoteEditor({ note, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '')
  const [content, setContent] = useState(note?.content || '')
  const [tags, setTags] = useState<string[]>(note?.tags || [])
  const [isFavorite, setIsFavorite] = useState(note?.is_favorite || false)
  const [tagInput, setTagInput] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved')
  
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-save function
  const autoSave = async () => {
    if (!title.trim() && !content.trim()) return

    setAutoSaveStatus('saving')
    
    try {
      if (note) {
        // Update existing note
        const updated = await updateNote(note.id, {
          title: title || '제목 없음',
          content,
          tags,
          is_favorite: isFavorite,
        })
        if (updated) {
          onSave(updated)
        }
      } else {
        // Create new note
        const newNote = await createNote({
          title: title || '제목 없음',
          content,
          tags,
          is_favorite: isFavorite,
        })
        if (newNote) {
          onSave(newNote)
        }
      }
      setAutoSaveStatus('saved')
    } catch (error) {
      console.error('Auto-save failed:', error)
      setAutoSaveStatus('unsaved')
    }
  }

  // Trigger auto-save on content change (debounced)
  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }

    if (title.trim() || content.trim()) {
      setAutoSaveStatus('unsaved')
      
      autoSaveTimerRef.current = setTimeout(() => {
        autoSave()
      }, 3000) // 3초 후 자동 저장
    }

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [title, content, tags, isFavorite])

  const handleManualSave = async () => {
    if (!title.trim() && !content.trim()) {
      alert('제목 또는 내용을 입력해주세요')
      return
    }

    setIsSaving(true)
    try {
      await autoSave()
      alert('노트가 저장되었습니다!')
    } catch (error) {
      alert('저장 실패: ' + (error as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddTag = () => {
    const trimmed = tagInput.trim()
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed])
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    }
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="glass-morphism border-b border-slate-700/50">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left: Status */}
          <div className="flex items-center gap-3">
            <div className="text-sm">
              {autoSaveStatus === 'saving' && (
                <span className="flex items-center gap-2 text-blue-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  저장 중...
                </span>
              )}
              {autoSaveStatus === 'saved' && (
                <span className="flex items-center gap-2 text-green-400">
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  저장됨
                </span>
              )}
              {autoSaveStatus === 'unsaved' && (
                <span className="flex items-center gap-2 text-slate-400">
                  <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  저장 안됨
                </span>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFavorite(!isFavorite)}
              className={`p-2.5 rounded-xl transition-all ${
                isFavorite
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-400' : ''}`} />
            </button>
            <button
              onClick={handleManualSave}
              disabled={isSaving}
              className="px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-semibold flex items-center gap-2 transition-all shadow-lg shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  저장
                </>
              )}
            </button>
            <button
              onClick={onCancel}
              className="p-2.5 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-xl transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-12">
          {/* Title */}
          <input
            type="text"
            placeholder="제목을 입력하세요..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold text-white bg-transparent border-none outline-none placeholder-slate-600 mb-6"
          />

          {/* Tags */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-400">태그</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-blue-500/20 text-blue-300 rounded-lg text-sm flex items-center gap-2 border border-blue-500/30"
                >
                  #{tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              placeholder="태그 입력 후 Enter..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all text-sm"
            />
          </div>

          {/* Content */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-400">내용</span>
            </div>
            <textarea
              placeholder="노트 내용을 작성하세요...

Markdown을 지원합니다:
# 제목
## 소제목
- 리스트
**굵게**
*기울임*
"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-[600px] px-6 py-4 bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all resize-none font-mono text-sm leading-relaxed"
            />
          </div>

          {/* Tips */}
          <div className="glass-morphism rounded-xl p-4 border-l-4 border-blue-500">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-blue-300">팁</span>
            </div>
            <p className="text-slate-300 text-sm">
              작성을 멈추면 3초 후 자동으로 저장됩니다. 수동 저장도 가능합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
