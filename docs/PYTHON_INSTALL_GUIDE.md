# 🐍 Python 설치 가이드 (Windows)

UVKL Backend를 실행하기 위한 Python 설치 방법입니다.

## 📋 요구사항

- **Python 버전:** 3.11 이상 (권장: 3.12)
- **운영체제:** Windows 10/11

---

## 방법 1: 자동 설치 (winget 사용) ⚡

### 1️⃣ winget 확인

터미널(PowerShell)에서:
```powershell
winget --version
```

### 2️⃣ Python 설치

```powershell
# Python 3.12 설치 (권장)
winget install Python.Python.3.12

# 또는 최신 버전
winget install Python.Python.3
```

설치 중 나타나는 모든 대화상자에서 **"예"** 또는 **"설치"**를 선택하세요.

### 3️⃣ 설치 확인

**⚠️ 중요: 터미널을 완전히 닫고 새로 열어야 합니다!**

```powershell
python --version
# 출력 예시: Python 3.12.x

python -m pip --version
# 출력 예시: pip 24.x.x
```

---

## 방법 2: 수동 설치 (공식 웹사이트) 🌐

### 1️⃣ Python 다운로드

1. https://www.python.org/downloads/ 접속
2. **Download Python 3.12.x** (노란색 버튼) 클릭
3. 설치 파일 다운로드 완료 대기

### 2️⃣ Python 설치

1. 다운로드한 `python-3.12.x-amd64.exe` 실행
2. **🔥 매우 중요!** 
   - 하단의 **"Add python.exe to PATH"** 체크박스 ✅ **반드시 선택!**
   - 이것을 선택하지 않으면 명령어를 찾을 수 없습니다!

3. **"Install Now"** 클릭
4. UAC (사용자 계정 컨트롤) 창에서 **"예"** 클릭
5. 설치 완료까지 대기 (약 2-3분)
6. **"Close"** 클릭

### 3️⃣ 설치 확인

**⚠️ 중요: 현재 열린 모든 터미널을 닫고 새로 열어야 합니다!**

새 PowerShell 또는 Command Prompt 열고:
```powershell
python --version
python -m pip --version
```

---

## 방법 3: Microsoft Store (간편하지만 권장하지 않음)

1. **Microsoft Store** 앱 열기
2. "Python 3.12" 검색
3. **설치** 클릭

**⚠️ 주의:** Microsoft Store 버전은 때때로 권한 문제가 있을 수 있습니다.
가능하면 **방법 1** 또는 **방법 2**를 사용하세요.

---

## 🔧 설치 후 작업

### 1️⃣ pip 업그레이드

```powershell
python -m pip install --upgrade pip
```

### 2️⃣ Backend 의존성 설치

```powershell
# SupremeNote 프로젝트 폴더로 이동
cd C:\Users\1213j\njc\SupremeNote\backend

# 가상환경 생성 (권장)
python -m venv venv

# 가상환경 활성화
.\venv\Scripts\activate

# 의존성 설치
pip install -r requirements.txt
```

### 3️⃣ Backend 서버 실행

```powershell
# 환경변수 설정 (선택사항, .env 파일이 있으면 자동)
# $env:ENVIRONMENT="development"

# 서버 실행
python main.py

# 또는
uvicorn main:app --reload
```

서버가 http://localhost:8000 에서 실행됩니다! 🎉

---

## 🚨 문제 해결

### "python을 찾을 수 없습니다" 에러

**원인:** PATH 환경변수에 Python이 추가되지 않음

**해결방법 1 - 재설치:**
1. Python 제거 (제어판 > 프로그램 제거)
2. 재설치 시 **"Add to PATH"** 체크 ✅

**해결방법 2 - 수동으로 PATH 추가:**
1. **시스템 환경 변수** 검색
2. **환경 변수** 클릭
3. **Path** 편집
4. 다음 경로 추가:
   ```
   C:\Users\1213j\AppData\Local\Programs\Python\Python312\
   C:\Users\1213j\AppData\Local\Programs\Python\Python312\Scripts\
   ```
5. 터미널 재시작

### "pip을 찾을 수 없습니다" 에러

```powershell
# pip 재설치
python -m ensurepip --upgrade
python -m pip install --upgrade pip
```

### "권한이 거부되었습니다" 에러

```powershell
# 관리자 권한으로 PowerShell 실행
# 또는 --user 옵션 사용
pip install --user -r requirements.txt
```

### 설치가 너무 느린 경우

```powershell
# 미러 서버 사용 (한국)
pip install -r requirements.txt -i https://mirror.kakao.com/pypi/simple
```

---

## ✅ 설치 확인 체크리스트

설치가 완료되면 다음을 확인하세요:

```powershell
# 1. Python 버전 확인 (3.11 이상)
python --version

# 2. pip 버전 확인
python -m pip --version

# 3. 가상환경 생성 테스트
python -m venv test_env

# 4. 가상환경 삭제
Remove-Item -Recurse -Force test_env

# 5. 간단한 Python 코드 실행
python -c "print('Python 설치 성공!')"
```

모두 정상적으로 실행되면 ✅ 설치 완료!

---

## 🎯 다음 단계

Python 설치가 완료되었다면:

1. ✅ Backend 의존성 설치
2. ✅ Backend 서버 실행
3. ✅ API 문서 확인 (http://localhost:8000/docs)
4. 🔄 Frontend-Backend 연동 테스트

---

## 📚 추가 도구 (선택사항)

### VS Code Python Extension

1. VS Code에서 **Extensions** (Ctrl + Shift + X)
2. "Python" 검색
3. Microsoft의 **Python** extension 설치

### 유용한 Python 패키지

```powershell
# 코드 포맷터
pip install black

# Linter
pip install pylint

# 타입 체커
pip install mypy
```

---

**도움이 필요하면 언제든 문의하세요!** 🐍✨
