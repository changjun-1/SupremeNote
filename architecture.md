# 🏗️ Project: SupremeNote
> **Overview:** ThetaWave의 세련된 UI와 사용자 맞춤형 'Supreme Instruction' 기능이 결합된 AI 지식 관리 플랫폼.

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
- **입력:** 유튜브 URL, PDF, PPT, 일반 텍스트.
- **처리:** 사용자의 특정 요청(Supreme Instruction)을 최우선 반영하여 요약 및 마인드맵 생성.
- **저장:** 소셜 로그인 기반 개인 저장소 및 대용량 처리를 위한 이중 DB 구조.
- **UI:** ThetaWave 스타일의 직관적인 3분할 레이아웃.

---

## 2. 🛠️ 기술 스택 (Tech Stack)
- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, Lucide React, Mermaid.js.
- **Backend:** FastAPI (Python), `yt-dlp` (YouTube), `unstructured` (Document Parsing).
- **Auth:** NextAuth.js (Google, GitHub Providers).
- **Database:** Supabase (PostgreSQL + Vector).
- **AI/LLM:** LangChain, Gemini 1.5 Pro or GPT-4o.

---

## 3. 🗺️ 시스템 아키텍처 (System Flow)



1. **Auth:** NextAuth.js를 통한 소셜 로그인 (Google/GitHub).
2. **Ingestion:** - 유튜브 → `yt-dlp` (자막 및 메타데이터).
   - 문서(PDF/PPT) → `unstructured` (텍스트 및 컨텍스트).
3. **Orchestration:** 사용자의 **'Supreme Instruction'** + **'추출 데이터'**를 결합하여 프롬프트 구성.
4. **Generation:** AI가 마크다운 요약본과 Mermaid 마인드맵 코드를 동시 생성.
5. **Storage:** - **Supabase (Relational):** 일반 노트 정보 및 메타데이터 저장.
   - **Supabase (Vector):** 차후 RAG 검색을 위한 임베딩 데이터 저장.

---

## 4. 🗄️ 데이터베이스 스키마 (Database Schema)

### `users` (Managed by Supabase Auth)
### `notes` (Core Knowledge Data)
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | uuid (PK) | 고유 식별자 |
| `user_id` | uuid (FK) | 작성자 ID |
| `title` | text | 영상/문서 제목 |
| `source_url` | text | 원본 링크 또는 파일 경로 |
| `instruction` | text | 사용자가 입력한 '최고 명령' (Supreme Instruction) |
| `content_md` | text | AI가 생성한 마크다운 요약 노트 |
| `mermaid_code` | text | Mermaid.js 렌더링용 코드 |
| `created_at` | timestamp | 저장 일시 |

---

## 5. 🎨 UI/UX 설계 (ThetaWave Style)

### Layout 1: Dashboard (Main)
- **Sidebar:** 저장된 노트 목록 (검색 및 필터링 가능).
- **Top Input Area:** URL 입력창, 파일 업로드 버튼, 그리고 대망의 **'Supreme Instruction' 입력 칸**.
- **Run Button:** "요약 및 시각화 시작"

### Layout 2: Viewer (Result)
- **Left Pane:** 마크다운 렌더러 (타임스탬프 클릭 시 유튜브 재생 위치 이동 연동).
- **Right Pane:** Mermaid.js 기반의 동적 마인드맵 캔버스.
- **Bottom Bar:** '노트 수정', '저장', 'PDF로 내보내기' 버튼.

---

## 6. 🧠 프롬프트 엔지니어링 전략
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