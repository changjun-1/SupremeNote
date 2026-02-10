# 🎯 SupremeNote

AI 기반 지식 관리 플랫폼으로, YouTube 영상, PDF, 웹 페이지를 AI가 자동으로 요약하고 마인드맵으로 시각화합니다.

## 📦 프로젝트 구조

```
SupremeNote/
├── frontend/          # Next.js 14+ (App Router)
├── backend/           # FastAPI Python Server
└── architecture.md    # 시스템 설계 문서
```

## 🚀 빠른 시작

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 🌐 로컬호스트 주소

| 서비스 | URL | 설명 |
|:---|:---|:---|
| 🎨 **메인 페이지** | http://localhost:3000 | 로그인 페이지로 리디렉션 |
| 🔐 **로그인** | http://localhost:3000/auth/signin | Google OAuth 로그인 |
| 📊 **Dashboard** | http://localhost:3000/dashboard | 메인 대시보드 (로그인 필요) |
| ⚙️ **Backend API** | http://localhost:8000 | FastAPI 서버 |
| 📖 **API Docs (Swagger)** | http://localhost:8000/docs | 인터랙티브 API 문서 |
| 📚 **API Docs (ReDoc)** | http://localhost:8000/redoc | 읽기 전용 API 문서 |
| ✅ **Health Check** | http://localhost:8000/health | API 서버 상태 확인 |

### API 엔드포인트
- `/api/youtube/summarize` - YouTube 영상 요약
- `/api/pdf/upload` - PDF 파일 업로드 및 요약
- `/api/web/summarize` - 웹 페이지 크롤링 및 요약

## 🛠️ 기술 스택

- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, React
- **Backend:** FastAPI, Python 3.12
- **Database:** Supabase (PostgreSQL + pgvector)
- **AI:** Google Gemini Flash (요약), OpenAI Whisper (음성인식)
- **Processing:** yt-dlp (YouTube), BeautifulSoup4 (웹 크롤링), pdfplumber (PDF)
- **Auth:** Supabase Auth (Google OAuth)

## 🎨 주요 기능

### ✨ Supreme Instruction
사용자가 원하는 방식으로 AI에게 직접 지시할 수 있는 핵심 기능
- "핵심 개념 5가지로 요약해주세요"
- "초보자도 이해할 수 있게 설명해주세요"
- "시험에 나올 만한 내용 위주로 정리해주세요"

### 📚 AI 콘텐츠 요약
- **YouTube 영상**: 자막 + Whisper 음성인식 하이브리드 요약
- **PDF 문서**: 자동 텍스트 추출 및 요약
- **웹 페이지**: 블로그, 뉴스 등 웹 크롤링 후 요약

### 📁 스마트 노트 관리
- **폴더/카테고리**: 커스텀 폴더로 노트 정리
- **전체 검색**: 제목, 내용, 태그 통합 검색
- **즐겨찾기**: 중요한 노트 즐겨찾기
- **자동 저장**: 3초마다 자동 저장

### 🎯 스마트 출력
- **마크다운 노트**: 구조화된 학습 자료
- **마인드맵**: Mermaid.js 기반 동적 시각화
- **맞춤형 요약**: Supreme Instruction 기반
- **YouTube 임베드**: 요약과 함께 영상 바로 보기

### 🔍 최근 기록 관리
- **중복 자동 제거**: 같은 제목 노트 하나만 표시
- **최대 3개 표시**: 가장 최근 3개만 표시
- **자동 정렬**: 최신순 자동 정렬

## 📝 개발 상태

### ✅ 완료된 기능
- [x] 아키텍처 설계
- [x] 프로젝트 초기 설정
- [x] Python 3.12 + 의존성 설치
- [x] Frontend UI (Notion 스타일)
  - [x] 로그인 페이지 (Google OAuth)
  - [x] Dashboard 레이아웃
  - [x] Sidebar (노트 목록, 폴더, 검색)
  - [x] Input Area (YouTube/PDF/웹 URL 입력)
  - [x] Viewer (마크다운 + 마인드맵 + 영상)
  - [x] NoteEditor (자동 저장, 폴더 선택)
  - [x] 사용자 프로필 & 로그아웃
- [x] Backend API
  - [x] YouTube 요약 API (자막 + Whisper)
  - [x] PDF 업로드 & 요약 API
  - [x] 웹 URL 크롤링 & 요약 API
  - [x] Gemini AI 통합 (요약, 핵심 포인트)
  - [x] Whisper 로컬 모델 (무료 음성인식)
