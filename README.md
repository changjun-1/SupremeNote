# 🎯 UVKL - Universal Video Knowledge Library

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
→ http://localhost:3000

### Backend (FastAPI)
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
→ http://localhost:8000

## 🛠️ 기술 스택

- **Frontend:** Next.js 14+, Tailwind CSS, NextAuth.js
- **Backend:** FastAPI, LangChain, yt-dlp, unstructured
- **Database:** Supabase (PostgreSQL + Vector)
- **AI:** Gemini 1.5 Pro / GPT-4o

## 📝 개발 상태

- [x] 아키텍처 설계
- [x] 프로젝트 초기 설정
- [x] Frontend 실행 환경 구축 (http://localhost:3000)
- [ ] 데이터베이스 구축 (Supabase 설정 중)
- [ ] 인증 시스템
- [ ] 백엔드 API (Python 설치 필요)
- [ ] 프론트엔드 UI

## 📚 문서

- `architecture.md` - 시스템 아키텍처 설계
- `database/README.md` - Supabase 설정 가이드
- `docs/SETUP_GUIDE.md` - 전체 설정 가이드
- `database/schema.sql` - 데이터베이스 스키마
- `database/test-queries.sql` - 테스트 쿼리
