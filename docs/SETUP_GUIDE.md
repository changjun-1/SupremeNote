# 🚀 SupremeNote 전체 설정 가이드

완전한 개발 환경 설정을 위한 단계별 가이드입니다.

## 📋 필수 준비물

### 1. 소프트웨어 설치
- ✅ **Node.js** 18+ (Frontend용)
- ⚠️ **Python** 3.11+ (Backend용) - 현재 미설치 상태
- ✅ **Git** (버전 관리)
- 📝 **VS Code** (권장 에디터)

### 2. 계정 생성
- 🔐 **Supabase** 계정 (https://supabase.com)
- 🤖 **Google Cloud** 계정 (OAuth 및 Gemini API)
- 🔑 **OpenAI** 계정 (선택사항, GPT-4o 사용 시)

---

## 🏗️ 설정 단계

### ✅ Step 1: 프로젝트 기본 설정 (완료!)

```bash
# 프로젝트 구조 생성 완료
SupremeNote/
├── frontend/     ✅ Next.js 14+ 프로젝트
├── backend/      ✅ FastAPI 프로젝트
└── database/     ✅ SQL 스키마
```

**현재 상태:**
- Frontend: ✅ 실행 중 (http://localhost:3000)
- Backend: ⚠️ Python 설치 필요

---

### 🔄 Step 2: 데이터베이스 설정 (진행 중)

#### 2-1. Supabase 프로젝트 생성

1. https://supabase.com 접속
2. **New Project** 생성
   - Name: `uvkl-production`
   - Region: **Northeast Asia (Seoul)**
   - Password: 강력한 비밀번호 (저장 필수!)

#### 2-2. 데이터베이스 스키마 적용

1. Supabase Dashboard → **SQL Editor**
2. `database/schema.sql` 파일 내용 복사 후 실행
3. **Table Editor**에서 테이블 생성 확인:
   - `profiles` ✅
   - `notes` ✅
   - `embeddings` ✅

#### 2-3. OAuth 설정

**Google OAuth:**
1. https://console.cloud.google.com
2. OAuth 2.0 Client ID 생성
3. Redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`
4. Client ID & Secret 복사
5. Supabase → Authentication → Providers → Google 활성화

**GitHub OAuth (선택):**
1. GitHub → Settings → Developer settings → OAuth Apps
2. 동일한 방식으로 설정

#### 2-4. 환경변수 설정

**Frontend (`frontend/.env.local`):**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
NEXT_PUBLIC_API_URL=http://localhost:8000
```

**Backend (`backend/.env`):**
```env
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=your-service-role-key
GOOGLE_API_KEY=your-gemini-api-key
ENVIRONMENT=development
DEBUG=True
```

📚 **자세한 가이드:** `database/README.md` 참조

---

### ⏭️ Step 3: 인증 시스템 구현 (다음)

- NextAuth.js 설정
- Supabase 클라이언트 초기화
- 로그인/로그아웃 페이지
- 프로필 관리

---

### ⏭️ Step 4: 백엔드 API 구현 (다음)

**Python 설치 후 진행:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

**구현할 기능:**
- YouTube 자막 추출 (yt-dlp)
- 문서 파싱 (PDF, PPT)
- AI 요약 생성 (LangChain + Gemini)
- Supabase 연동

---

### ⏭️ Step 5: 프론트엔드 UI 구현 (다음)

**ThetaWave 스타일 레이아웃:**
- Dashboard (메인 페이지)
- Sidebar (노트 목록)
- Input Area (URL, 파일, Supreme Instruction)
- Viewer (마크다운 + Mermaid.js)

---

## 🎯 현재 상황 요약

| 단계 | 상태 | 비고 |
|-----|------|------|
| 1. 프로젝트 구조 | ✅ 완료 | Frontend 실행 중 |
| 2. 데이터베이스 | 🔄 진행 중 | SQL 스키마 준비 완료 |
| 3. 인증 시스템 | ⏭️ 대기 | Supabase 설정 후 진행 |
| 4. 백엔드 API | ⏭️ 대기 | Python 설치 필요 |
| 5. 프론트엔드 UI | ⏭️ 대기 | 인증 후 진행 |

---

## 🔧 다음 해야 할 일

### 즉시 가능:
1. ✅ **Supabase 프로젝트 생성** (5분)
2. ✅ **SQL 스키마 실행** (1분)
3. ✅ **OAuth 설정** (10분)
4. ✅ **환경변수 설정** (5분)

### Python 설치 후:
1. ⚠️ **Backend 의존성 설치**
2. ⚠️ **Backend 서버 실행**
3. ⚠️ **API 테스트**

---

## 📞 도움말

### 문제 해결
- **Frontend 실행 안됨:** `frontend/README.md` 참조
- **Backend 실행 안됨:** Python 설치 확인
- **Supabase 연결 안됨:** 환경변수 및 RLS 정책 확인

### 유용한 링크
- [Next.js 문서](https://nextjs.org/docs)
- [FastAPI 문서](https://fastapi.tiangolo.com)
- [Supabase 문서](https://supabase.com/docs)
- [LangChain 문서](https://python.langchain.com)

---

**준비되셨나요?** 이제 Supabase 설정을 진행하시면 됩니다! 🚀
