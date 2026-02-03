# 🚀 OAuth 빠른 설정 가이드

실제 Google, GitHub, 네이버 계정으로 로그인하려면 OAuth 설정이 필요합니다.

## ⚡ 가장 빠른 방법: Google OAuth (5분)

### 1. Google Cloud Console
https://console.cloud.google.com

### 2. 새 프로젝트 생성
- 프로젝트 이름: `SupremeNote`

### 3. OAuth 동의 화면
1. **APIs & Services** → **OAuth consent screen**
2. **External** 선택
3. 앱 이름: `SupremeNote`
4. 이메일 입력 → 저장

### 4. OAuth 클라이언트 ID 생성
1. **Credentials** → **CREATE CREDENTIALS** → **OAuth client ID**
2. Application type: **Web application**
3. **Authorized redirect URIs** 추가:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
4. **CREATE** 클릭

### 5. 환경변수 설정

`frontend/.env.local` 파일 생성:

```env
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-random-secret-here

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret

# GitHub (선택)
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

# Naver (선택)
NAVER_CLIENT_ID=
NAVER_CLIENT_SECRET=
```

### 6. NEXTAUTH_SECRET 생성

PowerShell에서:
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

### 7. Frontend 서버 재시작

```bash
cd frontend
npm run dev
```

---

## ✅ 테스트

1. http://localhost:3000 접속
2. "Google로 로그인" 클릭
3. Google 계정 선택
4. 권한 승인
5. ✅ Dashboard로 자동 이동!

---

## 📚 전체 가이드

더 자세한 설명은 `docs/OAUTH_SETUP_GUIDE.md` 참고
