"""
PDF 처리 서비스
- PDF에서 텍스트 추출
- 이미지 포함 PDF 처리
"""
import pdfplumber
from typing import Optional, Dict
import os


def extract_text_from_pdf(pdf_path: str) -> Optional[str]:
    """
    PDF 파일에서 텍스트 추출
    
    Args:
        pdf_path: PDF 파일 경로
    
    Returns:
        추출된 텍스트
    """
    try:
        if not os.path.exists(pdf_path):
            raise FileNotFoundError(f"PDF 파일을 찾을 수 없습니다: {pdf_path}")
        
        print(f"[INFO] PDF 텍스트 추출 시작: {pdf_path}")
        
        full_text = []
        page_count = 0
        
        with pdfplumber.open(pdf_path) as pdf:
            page_count = len(pdf.pages)
            print(f"[INFO] 총 페이지 수: {page_count}")
            
            for i, page in enumerate(pdf.pages):
                text = page.extract_text()
                if text:
                    full_text.append(text)
                    print(f"[PROGRESS] 페이지 {i+1}/{page_count} 처리 중...")
        
        result = "\n\n".join(full_text)
        print(f"[SUCCESS] PDF 텍스트 추출 완료! ({len(result)} 글자)")
        
        return result
    
    except Exception as e:
        print(f"[ERROR] PDF 텍스트 추출 실패: {str(e)}")
        return None


def get_pdf_info(pdf_path: str) -> Dict:
    """
    PDF 파일 메타데이터 추출
    
    Args:
        pdf_path: PDF 파일 경로
    
    Returns:
        PDF 정보 딕셔너리
    """
    try:
        with pdfplumber.open(pdf_path) as pdf:
            metadata = pdf.metadata or {}
            
            return {
                'page_count': len(pdf.pages),
                'title': metadata.get('Title', '제목 없음'),
                'author': metadata.get('Author', '저자 없음'),
                'subject': metadata.get('Subject', ''),
                'creator': metadata.get('Creator', ''),
                'producer': metadata.get('Producer', ''),
            }
    except Exception as e:
        print(f"[ERROR] PDF 정보 추출 실패: {str(e)}")
        return {}


def process_pdf(pdf_path: str) -> Dict:
    """
    PDF 전체 처리
    - 메타데이터 추출
    - 텍스트 추출
    
    Args:
        pdf_path: PDF 파일 경로
    
    Returns:
        처리 결과 딕셔너리
    """
    try:
        # PDF 정보 추출
        info = get_pdf_info(pdf_path)
        
        # 텍스트 추출
        text = extract_text_from_pdf(pdf_path)
        
        if not text:
            raise Exception("PDF에서 텍스트를 추출할 수 없습니다")
        
        return {
            **info,
            'text': text,
            'has_text': True,
        }
    
    except Exception as e:
        raise Exception(f"PDF 처리 실패: {str(e)}")
