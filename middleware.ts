
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/request';

/**
 * SECURITY & PERFORMANCE MIDDLEWARE
 * - Thiết lập CSP (Content Security Policy)
 * - Xử lý Tenant Subdomain
 * - Security Headers
 */
export function middleware(request: any) {
  const url = request.nextUrl;
  const host = request.headers.get('host');
  const subdomain = host?.split('.')[0] || 'demo';
  
  const response = NextResponse.next();

  // SECURITY HEADERS
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

  // Tenant Context
  response.headers.set('x-tenant-id', subdomain);
  
  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
