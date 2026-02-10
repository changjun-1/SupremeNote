'use client'

import { useState } from 'react'
import { Link, Upload, Sparkles, Loader2, X, Youtube, FileText, CheckCircle, AlertCircle, Globe } from 'lucide-react'
import { summarizeYoutubeVideo } from '@/lib/youtube'
import { uploadAndSummarizePdf } from '@/lib/pdf'
import { summarizeWebPage } from '@/lib/web'
import { supabase } from '@/lib/supabase'

interface InputAreaProps {
  onGenerate: (data: any) => void
  onCancel: () => void
}

export default function InputArea({ onGenerate, onCancel }: InputAreaProps) {
  const [inputType, setInputType] = useState<'youtube' | 'pdf' | 'web'>('youtube')
  const [url, setUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [instruction, setInstruction] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = async () => {
    // 입력 검증
    if ((inputType === 'youtube' || inputType === 'web') && !url) {
      setError('URL을 입력해주세요.')
      return
    }
    if (inputType === 'pdf' && !file) {
      setError('PDF 파일을 선택해주세요.')
      return
    }

    setError('')
    setIsGenerating(true)
    
    try {
      // 1. 사용자 정보 가져오기
      setProgress('사용자 인증 중...')
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('로그인이 필요합니다')
      }

      let result

      if (inputType === 'youtube') {
        // 2-A. YouTube 비디오 요약 생성
        setProgress('YouTube 비디오 정보 추출 중...')
        result = await summarizeYoutubeVideo({
          video_url: url,
          custom_instruction: instruction || undefined,
          user_id: user.id,
        })
      } else if (inputType === 'pdf') {
        // 2-B. PDF 업로드 및 요약 생성
        setProgress('PDF 파일 업로드 중...')
        result = await uploadAndSummarizePdf(file!, instruction || undefined, user.id)
      } else {
        // 2-C. 웹 페이지 요약 생성
        setProgress('웹 페이지 크롤링 중...')
        result = await summarizeWebPage(url, instruction || undefined, user.id)
      }

      setProgress('요약 완료!')
      
      // 3. 결과 전달
      setTimeout(() => {
        onGenerate(result)
        setUrl('')
        setFile(null)
        setInstruction('')
        setProgress('')
      }, 500)

    } catch (err) {
      console.error('요약 생성 실패:', err)
      setError((err as Error).message || '요약 생성에 실패했습니다')
      setIsGenerating(false)
      setProgress('')
    }
  }

  return (
    <div className="flex-1 overflow-y-auto bg-white">
      <div className="w-full max-w-2xl mx-auto space-y-6 py-16 px-8 min-h-full flex flex-col justify-center">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded bg-[#f7f6f3] border border-[#e9e9e7] mb-3">
            <Sparkles className="w-6 h-6 text-[#2383e2]" />
          </div>
          <h2 className="text-2xl font-bold text-[#37352f] mb-2">
            AI 콘텐츠 요약
          </h2>
          <p className="text-sm text-[#9b9a97]">
            YouTube, PDF, 웹 페이지를 AI로 자동 요약하세요
          </p>
        </div>

        {/* Main Card */}
        <div className="notion-card p-6 space-y-4">
          {/* Input Type Tabs */}
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setInputType('youtube')}
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                inputType === 'youtube'
                  ? 'bg-[#2383e2] text-white'
                  : 'bg-[#f7f6f3] text-[#787774] hover:bg-[#e9e9e7]'
              }`}
            >
              <Youtube className="w-3.5 h-3.5 inline mr-1" />
              YouTube
            </button>
            <button
              onClick={() => setInputType('pdf')}
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                inputType === 'pdf'
                  ? 'bg-[#2383e2] text-white'
                  : 'bg-[#f7f6f3] text-[#787774] hover:bg-[#e9e9e7]'
              }`}
            >
              <FileText className="w-3.5 h-3.5 inline mr-1" />
              PDF
            </button>
            <button
              onClick={() => setInputType('web')}
              className={`px-3 py-2 rounded text-sm font-medium transition-all ${
                inputType === 'web'
                  ? 'bg-[#2383e2] text-white'
                  : 'bg-[#f7f6f3] text-[#787774] hover:bg-[#e9e9e7]'
              }`}
            >
              <Globe className="w-3.5 h-3.5 inline mr-1" />
              웹 URL
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Progress Message */}
          {progress && (
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-400 animate-spin flex-shrink-0" />
              <p className="text-blue-300 text-sm">{progress}</p>
            </div>
          )}

          {/* Input Field */}
          {inputType === 'youtube' || inputType === 'web' ? (
            <div className="relative group">
              {inputType === 'youtube' ? (
                <Youtube className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-400" />
              ) : (
                <Globe className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
              )}
              <input
                type="text"
                placeholder={inputType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://example.com/article'}
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value)
                  setError('')
                }}
                className={`w-full pl-12 pr-4 py-4 bg-slate-900/70 border-2 border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none transition-all ${
                  inputType === 'youtube' 
                    ? 'focus:border-red-500/50 focus:ring-4 focus:ring-red-500/10' 
                    : 'focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10'
                }`}
              />
            </div>
          ) : (
            <label className="block">
              <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-12 text-center hover:border-purple-500/50 hover:bg-slate-800/30 transition-all cursor-pointer group">
                {file ? (
                  <>
                    <FileText className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                    <p className="text-purple-300 font-medium mb-2">
                      {file.name}
                    </p>
                    <p className="text-slate-400 text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </>
                ) : (
                  <>
                    <Upload className="w-16 h-16 text-slate-500 mx-auto mb-4 group-hover:text-purple-400 group-hover:scale-110 transition-all" />
                    <p className="text-slate-300 font-medium mb-2 group-hover:text-purple-300 transition-colors">
                      PDF 파일을 드래그하거나
                    </p>
                    <p className="text-purple-400 font-semibold group-hover:text-purple-300">
                      클릭하여 업로드
                    </p>
                  </>
                )}
              </div>
              <input
                type="file"
                className="hidden"
                accept=".pdf"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0]
                  if (selectedFile) {
                    setFile(selectedFile)
                    setError('')
                  }
                }}
              />
            </label>
          )}

          {/* Supreme Instruction */}
          <div className="relative">
            <div className="absolute left-4 top-3 flex items-center gap-2 z-10">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-xs font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Supreme Instruction
              </span>
            </div>
            <textarea
              placeholder="예: '핵심 개념 5가지로 요약해주세요' 또는 '초보자도 이해할 수 있게 설명해주세요'"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={3}
              className="w-full px-4 pt-14 pb-4 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20 border-2 border-blue-500/30 rounded-xl text-white text-sm placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 resize-none transition-all"
            />
            <div className="absolute bottom-3 right-3 text-xs text-slate-500">
              {instruction.length} / 500
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all text-sm"
            >
              <X className="w-4 h-4 inline mr-1" />
              취소
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || ((inputType === 'youtube' || inputType === 'web') && !url) || (inputType === 'pdf' && !file)}
              className="flex-1 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-500 hover:via-purple-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:shadow-none bg-size-200 bg-pos-0 hover:bg-pos-100"
              style={{ backgroundSize: '200% 100%' }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm">{progress || 'AI가 분석 중입니다...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span className="text-sm">AI 요약 생성</span>
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="pt-3 border-t border-slate-700/30">
            <p className="text-xs text-slate-500 mb-1.5">💡 팁:</p>
            <ul className="text-xs text-slate-400 space-y-0.5">
              <li>• 구체적인 지시일수록 더 정확한 결과를 얻을 수 있습니다</li>
              <li>• Supreme Instruction에 원하는 형식, 수준, 초점을 명시하세요</li>
              <li>• YouTube 자막이 없는 영상은 처리할 수 없습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
