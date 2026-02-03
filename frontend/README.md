# SupremeNote Frontend

Next.js 14+ (App Router)를 사용한 프론트엔드 애플리케이션입니다.

## 🚀 시작하기

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.local.example`을 복사하여 `.env.local` 파일을 생성하고 값을 채워넣으세요.

```bash
cp .env.local.example .env.local
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

## 📁 프로젝트 구조

```
frontend/
├── src/
│   ├── app/              # App Router 페이지
│   │   ├── layout.tsx    # 루트 레이아웃
│   │   ├── page.tsx      # 메인 페이지 (Dashboard)
│   │   └── api/          # API Routes (NextAuth 등)
│   ├── components/       # 재사용 가능한 컴포넌트
│   │   ├── ui/           # 기본 UI 컴포넌트
│   │   ├── dashboard/    # Dashboard 관련
│   │   └── viewer/       # Viewer 관련
│   ├── lib/              # 유틸리티 및 설정
│   └── types/            # TypeScript 타입 정의
├── public/               # 정적 파일
└── styles/               # 전역 스타일
```

## 🛠️ 주요 기능

- ✅ Next.js 14+ App Router
- ✅ Tailwind CSS (ThetaWave 스타일)
- ✅ TypeScript
- ✅ NextAuth.js (소셜 로그인)
- ✅ Supabase 클라이언트
- ✅ Lucide React 아이콘
- ✅ Mermaid.js 마인드맵

## 📝 개발 명령어

```bash
npm run dev      # 개발 서버 시작
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버 시작
npm run lint     # ESLint 실행
```
