'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import NoteEditor from './NoteEditor'
import Viewer from './Viewer'
import InputArea from './InputArea'
import { getNote, getNotes } from '@/lib/notes'
import type { Note } from '@/types/database'
import type { YoutubeSummaryResponse } from '@/lib/youtube'

export default function Dashboard({ session }: { session: any }) {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [currentNote, setCurrentNote] = useState<Note | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load notes on mount
  useEffect(() => {
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const fetchedNotes = await getNotes()
      setNotes(fetchedNotes)
    } catch (error) {
      console.error('Failed to load notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectNote = async (noteId: string) => {
    setSelectedNoteId(noteId)
    setIsEditing(false)
    
    try {
      const note = await getNote(noteId)
      setCurrentNote(note)
    } catch (error) {
      console.error('Failed to load note:', error)
    }
  }

  const handleNewNote = () => {
    setSelectedNoteId(null)
    setCurrentNote(null)
    setIsEditing(true)
    setShowYoutubeInput(false)
  }

  const handleNewYoutubeSummary = () => {
    setSelectedNoteId(null)
    setCurrentNote(null)
    setIsEditing(false)
    setShowYoutubeInput(true)
  }

  const handleYoutubeSummaryGenerated = (summary: YoutubeSummaryResponse) => {
    // YouTube 요약을 노트로 변환
    const noteContent = `# ${summary.title}

## 📺 YouTube 요약

**영상 URL:** [YouTube에서 보기 🎬](${summary.video_url})

---

## 📝 요약

${summary.summary}

---

## 💡 핵심 포인트

${summary.key_points.map((point, index) => `${index + 1}. ${point}`).join('\n\n')}

---

*생성 일시: ${new Date(summary.created_at).toLocaleString('ko-KR')}*
`

    // 노트로 저장하지 않고 바로 표시
    const tempNote: Note = {
      id: summary.id,
      user_id: session.user.id,
      title: summary.title,
      content: noteContent,
      tags: ['youtube', '요약'],
      is_favorite: false,
      created_at: summary.created_at,
      updated_at: summary.created_at,
    }

    setCurrentNote(tempNote)
    setSelectedNoteId(summary.id)
    setShowYoutubeInput(false)
    
    // 목록 새로고침
    loadNotes()
  }

  const handleEditNote = () => {
    setIsEditing(true)
  }

  const handleSaveNote = (savedNote: Note) => {
    // Update notes list
    setNotes((prev) => {
      const index = prev.findIndex((n) => n.id === savedNote.id)
      if (index >= 0) {
        // Update existing
        const updated = [...prev]
        updated[index] = savedNote
        return updated
      } else {
        // Add new
        return [savedNote, ...prev]
      }
    })

    setCurrentNote(savedNote)
    setSelectedNoteId(savedNote.id)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    if (!currentNote) {
      setSelectedNoteId(null)
    }
  }

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId))
    if (selectedNoteId === noteId) {
      setSelectedNoteId(null)
      setCurrentNote(null)
    }
  }

  const handleSaveAsNote = async (note: Note) => {
    // YouTube 요약을 실제 노트로 저장
    const { createNote } = await import('@/lib/notes')
    
    try {
      const savedNote = await createNote({
        title: note.title,
        content: note.content,
        tags: note.tags || ['youtube', '요약'],
        is_favorite: false,
      })

      if (savedNote) {
        // 노트 목록에 추가
        setNotes((prev) => [savedNote, ...prev])
        
        // 저장된 노트로 전환
        setCurrentNote(savedNote)
        setSelectedNoteId(savedNote.id)
      }
    } catch (error) {
      console.error('Failed to save note:', error)
      throw error
    }
  }

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <Sidebar 
        session={session}
        notes={notes}
        selectedNoteId={selectedNoteId}
        onSelectNote={handleSelectNote}
        onNewNote={handleNewNote}
        onNewYoutubeSummary={handleNewYoutubeSummary}
        onDeleteNote={handleDeleteNote}
        isLoading={isLoading}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showYoutubeInput ? (
          <InputArea 
            onGenerate={handleYoutubeSummaryGenerated}
            onCancel={() => setShowYoutubeInput(false)}
          />
        ) : isEditing ? (
          <NoteEditor 
            note={currentNote}
            onSave={handleSaveNote}
            onCancel={handleCancelEdit}
          />
        ) : (
          <Viewer 
            session={session}
            note={currentNote}
            onEdit={handleEditNote}
            onSaveAsNote={handleSaveAsNote}
          />
        )}
      </div>
    </div>
  )
}
