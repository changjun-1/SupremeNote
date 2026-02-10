# 🏗️ Project: SupremeNote
> **Overview:** Notion 스타일의 깔끔한 UI와 사용자 맞춤형 'Supreme Instruction' 기능이 결합된 AI 지식 관리 플랫폼.
> 
> **업데이트:** 2026-02-10 - YouTube/PDF/웹 URL 요약, 폴더 관리, Notion 디자인 완료

## 🌐 로컬 개발 주소

| 서비스 | URL | 설명 |
|:---|:---|:---|
| **Frontend** | http://localhost:3000 | Next.js 웹 애플리케이션 |
| **Login** | http://localhost:3000/auth/signin | 로그인 페이지 |
| **Dashboard** | http://localhost:3000/dashboard | 메인 대시보드 (로그인 필요) |
| **Backend API** | http://localhost:8000 | FastAPI 서버 |
| **API Docs** | http://localhost:8000/docs | Swagger API 문서 |
| **API Redoc** | http://localhost:8000/redoc | ReDoc API 문서 |

---

## 1. 🎯 프로젝트 목표
- **입력:** YouTube URL, PDF 문서, 웹 페이지 URL
- **처리:** 사용자의 Supreme Instruction을 반영한 AI 자동 요약
- **저장:** Supabase 기반 개인 저장소 + 폴더 관리
- **UI:** Notion 스타일의 깔끔하고 직관적인 인터페이스
- **검색:** 제목, 내용, 태그 통합 검색
- **최적화:** 중복 제거 + 최근 3개 제한

---

## 2. 🛠️ 기술 스택 (Tech Stack)
- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, Lucide React, Mermaid.js
- **Backend:** FastAPI (Python), yt-dlp (YouTube), pdfplumber (PDF), BeautifulSoup4 (웹 크롤링)
- **Auth:** Supabase Auth (Google OAuth) ✅ 완료
- **Database:** Supabase (PostgreSQL + pgvector) ✅ 완료
- **AI/LLM:** 
  - Google Gemini Flash Latest (요약, 핵심 포인트)
  - OpenAI Whisper Tiny (로컬 음성인식, 무료)
- **최적화:** FFmpeg (오디오 처리), Hybrid 처리 (자막 우선 → Whisper 폴백)

---

## 3. 🗺️ 시스템 아키텍처 (System Architecture)

### 3.1 전체 시스템 구조

```
┌─────────────────────────────────────────┐
│         사용자 (브라우저)                 │
└─────────────────┬───────────────────────┘
                  │
        ┌─────────┴──────────┐
        │                    │
        ▼                    ▼
┌──────────────┐    ┌──────────────────┐
│   Next.js    │◄──►│   Supabase       │
│  (Frontend)  │    │                  │
│              │    │ • Auth           │
│ • UI/UX      │    │ • Database       │
│ • 로그인      │    │ • Storage        │
│ • 결과 표시   │    │ • Realtime       │
└──────┬───────┘    └──────────────────┘
       │
       │ API 호출
       ▼
┌──────────────────────────────────────┐
│        FastAPI Backend               │
│         (Python)                     │
├──────────────────────────────────────┤
│ • yt-dlp (YouTube 다운로드)          │
│ • LangChain (AI 처리)               │
│ • Gemini/GPT API (요약, 생성)       │
│ • unstructured (문서 파싱)          │
│ • 비즈니스 로직                      │
└────────┬─────────────────────────────┘
         │
         ▼
    ┌──────────┐
    │ Supabase │
    │ Database │ ← 처리된 데이터 저장
    └──────────┘
```

### 3.2 각 컴포넌트의 역할

#### 🎨 Next.js Frontend ✅
**역할:** 사용자 인터페이스 및 클라이언트 로직
- UI/UX 렌더링 (Notion 스타일)
- 사용자 입력 수집 (YouTube URL, PDF 파일, 웹 URL, Supreme Instruction)
- Supabase와 직접 통신 (인증, 노트 CRUD, 폴더 관리)
- FastAPI Backend로 요약 요청
- 실시간 결과 표시 및 마인드맵 생성

