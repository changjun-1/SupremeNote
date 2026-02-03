import json
import hashlib
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict

USERS_FILE = Path(__file__).parent / "users.json"

def hash_password(password: str) -> str:
    """비밀번호를 SHA-256으로 해싱"""
    return hashlib.sha256(password.encode()).hexdigest()

def load_users() -> Dict:
    """사용자 데이터 로드"""
    if not USERS_FILE.exists():
        return {"users": []}
    
    with open(USERS_FILE, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_users(data: Dict):
    """사용자 데이터 저장"""
    with open(USERS_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def register_user(email: str = None, username: str = None, password: str = None, 
                 name: str = None, provider: str = 'google') -> Dict:
    """새 사용자 등록"""
    data = load_users()
    
    # 중복 확인
    identifier = email if provider == 'google' else username
    for user in data['users']:
        if user.get('provider') == provider:
            if (user.get('email') == email and provider == 'google') or \
               (user.get('username') == username and provider != 'google'):
                raise ValueError("이미 존재하는 계정입니다")
    
    # 새 사용자 생성
    new_user = {
        "id": f"{provider}-{len(data['users']) + 1}",
        "email": email,
        "username": username,
        "password": hash_password(password),
        "name": name or (email.split('@')[0] if email else username),
        "provider": provider,
        "created_at": datetime.now().isoformat()
    }
    
    data['users'].append(new_user)
    save_users(data)
    
    return {k: v for k, v in new_user.items() if k != 'password'}

def verify_user(identifier: str, password: str, provider: str) -> Optional[Dict]:
    """사용자 인증"""
    data = load_users()
    hashed_password = hash_password(password)
    
    for user in data['users']:
        if user.get('provider') == provider:
            if provider == 'google' and user.get('email') == identifier:
                if user.get('password') == hashed_password:
                    return {k: v for k, v in user.items() if k != 'password'}
            elif provider != 'google' and user.get('username') == identifier:
                if user.get('password') == hashed_password:
                    return {k: v for k, v in user.items() if k != 'password'}
    
    return None

def get_all_users() -> list:
    """모든 사용자 조회 (비밀번호 제외)"""
    data = load_users()
    return [{k: v for k, v in user.items() if k != 'password'} 
            for user in data['users']]
