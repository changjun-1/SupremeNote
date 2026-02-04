"""
YouTube 비디오 처리 서비스
- 비디오 정보 추출
- 자막 다운로드
- 오디오 추출
- Whisper 음성 인식
"""
import yt_dlp
from youtube_transcript_api import YouTubeTranscriptApi
from typing import Optional, Dict, List
import re
import os


def extract_video_id(url: str) -> Optional[str]:
    """
    YouTube URL에서 비디오 ID 추출
    """
    patterns = [
        r'(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)',
        r'youtube\.com\/embed\/([^&\n?#]+)',
        r'youtube\.com\/v\/([^&\n?#]+)'
    ]
    
    for pattern in patterns:
        match = re.search(pattern, url)
        if match:
            return match.group(1)
    
    return None


def get_video_info(video_url: str) -> Dict:
    """
    YouTube 비디오 정보 가져오기 (개선된 버전)
    """
    ydl_opts = {
        'quiet': True,
        'no_warnings': True,
        'extract_flat': False,  # 전체 정보 가져오기
        'skip_download': True,
        'nocheckcertificate': True,
        'ignoreerrors': True,
        'no_color': True,
        'geo_bypass': True,  # 지역 제한 우회
    }
    
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            
            if not info:
                raise Exception("영상 정보를 가져올 수 없습니다")
            
            return {
                'video_id': info.get('id'),
                'title': info.get('title'),
                'description': info.get('description'),
                'duration': info.get('duration'),  # 초 단위
                'thumbnail_url': info.get('thumbnail'),
                'channel': info.get('uploader'),
                'view_count': info.get('view_count'),
                'upload_date': info.get('upload_date'),
            }
    except Exception as e:
        raise Exception(f"비디오 정보 가져오기 실패: {str(e)}")


def get_transcript(video_id: str, languages: List[str] = None) -> Optional[str]:
    """
    YouTube 비디오 자막 가져오기
    - 더 많은 언어 지원
    - 자동 생성 자막 우선 지원
    """
    if languages is None:
        # 기본 언어 목록 (더 많이 추가)
        languages = ['en', 'ko', 'ja', 'zh-Hans', 'zh-Hant', 'es', 'fr', 'de', 'ru', 'pt', 'it', 'ar']
    
    try:
        # 자막 목록 가져오기
        transcript_list = YouTubeTranscriptApi.list_transcripts(video_id)
        
        print(f"[INFO] 비디오 ID: {video_id}")
        
        # 사용 가능한 모든 자막 출력
        try:
            available = []
            for t in transcript_list:
                available.append(f"{t.language_code}({t.language})")
            print(f"[INFO] 사용 가능한 자막: {', '.join(available)}")
        except:
            pass
        
        # 1. 자동 생성 자막 먼저 시도 (더 많은 영상에 있음)
        for lang in languages:
            try:
                transcript = transcript_list.find_generated_transcript([lang])
                transcript_data = transcript.fetch()
                full_text = ' '.join([item['text'] for item in transcript_data])
                print(f"[SUCCESS] 자동 생성 자막 발견: {lang}")
                return full_text
            except:
                continue
        
        # 2. 수동 자막 시도
        for lang in languages:
            try:
                transcript = transcript_list.find_manually_created_transcript([lang])
                transcript_data = transcript.fetch()
                full_text = ' '.join([item['text'] for item in transcript_data])
                print(f"[SUCCESS] 수동 자막 발견: {lang}")
                return full_text
            except:
                continue
        
        # 3. 모든 사용 가능한 자막 시도 (언어 무관)
        try:
            for transcript in transcript_list:
                try:
                    transcript_data = transcript.fetch()
                    full_text = ' '.join([item['text'] for item in transcript_data])
                    print(f"[SUCCESS] 자막 발견: {transcript.language_code}")
                    return full_text
                except Exception as e:
                    print(f"[DEBUG] {transcript.language_code} 자막 가져오기 실패: {str(e)}")
                    continue
        except Exception as e:
            print(f"[DEBUG] 자막 목록 순회 실패: {str(e)}")
        
        print("[ERROR] 사용 가능한 자막을 찾을 수 없습니다")
        return None
    
    except Exception as e:
        print(f"[ERROR] 자막 가져오기 실패: {str(e)}")
        return None


