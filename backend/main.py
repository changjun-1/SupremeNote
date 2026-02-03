"""
UVKL Backend - FastAPI Main Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="UVKL API",
    description="Universal Video Knowledge Library Backend",
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
        "message": "🎯 UVKL API is running!",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    return {"status": "ok"}

# TODO: 라우터들을 여기에 추가할 예정
# from app.routers import youtube, documents, ai
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
