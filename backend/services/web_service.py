"""
웹 페이지 크롤링 서비스
- URL에서 텍스트 추출
- 메타데이터 추출
"""
import requests
from bs4 import BeautifulSoup
from typing import Optional, Dict
import re


def clean_text(text: str) -> str:
    """텍스트 정리"""
    # 연속된 공백과 줄바꿈 제거
    text = re.sub(r'\s+', ' ', text)
    # 앞뒤 공백 제거
    text = text.strip()
    return text


def extract_article_text(soup: BeautifulSoup) -> str:
    """
    웹 페이지에서 본문 추출
    """
    # 불필요한 태그 제거
    for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside', 'iframe']):
        tag.decompose()
    
    # 본문 찾기 시도 (여러 패턴)
    article_patterns = [
        {'name': 'article'},
        {'class_': re.compile(r'article|content|post|entry|main', re.I)},
        {'id': re.compile(r'article|content|post|entry|main', re.I)},
    ]
    
    article_text = None
    for pattern in article_patterns:
        element = soup.find(**pattern)
        if element:
            article_text = element.get_text(separator=' ', strip=True)
            if len(article_text) > 200:  # 충분한 텍스트가 있으면 사용
                break
    
    # 본문을 찾지 못하면 body 전체 사용
    if not article_text:
        body = soup.find('body')
        article_text = body.get_text(separator=' ', strip=True) if body else soup.get_text(separator=' ', strip=True)
    
    return clean_text(article_text)


def fetch_web_page(url: str) -> Dict:
    """
    웹 페이지 크롤링
    
    Args:
        url: 웹 페이지 URL
    
    Returns:
        웹 페이지 정보 딕셔너리
    """
    try:
        print(f"[INFO] 웹 페이지 크롤링 시작: {url}")
        
        # HTTP 요청
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        response.encoding = response.apparent_encoding
        
        print(f"[SUCCESS] HTTP 요청 성공: {response.status_code}")
        
        # HTML 파싱
        soup = BeautifulSoup(response.text, 'lxml')
        
        # 메타데이터 추출
        title = soup.find('title')
        title_text = title.get_text(strip=True) if title else '제목 없음'
        
        description_tag = soup.find('meta', attrs={'name': 'description'})
        description = description_tag['content'] if description_tag and description_tag.get('content') else ''
        
        author_tag = soup.find('meta', attrs={'name': 'author'})
        author = author_tag['content'] if author_tag and author_tag.get('content') else '저자 없음'
        
        # 본문 추출
        article_text = extract_article_text(soup)
        
        print(f"[SUCCESS] 텍스트 추출 완료! ({len(article_text)} 글자)")
        
        return {
            'url': url,
            'title': title_text,
            'description': description,
            'author': author,
            'text': article_text,
            'word_count': len(article_text.split()),
            'has_text': True,
        }
    
    except requests.RequestException as e:
        print(f"[ERROR] HTTP 요청 실패: {str(e)}")
        raise Exception(f"웹 페이지를 불러올 수 없습니다: {str(e)}")
    
    except Exception as e:
        print(f"[ERROR] 웹 크롤링 실패: {str(e)}")
        raise Exception(f"웹 페이지 처리 실패: {str(e)}")


def process_web_url(url: str) -> Dict:
    """
    웹 URL 전체 처리
    
    Args:
        url: 웹 페이지 URL
    
    Returns:
        처리 결과 딕셔너리
    """
    try:
        # URL 유효성 검사
        if not url.startswith(('http://', 'https://')):
            raise ValueError("올바른 URL을 입력해주세요 (http:// 또는 https://로 시작)")
        
        # 웹 페이지 크롤링
        web_data = fetch_web_page(url)
        
        if not web_data.get('has_text'):
            raise Exception("웹 페이지에서 텍스트를 추출할 수 없습니다")
        
        return web_data
    
    except Exception as e:
        raise Exception(f"웹 URL 처리 실패: {str(e)}")
