# 🗄️ Supabase 데이터베이스 설정 가이드

UVKL 프로젝트의 Supabase 데이터베이스 설정 방법입니다.

## 📋 목차
1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [데이터베이스 스키마 적용](#2-데이터베이스-스키마-적용)
3. [인증 설정](#3-인증-설정)
4. [환경변수 설정](#4-환경변수-설정)
5. [테스트](#5-테스트)

---

## 1. Supabase 프로젝트 생성

### 1️⃣ Supabase 계정 생성
1. https://supabase.com 접속
2. **Start your project** 클릭
3. GitHub 계정으로 로그인 (권장)

### 2️⃣ 새 프로젝트 생성
1. **New Project** 클릭
2. 프로젝트 정보 입력:
   - **Name:** `uvkl-production` (또는 원하는 이름)
   - **Database Password:** 강력한 비밀번호 생성 (잘 저장해두세요!)
   - **Region:** `Northeast Asia (Seoul)` 선택 (한국 서버)
   - **Pricing Plan:** Free tier 선택
3. **Create new project** 클릭
4. 프로젝트 생성 완료까지 약 2분 대기

---

## 2. 데이터베이스 스키마 적용

### 1️⃣ SQL Editor 열기
1. 왼쪽 사이드바에서 **SQL Editor** 클릭
2. **New query** 클릭

### 2️⃣ 스키마 실행
1. `database/schema.sql` 파일의 내용을 복사
2. SQL Editor에 붙여넣기
3. **Run** 버튼 (또는 Ctrl + Enter) 클릭
4. 성공 메시지 확인:
   ```
   Success. No rows returned.
   ```

### 3️⃣ 테이블 확인
1. 왼쪽 사이드바에서 **Table Editor** 클릭
2. 다음 테이블들이 생성되었는지 확인:
   - ✅ `profiles` - 사용자 프로필
   - ✅ `notes` - 노트 데이터
   - ✅ `embeddings` - 벡터 임베딩 (차후 RAG용)

---

## 3. 인증 설정

### 1️⃣ 소셜 로그인 설정 (Google)

#### Google OAuth 설정
1. https://console.cloud.google.com 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. **APIs & Services > Credentials** 이동
4. **Create Credentials > OAuth 2.0 Client ID** 클릭
5. 설정:
   - **Application type:** Web application
   - **Name:** UVKL
   - **Authorized redirect URIs:** 
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
     (Supabase 프로젝트의 URL로 교체)
6. **Client ID**와 **Client Secret** 복사

#### Supabase에 Google OAuth 연결
1. Supabase Dashboard > **Authentication > Providers**
2. **Google** 클릭
3. **Enabled** 토글 ON
4. 복사한 **Client ID**와 **Client Secret** 입력
5. **Save** 클릭

### 2️⃣ GitHub OAuth 설정 (선택사항)

1. GitHub > **Settings > Developer settings > OAuth Apps**
2. **New OAuth App** 클릭
3. 설정:
   - **Application name:** UVKL
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:**
     ```
     https://<your-project-ref>.supabase.co/auth/v1/callback
     ```
4. **Register application** 클릭
5. **Client ID**와 **Client Secret** 복사
6. Supabase Dashboard에서 동일한 방식으로 설정

---

## 4. 환경변수 설정

### 1️⃣ Supabase 키 가져오기

1. Supabase Dashboard > **Settings > API**
2. 다음 값들을 복사:
   - **Project URL** (예: `https://xxxxx.supabase.co`)
   - **anon public** key
   - **service_role** key (⚠️ 비밀로 유지!)

### 2️⃣ Frontend 환경변수 설정

`frontend/.env.local` 파일 생성:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here  # openssl rand -base64 32 로 생성

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3️⃣ Backend 환경변수 설정

`backend/.env` 파일 생성:

```env
# Supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your-service-role-key  # ⚠️ service_role key 사용

# AI API Keys
GOOGLE_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key

# Application Settings
ENVIRONMENT=development
DEBUG=True
```

---

## 5. 테스트

### 1️⃣ Supabase 연결 테스트

SQL Editor에서 다음 쿼리 실행:

```sql
-- 테이블 목록 확인
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- RLS 정책 확인
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Extension 확인
SELECT * FROM pg_extension;
```

### 2️⃣ 프론트엔드에서 연결 테스트

나중에 Supabase 클라이언트를 만들고 테스트할 예정입니다.

---

## 📊 데이터베이스 구조

### ERD (Entity Relationship Diagram)

```
┌─────────────────┐
│  auth.users     │ (Supabase 관리)
└────────┬────────┘
         │
         │ 1:1
         │
┌────────▼────────┐
│   profiles      │
│  - id (PK)      │
│  - email        │
│  - full_name    │
│  - avatar_url   │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│     notes       │
│  - id (PK)      │
│  - user_id (FK) │
│  - title        │
│  - source_url   │
│  - instruction  │
│  - content_md   │
│  - mermaid_code │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐
│  embeddings     │
│  - id (PK)      │
│  - note_id (FK) │
│  - chunk_text   │
│  - embedding    │
└─────────────────┘
```

---

## 🔐 보안 체크리스트

- ✅ Row Level Security (RLS) 활성화됨
- ✅ 사용자는 자신의 데이터만 접근 가능
- ✅ Service Role Key는 백엔드에서만 사용
- ✅ Anon Key는 프론트엔드에서 사용
- ✅ 환경변수 파일은 `.gitignore`에 포함

---

## 🎯 다음 단계

데이터베이스 설정이 완료되었습니다! 이제:

1. **인증 시스템 구현** (NextAuth.js)
2. **Supabase 클라이언트 설정**
3. **데이터 CRUD 작업**

로 진행할 수 있습니다.
