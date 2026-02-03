'use client'

import { useState } from 'react'
import { Link, Upload, Sparkles, Loader2, X, Youtube, FileText } from 'lucide-react'

interface InputAreaProps {
  onGenerate: (data: any) => void
  onCancel: () => void
}

export default function InputArea({ onGenerate, onCancel }: InputAreaProps) {
  const [inputType, setInputType] = useState<'url' | 'file'>('url')
  const [url, setUrl] = useState('')
  const [instruction, setInstruction] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerate = async () => {
    if (!url && !instruction) {
      alert('URL 또는 파일과 Supreme Instruction을 입력해주세요.')
      return
    }

    setIsGenerating(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    onGenerate({ url, instruction })
    setIsGenerating(false)
  }

  return (
    <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="w-full max-w-3xl space-y-6 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-blue-500/25">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2 gradient-text">
            SupremeNote로 학습하기
          </h2>
          <p className="text-slate-400">
            YouTube 영상이나 문서를 Supreme Instruction과 함께 제출하면<br />
            AI가 당신만의 완벽한 학습 노트를 생성합니다
          </p>
        </div>

        {/* Main Card */}
        <div className="glass-morphism rounded-2xl p-8 space-y-6 shadow-2xl">
          {/* Input Type Tabs */}
          <div className="flex gap-3">
            <button
              onClick={() => setInputType('url')}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                inputType === 'url'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <Youtube className="w-5 h-5 inline mr-2" />
              YouTube URL
            </button>
            <button
              onClick={() => setInputType('file')}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                inputType === 'file'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-5 h-5 inline mr-2" />
              문서 업로드
            </button>
          </div>

          {/* Input Field */}
          {inputType === 'url' ? (
            <div className="relative group">
              <Link className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400" />
              <input
                type="text"
                placeholder="https://youtube.com/watch?v=..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-900/70 border-2 border-slate-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>
          ) : (
            <label className="block">
              <div className="border-2 border-dashed border-slate-600/50 rounded-xl p-12 text-center hover:border-purple-500/50 hover:bg-slate-800/30 transition-all cursor-pointer group">
                <Upload className="w-16 h-16 text-slate-500 mx-auto mb-4 group-hover:text-purple-400 group-hover:scale-110 transition-all" />
                <p className="text-slate-300 font-medium mb-2 group-hover:text-purple-300 transition-colors">
                  PDF, PPT, DOCX 파일을 드래그하거나
                </p>
                <p className="text-blue-400 font-semibold group-hover:text-blue-300">
                  클릭하여 업로드
                </p>
              </div>
              <input type="file" className="hidden" accept=".pdf,.ppt,.pptx,.doc,.docx" />
            </label>
          )}

          {/* Supreme Instruction */}
          <div className="relative">
            <div className="absolute left-5 top-4 flex items-center gap-2 z-10">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Supreme Instruction
              </span>
            </div>
            <textarea
              placeholder="예: '핵심 개념 5가지로 요약해주세요' 또는 '초보자도 이해할 수 있게 설명해주세요'"
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              rows={4}
              className="w-full px-5 pt-16 pb-5 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-blue-900/20 border-2 border-blue-500/30 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 resize-none transition-all"
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-500">
              {instruction.length} / 500
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl font-medium transition-all"
            >
              <X className="w-5 h-5 inline mr-2" />
              취소
            </button>
            <button
              onClick={handleGenerate}
              disabled={isGenerating || (!url && inputType === 'url')}
              className="flex-1 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 hover:from-blue-500 hover:via-purple-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-600 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 disabled:cursor-not-allowed disabled:shadow-none bg-size-200 bg-pos-0 hover:bg-pos-100"
              style={{ backgroundSize: '200% 100%' }}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  AI가 분석 중입니다...
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6" />
                  요약 및 시각화 시작
                </>
              )}
            </button>
          </div>

          {/* Tips */}
          <div className="pt-4 border-t border-slate-700/30">
            <p className="text-xs text-slate-500 mb-2">💡 팁:</p>
            <ul className="text-xs text-slate-400 space-y-1">
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