- [x] 인증 시스템 (Supabase Auth)
  - [x] Google OAuth 로그인
  - [x] 세션 관리 & 미들웨어
  - [x] 로그아웃 기능
- [x] 데이터베이스 (Supabase)
  - [x] Notes 테이블 (CRUD)
  - [x] Folders 테이블 (계층 구조)
  - [x] YouTube Summaries 테이블
  - [x] Row Level Security (RLS) 정책
- [x] 노트 관리 기능
  - [x] 폴더/카테고리 생성 및 관리
  - [x] 전체 검색 (제목, 내용, 태그)
  - [x] 즐겨찾기
  - [x] 자동 저장 (3초)
  - [x] 요약 → 노트 저장 (폴더 선택 가능)
- [x] 최근 기록 관리
  - [x] 중복 자동 제거
  - [x] 최대 3개 제한
  - [x] 최신순 정렬

### 🚧 계획된 기능
- [ ] 노트 공유 기능
- [ ] 노트 내보내기 (PDF, Markdown)
- [ ] 더 많은 OAuth 제공자 (GitHub, Naver)
- [ ] 모바일 반응형 최적화
- [ ] 다크 모드 토글

## 📚 문서

- `architecture.md` - 시스템 아키텍처 설계
- `database/README.md` - Supabase 설정 가이드
- `docs/SETUP_GUIDE.md` - 전체 설정 가이드
- `docs/PYTHON_INSTALL_GUIDE.md` - Python 설치 가이드
- `database/schema.sql` - 데이터베이스 스키마
- `database/test-queries.sql` - 테스트 쿼리

## 💻 로컬 개발 환경 실행

### 1. Frontend 서버 시작
```bash
cd frontend
npm run dev
```
→ http://localhost:3000 실행됨

### 2. Backend 서버 시작
```bash
cd backend
uvicorn main:app --reload
```
→ http://localhost:8000 실행됨

### 3. 브라우저에서 접속
```
http://localhost:3000
```

### 서버 상태 확인
- Frontend: 브라우저에서 페이지가 보이면 정상
- Backend: http://localhost:8000/health 접속 시 `{"status": "healthy"}` 응답

## 🎨 디자인 시스템

**Notion 스타일 기반**
- 라이트 테마 (화이트 + 베이지)
- 깔끔한 미니멀 디자인
- 읽기 쉬운 타이포그래피
- 부드러운 트랜지션

### 색상 팔레트
- **배경**: `#ffffff` (화이트)
- **사이드바**: `#f7f6f3` (베이지)
- **텍스트**: `#37352f` (다크 그레이)
- **보조**: `#9b9a97` (그레이)
- **액센트**: `#2383e2` (블루)
- **테두리**: `#e9e9e7` (라이트 그레이)

## 🔧 환경 변수 설정

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

### Backend (.env)
```env
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-service-role-key
GEMINI_API_KEY=your-gemini-api-key
ENVIRONMENT=development
DEBUG=True
```

## 📦 주요 의존성

### Frontend
- `next@15.1.6` - React 프레임워크
- `@supabase/auth-helpers-nextjs` - Supabase Auth
- `react-markdown` - 마크다운 렌더링
- `mermaid` - 마인드맵 시각화
- `lucide-react` - 아이콘

### Backend
- `fastapi` - 웹 프레임워크
- `google-generativeai` - Gemini AI
- `openai-whisper` - 음성인식 (로컬)
- `yt-dlp` - YouTube 다운로더
- `beautifulsoup4` - 웹 크롤링
- `pdfplumber` - PDF 텍스트 추출

## ⚡ 성능 최적화

- **Whisper Tiny 모델**: CPU 최적화 (무료)
- **하이브리드 YouTube 처리**: 자막 우선 → Whisper 폴백
- **자동 저장**: 3초 디바운싱
- **최근 기록 제한**: 최대 3개 표시로 UI 성능 향상

## 🤝 기여하기

이 프로젝트는 개인 학습 프로젝트입니다. 
피드백과 제안은 언제나 환영합니다!

## 📜 라이선스

이 프로젝트는 개인 학습 목적으로 제작되었습니다.

## 📞 연락처

프로젝트 관련 문의나 버그 리포트는 GitHub Issues를 이용해주세요.
