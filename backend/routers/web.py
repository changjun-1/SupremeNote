"""
웹 URL 요약 라우터
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from services.web_service import process_web_url
from services.gemini_service import summarize_transcript
from datetime import datetime
import uuid
from typing import Optional

router = APIRouter()


class WebSummaryRequest(BaseModel):
    url: HttpUrl
    custom_instruction: Optional[str] = None
    user_id: Optional[str] = None


@router.post("/summarize")
async def summarize_web_page(request: WebSummaryRequest):
    """
    웹 페이지 크롤링 및 요약 생성
    
    1. URL에서 텍스트 크롤링
    2. Gemini AI로 요약
    3. 결과 반환
    """
    try:
        url_str = str(request.url)
        print(f"[INFO] 웹 페이지 처리: {url_str}")
        
        # 웹 페이지 크롤링
        web_data = process_web_url(url_str)
        
        if not web_data.get('has_text'):
            raise HTTPException(
                status_code=400,
                detail="웹 페이지에서 텍스트를 추출할 수 없습니다"
            )
        
        # AI 요약 생성
        print("[INFO] AI 요약 생성 중...")
        summary_result = summarize_transcript(
            transcript=web_data['text'],
            video_title=web_data['title'],
            custom_instruction=request.custom_instruction
        )
        
        # 결과 반환
        return {
            'id': str(uuid.uuid4()),
            'url': url_str,
            'title': web_data['title'],
            'description': web_data.get('description', ''),
            'author': web_data.get('author'),
            'summary': summary_result['summary'],
            'key_points': summary_result['key_points'],
            'word_count': web_data['word_count'],
            'created_at': datetime.now().isoformat(),
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] 웹 페이지 요약 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"웹 페이지 요약 실패: {str(e)}")


@router.get("/health")
async def health_check():
    """웹 서비스 상태 확인"""
    return {"status": "ok", "service": "web"}