**주요 컴포넌트:**
- `Dashboard.tsx`: 메인 레이아웃, 상태 관리
- `Sidebar.tsx`: 검색, 필터, 폴더, 노트 목록
- `InputArea.tsx`: YouTube/PDF/웹 URL 입력
- `Viewer.tsx`: 마크다운, 마인드맵, 영상 보기
- `NoteEditor.tsx`: 노트 편집, 자동 저장

**기술:**
- Next.js 14+ (App Router)
- Tailwind CSS (Notion 색상 팔레트)
- Supabase Client SDK (`@supabase/auth-helpers-nextjs`)
- Mermaid.js (마인드맵 동적 렌더링)
- ReactMarkdown (마크다운 렌더링)

#### 🗄️ Supabase ✅
**역할:** 데이터 저장소 및 인증 관리

- **Auth (완료):**
  - Google OAuth 로그인
  - 세션 관리 (쿠키 기반)
  - JWT 토큰 발급

- **Database (PostgreSQL) (완료):**
  - `folders` 테이블: 폴더 관리, 계층 구조, 아이콘
  - `notes` 테이블: 제목, 마크다운, 태그, 폴더 연결
  - `youtube_summaries` 테이블: 요약 기록
  - `embeddings` 테이블: 벡터 검색 (pgvector)
  - `user_documents` 테이블: 문서 메타데이터
  - `user_preferences` 테이블: 사용자 설정

- **RLS (Row Level Security) (완료):**
  - 모든 테이블에 RLS 정책 적용
  - `auth.uid() = user_id` 조건
  - 사용자는 자신의 데이터만 접근

- **Triggers (완료):**
  - `updated_at` 자동 업데이트
  - 폴더/노트 수정 시 타임스탬프 갱신

**특징:**
- ✅ Row Level Security (사용자별 데이터 완전 분리)
- ✅ Indexes (검색 성능 최적화)
- ✅ Foreign Keys (데이터 무결성)
- 🚧 Storage (향후 구현 예정)
- 🚧 Realtime (향후 구현 예정)

#### ⚙️ FastAPI Backend ✅
**역할:** 무거운 처리 및 AI 연동

- **YouTube 처리 (완료):**
  - `youtube-transcript-api`: 자막 추출 (빠름)
  - `yt-dlp`: 오디오 다운로드 (자막 없을 때)
  - `Whisper Tiny`: 음성→텍스트 변환 (로컬, 무료)
  - `FFmpeg`: 오디오 포맷 변환

- **PDF 처리 (완료):**
  - `pdfplumber`: 텍스트 추출
  - 메타데이터 자동 추출 (제목, 저자, 페이지 수)
  - `python-multipart`: 파일 업로드

- **웹 크롤링 (완료):**
  - `BeautifulSoup4`: HTML 파싱
  - `requests`: HTTP 요청
  - `lxml`: 빠른 XML 파싱
  - 본문 자동 추출 (article 태그 우선)

- **AI 처리 (완료):**
  - `google-generativeai`: Gemini Flash API
  - Supreme Instruction 우선 프롬프트
  - 요약 + 핵심 포인트 생성
  - 커스텀 요청 완벽 반영

**API 엔드포인트:**
- `POST /api/youtube/summarize`: YouTube 요약
- `POST /api/pdf/upload`: PDF 업로드 & 요약
- `POST /api/web/summarize`: 웹 페이지 요약
- `GET /health`: 서버 상태 확인

**보안:**
- ✅ API 키는 `.env`에만 저장
- ✅ CORS 설정 (localhost:3000만 허용)
- ✅ 환경 변수 분리
- ✅ 임시 파일 자동 삭제

### 3.3 데이터 흐름 (실제 구현) ✅

