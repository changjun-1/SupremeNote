'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Sidebar from './Sidebar'
import InputArea from './InputArea'
import Viewer from './Viewer'

export default function Dashboard({ session }: { session?: any }) {
  const { data: clientSession } = useSession()
  const currentSession = session || clientSession
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [currentNote, setCurrentNote] = useState<any>(null)
  const [showInput, setShowInput] = useState(false)

  return (
    <div className="flex h-screen bg-slate-900">
      {/* Sidebar */}
      <Sidebar 
        selectedNoteId={selectedNoteId}
        onSelectNote={(noteId) => {
          setSelectedNoteId(noteId)
          setShowInput(false)
          // TODO: Fetch note data
        }}
        onNewNote={() => setShowInput(true)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {showInput ? (
          <>
            {/* Input Area */}
            <InputArea 
              onGenerate={(data) => {
                console.log('Generate:', data)
                setShowInput(false)
                // TODO: Call API to generate summary
              }}
              onCancel={() => setShowInput(false)}
            />
          </>
        ) : (
          /* Viewer */
          <Viewer note={currentNote} />
        )}
      </div>
    </div>
  )
}
