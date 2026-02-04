import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if expired
  const {
    data: { session },
  } = await supabase.auth.getSession()

  console.log('Middleware - Path:', req.nextUrl.pathname, 'Session:', !!session)

  // 로그인이 필요한 페이지 보호
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    const redirectUrl = new URL('/auth/signin', req.url)
    console.log('Middleware - Redirecting to signin (no session)')
    return NextResponse.redirect(redirectUrl)
  }

  // 이미 로그인한 사용자가 로그인 페이지 접근 시 dashboard로
  if (session && req.nextUrl.pathname === '/auth/signin') {
    const redirectUrl = new URL('/dashboard', req.url)
    console.log('Middleware - Redirecting to dashboard (has session)')
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/auth/signin', '/'],
}
