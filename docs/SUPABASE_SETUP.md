# 🚀 Supabase 설정 가이드

SupremeNote에서 Supabase를 사용하기 위한 완벽한 설정 가이드입니다.

---

## 📋 목차

1. [Supabase 프로젝트 생성](#1-supabase-프로젝트-생성)
2. [환경변수 설정](#2-환경변수-설정)
3. [Google OAuth 설정](#3-google-oauth-설정)
4. [Database 스키마 생성](#4-database-스키마-생성)
5. [Storage 설정](#5-storage-설정)
6. [테스트](#6-테스트)

---

## 1. Supabase 프로젝트 생성

### 1️⃣ Supabase 회원가입
```
https://supabase.com
```
- 우측 상단 "Start your project" 클릭
- GitHub 또는 Google 계정으로 가입

### 2️⃣ 새 프로젝트 생성
1. Dashboard에서 "New Project" 클릭
2. 프로젝트 정보 입력:
   - **Name:** `SupremeNote`
   - **Database Password:** 안전한 비밀번호 (저장해두세요!)
   - **Region:** `Northeast Asia (Seoul)` 또는 가까운 지역
3. "Create new project" 클릭
4. 프로젝트 생성 대기 (1-2분)

### 3️⃣ API 키 확인
프로젝트 생성 후:
1. 좌측 메뉴 "Settings" → "API" 클릭
2. 다음 값을 복사:
   - **Project URL:** `https://xxxxx.supabase.co`
   - **anon public key:** `eyJhbGc...` (긴 문자열)

---

## 2. 환경변수 설정

### `frontend/.env.local` 파일 수정
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

**주의:** 위 값을 실제 프로젝트의 URL과 Key로 교체하세요!

---

## 3. Google OAuth 설정

### 3️⃣-1. Supabase에서 Google Provider 활성화

1. Supabase Dashboard
2. 좌측 메뉴 "Authentication" → "Providers" 클릭
3. "Google" 찾아서 클릭
4. "Enable Sign in with Google" 토글 켜기

### 3️⃣-2. Google Cloud Console 설정

#### A. Google Cloud Console 접속
```
https://console.cloud.google.com
```

#### B. 프로젝트 생성 (기존 프로젝트가 있다면 선택)
1. 상단 프로젝트 선택 → "새 프로젝트"
2. 프로젝트 이름: `SupremeNote`
3. "만들기" 클릭

#### C. OAuth 동의 화면 설정
1. 좌측 메뉴 "APIs & Services" → "OAuth consent screen"
2. User Type: **External** 선택
3. "만들기" 클릭
4. 앱 정보 입력:
   - **App name:** `SupremeNote`
   - **User support email:** 본인 이메일
   - **Developer contact information:** 본인 이메일
5. "Save and Continue" 3번 클릭

#### D. OAuth Client ID 생성
1. 좌측 메뉴 "Credentials" 클릭
2. "+ CREATE CREDENTIALS" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `SupremeNote Web`
5. **Authorized redirect URIs** 추가:
   ```
   https://xxxxx.supabase.co/auth/v1/callback
   ```
   ⚠️ `xxxxx`를 본인의 Supabase Project URL로 교체!
6. "만들기" 클릭
7. **Client ID**와 **Client Secret** 복사

### 3️⃣-3. Supabase에 Google 자격증명 입력

1. Supabase Dashboard로 돌아가기
2. Authentication → Providers → Google
3. 복사한 값 입력:
   - **Client ID:** Google에서 복사한 Client ID
   - **Client Secret:** Google에서 복사한 Client Secret
4. "Save" 클릭

---

## 4. Database 스키마 생성

### Supabase SQL Editor에서 실행

1. Supabase Dashboard
2. 좌측 메뉴 "SQL Editor" 클릭
3. "New query" 클릭
4. 아래 SQL 복사 & 붙여넣기:

```sql
-- users 테이블은 Supabase Auth가 자동으로 관리

-- notes 테이블 생성
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  source_url TEXT,
  instruction TEXT,
  content_md TEXT,
  mermaid_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security (RLS) 활성화
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- 정책: 사용자는 자신의 노트만 조회 가능
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

-- 정책: 사용자는 자신의 노트만 생성 가능
CREATE POLICY "Users can create their own notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 정책: 사용자는 자신의 노트만 수정 가능
CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id);

-- 정책: 사용자는 자신의 노트만 삭제 가능
CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX notes_user_id_idx ON notes(user_id);
CREATE INDEX notes_created_at_idx ON notes(created_at DESC);
```

5. "Run" 버튼 클릭
6. 성공 메시지 확인

---

## 5. Storage 설정

### Storage Bucket 생성

1. Supabase Dashboard
2. 좌측 메뉴 "Storage" 클릭
3. "Create a new bucket" 클릭
4. Bucket 정보 입력:
   - **Name:** `user-documents`
   - **Public bucket:** 체크 해제 (Private)
5. "Create bucket" 클릭

### Storage 정책 설정

1. 생성한 `user-documents` bucket 클릭
2. "Policies" 탭 클릭
3. "Add policy" → "For full customization"
4. 아래 정책 추가:

#### 정책 1: 사용자는 자신의 폴더에 파일 업로드 가능
```sql
-- Policy name: Users can upload to their own folder
CREATE POLICY "Users can upload to their own folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'user-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### 정책 2: 사용자는 자신의 파일만 조회 가능
```sql
-- Policy name: Users can view their own files
CREATE POLICY "Users can view their own files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'user-documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 6. 테스트

### 6️⃣-1. 패키지 설치
```bash
cd frontend
npm install
```

### 6️⃣-2. 개발 서버 실행
```bash
npm run dev
```

### 6️⃣-3. 로그인 테스트
1. 브라우저에서 `http://localhost:3000` 접속
2. "Google로 로그인" 버튼 클릭
3. Google 계정 선택
4. 권한 승인
5. Dashboard로 리디렉션 확인

---

## ✅ 완료!

이제 Supabase Auth, Database, Storage가 모두 설정되었습니다! 🎉

---

## 🔧 문제 해결

### 로그인이 안 되는 경우
1. `.env.local` 파일 확인
2. Google OAuth Redirect URI 확인
3. Supabase Google Provider 활성화 확인

### Database 연결 오류
1. SQL 스크립트 실행 확인
2. RLS 정책 확인
3. Supabase Dashboard → Table Editor에서 `notes` 테이블 확인

### Storage 업로드 오류
1. Bucket 생성 확인
2. Storage 정책 확인
3. 파일 크기 제한 확인 (무료: 1GB)

---

## 📚 추가 자료

- [Supabase 공식 문서](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
