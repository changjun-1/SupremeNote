'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Download, Edit, Save, BookOpen, Network, Share2, Star, MoreVertical, Sparkles, LogOut, User, Settings, Youtube, ExternalLink, Play } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

import type { Note } from '@/types/database'
import { toggleFavorite } from '@/lib/notes'

interface ViewerProps {
  session: any
  note: Note | null
  onEdit: () => void
  onSaveAsNote?: (note: Note) => void
}

export default function Viewer({ session, note, onEdit, onSaveAsNote }: ViewerProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'markdown' | 'mindmap' | 'video'>('markdown')
  const [isFavorite, setIsFavorite] = useState(note?.is_favorite || false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  
  useEffect(() => {
    setIsFavorite(note?.is_favorite || false)
  }, [note])
  
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  const handleToggleFavorite = async () => {
    if (!note) return
    
    const newFavoriteState = !isFavorite
    setIsFavorite(newFavoriteState)
    
    try {
      await toggleFavorite(note.id, newFavoriteState)
    } catch (error) {
      // Revert on error
      setIsFavorite(!newFavoriteState)
      alert('즐겨찾기 설정 실패')
    }
  }

  const handleSaveAsNote = async () => {
    if (!note || !onSaveAsNote) return
    
    setIsSaving(true)
    try {
      await onSaveAsNote(note)
      alert('✅ 노트로 저장되었습니다!')
    } catch (error) {
      console.error('노트 저장 실패:', error)
      alert('❌ 노트 저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  // YouTube URL 추출
  const extractYoutubeUrl = (content: string): string | null => {
    const match = content.match(/\*\*영상 URL:\*\* (https:\/\/[^\s]+)/);
    return match ? match[1] : null;
  }

  // YouTube 비디오 ID 추출
  const getYoutubeVideoId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  }

  const isYoutubeSummary = note?.tags?.includes('youtube') || note?.content?.includes('📺 YouTube 요약');
  const youtubeUrl = note ? extractYoutubeUrl(note.content) : null;
  const videoId = youtubeUrl ? getYoutubeVideoId(youtubeUrl) : null;

  // YouTube 요약에서 핵심 포인트 추출
  const extractKeyPoints = (content: string): string[] => {
    const keyPointsSection = content.match(/## 💡 핵심 포인트\s+([\s\S]*?)(?=\n##|\n---|\*생성 일시|$)/);
    if (!keyPointsSection) return [];
    
    const points = keyPointsSection[1]
      .split(/\n/)
      .filter(line => /^\d+\./.test(line.trim()))
      .map(line => line.replace(/^\d+\.\s*/, '').trim())
      .filter(p => p.length > 0);
    
    return points.slice(0, 8); // 최대 8개
  }

  // YouTube 요약용 마인드맵 생성
  const generateYoutubeMindmap = (): string => {
    if (!note || !isYoutubeSummary) return mockMermaidCode;
    
    const keyPoints = extractKeyPoints(note.content);
    if (keyPoints.length === 0) return mockMermaidCode;
    
    // 제목을 30자로 제한
    const shortTitle = note.title.length > 30 
      ? note.title.substring(0, 27) + '...' 
      : note.title;
    
    let mermaid = `mindmap
  root((${shortTitle}))
`;
    
    keyPoints.forEach((point, index) => {
      // 각 포인트를 35자로 제한
      const shortPoint = point.length > 35 
        ? point.substring(0, 32) + '...' 
        : point;
      mermaid += `    포인트${index + 1}\n      ${shortPoint}\n`;
    });
    
    return mermaid;
  }

  // Mock data
  const mockMarkdown = `# 머신러닝 기초 강의 요약

## 📚 핵심 개념 5가지

### 1. 지도 학습 (Supervised Learning)
- **정의:** 레이블이 있는 데이터로 학습
- **예시:** 이메일 스팸 필터, 이미지 분류
- **알고리즘:** 선형 회귀, 로지스틱 회귀, 의사결정 트리

### 2. 비지도 학습 (Unsupervised Learning)
- **정의:** 레이블 없이 패턴 발견
- **예시:** 고객 세분화, 이상 탐지
- **알고리즘:** K-Means, PCA, DBSCAN

### 3. 특성 엔지니어링 (Feature Engineering)
- 데이터에서 의미있는 특성 추출
- 모델 성능에 가장 큰 영향
- 도메인 지식이 중요

### 4. 과적합 방지 (Overfitting Prevention)
- **정규화(Regularization):** L1, L2
- **드롭아웃(Dropout)**
- **교차 검증(Cross-validation)**

### 5. 평가 지표 (Evaluation Metrics)
- **분류:** 정확도, 정밀도, 재현율, F1-score
- **회귀:** MSE, RMSE, MAE, R²

## 💡 주요 인사이트

> "데이터가 많을수록, 단순한 모델도 복잡한 모델을 능가할 수 있다."

## 🔗 관련 자료
- [Coursera ML 강의](https://example.com)
- [Kaggle 실습](https://kaggle.com)
`

  const mockMermaidCode = `graph TD
    A[머신러닝] --> B[지도 학습]
    A --> C[비지도 학습]
    A --> D[강화 학습]
    
    B --> B1[분류]
    B --> B2[회귀]
    
    C --> C1[군집화]
    C --> C2[차원 축소]
    
    B1 --> E[로지스틱 회귀]
    B1 --> F[의사결정 트리]
    B1 --> G[SVM]
    
    B2 --> H[선형 회귀]
    B2 --> I[다항 회귀]
    
    C1 --> J[K-Means]
    C1 --> K[DBSCAN]
    
    C2 --> L[PCA]
    C2 --> M[t-SNE]
    
    style A fill:#3b82f6,stroke:#2563eb,color:#fff
    style B fill:#10b981,stroke:#059669,color:#fff
    style C fill:#f59e0b,stroke:#d97706,color:#fff
    style D fill:#8b5cf6,stroke:#7c3aed,color:#fff
`

  // Mermaid 렌더링
  useEffect(() => {
    if (activeTab === 'mindmap' && typeof window !== 'undefined') {
      import('mermaid').then((mermaid) => {
        mermaid.default.initialize({ 
          startOnLoad: true,
          theme: 'dark',
          themeVariables: {
            darkMode: true,
            background: '#0f172a',
            primaryColor: '#3b82f6',
            primaryTextColor: '#fff',
            primaryBorderColor: '#2563eb',
            lineColor: '#64748b',
            secondaryColor: '#10b981',
            tertiaryColor: '#f59e0b',
          }
        })
        mermaid.default.contentLoaded()
      })
    }
  }, [activeTab])

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">노트를 선택하세요</h3>
          <p className="text-slate-400 mb-6">
            왼쪽에서 기존 노트를 선택하거나<br />
            새 노트를 생성하여 시작하세요
          </p>
          <div className="flex gap-3 justify-center text-xs text-slate-500">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500"></div>
              YouTube
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-500"></div>
              PDF/문서
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              AI 요약
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
      {/* Header */}
      <div className="glass-morphism border-b border-slate-700/50">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Left: Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('markdown')}
              className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'markdown'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
              }`}
            >
              <BookOpen className="w-4 h-4 inline mr-2" />
              노트
            </button>
            {isYoutubeSummary && videoId && (
              <button
                onClick={() => setActiveTab('video')}
                className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === 'video'
                    ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30'
                    : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
                }`}
              >
                <Youtube className="w-4 h-4 inline mr-2" />
                영상 보기
              </button>
            )}
            <button
              onClick={() => setActiveTab('mindmap')}
              className={`px-4 py-2.5 rounded-xl font-semibold transition-all duration-200 ${
                activeTab === 'mindmap'
                  ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300'
              }`}
            >
              <Network className="w-4 h-4 inline mr-2" />
              마인드맵
            </button>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {isYoutubeSummary && onSaveAsNote && (
              <button 
                onClick={handleSaveAsNote}
                disabled={isSaving}
                className="px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white rounded-xl font-semibold transition-all shadow-lg shadow-green-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? '저장 중...' : '노트로 저장'}
              </button>
            )}
            <button 
              onClick={handleToggleFavorite}
              className={`p-2.5 rounded-xl transition-all ${
                isFavorite
                  ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                  : 'bg-slate-700/30 text-slate-400 hover:bg-slate-700/50'
              }`}
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-400' : ''}`} />
            </button>
            <button className="p-2.5 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-xl transition-all">
              <Share2 className="w-5 h-5" />
            </button>
            <button 
              onClick={onEdit}
              className="p-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-xl transition-all"
            >
              <Edit className="w-5 h-5" />
            </button>
            <button className="p-2.5 bg-slate-700/30 hover:bg-slate-700/50 text-slate-300 rounded-xl transition-all">
              <Download className="w-5 h-5" />
            </button>

            {/* User Menu */}
            {session?.user && (
              <div className="relative ml-2">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-700/30 hover:bg-slate-700/50 rounded-xl transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                    {session.user.user_metadata?.name?.[0] || session.user.email?.[0] || 'U'}
                  </div>
                  <span className="text-sm text-white hidden md:block">
                    {session.user.user_metadata?.name || session.user.user_metadata?.full_name || '사용자'}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-64 glass-morphism border border-slate-700/50 rounded-xl shadow-2xl z-20 overflow-hidden">
                      {/* User Info */}
                      <div className="p-4 border-b border-slate-700/50">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {session.user.user_metadata?.name?.[0] || session.user.email?.[0] || 'U'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {session.user.user_metadata?.name || session.user.user_metadata?.full_name || '사용자'}
                            </p>
                            <p className="text-xs text-slate-400 truncate">
                              {session.user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="p-2">
                        <button className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:bg-slate-700/50 rounded-lg transition-all text-sm">
                          <User className="w-4 h-4" />
                          내 프로필
                        </button>
                        <button className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:bg-slate-700/50 rounded-lg transition-all text-sm">
                          <Settings className="w-4 h-4" />
                          설정
                        </button>
                      </div>

                      {/* Logout */}
                      <div className="p-2 border-t border-slate-700/50">
                        <button
                          onClick={handleSignOut}
                          className="w-full px-4 py-2.5 flex items-center gap-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          로그아웃
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'video' && videoId ? (
          <div className="max-w-6xl mx-auto px-8 py-12">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">YouTube 비디오</h2>
              <p className="text-slate-400">사이트 내에서 바로 시청하세요</p>
            </div>
            
            {/* YouTube Player */}
            <div className="glass-morphism rounded-2xl overflow-hidden shadow-2xl">
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                  style={{ border: 'none' }}
                />
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 flex gap-3 justify-center">
              <a
                href={youtubeUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-red-500/25"
              >
                <Youtube className="w-5 h-5" />
                YouTube에서 열기
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => setActiveTab('markdown')}
                className="px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl font-medium flex items-center gap-2 transition-all"
              >
                <BookOpen className="w-5 h-5" />
                요약 노트 보기
              </button>
            </div>
          </div>
        ) : activeTab === 'markdown' ? (
          <div className="max-w-4xl mx-auto px-8 py-12">
            {/* Note Header */}
            <div className="mb-8 pb-6 border-b border-slate-700/50">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-2xl shadow-lg">
                  {isYoutubeSummary ? '📺' : '📝'}
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {note.title || '제목 없음'}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>생성: {new Date(note.created_at).toLocaleString('ko-KR')}</span>
                    <span>•</span>
                    <span>수정: {new Date(note.updated_at).toLocaleString('ko-KR')}</span>
                    {youtubeUrl && (
                      <>
                        <span>•</span>
                        <a
                          href={youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors font-medium"
                        >
                          <Youtube className="w-4 h-4" />
                          YouTube에서 보기
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Tags */}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className={`px-3 py-1.5 rounded-lg text-sm border ${
                        tag === 'youtube'
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Markdown Content */}
            <article className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-4xl font-bold text-white mb-6 pb-4 border-b border-slate-700/50">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mt-12 mb-6">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-bold text-blue-300 mt-8 mb-4">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-slate-300 leading-relaxed text-lg mb-6">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="space-y-3 mb-6 ml-6">
                      {children}
                    </ul>
                  ),
                  li: ({ children }) => (
                    <li className="text-slate-300 text-lg pl-2 relative before:content-[''] before:absolute before:left-[-20px] before:top-[12px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-blue-400">
                      {children}
                    </li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="glass-morphism border-l-4 border-blue-500 rounded-r-xl pl-6 pr-6 py-4 my-8 italic">
                      <div className="text-blue-200 text-xl font-medium">
                        {children}
                      </div>
                    </blockquote>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-bold text-blue-300">{children}</strong>
                  ),
                  a: ({ children, href }) => (
                    <a
                      href={href}
                      className="text-blue-400 hover:text-blue-300 underline decoration-blue-400/50 hover:decoration-blue-300 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  code: ({ children }) => (
                    <code className="px-2 py-1 bg-slate-700/50 text-blue-300 rounded text-sm font-mono">
                      {children}
                    </code>
                  ),
                }}
              >
                {note.content || '*내용이 없습니다.*'}
              </ReactMarkdown>
            </article>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto px-8 py-12">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isYoutubeSummary ? '📺 YouTube 요약 마인드맵' : '지식 구조 마인드맵'}
              </h2>
              <p className="text-slate-400">
                {isYoutubeSummary 
                  ? '핵심 포인트를 한눈에 확인하세요' 
                  : 'AI가 생성한 개념 간의 관계를 시각화합니다'}
              </p>
            </div>
            <div className="glass-morphism rounded-2xl p-8 shadow-2xl">
              <div className="mermaid bg-slate-900/50 rounded-xl p-8">
                {isYoutubeSummary ? generateYoutubeMindmap() : mockMermaidCode}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
