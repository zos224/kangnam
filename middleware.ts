import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const method = request.method
  const token = request.cookies.get('authjs.session-token')?.value

  if (path.includes("/admin/login") && token) {
    return NextResponse.redirect(new URL('/admin/language', request.url))
  }

  // Kiểm tra các đường dẫn admin
  if (path.startsWith('/admin/') && !path.includes("login") && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  // Kiểm tra các phương thức API bị chặn
  const blockedMethods = ['POST', 'PUT', 'DELETE']
  if (
    path.startsWith('/api/') && !path.includes("user-request") && !path.includes("auth") && !path.includes("/api/admin/login") &&
    blockedMethods.includes(method) && !token
  ) {
    return new NextResponse(
      JSON.stringify({ error: 'Phương thức không được phép' }), 
      { 
        status: 405, 
        headers: { 'Content-Type': 'application/json' } 
      }
    )
  }

  // Cho phép các request khác
  return NextResponse.next()
}

// Cấu hình matcher để áp dụng middleware
export const config = {
  matcher: ['/admin/:path*', '/api/:path*']
}