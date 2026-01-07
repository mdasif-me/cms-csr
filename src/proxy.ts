import { AuthMiddleware } from '@/lib/auth/middleware/auth-middleware';
import { NextRequest, NextResponse } from 'next/server';

export async function proxy(request: NextRequest): Promise<NextResponse> {
  return AuthMiddleware.handle(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
