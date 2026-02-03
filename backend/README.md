# SupremeNote Backend

FastAPI 기반의 백엔드 서버입니다.

## 🚀 시작하기

### 1. 가상환경 생성 (권장)
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. 의존성 설치
```bash
pip install -r requirements.txt
```

### 3. 환경변수 설정
`.env.example`을 복사하여 `.env` 파일을 생성하고 값을 채워넣으세요.

```bash
cp .env.example .env
```

### 4. 서버 실행
```bash
# 방법 1: uvicorn 직접 실행
uvicorn main:app --reload

# 방법 2: Python으로 실행
python main.py
```

서버가 [http://localhost:8000](http://localhost:8000)에서 실행됩니다.

API 문서는 [http://localhost:8000/docs](http://localhost:8000/docs)에서 확인 가능합니다.

## 📁 프로젝트 구조 (예정)

```
backend/
├── main.py              # FastAPI 앱 진입점
├── requirements.txt     # Python 의존성
├── .env                 # 환경변수 (git ignore)
├── app/
│   ├── routers/         # API 엔드포인트
│   │   ├── youtube.py   # YouTube 처리
│   │   ├── documents.py # 문서 파싱
│   │   └── ai.py        # AI 요약/생성
│   ├── services/        # 비즈니스 로직
│   │   ├── youtube_service.py
│   │   ├── document_service.py
│   │   └── ai_service.py
│   ├── models/          # Pydantic 모델
│   ├── config/          # 설정 파일
│   └── utils/           # 유틸리티 함수
└── tests/               # 테스트 코드
```

## 🛠️ 주요 기능

- ✅ FastAPI REST API
- ✅ YouTube 자막 추출 (yt-dlp)
- ✅ 문서 파싱 (PDF, PPT, DOCX)
- ✅ AI 요약 및 마인드맵 생성 (LangChain)
- ✅ Supabase 데이터베이스 연동

## 📝 API 엔드포인트 (예정)

### Health Check
- `GET /` - 서버 상태 확인
- `GET /health` - Health check

### YouTube Processing
- `POST /api/youtube/extract` - YouTube URL에서 자막 추출

### Document Processing
- `POST /api/documents/upload` - 문서 업로드 및 파싱

### AI Processing
- `POST /api/ai/summarize` - 요약 및 마인드맵 생성
