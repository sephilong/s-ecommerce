
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get('host');
  
  // Basic tenant resolution via subdomain logic
  // For production, this would handle custom domains too
  const subdomain = host?.split('.')[0] || 'demo';
  
  // Example: Redirect root requests if needed or attach tenant header
  const response = NextResponse.next();
  response.headers.set('x-tenant-id', subdomain);
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
