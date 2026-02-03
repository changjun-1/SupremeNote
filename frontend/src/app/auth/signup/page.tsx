'use client'

import { useState } from 'react'
import { Chrome, Github, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Provider = 'google' | 'github' | 'naver' | null

export default function SignUp() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProvider, setSelectedProvider] = useState<Provider>(null)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    name: ''
  })

  const handleProviderClick = (provider: Provider) => {
    setSelectedProvider(provider)
    setFormData({ email: '', username: '', password: '', confirmPassword: '', name: '' })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProvider) return

    // 비밀번호 확인
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다')
      return
    }

    if (formData.password.length < 4) {
      setError('비밀번호는 최소 4자 이상이어야 합니다')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: selectedProvider === 'google' ? formData.email : undefined,
          username: selectedProvider !== 'google' ? formData.username : undefined,
          password: formData.password,
          name: formData.name,
          provider: selectedProvider
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        alert('회원가입이 완료되었습니다! 로그인해주세요.')
        router.push('/auth/signin')
      } else {
        setError(data.detail || '회원가입에 실패했습니다')
      }
    } catch (error) {
      setError('서버 연결에 실패했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderInfo = (provider: Provider) => {
    switch (provider) {
      case 'google':
        return { name: 'Google', color: 'blue', icon: '🔵' }
      case 'github':
        return { name: 'GitHub', color: 'gray', icon: '⚫' }
      case 'naver':
        return { name: '네이버', color: 'green', icon: '🟢' }
      default:
        return { name: '', color: '', icon: '' }
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
            회원가입
          </p>
        </div>

        {/* Signup Card */}
        <div className="glass-morphism rounded-2xl p-8 shadow-2xl backdrop-blur-xl border border-slate-700/50 animate-slide-up">
          {!selectedProvider ? (
            <>
              <h2 className="text-2xl font-bold text-white mb-2 text-center">
                계정 유형 선택
              </h2>
              <p className="text-slate-400 text-center mb-8">
                가입할 계정 유형을 선택하세요
              </p>

              <div className="space-y-4">
                {/* Google */}
                <button
                  onClick={() => handleProviderClick('google')}
                  className="w-full px-8 py-5 bg-white hover:bg-gray-50 text-gray-800 rounded-2xl font-bold text-lg flex items-center justify-center gap-4 transition-all duration-200 shadow-2xl hover:shadow-3xl hover:scale-[1.02] group"
                >
                  <Chrome className="w-7 h-7 text-blue-600" />
                  <span>Google 계정으로 가입</span>
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700/50"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-slate-800/50 text-slate-500 backdrop-blur-sm rounded-full">
                      또는
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleProviderClick('github')}
                    className="w-full px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
                  >
                    <Github className="w-5 h-5" />
                    <span>GitHub</span>
                  </button>

                  <button
                    onClick={() => handleProviderClick('naver')}
                    className="w-full px-6 py-3 bg-slate-800/50 hover:bg-slate-700/50 text-white rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
                  >
                    <div className="w-5 h-5 bg-[#03C75A] rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">N</span>
                    </div>
                    <span>네이버</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 text-center">
                <p className="text-sm text-slate-400 mb-2">이미 계정이 있으신가요?</p>
                <button
                  onClick={() => router.push('/auth/signin')}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  로그인하기
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={() => setSelectedProvider(null)}
                  className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-400" />
                </button>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <span>{getProviderInfo(selectedProvider).icon}</span>
                  <span>{getProviderInfo(selectedProvider).name} 회원가입</span>
                </h2>
                <div className="w-9"></div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-sm text-red-300 text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {selectedProvider === 'google' ? (
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                      이메일 *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="example@gmail.com"
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                ) : (
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-slate-300 mb-2">
                      {selectedProvider === 'github' ? '사용자명' : '아이디'} *
                    </label>
                    <input
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder={selectedProvider === 'github' ? 'username' : '아이디'}
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
                    이름
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="홍길동"
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                    비밀번호 *
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-2">
                    비밀번호 확인 *
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <span>회원가입</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            회원가입하면{' '}
            <a href="/terms" className="text-blue-400 hover:text-blue-300 underline">
              이용약관
            </a>
            {' '}및{' '}
            <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
              개인정보처리방침
            </a>
            에 동의하게 됩니다
          </p>
        </div>
      </div>
    </div>
  )
}
