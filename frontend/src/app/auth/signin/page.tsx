'use client'

import { useState } from 'react'
import { Chrome } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function SignIn() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        console.error('로그인 실패:', error.message)
        alert('로그인 실패: ' + error.message)
        setIsLoading(false)
      }
    } catch (error) {
      console.error('로그인 오류:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-2xl shadow-blue-500/50 animate-scale-in">
            <span className="text-4xl">🎯</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 gradient-text">
            SupremeNote
          </h1>
          <p className="text-slate-300 text-lg mb-2">
            AI 기반 스마트 학습 플랫폼
          </p>
          <p className="text-slate-400 text-sm">
            YouTube, 문서를 당신만의 완벽한 노트로
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-morphism rounded-2xl p-8 shadow-2xl backdrop-blur-xl border border-slate-700/50 animate-slide-up">
          <h2 className="text-2xl font-bold text-white mb-2 text-center">
            환영합니다! 👋
          </h2>
          <p className="text-slate-400 text-center mb-8">
            Google 계정으로 간편하게 로그인하세요
          </p>

          {/* Google Login */}
          <button
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full px-8 py-5 bg-white hover:bg-gray-50 text-gray-800 rounded-2xl font-bold text-lg flex items-center justify-center gap-4 transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-3 border-gray-800 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Chrome className="w-7 h-7 text-blue-600" />
                <span>Google로 로그인</span>
              </>
            )}
          </button>

          {/* Info Message */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-sm text-blue-300 text-center">
              🔒 Supabase Auth로 안전하게 로그인됩니다
            </p>
          </div>

          {/* Features */}
          <div className="mt-6 space-y-3 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
              <span>별도 회원가입 불필요</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
              <span>Google이 보안 관리</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400"></div>
              <span>모든 기기에서 자동 동기화</span>
            </div>
          </div>

          {/* Setup Notice */}
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <p className="text-xs text-yellow-300 text-center">
              ⚠️ Supabase 프로젝트 설정이 필요합니다
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            로그인하면{' '}
            <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">
              이용약관
            </a>
            {' '}및{' '}
            <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
              개인정보처리방침
            </a>
            에 동의하게 됩니다
          </p>
          <p className="text-slate-600 text-xs mt-4">
            © 2026 SupremeNote. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
