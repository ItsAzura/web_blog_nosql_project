import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('blog_token'); // Lấy token từ cookies
  const { pathname } = request.nextUrl; // Lấy đường dẫn hiện tại

  // Nếu có token và đang truy cập vào /login hoặc /register, chuyển hướng về trang chủ
  if (token && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Nếu không có token và không truy cập vào /login hoặc /register, chuyển hướng về /login
  if (!token && pathname !== '/login' && pathname !== '/register') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Nếu điều kiện không khớp, tiếp tục xử lý
  return NextResponse.next();
}

// Áp dụng middleware cho các trang cần bảo vệ
export const config = {
  matcher: ['/((?!api|_next|static|favicon.ico).*)'], // Bảo vệ tất cả các route, ngoại trừ api, _next, static, favicon
};
