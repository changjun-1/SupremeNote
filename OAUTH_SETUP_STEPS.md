# 🔐 Google OAuth 설정 단계 (5분 완성)

## ✅ 준비 완료된 것
- [x] .env.local 파일 생성됨
- [x] NEXTAUTH_SECRET 설정됨
- [x] NextAuth 코드 준비됨

## 🚀 남은 단계: Google OAuth 설정

### 1단계: Google Cloud Console 접속
**링크 클릭:** https://console.cloud.google.com

### 2단계: 프로젝트 생성
1. 상단 프로젝트 선택 드롭다운 클릭
2. "새 프로젝트" 클릭
3. 프로젝트 이름: `SupremeNote`
4. "만들기" 클릭

### 3단계: OAuth 동의 화면 설정
1. 왼쪽 메뉴 **APIs & Services** 클릭
2. **OAuth consent screen** 클릭
3. **External** 선택 → "만들기" 클릭
4. 다음 정보 입력:
   - 앱 이름: `SupremeNote`
   - 사용자 지원 이메일: [본인 Gmail]
   - 개발자 연락처 이메일: [본인 Gmail]
5. **저장 및 계속** 클릭
6. 범위: 그냥 **저장 및 계속** 클릭
7. 테스트 사용자: 그냥 **저장 및 계속** 클릭

### 4단계: OAuth 클라이언트 ID 생성
1. 왼쪽 메뉴 **Credentials** 클릭
2. 상단 **+ CREATE CREDENTIALS** 클릭
3. **OAuth client ID** 선택
4. 다음 정보 입력:
   - Application type: **Web application**
   - 이름: `SupremeNote Web`
5. **승인된 리디렉션 URI** 섹션에서 **+ ADD URI** 클릭
6. 다음 주소 입력:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
7. **만들기** 클릭

### 5단계: 클라이언트 정보 복사
팝업 창에 나타난 정보를 복사:
- **클라이언트 ID**: `xxxxx.apps.googleusercontent.com`
- **클라이언트 보안 비밀번호**: `GOCSPX-xxxxx`

### 6단계: .env.local 파일 수정
1. `frontend/.env.local` 파일 열기
2. 다음 두 줄 찾기:
   ```
   GOOGLE_CLIENT_ID=
   GOOGLE_CLIENT_SECRET=
   ```
3. 복사한 값 붙여넣기:
   ```
   GOOGLE_CLIENT_ID=여기에-클라이언트-ID-붙여넣기.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=GOCSPX-여기에-시크릿-붙여넣기
   ```
4. 파일 저장 (Ctrl+S)

### 7단계: 완료! 테스트
1. 브라우저에서 http://localhost:3000 접속
2. "Google로 로그인" 버튼 클릭
3. Google 계정 선택
4. "허용" 클릭
5. ✅ Dashboard 화면 나타남!

---

## 🎯 다음에 할 것
설정이 완료되면 알려주세요! 바로 테스트해드리겠습니다.

---

## 💡 도움말
- 막히는 부분이 있으면 바로 물어보세요
- 스크린샷이 필요하면 말씀해주세요
- 다른 방법으로 하고 싶으면 알려주세요
