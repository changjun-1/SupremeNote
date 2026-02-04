"""
Whisper 음성 인식 서비스 (무료 로컬 버전)
- 오디오를 텍스트로 변환
- 완전 무료
"""
import whisper
import os
from typing import Optional

# Whisper 모델 로드 (한 번만 로드)
_whisper_model = None

def get_whisper_model():
    """
    Whisper 모델 로드 (싱글톤)
    """
    global _whisper_model
    
    if _whisper_model is None:
        print("[INFO] Whisper 모델 로딩 중... (처음 한 번만)")
        _whisper_model = whisper.load_model("tiny")  # tiny 모델 (39MB, 2-3배 빠름!)
        print("[INFO] Whisper 모델 로드 완료!")
    
    return _whisper_model


def transcribe_audio(audio_path: str, language: str = 'ko') -> Optional[str]:
    """
    오디오 파일을 텍스트로 변환
    
    Args:
        audio_path: 오디오 파일 경로
        language: 언어 코드 ('ko', 'en' 등)
    
    Returns:
        변환된 텍스트
    """
    try:
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"오디오 파일을 찾을 수 없습니다: {audio_path}")
        
        print(f"[INFO] Whisper로 음성 인식 시작: {audio_path}")
        print(f"[INFO] 언어: {language}")
        
        # Whisper 모델 로드
        model = get_whisper_model()
        
        # 음성 인식 실행
        result = model.transcribe(
            audio_path,
            language=language,
            verbose=False,
            fp16=False  # CPU 호환성
        )
        
        text = result["text"]
        print(f"[SUCCESS] Whisper 변환 완료! ({len(text)} 글자)")
        
        return text
    
    except Exception as e:
        print(f"[ERROR] Whisper 변환 실패: {str(e)}")
        return None


def transcribe_audio_auto_detect(audio_path: str) -> Optional[str]:
    """
    오디오 파일을 텍스트로 변환 (언어 자동 감지)
    
    Args:
        audio_path: 오디오 파일 경로
    
    Returns:
        변환된 텍스트
    """
    try:
        # 절대 경로로 변환
        audio_path = os.path.abspath(audio_path)
        
        print(f"[DEBUG] Whisper 입력 파일: {audio_path}")
        print(f"[DEBUG] 파일 존재 여부: {os.path.exists(audio_path)}")
        print(f"[DEBUG] 현재 작업 디렉토리: {os.getcwd()}")
        
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"오디오 파일을 찾을 수 없습니다: {audio_path}")
        
        print(f"[INFO] Whisper로 음성 인식 시작 (언어 자동 감지): {audio_path}")
        
        # Whisper 모델 로드
        model = get_whisper_model()
        
        # 음성 인식 실행 (언어 자동 감지)
        result = model.transcribe(
            audio_path,
            verbose=False,
            fp16=False  # CPU 호환성
        )
        
        detected_language = result.get("language", "unknown")
        text = result["text"]
        
        print(f"[SUCCESS] 언어 감지: {detected_language}")
        print(f"[SUCCESS] Whisper 변환 완료! ({len(text)} 글자)")
        
        return text
    
    except Exception as e:
        print(f"[ERROR] Whisper 변환 실패: {str(e)}")
        import traceback
        traceback.print_exc()
        return None