```
1. 사용자 입력 (Frontend)
   ↓
   [YouTube URL | PDF 파일 | 웹 URL] + Supreme Instruction
   ↓
2. Supabase Auth 확인
   ↓
   supabase.auth.getUser() → JWT 검증
   ↓
3. FastAPI Backend 호출
   ↓
   POST /api/youtube/summarize
   POST /api/pdf/upload
   POST /api/web/summarize
   {
     video_url/url: "...",
     custom_instruction: "...",
     user_id: "uuid"
   }
   ↓
4. Backend 처리
   ┌─────────────────────────────────┐
   │ YouTube:                        │
   │  ├─ youtube-transcript-api      │ → 자막 추출 (우선)
   │  └─ yt-dlp + Whisper           │ → 음성인식 (폴백)
   │                                 │
   │ PDF:                            │
   │  └─ pdfplumber                  │ → 텍스트 추출
   │                                 │
   │ Web:                            │
   │  └─ BeautifulSoup4              │ → HTML 파싱
   │                                 │
   │ AI 요약:                         │
   │  └─ Gemini Flash                │ → 요약 + 핵심 포인트
   └─────────────────────────────────┘
   ↓
5. Frontend 임시 표시
   ┌─────────────────────────────────┐
   │ Viewer 컴포넌트                  │
   │  ├─ 마크다운 렌더링              │
   │  ├─ 마인드맵 동적 생성           │
   │  ├─ YouTube 임베드 (선택)        │
   │  └─ "노트로 저장" 버튼          │
   └─────────────────────────────────┘
   ↓
6. 사용자가 저장 클릭
   ↓
   폴더 선택 (선택사항)
   ↓
7. Supabase Database 저장
   ┌─────────────────────────────────┐
   │ notes 테이블                     │
   │  ├─ title, content, tags        │
   │  ├─ folder_id (선택된 폴더)      │
   │  └─ user_id (RLS 자동 필터)     │
   └─────────────────────────────────┘
   ↓
8. 노트 목록 새로고침
   ↓
   Sidebar에 새 노트 표시
```

### 3.4 파일 저장 전략 (현재 구현)

#### ✅ Database 저장 (Supabase PostgreSQL)
- **notes 테이블:** 제목, 마크다운 콘텐츠, 태그, 폴더
- **folders 테이블:** 폴더 이름, 아이콘, 색상, 계층
- **youtube_summaries 테이블:** 요약, 핵심 포인트, URL
- **메타데이터:** 생성/수정 일시, 사용자 ID

