// 간단한 사용자 데이터베이스 (실제 프로덕션에서는 Supabase 사용)
// 브라우저 localStorage를 사용하여 사용자 정보 저장

export interface User {
  id: string
  email?: string
  username?: string
  password: string // 실제로는 해시된 비밀번호
  name: string
  provider: 'google' | 'github' | 'naver'
  createdAt: string
}

// 간단한 해싱 함수 (실제 프로덕션에서는 bcrypt 사용)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

// 사용자 저장 (서버 사이드)
export async function saveUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const hashedPassword = await hashPassword(user.password)
  
  const newUser: User = {
    id: `${user.provider}-${Date.now()}`,
    ...user,
    password: hashedPassword,
    createdAt: new Date().toISOString()
  }

  // localStorage 대신 서버에 저장 (여기서는 임시로 메모리)
  return newUser
}

// 사용자 검증 (서버 사이드)
export async function verifyUser(
  identifier: string, // email 또는 username
  password: string,
  provider: 'google' | 'github' | 'naver'
): Promise<User | null> {
  const hashedPassword = await hashPassword(password)
  
  // 여기서 실제 DB 조회 대신 하드코딩된 테스트 계정 사용
  const testUsers: User[] = [
    {
      id: 'google-test',
      email: 'test@gmail.com',
      password: await hashPassword('1234'),
      name: '테스트 사용자',
      provider: 'google',
      createdAt: new Date().toISOString()
    },
    {
      id: 'github-test',
      username: 'testuser',
      password: await hashPassword('1234'),
      name: 'Test User',
      provider: 'github',
      createdAt: new Date().toISOString()
    },
    {
      id: 'naver-test',
      username: 'testuser',
      password: await hashPassword('1234'),
      name: '테스트',
      provider: 'naver',
      createdAt: new Date().toISOString()
    }
  ]

  // 사용자 찾기
  const user = testUsers.find(u => 
    u.provider === provider && 
    (u.email === identifier || u.username === identifier)
  )

  if (!user) return null

  // 비밀번호 확인
  if (user.password !== hashedPassword) return null

  return user
}
