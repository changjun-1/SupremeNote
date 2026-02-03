# 🔐 OAuth 설정 가이드

SupremeNote에서 소셜 로그인을 설정하는 방법입니다.

## 📋 목차
1. [Google OAuth 설정](#1-google-oauth-설정)
2. [GitHub OAuth 설정](#2-github-oauth-설정)
3. [네이버 OAuth 설정](#3-네이버-oauth-설정)
4. [환경변수 설정](#4-환경변수-설정)
5. [테스트](#5-테스트)

---

## 1. Google OAuth 설정

### 1️⃣ Google Cloud Console 접속
1. https://console.cloud.google.com 접속
2. 프로젝트 선택 또는 새 프로젝트 생성

### 2️⃣ OAuth 동의 화면 구성
1. 왼쪽 메뉴 > **APIs & Services** > **OAuth consent screen**
2. User Type: **External** 선택
3. 앱 정보 입력:
   - **App name**: SupremeNote
   - **User support email**: 본인 이메일
   - **Developer contact information**: 본인 이메일
4. **SAVE AND CONTINUE** 클릭

### 3️⃣ OAuth 2.0 클라이언트 ID 생성
1. 왼쪽 메뉴 > **Credentials** 클릭
2. **+ CREATE CREDENTIALS** > **OAuth client ID**
3. Application type: **Web application**
4. 이름: `SupremeNote Web`
5. **Authorized redirect URIs** 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (배포 시: `https://yourdomain.com/api/auth/callback/google`)
6. **CREATE** 클릭

### 4️⃣ 클라이언트 정보 복사
- **Client ID**: `xxxxx.apps.googleusercontent.com`
- **Client secret**: `GOCSPX-xxxxx`

복사한 값을 `.env.local` 파일에 저장하세요.

---

## 2. GitHub OAuth 설정

### 1️⃣ GitHub Settings 접속
1. GitHub 로그인
2. 프로필 클릭 > **Settings**
3. 왼쪽 메뉴 맨 아래 > **Developer settings**
4. **OAuth Apps** 클릭

### 2️⃣ New OAuth App 생성
1. **New OAuth App** 버튼 클릭
2. 정보 입력:
   - **Application name**: SupremeNote
   - **Homepage URL**: `http://localhost:3000`
   - **Application description**: AI 기반 학습 노트 플랫폼
   - **Authorization callback URL**: 
     ```
     http://localhost:3000/api/auth/callback/github
     ```
3. **Register application** 클릭

### 3️⃣ Client Secret 생성
1. **Generate a new client secret** 클릭
2. Client ID와 Client secret 복사

### 4️⃣ 클라이언트 정보 복사
- **Client ID**: `Iv1.xxxxx`
- **Client secrets**: `xxxxx`

복사한 값을 `.env.local` 파일에 저장하세요.

---

## 3. 네이버 OAuth 설정

### 1️⃣ 네이버 개발자 센터 접속
1. https://developers.naver.com 접속
2. 네이버 계정으로 로그인
3. 상단 메뉴 > **Application** > **애플리케이션 등록**

### 2️⃣ 애플리케이션 등록
1. **애플리케이션 이름**: SupremeNote
2. **사용 API**: 
   - ✅ 네이버 로그인
   - 회원이름, 이메일, 프로필 사진 선택
3. **로그인 오픈 API 서비스 환경**:
   - ✅ PC웹
4. **서비스 URL**: `http://localhost:3000`
5. **Callback URL**: 
   ```
   http://localhost:3000/api/auth/callback/naver
   ```
6. **등록하기** 클릭

### 3️⃣ 클라이언트 정보 확인
애플리케이션 정보 페이지에서:
- **Client ID**: `xxxxx`
- **Client Secret**: `xxxxx`

복사한 값을 `.env.local` 파일에 저장하세요.

---

## 4. 환경변수 설정

### 1️⃣ `.env.local` 파일 생성

`frontend/.env.local` 파일을 생성하고 다음 내용을 입력:

```env
# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret

# GitHub OAuth
GITHUB_CLIENT_ID=Iv1.your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Naver OAuth
NAVER_CLIENT_ID=your-naver-client-id
NAVER_CLIENT_SECRET=your-naver-client-secret

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 2️⃣ NEXTAUTH_SECRET 생성

터미널에서 실행:

```bash
# Windows PowerShell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))

# Mac/Linux
openssl rand -base64 32
```

생성된 값을 `NEXTAUTH_SECRET`에 입력하세요.

---

## 5. 테스트

### 1️⃣ Frontend 서버 재시작

```bash
cd frontend
npm run dev
```

### 2️⃣ 로그인 페이지 접속

http://localhost:3000 접속

자동으로 로그인 페이지로 리디렉션됩니다.

### 3️⃣ 각 소셜 로그인 테스트

1. ✅ **Google로 계속하기** 클릭
   - Google 계정 선택
   - 권한 승인
   - Dashboard로 리디렉션 확인

2. ✅ **GitHub로 계속하기** 클릭
   - GitHub 계정으로 Authorize
   - Dashboard로 리디렉션 확인

3. ✅ **네이버로 계속하기** 클릭
   - 네이버 계정 로그인
   - 동의하기
   - Dashboard로 리디렉션 확인

---

## 🚨 문제 해결

### "Redirect URI mismatch" 에러
- OAuth 설정에서 Callback URL이 정확한지 확인
- 프로토콜(http/https), 포트번호 확인
- 슬래시(/) 포함 여부 확인

### "Invalid client" 에러
- Client ID와 Client Secret이 정확한지 확인
- 환경변수 파일 저장 후 서버 재시작 확인

### 로그인 후 리디렉션 안됨
- `NEXTAUTH_URL` 환경변수 확인
- `NEXTAUTH_SECRET` 설정 확인

### 네이버 로그인이 작동하지 않음
- 네이버 애플리케이션에서 "검수 상태" 확인
- 개발 중일 때는 "개발 중" 상태에서도 테스트 가능
- 테스트 계정 등록 필요할 수 있음

---

## 🎯 배포 시 추가 설정

### 프로덕션 URL 추가

각 OAuth 플랫폼에서 프로덕션 URL 추가:

**Google:**
```
https://yourdomain.com/api/auth/callback/google
```

**GitHub:**
```
https://yourdomain.com/api/auth/callback/github
```

**네이버:**
```
https://yourdomain.com/api/auth/callback/naver
```

### 환경변수 업데이트

배포 환경의 환경변수에서:
```env
NEXTAUTH_URL=https://yourdomain.com
```

---

## 📚 참고 자료

- [NextAuth.js 공식 문서](https://next-auth.js.org/)
- [Google OAuth 설정](https://console.cloud.google.com/)
- [GitHub OAuth Apps](https://github.com/settings/developers)
- [네이버 개발자 센터](https://developers.naver.com/)

---

**설정이 완료되었습니다!** 🎉

이제 사용자들이 Google, GitHub, 네이버 계정으로 간편하게 로그인할 수 있습니다.
