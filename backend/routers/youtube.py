"""
YouTube 처리 API 라우터
"""
from fastapi import APIRouter, HTTPException, BackgroundTasks
from models.schemas import YoutubeSummaryRequest, YoutubeSummaryResponse, VideoInfo
from services.youtube_service import process_youtube_video, extract_video_id
from services.gemini_service import summarize_transcript
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from datetime import datetime
import uuid

load_dotenv()

router = APIRouter()

# Supabase 클라이언트 초기화
SUPABASE_URL = os.getenv('SUPABASE_URL')
SUPABASE_KEY = os.getenv('SUPABASE_KEY')

# Supabase 연결 시도 (optional)
supabase: Client = None
try:
    if SUPABASE_URL and SUPABASE_KEY:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("[OK] Supabase connected")
except Exception as e:
    print(f"[WARNING] Supabase connection failed: {e}")
    print("[INFO] Running without Supabase (responses will not be saved)")


@router.post("/summarize", response_model=YoutubeSummaryResponse)
async def summarize_youtube_video(request: YoutubeSummaryRequest):
    """
    YouTube 비디오 요약 생성 (하이브리드)
    
    1. YouTube 비디오 정보 및 자막 추출
    2. 자막 없으면 Whisper로 음성 인식
    3. Gemini AI로 요약 생성
    4. Supabase에 저장
    5. 결과 반환
    """
    try:
        # 1. YouTube 비디오 처리 (자막 + Whisper)
        print(f"[INFO] Processing video: {request.video_url}")
        video_data = process_youtube_video(request.video_url, use_whisper=True)
        
        if not video_data.get('has_transcript'):
            raise HTTPException(
                status_code=400,
                detail="영상 처리 실패: 자막도 없고 Whisper로도 변환할 수 없습니다."
            )
        
        # 처리 방법 로그
        source = video_data.get('source', 'unknown')
        print(f"[INFO] 처리 방법: {source}")
        
        # 2. Gemini로 요약 생성
        print(f"Generating summary with Gemini...")
        summary_result = summarize_transcript(
            transcript=video_data['transcript'],
            video_title=video_data['title'],
            custom_instruction=request.custom_instruction
        )
        
        # 3. Supabase에 저장
        if supabase:
            summary_data = {
                'id': str(uuid.uuid4()),
                'user_id': request.user_id,
                'video_url': request.video_url,
                'video_id': video_data['video_id'],
                'title': video_data['title'],
                'thumbnail_url': video_data.get('thumbnail_url'),
                'duration': video_data.get('duration'),
                'summary': summary_result['summary'],
                'key_points': summary_result['key_points'],
                'transcript': video_data['transcript'],
                'created_at': datetime.utcnow().isoformat()
            }
            
            result = supabase.table('youtube_summaries').insert(summary_data).execute()
            
            if result.data:
                return YoutubeSummaryResponse(**result.data[0])
        
        # Supabase 없이 반환 (개발용)
        return YoutubeSummaryResponse(
            id=str(uuid.uuid4()),
            video_id=video_data['video_id'],
            video_url=request.video_url,
            title=video_data['title'],
            thumbnail_url=video_data.get('thumbnail_url'),
            duration=video_data.get('duration'),
            summary=summary_result['summary'],
            key_points=summary_result['key_points'],
            transcript=video_data['transcript'],
            created_at=datetime.utcnow()
        )
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"요약 생성 실패: {str(e)}")


@router.get("/info")
async def get_video_info(video_url: str) -> VideoInfo:
    """
    YouTube 비디오 정보만 가져오기 (요약 전 미리보기)
    """
    try:
        video_id = extract_video_id(video_url)
        if not video_id:
            raise HTTPException(status_code=400, detail="유효하지 않은 YouTube URL입니다")
        
        video_data = process_youtube_video(video_url)
        
        return VideoInfo(
            video_id=video_data['video_id'],
            title=video_data['title'],
            description=video_data.get('description'),
            duration=video_data.get('duration'),
            thumbnail_url=video_data.get('thumbnail_url'),
            channel=video_data.get('channel'),
            view_count=video_data.get('view_count'),
            upload_date=video_data.get('upload_date')
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summaries")
async def get_user_summaries(user_id: str, limit: int = 20):
    """
    사용자의 YouTube 요약 목록 가져오기
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    
    try:
        result = supabase.table('youtube_summaries') \
            .select('*') \
            .eq('user_id', user_id) \
            .order('created_at', desc=True) \
            .limit(limit) \
            .execute()
        
        return result.data
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/summaries/{summary_id}")
async def get_summary(summary_id: str):
    """
    특정 YouTube 요약 가져오기
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    
    try:
        result = supabase.table('youtube_summaries') \
            .select('*') \
            .eq('id', summary_id) \
            .single() \
            .execute()
        
        return result.data
    
    except Exception as e:
        raise HTTPException(status_code=404, detail="요약을 찾을 수 없습니다")


@router.delete("/summaries/{summary_id}")
async def delete_summary(summary_id: str):
    """
    YouTube 요약 삭제
    """
    if not supabase:
        raise HTTPException(status_code=503, detail="Supabase not configured")
    
    try:
        supabase.table('youtube_summaries').delete().eq('id', summary_id).execute()
        return {"message": "삭제되었습니다"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