def download_audio(video_url: str, output_path: str = 'downloads') -> Optional[str]:
    """
    YouTube 비디오에서 오디오만 다운로드 (Whisper용, 개선된 버전)
    """
    import os
    
    # downloads 폴더 생성
    if not os.path.exists(output_path):
        os.makedirs(output_path)
    
    # FFmpeg 경로 설정
    ffmpeg_location = r'C:\Users\1213j\AppData\Local\Microsoft\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\ffmpeg-8.0.1-full_build\bin'
    
    ydl_opts = {
        'format': 'bestaudio/best',
        'postprocessors': [{
            'key': 'FFmpegExtractAudio',
            'preferredcodec': 'mp3',
            'preferredquality': '128',  # 품질 낮춤 (Whisper용으로 충분)
        }],
        'ffmpeg_location': ffmpeg_location,  # FFmpeg 경로 명시
        'outtmpl': f'{output_path}/%(id)s.%(ext)s',
        'quiet': True,
        'no_warnings': True,
        'nocheckcertificate': True,
        'ignoreerrors': False,
        'no_color': True,
        'extract_flat': False,
        'geo_bypass': True,  # 지역 제한 우회 시도
        'geo_bypass_country': 'KR',  # 한국으로 설정
    }
    
    try:
        print(f"[INFO] 오디오 다운로드 시작: {video_url}")
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=True)
            
            if not info:
                print(f"[ERROR] 영상 정보를 가져올 수 없습니다")
                return None
            
            # 절대 경로로 변환
            audio_file = os.path.abspath(f"{output_path}/{info['id']}.mp3")
            
            print(f"[DEBUG] 파일 경로 확인: {audio_file}")
            print(f"[DEBUG] 파일 존재 여부: {os.path.exists(audio_file)}")
            
            if os.path.exists(audio_file):
                print(f"[SUCCESS] 오디오 다운로드 완료: {audio_file}")
                return audio_file
            else:
                print(f"[ERROR] 오디오 파일을 찾을 수 없음: {audio_file}")
                return None
    except Exception as e:
        print(f"[ERROR] 오디오 다운로드 실패: {str(e)}")
        return None


def process_youtube_video(video_url: str, use_whisper: bool = True) -> Dict:
    """
    YouTube 비디오 전체 처리 (하이브리드 방식)
    - 비디오 정보 추출
    - 자막 다운로드 (우선)
    - 자막 없으면 Whisper 사용
    """
    # 비디오 ID 추출
    video_id = extract_video_id(video_url)
    if not video_id:
        raise ValueError("유효하지 않은 YouTube URL입니다")
    
    # 비디오 정보 가져오기
    video_info = get_video_info(video_url)
    
    # 1단계: 자막 시도 (빠르고 무료)
    print("[INFO] 1단계: 자막 확인 중...")
    transcript = get_transcript(video_id)
    
    if transcript:
        print("[SUCCESS] 자막으로 처리 완료! (빠름)")
        video_info['transcript'] = transcript
        video_info['has_transcript'] = True
        video_info['source'] = 'subtitle'
        return video_info
    
    # 2단계: 자막 없으면 Whisper 사용 (느리지만 확실)
    if use_whisper:
        print("[INFO] 2단계: 자막 없음. Whisper로 음성 인식 시작...")
        
        # 오디오 다운로드
        audio_file = download_audio(video_url)
        
        if audio_file and os.path.exists(audio_file):
            # Whisper로 변환
            from services.whisper_service import transcribe_audio_auto_detect
            
            whisper_text = transcribe_audio_auto_detect(audio_file)
            
            # 오디오 파일 삭제 (정리)
            try:
                os.remove(audio_file)
                print(f"[INFO] 임시 오디오 파일 삭제: {audio_file}")
            except:
                pass
            
            if whisper_text:
                print("[SUCCESS] Whisper로 처리 완료!")
                video_info['transcript'] = whisper_text
                video_info['has_transcript'] = True
                video_info['source'] = 'whisper'
                return video_info
    
    # 둘 다 실패
    print("[ERROR] 자막도 없고 Whisper도 실패")
    video_info['transcript'] = None
    video_info['has_transcript'] = False
    video_info['source'] = 'none'
    
    return video_info
