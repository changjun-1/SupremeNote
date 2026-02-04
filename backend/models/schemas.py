"""
Pydantic 스키마 정의
"""
from pydantic import BaseModel, Field, HttpUrl
from typing import Optional, List
from datetime import datetime


# YouTube 요약 요청
class YoutubeSummaryRequest(BaseModel):
    video_url: str = Field(..., description="YouTube 비디오 URL")
    custom_instruction: Optional[str] = Field(None, description="사용자 지정 요약 지시사항")
    user_id: str = Field(..., description="사용자 ID")


# YouTube 요약 응답
class YoutubeSummaryResponse(BaseModel):
    id: str
    video_id: str
    video_url: str
    title: str
    thumbnail_url: Optional[str]
    duration: Optional[int]
    summary: str
    key_points: List[str]
    transcript: Optional[str]
    created_at: datetime


# 비디오 정보
class VideoInfo(BaseModel):
    video_id: str
    title: str
    description: Optional[str]
    duration: Optional[int]
    thumbnail_url: Optional[str]
    channel: Optional[str]
    view_count: Optional[int]
    upload_date: Optional[str]


# 노트
class Note(BaseModel):
    id: str
    user_id: str
    title: str
    content: str
    tags: List[str] = []
    is_favorite: bool = False
    created_at: datetime
    updated_at: datetime


class NoteCreate(BaseModel):
    title: str
    content: str
    tags: List[str] = []
    is_favorite: bool = False


class NoteUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    is_favorite: Optional[bool] = None


# AI 채팅
class ChatRequest(BaseModel):
    content_id: str = Field(..., description="노트 또는 YouTube 요약 ID")
    content_type: str = Field(..., description="'note' 또는 'youtube'")
    question: str = Field(..., description="사용자 질문")


class ChatResponse(BaseModel):
    answer: str
    sources: Optional[List[str]] = None


# 검색 요청
class SearchRequest(BaseModel):
    query: str
    content_type: Optional[str] = None  # 'note', 'youtube', 또는 None (전체)
    limit: int = 10


# 상태 응답
class HealthResponse(BaseModel):
    status: str
    version: str
    gemini_api_configured: bool
    supabase_configured: bool
