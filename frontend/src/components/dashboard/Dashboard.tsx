'use client'

import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import NoteEditor from './NoteEditor'
import Viewer from './Viewer'
import InputArea from './InputArea'
import { getNote, getNotes } from '@/lib/notes'
import type { Note } from '@/types/database'
import type { YoutubeSummaryResponse } from '@/lib/youtube'
import type { PdfSummaryResponse } from '@/lib/pdf'
import type { WebSummaryResponse } from '@/lib/web'

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
      folder_id: null,
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

  const handlePdfSummaryGenerated = (summary: PdfSummaryResponse) => {
    // PDF 요약을 노트로 변환
    const noteContent = `# ${summary.title}

## 📄 PDF 문서 요약

**파일명:** ${summary.filename}  
**저자:** ${summary.author || '정보 없음'}  
**페이지 수:** ${summary.page_count}페이지  
**단어 수:** 약 ${summary.word_count.toLocaleString()}단어

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
      folder_id: null,
      title: summary.title,
      content: noteContent,
      tags: ['pdf', '문서', '요약'],
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

  const handleWebSummaryGenerated = (summary: WebSummaryResponse) => {
    // 웹 URL 요약을 노트로 변환
    const noteContent = `# ${summary.title}

## 🌐 웹 페이지 요약

**URL:** [웹사이트 방문 🔗](${summary.url})  
**저자:** ${summary.author || '정보 없음'}  
**단어 수:** 약 ${summary.word_count.toLocaleString()}단어

${summary.description ? `\n**설명:** ${summary.description}\n` : ''}

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
      folder_id: null,
      title: summary.title,
      content: noteContent,
      tags: ['web', '웹', '요약'],
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

  const handleSummaryGenerated = (data: any) => {
    // YouTube, PDF, 웹 URL 요약 결과 처리
    if ('video_url' in data) {
      handleYoutubeSummaryGenerated(data as YoutubeSummaryResponse)
    } else if ('filename' in data) {
      handlePdfSummaryGenerated(data as PdfSummaryResponse)
    } else if ('url' in data && 'word_count' in data) {
      handleWebSummaryGenerated(data as WebSummaryResponse)
    }
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
    // YouTube/PDF 요약을 실제 노트로 저장
    const { createNote } = await import('@/lib/notes')
    
    try {
      const savedNote = await createNote({
        title: note.title,
        content: note.content,
        tags: note.tags || ['요약'],
        is_favorite: false,
        folder_id: note.folder_id || null,
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
    <div className="flex h-screen bg-white">
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
            onGenerate={handleSummaryGenerated}
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