#### 🚧 임시 파일 (Backend)
- **downloads/**: YouTube 오디오 다운로드 (처리 후 자동 삭제)
- **uploads/pdf/**: PDF 업로드 (처리 후 자동 삭제)

#### 📋 향후 계획: Supabase Storage
- PDF 원본 영구 저장
- 오디오/영상 파일 보관
- 노트 첨부 파일

#### 예시 구조 (현재):
```
Supabase Database:
folders 테이블
├─ id: uuid-1
├─ name: "개발 공부"
├─ icon: "📁"
└─ color: "#2383e2"

notes 테이블
├─ id: uuid-2
├─ user_id: auth-uuid
├─ folder_id: uuid-1  ← 폴더 연결
├─ title: "Python 기초"
├─ content: "# Python\n\n## 변수..."
├─ tags: ["python", "프로그래밍"]
└─ is_favorite: false

youtube_summaries 테이블
├─ id: uuid-3
├─ video_id: "abc123"
├─ summary: "이 영상은..."
├─ key_points: ["포인트1", "포인트2"]
└─ source: "subtitle" or "whisper"
```

---

## 4. 🔄 처리 흐름 상세

### 4.1 Auth Flow ✅
```
1. 사용자가 "Google로 로그인" 클릭
   ↓
   signin/page.tsx → supabase.auth.signInWithOAuth()
   ↓
2. Google OAuth 페이지로 리디렉션
   ↓
   사용자가 Google 계정 선택
   ↓
3. Callback 처리
   ↓
   auth/callback/route.ts → exchangeCodeForSession()
   ↓
4. 세션 생성 & 쿠키 저장
   ↓
   JWT 토큰 발급
   ↓
5. Dashboard로 리디렉션
   ↓
   middleware.ts → 세션 확인
   ↓
6. Protected Routes 보호
   ├─ /dashboard → 로그인 필요
   └─ /auth/signin → 로그인 시 dashboard로
```

**구현 파일:**
- `frontend/src/app/auth/signin/page.tsx`: 로그인 UI
- `frontend/src/app/auth/callback/route.ts`: OAuth 콜백
- `frontend/src/middleware.ts`: 세션 확인 & 라우트 보호
- `frontend/src/lib/supabase.ts`: Supabase 클라이언트

### 4.2 Content Processing Flow ✅

1. **Ingestion (수집):**
   - **YouTube:** 
     - 1차: `youtube-transcript-api` (자막)
     - 2차: `yt-dlp` + `Whisper` (음성인식)
   - **PDF:** `pdfplumber` (텍스트 + 메타데이터)
   - **웹:** `BeautifulSoup4` (HTML → 텍스트)

2. **Preprocessing (전처리):**
   - 텍스트 정리 (공백, 줄바꿈)
   - 메타데이터 추출 (제목, 저자, URL)
   - 언어 자동 감지 (Whisper)

3. **AI Processing (AI 처리):**
   - **Gemini Flash Latest** 호출
   - **Supreme Instruction 우선 적용**
   - 프롬프트 구성:
     ```
     # 영상 제목
     "{title}"
     
     # 영상 내용
     {transcript}
     
     # 사용자의 요청
     {custom_instruction}
     
     # 지시사항
     사용자의 요청에 정확히 맞게 분석
     ```
   - 요약 + 핵심 포인트 생성

4. **Rendering (렌더링):**
   - Frontend에서 임시 노트 생성
   - 마크다운 렌더링 (ReactMarkdown)
   - 마인드맵 동적 생성 (Mermaid.js)
   - YouTube 임베드 (videoId 추출)

5. **Storage (저장):**
   - 사용자가 "노트로 저장" 클릭 시
   - 폴더 선택 (선택사항)
   - Supabase `notes` 테이블에 저장
   - RLS 자동 적용 (`user_id` 필터)

6. **Post-processing (후처리):**
   - 임시 파일 삭제 (오디오, PDF)
   - 노트 목록 새로고침
   - Viewer로 자동 전환

---

## 5. 🗄️ 데이터베이스 스키마 (Database Schema) ✅ 완료

### 1. `auth.users` (Supabase Auth 관리)
- Google OAuth 사용자 정보
- 이메일, 프로필 사진 등

### 2. `folders` (폴더/카테고리)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | 고유 식별자 |
| `user_id` | uuid (FK) | 소유자 ID |
| `name` | text | 폴더 이름 |
| `color` | text | 폴더 색상 (기본: `#3b82f6`) |
| `icon` | text | 폴더 아이콘 (기본: 📁) |
| `parent_id` | uuid (FK) | 상위 폴더 (중첩 구조) |
| `position` | integer | 정렬 순서 |
| `created_at` | timestamp | 생성 일시 |
| `updated_at` | timestamp | 수정 일시 |

### 3. `notes` (사용자 노트)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | 고유 식별자 |
| `user_id` | uuid (FK) | 작성자 ID |
| `folder_id` | uuid (FK) | 폴더 ID (NULL 가능) |
| `title` | text | 노트 제목 |
| `content` | text | 마크다운 내용 |
| `tags` | text[] | 태그 배열 |
| `is_favorite` | boolean | 즐겨찾기 여부 |
| `created_at` | timestamp | 생성 일시 |
| `updated_at` | timestamp | 수정 일시 |

### 4. `youtube_summaries` (YouTube 요약 기록)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | 고유 식별자 |
| `user_id` | uuid (FK) | 사용자 ID |
| `video_id` | text | YouTube 비디오 ID |
| `video_url` | text | 원본 URL |
| `title` | text | 영상 제목 |
| `summary` | text | AI 요약 |
| `key_points` | text[] | 핵심 포인트 |
| `custom_instruction` | text | 사용자 지시사항 |
| `source` | text | 처리 방법 (subtitle/whisper) |
| `created_at` | timestamp | 생성 일시 |

### 5. `embeddings` (벡터 검색용)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | 고유 식별자 |
| `note_id` | uuid (FK) | 노트 ID |
| `content` | text | 원본 텍스트 |
| `embedding` | vector(768) | AI 임베딩 |
| `created_at` | timestamp | 생성 일시 |

### RLS (Row Level Security) 정책
- ✅ 모든 테이블에 RLS 활성화
- ✅ 사용자는 자신의 데이터만 접근 가능
- ✅ `auth.uid() = user_id` 조건

---

## 13. 🎬 YouTube 처리 플로우

### 하이브리드 처리 전략
```
1. YouTube URL 입력
   ↓
2. 자막 확인 (youtube-transcript-api)
   ├─ 자막 있음 → ✅ 빠른 처리 (1-2초)
   └─ 자막 없음 → 3단계로
   ↓
3. Whisper 음성인식
   ├─ yt-dlp로 오디오 다운로드
   ├─ FFmpeg로 MP3 변환
   └─ Whisper Tiny 모델로 변환 (2-3분)
   ↓
4. Gemini AI 요약
   ├─ Supreme Instruction 우선 적용
   ├─ 요약 생성
   └─ 핵심 포인트 추출 (5-10개)
   ↓
5. 결과 표시
   ├─ 마크다운 렌더링
   ├─ 마인드맵 생성
   ├─ YouTube 영상 임베드
   └─ 폴더 선택 후 저장
```

### Whisper 모델 선택
- **Tiny (39MB)**: ⚡ 가장 빠름, CPU 최적화, 무료
- Base (74MB): 더 정확, 2-3배 느림
- Small/Medium/Large: GPU 필요

---

## 14. 📄 PDF 처리 플로우

```
1. PDF 파일 업로드
   ↓
2. pdfplumber로 텍스트 추출
   ├─ 페이지별 처리
   ├─ 메타데이터 추출 (제목, 저자)
   └─ 진행률 표시
   ↓
3. Gemini AI 요약
   ├─ Supreme Instruction 적용
   ├─ 요약 생성
   └─ 핵심 포인트 추출
   ↓
4. 임시 파일 삭제
   ↓
5. 결과 표시 & 저장
```

---

## 15. 🌐 웹 URL 처리 플로우

```
1. 웹 페이지 URL 입력
   ↓
2. BeautifulSoup4로 크롤링
   ├─ HTTP 요청
   ├─ HTML 파싱
   └─ 본문 추출 (article 태그 우선)
   ↓
3. 메타데이터 추출
   ├─ <title> 태그
   ├─ <meta name="description">
   └─ <meta name="author">
   ↓
4. Gemini AI 요약
   ├─ Supreme Instruction 적용
   ├─ 요약 생성
   └─ 핵심 포인트 추출
   ↓
5. 결과 표시 & 저장
```

---

## 16. 🎨 Notion 스타일 가이드

### 색상 팔레트
```css
--notion-white: #ffffff
--notion-bg: #f7f6f3
--notion-text: #37352f
--notion-gray: #9b9a97
--notion-light-gray: #787774
--notion-border: #e9e9e7
--notion-hover: #f1f1ef
--notion-blue: #2383e2
--notion-red: #eb5757
```

### 컴포넌트 스타일
- **카드:** `border: 1px solid #e9e9e7` + `box-shadow`
- **버튼:** `border-radius: 3px`, 단색 배경
- **입력:** 1px border, 최소 shadow
- **호버:** 배경색만 변경, transform 없음
- **간격:** 넉넉한 padding (Notion 특유의 여백감)

### 타이포그래피
- **폰트:** `-apple-system, Segoe UI, Helvetica`
- **제목:** `font-weight: 600-700`, `text-[#37352f]`
- **본문:** `font-weight: 400`, `text-[#37352f]`
- **보조:** `text-[#9b9a97]`

---

**마지막 대규모 업데이트:** 2026-02-10  
**주요 변경사항:**  
1. ThetaWave → Notion 스타일 디자인 전환  
2. PDF/웹 URL 요약 기능 추가  
3. 폴더 관리 및 검색 강화  
4. 최근 기록 중복 제거 + 3개 제한  
5. 요약 저장 시 폴더 선택 기능

---

## 6. 🎨 UI/UX 설계 (Notion Style) ✅ 완료

### Notion 스타일 디자인 시스템
- **색상:** 라이트 테마 (`#ffffff`, `#f7f6f3`, `#37352f`)
- **타이포그래피:** `-apple-system, Segoe UI, Helvetica`
- **컴포넌트:** 깔끔한 border, 미니멀 shadow, 단색 버튼

### Layout 1: Dashboard (Main)
- **Sidebar (왼쪽 280px):**
  - 로고 & YouTube 바로가기
  - "새 노트 작성" / "AI 콘텐츠 요약" 버튼
  - 검색창 (제목, 내용, 태그)
  - 필터 (전체, 최근, 즐겨찾기)
  - 폴더 목록 (생성, 삭제, 선택)
  - 노트 목록 (카드 스타일)
  - 사용자 프로필 & 로그아웃

### Layout 2: Input Area (요약 생성)
- **3가지 입력 모드:**
  - YouTube: URL 입력
  - PDF: 파일 업로드 (드래그 앤 드롭)
  - 웹 URL: 웹 페이지 링크 입력
- **Supreme Instruction 입력칸** (선택)
- **AI 요약 생성 버튼**
- **진행 상태 표시** (인증 → 처리 → 완료)

### Layout 3: Viewer (결과 보기)
- **상단 탭:** 노트 | 마인드맵 | 영상 (YouTube만)
- **액션 버튼:**
  - 폴더 선택 드롭다운
  - 노트로 저장 (요약용)
  - 즐겨찾기
  - 공유
  - 편집
  - 다운로드
- **마크다운 렌더링:** ReactMarkdown + 커스텀 스타일
- **마인드맵:** Mermaid.js 동적 생성 (YouTube 핵심 포인트 기반)
- **영상 임베드:** YouTube iframe

### Layout 4: Note Editor (노트 편집)
- **자동 저장:** 3초 디바운스
- **저장 상태 표시:** 저장 중 | 저장됨 | 저장 안됨
- **제목 입력:** Placeholder "제목 없음"
- **폴더 선택:** 드롭다운
- **태그 관리:** 추가/제거
- **마크다운 에디터:** Textarea (전체 화면)

---

## 7. 🧠 프롬프트 엔지니어링 전략
AI에게 전달될 최종 프롬프트 구조는 다음과 같음:

```text
너는 최고의 지식 구조화 전문가이다. 
아래의 [USER_SUPREME_INSTRUCTION]은 다른 모든 규칙보다 절대적인 우선순위를 가진다.

[USER_SUPREME_INSTRUCTION]
{{사용자가 입력한 커스텀 요청 내용}}

[SOURCE_DATA]
{{yt-dlp 또는 파일에서 추출된 텍스트}}

[OUTPUT_FORMAT]
1. 계층적 Markdown 노트를 작성할 것.
2. 지식의 흐름을 보여주는 Mermaid.js 코드를 작성할 것.

---

## 8. ✅ 완료된 기능 (2026-02-10 업데이트)

### 🎨 Frontend (Next.js)
- ✅ Notion 스타일 디자인 시스템 적용
- ✅ Sidebar 컴포넌트 (검색, 필터, 폴더, 노트 목록)
- ✅ InputArea 컴포넌트 (YouTube/PDF/웹 URL 입력)
- ✅ Viewer 컴포넌트 (마크다운, 마인드맵, 영상)
- ✅ NoteEditor 컴포넌트 (자동 저장, 폴더 선택)
- ✅ Dashboard 컴포넌트 (전체 레이아웃)

### 🔐 Auth (Supabase)
- ✅ Google OAuth 로그인
- ✅ 세션 관리 (Middleware)
- ✅ 로그아웃
- ✅ Protected Routes

### 🗄️ Database (Supabase)
- ✅ notes 테이블 (제목, 내용, 태그, 폴더)
- ✅ folders 테이블 (이름, 색상, 아이콘, 계층)
- ✅ youtube_summaries 테이블
- ✅ Row Level Security (RLS) 정책
- ✅ CRUD 작업 (Create, Read, Update, Delete)

### 📁 폴더 관리
- ✅ 폴더 생성/삭제
- ✅ 폴더별 노트 필터링
- ✅ 요약 저장 시 폴더 선택
- ✅ 폴더별 노트 개수 표시

### 🔍 검색 & 필터
- ✅ 전체 검색 (제목, 내용, 태그)
- ✅ 검색 결과 개수 표시
- ✅ 필터: 전체, 최근, 즐겨찾기
- ✅ 최근 기록 중복 제거
- ✅ 최근 기록 최대 3개 제한

### 🤖 AI 처리 (Backend)
- ✅ YouTube 요약 API
  - ✅ 자막 추출 (youtube-transcript-api)
  - ✅ Whisper 음성인식 (Tiny 모델)
  - ✅ 하이브리드 처리 (자막 우선 → Whisper 폴백)
  - ✅ FFmpeg 통합
- ✅ PDF 요약 API
  - ✅ 텍스트 추출 (pdfplumber)
  - ✅ 메타데이터 추출
- ✅ 웹 URL 요약 API
  - ✅ 웹 크롤링 (BeautifulSoup4)
  - ✅ 본문 자동 추출
- ✅ Gemini AI 통합
  - ✅ 요약 생성
  - ✅ 핵심 포인트 추출
  - ✅ Supreme Instruction 우선 적용

### 🎯 노트 기능
- ✅ 노트 작성/수정/삭제
- ✅ 자동 저장 (3초 디바운스)
- ✅ 즐겨찾기
- ✅ 태그 관리
- ✅ 마크다운 렌더링
- ✅ 마인드맵 시각화 (Mermaid.js)
- ✅ YouTube 영상 임베드

### 💾 요약 → 노트 저장
- ✅ 요약 콘텐츠 미리보기
- ✅ 폴더 선택 후 저장
- ✅ YouTube/PDF/웹 모두 지원
- ✅ 자동 태그 생성

---

## 9. 🚀 성능 최적화

### YouTube 처리
- **하이브리드 접근:** 자막 있으면 빠른 처리, 없으면 Whisper
- **Whisper Tiny 모델:** CPU 최적화, 2-3배 빠름
- **FFmpeg 통합:** 효율적인 오디오 처리

### UI 최적화
- **최근 기록 제한:** 최대 3개로 렌더링 성능 향상
- **중복 제거:** 같은 제목 노트 하나만 표시
- **자동 저장 디바운스:** 3초로 API 호출 최소화

### 비용 최적화
- **Whisper 로컬:** 100% 무료 (OpenAI API X)
- **Gemini Flash:** 빠르고 저렴한 모델 선택
- **자막 우선:** 가능하면 무료 자막 사용

---

## 10. 📋 다음 단계 (TODO)

### 우선순위 높음
- [ ] 노트 공유 기능
- [ ] 노트 내보내기 (PDF, Markdown)
- [ ] 모바일 반응형 개선

### 우선순위 중간
- [ ] 다크 모드 토글
- [ ] 더 많은 OAuth (GitHub, Naver)
- [ ] 노트 버전 관리

### 우선순위 낮음
- [ ] 협업 기능
- [ ] 실시간 동기화
- [ ] 오프라인 모드

---

## 11. 🔧 환경 설정

### 필수 환경 변수
```env
# Frontend
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_GEMINI_API_KEY=
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000

# Backend
SUPABASE_URL=
SUPABASE_KEY=
GEMINI_API_KEY=
ENVIRONMENT=development
DEBUG=True
```

### 설치 가이드
1. **FFmpeg 설치:** `winget install --id Gyan.FFmpeg`
2. **Python 의존성:** `pip install -r requirements.txt`
3. **Node 의존성:** `npm install`
4. **Supabase 설정:** `database/schema.sql` 실행

---

## 12. 📊 프로젝트 통계

- **Frontend 컴포넌트:** 5개 (Dashboard, Sidebar, Viewer, NoteEditor, InputArea)
- **Backend API 엔드포인트:** 3개 (YouTube, PDF, Web)
- **데이터베이스 테이블:** 7개 (notes, folders, youtube_summaries, embeddings, user_documents, user_preferences + auth.users)
- **지원 입력:** YouTube, PDF, 웹 URL
- **AI 모델:** Gemini Flash, Whisper Tiny
- **디자인 시스템:** Notion 스타일

---

**마지막 업데이트:** 2026-02-10  
**버전:** 1.0.0  
**상태:** Production Ready ✅