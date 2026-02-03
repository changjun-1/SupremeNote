"""
SupremeNote Backend - FastAPI Main Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="SupremeNote API",
    description="AI-Powered Knowledge Management Platform",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health Check Endpoint
@app.get("/")
async def root():
    return {
        "message": "🎯 SupremeNote API is running!",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# 인증 라우터 추가
from routers import auth
app.include_router(auth.router)

# TODO: 추가 라우터들
# from routers import youtube, documents, ai
# app.include_router(youtube.router, prefix="/api/youtube", tags=["YouTube"])
# app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
# app.include_router(ai.router, prefix="/api/ai", tags=["AI Processing"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
