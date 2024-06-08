// middleware.js

import { auth } from '@/lib/Auth';
import { NextResponse, NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const isAuthenticated = await auth();
  const protectedRoutes = ['/admin', '/dashboard']; // Protected routes

  if (!isAuthenticated && protectedRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Export the middleware
export const config = {
  matcher: ['/admin/:path*', '/dashboard'], // Match protected routes
};
