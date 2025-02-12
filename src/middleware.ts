import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyAccessToken } from './lib/auth';

export async function middleware(request: NextRequest) {
    // Define protected routes that require authentication
    const protectedPaths = ['/dashboard', '/profile', '/reports'];

    // Check if the current path is protected
    const isProtectedPath = protectedPaths.some(path =>
        request.nextUrl.pathname.startsWith(path)
    );

    if (isProtectedPath) {
        const token = request.cookies.get('token')?.value;

        if (!token) {
            return NextResponse.redirect(new URL('/signin', request.url));
        }

        const payload = await verifyAccessToken(token);
        if (!payload) {
            return NextResponse.redirect(new URL('/signin', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/reports/:path*'
    ],
};
