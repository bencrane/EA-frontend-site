import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';
  const isAdminApiRoute = request.nextUrl.pathname.startsWith('/api/admin');

  // Protect admin pages (except login)
  if (isAdminRoute && !isLoginPage && !session) {
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect logged-in users away from login page
  if (isLoginPage && session) {
    const adminUrl = new URL('/admin', request.url);
    return NextResponse.redirect(adminUrl);
  }

  // Protect admin API routes
  if (isAdminApiRoute && !session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
