import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIE_NAME } from './lib/constants';

const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get(AUTH_COOKIE_NAME);
    const isAuthenticated = !!authToken;

    // Redirect to books if authenticated user tries to access login
    if (isAuthenticated && authRoutes.includes(pathname)) {
        return NextResponse.redirect(new URL('/books', request.url));
    }

    // Redirect to login if unauthenticated user tries to access protected route
    if (!isAuthenticated && !publicRoutes.includes(pathname) && pathname !== '/') {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};