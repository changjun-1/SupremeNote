"""
PDF 업로드 & 요약 라우터
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from services.pdf_service import process_pdf
from services.gemini_service import summarize_transcript
import os
import uuid
from datetime import datetime
from typing import Optional

router = APIRouter()

UPLOAD_DIR = "uploads/pdf"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_and_summarize_pdf(
    file: UploadFile = File(...),
    custom_instruction: Optional[str] = Form(None),
    user_id: Optional[str] = Form(None)
):
    """
    PDF 파일 업로드 및 요약 생성
    
    1. PDF 파일 저장
    2. 텍스트 추출
    3. Gemini AI로 요약
    4. 결과 반환
    """
    try:
        # 파일 유효성 검사
        if not file.filename or not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="PDF 파일만 업로드 가능합니다")
        
        print(f"[INFO] PDF 업로드: {file.filename}")
        
        # 파일 저장
        file_id = str(uuid.uuid4())
        file_extension = os.path.splitext(file.filename)[1]
        saved_filename = f"{file_id}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, saved_filename)
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        print(f"[SUCCESS] 파일 저장: {file_path}")
        
        # PDF 처리 (텍스트 추출)
        pdf_data = process_pdf(file_path)
        
        if not pdf_data.get('has_text'):
            raise HTTPException(
                status_code=400,
                detail="PDF에서 텍스트를 추출할 수 없습니다"
            )
        
        # AI 요약 생성
        print("[INFO] AI 요약 생성 중...")
        summary_result = summarize_transcript(
            transcript=pdf_data['text'],
            video_title=pdf_data.get('title', file.filename),
            custom_instruction=custom_instruction
        )
        
        # 임시 파일 삭제
        try:
            os.remove(file_path)
            print(f"[INFO] 임시 파일 삭제: {file_path}")
        except:
            pass
        
        # 결과 반환
        return {
            'id': file_id,
            'filename': file.filename,
            'title': pdf_data.get('title', file.filename),
            'author': pdf_data.get('author'),
            'page_count': pdf_data.get('page_count'),
            'summary': summary_result['summary'],
            'key_points': summary_result['key_points'],
            'word_count': pdf_data['text'].count(' ') + 1,
            'created_at': datetime.now().isoformat(),
        }
    
    except HTTPException:
        raise
    except Exception as e:
        print(f"[ERROR] PDF 처리 실패: {str(e)}")
        raise HTTPException(status_code=500, detail=f"PDF 처리 실패: {str(e)}")


@router.get("/health")
async def health_check():
    """PDF 서비스 상태 확인"""
    return {"status": "ok", "service": "pdf"}
