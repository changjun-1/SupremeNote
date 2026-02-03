export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-white mb-4">
          🎯 UVKL
        </h1>
        <p className="text-2xl text-blue-200 mb-8">
          Universal Video Knowledge Library
        </p>
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 max-w-2xl">
          <p className="text-white text-lg mb-4">
            AI 기반 지식 관리 플랫폼
          </p>
          <p className="text-blue-100 text-sm">
            YouTube 영상, PDF, PPT를 사용자 맞춤형 요약 및 마인드맵으로 변환합니다.
          </p>
        </div>
        <div className="mt-8 text-green-400">
          ✅ 프론트엔드 초기 설정 완료!
        </div>
      </div>
    </main>
  )
}
