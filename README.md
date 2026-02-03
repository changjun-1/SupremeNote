# 🎯 SupremeNote

AI 기반 지식 관리 플랫폼으로, YouTube 영상, PDF, PPT 등을 사용자 맞춤형 요약 및 마인드맵으로 변환합니다.

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
| 🔐 **로그인** | http://localhost:3000/auth/signin | Google/GitHub/네이버 로그인 |
| 📊 **Dashboard** | http://localhost:3000/dashboard | 메인 대시보드 (로그인 필요) |
| ⚙️ **Backend API** | http://localhost:8000 | FastAPI 서버 |
| 📖 **API Docs (Swagger)** | http://localhost:8000/docs | 인터랙티브 API 문서 |
| 📚 **API Docs (ReDoc)** | http://localhost:8000/redoc | 읽기 전용 API 문서 |
| ✅ **Health Check** | http://localhost:8000/health | API 서버 상태 확인 |

## 🛠️ 기술 스택

- **Frontend:** Next.js 14+, Tailwind CSS, NextAuth.js
- **Backend:** FastAPI, LangChain, yt-dlp, unstructured
- **Database:** Supabase (PostgreSQL + Vector)
- **AI:** Gemini 1.5 Pro / GPT-4o

## 🎨 주요 기능

### ✨ Supreme Instruction
사용자가 원하는 방식으로 AI에게 직접 지시할 수 있는 핵심 기능
- "핵심 개념 5가지로 요약해주세요"
- "초보자도 이해할 수 있게 설명해주세요"
- "시험에 나올 만한 내용 위주로 정리해주세요"

### 📚 다양한 입력 소스
- **YouTube 영상**: 자막 기반 자동 요약
- **PDF 문서**: 학술 논문, 교재, 리포트
- **PPT 슬라이드**: 발표 자료, 강의 노트
- **일반 텍스트**: 웹 문서, 기사

### 🎯 스마트 출력
- **마크다운 노트**: 구조화된 학습 자료
- **마인드맵**: Mermaid.js 기반 시각화
- **맞춤형 요약**: Supreme Instruction 기반

## 📝 개발 상태

- [x] 아키텍처 설계
- [x] 프로젝트 초기 설정
- [x] Python 3.12 + 의존성 설치
- [x] Frontend UI (ThetaWave 스타일)
  - [x] 로그인 페이지 (Google/GitHub/네이버)
  - [x] Dashboard 레이아웃
  - [x] Sidebar (노트 목록)
  - [x] Input Area (Supreme Instruction)
  - [x] Viewer (마크다운 + 마인드맵)
  - [x] 사용자 프로필 & 로그아웃
- [x] Backend API 기본 구조
- [x] 인증 시스템 (NextAuth.js)
  - [x] 아이디/비밀번호 로그인
  - [x] 세션 관리
  - [x] 로그아웃 기능
- [ ] 데이터베이스 구축 (Supabase)
- [ ] AI 통합 (LangChain + Gemini/GPT)
- [ ] 실시간 처리 기능

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

**ThetaWave 스타일 기반**
- 슬레이트(Slate) 다크 테마
- 글래스모피즘 효과
- 블루-퍼플 그라디언트
- 부드러운 애니메이션

## 🤝 기여하기

이 프로젝트는 개인 학습 프로젝트입니다. 
피드백과 제안은 언제나 환영합니다!
