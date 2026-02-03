from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import sys
from pathlib import Path

# 상위 디렉토리의 auth.py import
sys.path.append(str(Path(__file__).parent.parent))
from auth import register_user, verify_user, get_all_users

router = APIRouter(prefix="/auth", tags=["authentication"])

class RegisterRequest(BaseModel):
    email: Optional[str] = None
    username: Optional[str] = None
    password: str
    name: Optional[str] = None
    provider: str = 'google'

class LoginRequest(BaseModel):
    identifier: str  # email 또는 username
    password: str
    provider: str = 'google'

@router.post("/register")
async def register(request: RegisterRequest):
    """회원가입"""
    try:
        user = register_user(
            email=request.email,
            username=request.username,
            password=request.password,
            name=request.name,
            provider=request.provider
        )
        return {
            "success": True,
            "message": "회원가입이 완료되었습니다",
            "user": user
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail="회원가입 중 오류가 발생했습니다")

@router.post("/login")
async def login(request: LoginRequest):
    """로그인"""
    user = verify_user(request.identifier, request.password, request.provider)
    
    if not user:
        raise HTTPException(
            status_code=401, 
            detail="이메일/아이디 또는 비밀번호가 올바르지 않습니다"
        )
    
    return {
        "success": True,
        "message": "로그인 성공",
        "user": user
    }

@router.get("/users")
async def list_users():
    """사용자 목록 조회 (개발용)"""
    return {
        "users": get_all_users()
    }
