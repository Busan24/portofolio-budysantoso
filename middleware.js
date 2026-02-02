import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if accessing admin routes (except login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // Check if user has auth cookie from Firebase
    // Firebase sets __session cookie when authenticated
    const authCookie = request.cookies.get('__session');
    
    // You can also check for Firebase auth token in cookies
    // This is a basic check - for production, verify the token server-side
    const hasAuthToken = request.cookies.has('__session') || 
                        request.cookies.has('firebase-auth-token');

    // For now, we'll rely on client-side check
    // But add a warning in console for security
    if (!hasAuthToken) {
      console.warn(`Unauthorized access attempt to: ${pathname}`);
    }
  }

  return NextResponse.next();
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
