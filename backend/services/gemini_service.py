"""
Gemini AI 서비스
- 텍스트 요약
- 핵심 포인트 추출
- 임베딩 생성
"""
import google.generativeai as genai
from typing import List, Dict, Optional
import os
from dotenv import load_dotenv

load_dotenv()

# Gemini API 설정
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


def summarize_transcript(
    transcript: str,
    video_title: str,
    custom_instruction: Optional[str] = None
) -> Dict[str, any]:
    """
    YouTube 자막을 Gemini로 요약
    
    Args:
        transcript: 자막 전체 텍스트
        video_title: 비디오 제목
        custom_instruction: 사용자 지정 요약 지시사항
    
    Returns:
        요약 결과 딕셔너리
    """
    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        
        # 프롬프트 구성
        if custom_instruction:
            prompt = f"""다음은 YouTube 영상 "{video_title}"의 자막입니다.

사용자 요청: {custom_instruction}

자막:
{transcript[:10000]}  # 토큰 제한을 위해 최대 10,000자

위 내용을 바탕으로 사용자의 요청에 맞게 요약해주세요.

응답 형식:
1. **요약**: 핵심 내용을 3-5문단으로 요약
2. **주요 포인트**: 중요한 개념이나 아이디어를 불릿 포인트로 나열 (5-10개)
3. **결론**: 한 문장으로 핵심 메시지 정리
"""
        else:
            prompt = f"""다음은 YouTube 영상 "{video_title}"의 자막입니다.

자막:
{transcript[:10000]}

위 내용을 다음 형식으로 요약해주세요:

1. **요약**: 핵심 내용을 3-5문단으로 요약
2. **주요 포인트**: 중요한 개념이나 아이디어를 불릿 포인트로 나열 (5-10개)
3. **결론**: 한 문장으로 핵심 메시지 정리
"""
        
        # Gemini로 요약 생성
        response = model.generate_content(prompt)
        summary_text = response.text
        
        # 주요 포인트 추출
        key_points = extract_key_points(transcript, video_title)
        
        return {
            'summary': summary_text,
            'key_points': key_points,
            'word_count': len(transcript.split()),
            'summary_ratio': len(summary_text.split()) / len(transcript.split()) if transcript else 0
        }
    
    except Exception as e:
        raise Exception(f"요약 생성 실패: {str(e)}")


def extract_key_points(transcript: str, video_title: str) -> List[str]:
    """
    자막에서 핵심 포인트 추출
    """
    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        
        prompt = f"""다음은 YouTube 영상 "{video_title}"의 자막입니다.

자막:
{transcript[:10000]}

위 내용에서 가장 중요한 핵심 포인트 5-10개를 추출해주세요.
각 포인트는 한 문장으로, 불릿 포인트 형식으로 작성해주세요.

형식:
- 핵심 포인트 1
- 핵심 포인트 2
...
"""
        
        response = model.generate_content(prompt)
        text = response.text
        
        # 불릿 포인트 추출
        points = []
        for line in text.split('\n'):
            line = line.strip()
            if line.startswith('-') or line.startswith('•') or line.startswith('*'):
                point = line[1:].strip()
                if point:
                    points.append(point)
        
        return points[:10]  # 최대 10개
    
    except Exception as e:
        print(f"핵심 포인트 추출 실패: {str(e)}")
        return []


def generate_embedding(text: str) -> List[float]:
    """
    텍스트 임베딩 생성 (Vector 검색용)
    """
    try:
        result = genai.embed_content(
            model="models/embedding-001",
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        print(f"임베딩 생성 실패: {str(e)}")
        return []


def chat_with_content(content: str, question: str, context: Optional[str] = None) -> str:
    """
    콘텐츠에 대해 질문하기
    """
    try:
        model = genai.GenerativeModel('gemini-flash-latest')
        
        prompt = f"""다음은 학습 자료의 내용입니다:

{content[:8000]}

{"추가 컨텍스트: " + context if context else ""}

사용자 질문: {question}

위 내용을 바탕으로 질문에 답변해주세요. 답변은 명확하고 구체적으로 작성해주세요.
"""
        
        response = model.generate_content(prompt)
        return response.text
    
    except Exception as e:
        raise Exception(f"질문 응답 생성 실패: {str(e)}")
